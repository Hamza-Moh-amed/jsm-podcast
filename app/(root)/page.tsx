"use client";
import PodcastCard from "@/components/PodcastCard";
import TrendingPodcastCard from "@/components/TrendingPodcastCard";
import { podcastData } from "@/constants";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";

const Home = () => {
  const aiGenerated = useQuery(api.podcasts.getAiGeneratedPodcasts);
  return (
    <div className="mt-9 flex flex-col gap-9">
      <section className="flex flex-col gap-5">
        <div className="flex flex-col">
          <h1 className=" text-20 font-bold text-white-1">Trending Podcasts</h1>
          <div className="podcast_grid">
            {podcastData.map(({ imgURL, title, description, id }) => (
              <TrendingPodcastCard
                key={id}
                imgURL={imgURL}
                title={title}
                description={description}
                podcastId={id}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className=" text-20 font-bold text-white-1">
            Ai Generated Podcast
          </h1>
          <div className="podcast_grid">
            {aiGenerated?.map(
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
