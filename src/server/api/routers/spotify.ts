import { z } from "zod";
import axios from "axios";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { Artist } from "spotify-types";
const baseurl = "https://api.spotify.com/v1";
export const spotifyRouter = createTRPCRouter({
  getMyTopArtists: protectedProcedure.query(async ({ ctx }) => {
    try {
      const response = await axios.get<{
        items: Artist[];
      }>(`${baseurl}/me/top/artists`, {
        headers: {
          Authorization: `Bearer ${ctx.session.user.jwt.accessToken || ""}`,
        },
      });
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error getting top artists",
        cause: error,
      });
    }
  }),
});
