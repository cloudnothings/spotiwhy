import { type NextPage } from "next";
import Head from "next/head";
import TopArtists from "./features/TopArtists";
import Navbar from "./components/Navbar";
import Menu from "./components/Menu";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Spotiwhy</title>
        <meta name="description" content="Spotify Showcase" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-[#191414] ">
        <Navbar />
        {/* <Menu /> */}
        <TopArtists />
      </main>
    </>
  );
};

export default Home;
