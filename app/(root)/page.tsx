"use client";
import PodcastCard from "@/components/PodcastCard";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";

const Home = () => {
  const allPocasts = useQuery(api.podcasts.getAllPodcasts);
  return (
    <div className="mt-9 flex flex-col gap-9 md:overflow-hidden">
      <section className="flex flex-col gap-5">
        <div className="flex flex-col">
          <h1 className=" text-20 font-bold text-white-1">Trending Podcasts</h1>
          <div className="podcast_grid">
            {allPocasts?.map(
              ({ _id, podcastTitle, podcastDescription, imageUrl }) => (
                <PodcastCard
                  key={_id}
                  imgUrl={imageUrl as string}
                  title={podcastTitle}
                  description={podcastDescription}
                  podcastId={_id}
                />
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
