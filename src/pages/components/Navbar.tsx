import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image"

const Navbar = () => {
  const { data: sessionData } = useSession();
  return (
    <div className="bg-[#191414] flex flex-row w-full items-center justify-between">
      <Image alt="Spotify Logo" src="/WordLogo.svg" height={100} width={200} />
      <div className="mr-8">
        <button
          className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          onClick={sessionData ? () => void signOut() : () => void signIn("spotify")}
        >
          {sessionData ? "Sign out" : "Sign in"}
        </button>
      </div>
    </div>
  )
}

export default Navbar