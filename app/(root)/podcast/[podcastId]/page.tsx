"use client";
import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import PodcastDetailPlayer from "@/components/PodcastDetailPlayer";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Image from "next/image";
import React from "react";

const PodcastDetails = ({
  params,
}: {
  params: { podcastId: Id<"podcasts"> };
}) => {
  const { podcastId } = React.use(params);
  const { user } = useUser();
  const podcast = useQuery(api.podcasts.getPodcastById, {
    podcastId,
  });
  const similarPodcasts = useQuery(api.podcasts.getPodcastByVoiceType, {
    podcastId,
  });

  const isOwner = user?.id === podcast?.authorId;

  console.log(user);

  if (!similarPodcasts || !podcast) return <LoaderSpinner />;

  return (
    <section className="flex flex-col w-full">
      <header className="mt-9 flex items-center justify-between">
        <h1 className="text-20 font-bold text-white-1">Cuurently Playing</h1>
        <figure className="flex gap-3">
          <Image
            src="/icons/headphone.svg"
            alt="headphone"
            width={24}
            height={24}
          />
          <h2 className="text-16 font-bold text-white-1">{podcast?.views}</h2>
        </figure>
      </header>

      <PodcastDetailPlayer
        podcastId={podcast._id}
        podcastTitle={podcast.podcastTitle}
        author={podcast.author}
        imageUrl={podcast.imageUrl!}
        imageStorageId={podcast.imageStorageId!}
        isOwner={isOwner}
        authorImageUrl={podcast.authorImageUrl}
        authorId={podcast.authorId}
        audioUrl={podcast.audioUrl!}
        audioStorageId={podcast.audioStorageId!}
      />

      <p className="text-white-2 text-16 pb-8 pt-[45px] max-md:text-center ">
        {podcast?.podcastDescription}
        {podcast?.voiceType}
      </p>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-18 font-bold text-white-1">Transcription</h1>
          <p className="text-16 font-medium text-white-2">
            {podcast?.voicePrompt || "voice Prompt not avalible!"}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-18 font-bold text-white-1">Thumbnail Prompt</h1>
          <p className="text-16 font-medium text-white-2">
            {podcast?.imagePrompt || "Image Prompt is not avalible"}
          </p>
        </div>
      </div>

      <section className="mt-8 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Similar Podcasts</h1>
        {similarPodcasts && similarPodcasts.length > 0 ? (
          <div className="podcast_grid">
            {similarPodcasts.map(
              ({ _id, imageUrl, podcastTitle, podcastDescription }) => (
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
        ) : (
          <>
            <EmptyState
              title="No similar Podcasts Found"
              buttonLink="/discover"
              buttonText="Discover more Podcasts"
            />
          </>
        )}
      </section>
    </section>
  );
};

export default PodcastDetails;
