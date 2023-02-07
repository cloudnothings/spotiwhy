import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import TopArtists from "./features/TopArtists";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Spotiwhy</title>
        <meta name="description" content="Spotify Showcase" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#008080] to-[#333]">
        <LoginScreen />
        <TopArtists />
      </main>
    </>
  );
};

export default Home;

const LoginScreen: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center mt-4 gap-4">
      {!sessionData?.user && <div className=" p-2 text-center text-3xl font-bold text-white">Sign in to get your Spotify Cracked</div>}
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn("spotify")}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

