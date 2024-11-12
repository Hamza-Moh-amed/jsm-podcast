"use client";
import { cn } from "@/lib/utils";
import { useAudio } from "@/providers/AudioProvider";
import Image from "next/image";

import React, { useState } from "react";

const PodcastPlayer = () => {
  const { audio } = useAudio();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  return (
    <div
      className={cn("sticky bottom-0 left-0 flex size-full flex-col", {
        hidden: !audio?.audioUrl,
      })}
    >
      <h1 className="text-white-1">{audio?.title}</h1>

      {/** 
       * <Progress
      value={(currentTime / duration) * 100}
      max={duration}
      className="w-full"

      
      /> 
     
      <Image
        src={audio?.imageUrl!}
        alt="player"
        width={64}
        height={64}
        className="aspect-square rounded-xl"
      />
       */}
      <h1 className="text-white-1">{audio?.author}</h1>
    </div>
  );
};

export default PodcastPlayer;
