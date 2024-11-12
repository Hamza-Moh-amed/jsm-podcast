"use client";
import { cn } from "@/lib/utils";
import { useAudio } from "@/providers/AudioProvider";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Progress } from "./ui/progress";
import Link from "next/link";
import { formatTime } from "@/lib/formatTime";

{
  /*
  ***** important *****
  Update folder after adding audio 
  time and duration state should be 0
  */
}

const PodcastPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(1000);
  const [currentTime, setCurrentTime] = useState(100);
  const { audio } = useAudio();
  console.log(audio);

  //functions: 1-togglePlayPaue, 2-toggleMute, 3-forward, 4-rewind, 5-handleLoadedMetadata, 6-handleAudioEnded
  //useEffect 1-Play&Pause  -2-updateTime

  const togglePlayPaue = () => {
    if (audioRef.current?.paused) {
      audioRef.current?.play();
      setIsPlaying(true);
    } else {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  };
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted((prev) => !prev);
    }
  };

  const forward = () => {
    if (
      audioRef.current &&
      audioRef.current.currentTime &&
      audioRef.current.duration &&
      audioRef.current.currentTime + 5 < audioRef.current.duration
    ) {
      audioRef.current.currentTime += 5;
    }
  };

  const rewind = () => {
    if (audioRef.current && audioRef.current.currentTime - 5 > 0) {
      audioRef.current.currentTime -= 5;
    } else if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    const updateCurrentTime = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("timeupdate", updateCurrentTime);

      return () => {
        audioElement.removeEventListener("timeupdate", updateCurrentTime);
      };
    }
  }, []);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audio?.audioUrl) {
      if (audioElement) {
        audioElement.play().then(() => {
          setIsPlaying(true);
        });
      }
    } else {
      audioElement?.pause();
      setIsPlaying(false);
    }
  }, [audio]);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };
  return (
    <div
      className={cn(
        "sticky bottom-0 left-0 flex size-full flex-col"
        // {hidden: !audio?.audioUrl || audio?.audioUrl === "",}
      )}
    >
      {/* Progress Bar */}
      <Progress
        value={(currentTime / duration) * 100}
        className="w-full"
        max={duration}
      />

      <section className="glassmorphism-black flex h-[112px] w-full items-center justify-between px-4 max-md:justify-center max-md:gap-5 md:px-12">
        <audio
          ref={audioRef}
          src={audio?.audioUrl}
          className="hidden"
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleAudioEnded}
        />
        {/* Author Info */}
        <div className="flex items-center gap-4 max-md:hidden">
          <Link href={`/podcast/${audio?.podcastId}`}>
            <Image
              src={audio?.imageUrl! || "/images/player1.png"}
              width={64}
              height={64}
              alt="player1"
              className="aspect-square rounded-xl"
            />
          </Link>

          <div className="flex w-[160px] flex-col">
            <h2 className="text-14 truncat font-semibold text-white-1">
              {audio?.title || "Demo Podcast Player"}
            </h2>
            <p className="text-12 font-normal text-white-2">
              {audio?.author || "Demo Author Name"}
            </p>
          </div>
        </div>
        {/* Player Controls */}
        <div className="flex-center cursor-pointer gap-3 md:gap-6">
          <div className="flex items-center gap-1.5">
            <Image
              src="icons/reverse.svg"
              alt="rewind"
              width={24}
              height={24}
              onClick={rewind}
            />
            <h2 className="text-12 font-bold text-white-4">-5</h2>
          </div>
          <Image
            src={isPlaying ? "icons/pause.svg" : "icons/play.svg"}
            alt="play"
            width={30}
            height={30}
            onClick={togglePlayPaue}
          />
          <div className="flex items-center gap-1.5">
            <h2 className="text-12 font-bold text-white-4 ">+5</h2>
            <Image
              src="icons/forward.svg"
              alt="forward"
              width={24}
              height={24}
              onClick={forward}
            />
          </div>
        </div>
        {/* Duration & Mute */}
        <div className="flex items-center gap-6">
          <h2 className="text-16 font-normal text-white-2 max-md:hidden">
            {formatTime(duration)}
          </h2>
          <div className="flex w-full gap-2">
            <Image
              src={isMuted ? "/icons/unmute.svg" : "/icons/mute.svg"}
              width={24}
              height={24}
              alt="mute unmute"
              onClick={toggleMute}
              className="cursor-pointer"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PodcastPlayer;
