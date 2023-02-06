import axios from "axios";
import type { GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { env } from "../env/server.mjs";

/**
 * Module augmentation for `next-auth` types.
 * Allows us to add custom properties to the `session` object and keep type
 * safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      jwt: {
        access_token: string | null;
        expires_at: number | null;
        refresh_token: string | null;
      };
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}
interface Token {
  accessToken: string;
  expiresAt: number;
  refreshToken: string;
}
interface RefreshTokenResponse {
  access_token: string;
  expires_at: number;
  refresh_token: string;
}
interface SpotifyProfile {
  display_name: string;
  email: string;
  id: string;
  uri: string;
}
async function refreshAccessToken(token: Token) {
  try {
    const body = new URLSearchParams({
      refresh_token: token.refreshToken,
      grant_type: "refresh_token",
    });
    const axiosOptions = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      method: "POST",
      data: body,
      url: `https://accounts.spotify.com/api/token`,
    };
    const response = await axios(axiosOptions);
    if (response.status !== 200) {
      throw new Error("RefreshAccessTokenError");
    }
    const data = response.data as RefreshTokenResponse;
    return {
      ...token,
      accessToken: data.access_token,
      accessTokenExpires: Date.now() + data.expires_at * 1000,
      refreshToken: data.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.error(error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks,
 * etc.
 *
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt({ token, account, profile }) {
      if (account && profile) {
        return {
          accessToken: account.access_token,
          expiresAt: account.expires_at,
          refreshToken: account.refresh_token,
          profile,
        };
      }
      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }
      console.log("refreshing token");
      return refreshAccessToken(token as unknown as Token);
    },
    session({ session, token }) {
      const profile = token.profile as SpotifyProfile;
      if (session) {
        if (token && token.accessToken && token.expiresAt && token.refreshToken)
          session.user.jwt = {
            access_token: token.accessToken as string,
            expires_at: token.expiresAt as number,
            refresh_token: token.refreshToken as string,
          };
        if (profile) {
          session.user.id = profile.id;
          session.user.email = profile.email;
          session.user.name = profile.display_name;
          session.user.image = profile.uri;
        }
      }
      return session;
    },
  },
  providers: [
    SpotifyProvider({
      clientId: env.SPOTIFY_CLIENT_ID,
      clientSecret: env.SPOTIFY_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            "user-read-email,user-read-currently-playing,playlist-read-private,playlist-read-collaborative,user-top-read,user-read-recently-played,user-library-read",
        },
      },
    }),
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     **/
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the
 * `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
