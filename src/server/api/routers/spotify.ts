import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const spotifyRouter = createTRPCRouter({
  getArtist: publicProcedure.query(() => {
    console.log("spotifyRouter.getArtist");
  }),
});
