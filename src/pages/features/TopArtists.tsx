import { useAutoAnimate } from "@formkit/auto-animate/react";
import { api } from "../../utils/api";
import { Artist } from "spotify-types/typings/artist";
import { useSession } from "next-auth/react";

const TopArtists: React.FC = () => {
  const { data: sessionData } = useSession();
  const { data: topArtists } = api.spotify.getMyTopArtists.useQuery(
    undefined, // no input
    {
      enabled: sessionData?.user !== undefined,
      initialData: [],
    },
  );
  const [parentRef] = useAutoAnimate();
  if (!sessionData?.user) return null;
  return (
    <div className="mx-4 flex flex-col items-center justify-center mt-4 gap-4">
      <h1 className="text-center text-2xl text-white">Top Artists</h1>
      <div className="flex flex-wrap items-center justify-center gap-4" ref={parentRef}>
        {topArtists.map((artist) => (
          <Artist key={artist.id} artist={artist} />
        ))}
      </div>
    </div>
  );
};

const Artist = ({ artist }: { artist: Artist }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-black rounded-b-md">
      <img className="h-48" src={artist.images[0]?.url} alt={artist.name} />
      <p className="text-center text-2xl pb-1 text-white">{artist.name}</p>
    </div>
  );
};
export default TopArtists;