import PodcastCard from "@/components/PodcastCard";
import { podcastData } from "@/constants";
import React from "react";

const Home = () => {
  return (
    <div className="mt-9 flex flex-col gap-9">
      <section className="flex flex-col gap-5">
        <div className="flex flex-col">
          <h1 className=" text-20 font-bold text-white-1">Trending Podcasts</h1>
          <div className="podcast_grid">
            {podcastData.map(({ imgURL, title, description, id }) => (
              <PodcastCard
                key={id}
                imgURL={imgURL}
                title={title}
                description={description}
                podcastId={id}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
