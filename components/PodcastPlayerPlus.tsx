"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  FaPlay,
  FaPause,
  FaForward,
  FaBackward,
  FaVolumeMute,
  FaVolumeUp,
  FaRedo,
} from "react-icons/fa";

import { formatTime } from "@/lib/formatTime";
import { cn } from "@/lib/utils";
import { useAudio } from "@/providers/AudioProvider";

const PodcastPlayerPlus = () => {
  const audioRef = useRef<HTMLAudioElement>(null); // Reference to audio element for control
  const [isPlaying, setIsPlaying] = useState(false); // Track play/pause state
  const [duration, setDuration] = useState(0); // Duration of the audio
  const [isMuted, setIsMuted] = useState(false); // Track mute/unmute state
  const [currentTime, setCurrentTime] = useState(0); // Current playback time
  const [hasEnded, setHasEnded] = useState(false); // Track if audio has ended for replay
  const { audio } = useAudio(); // Get audio information from context/provider

  // Toggle play/pause or replay if audio has ended
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (hasEnded) {
        // Replay the audio if it has ended
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        setHasEnded(false);
        setIsPlaying(true);
      } else if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Toggle mute/unmute
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Forward 5 seconds
  const forward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 5,
        duration
      );
    }
  };

  // Rewind 5 seconds
  const rewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        audioRef.current.currentTime - 5,
        0
      );
    }
  };

  // Update progress bar and current time based on audio playback
  useEffect(() => {
    const updateTime = () => setCurrentTime(audioRef.current!.currentTime);

    audioRef.current?.addEventListener("timeupdate", updateTime);
    return () =>
      audioRef.current?.removeEventListener("timeupdate", updateTime);
  }, []);

  // Load and autoplay audio if URL changes
  useEffect(() => {
    if (audio?.audioUrl && audioRef.current) {
      audioRef.current.src = audio.audioUrl;
      audioRef.current.play().then(() => setIsPlaying(true));
    } else {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  }, [audio?.audioUrl]);

  // Set audio duration when metadata loads
  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  // Handle audio end and show replay button
  const handleAudioEnded = () => {
    setIsPlaying(false);
    setHasEnded(true); // Indicate that audio has ended
  };

  // Seek functionality for progress bar
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setHasEnded(false); // Reset hasEnded if user seeks manually
    }
  };

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 w-full p-4 bg-opacity-70 backdrop-blur-lg",
        {
          hidden: !audio?.audioUrl,
        }
      )}
    >
      {/* Main player section with rounded background */}
      <section className="glassmorphism-black flex h-28 w-full items-center justify-between rounded-lg bg-gray-900/80 px-4 md:px-12">
        {/* Audio element for playback control */}
        <audio
          ref={audioRef}
          className="hidden"
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleAudioEnded}
        />
        {/* Podcast thumbnail and details */}
        <div className="flex items-center gap-4 max-md:hidden">
          <Link href={`/podcast/${audio?.podcastId}`}>
            <Image
              src={audio?.imageUrl || "/images/player1.png"}
              width={64}
              height={64}
              alt="Podcast thumbnail"
              className="aspect-square rounded-lg shadow-md"
            />
          </Link>
          <div className="flex flex-col w-[160px]">
            <h2 className="text-sm font-semibold text-gray-300 truncate">
              {audio?.title}
            </h2>
            <p className="text-xs font-normal text-gray-400 ">
              {audio?.author}
            </p>
          </div>
        </div>
        {/* Playback controls with icons */}
        <div className="flex items-center gap-6">
          <FaBackward
            onClick={rewind}
            className="text-gray-400 cursor-pointer hover:text-white transition-colors duration-200"
            size={24}
          />
          {hasEnded ? (
            <FaRedo
              onClick={togglePlayPause}
              className="text-gray-400 cursor-pointer hover:text-white transition-colors duration-200"
              size={30}
            />
          ) : isPlaying ? (
            <FaPause
              onClick={togglePlayPause}
              className="text-gray-400 cursor-pointer hover:text-white transition-colors duration-200"
              size={30}
            />
          ) : (
            <FaPlay
              onClick={togglePlayPause}
              className="text-gray-400 cursor-pointer hover:text-white transition-colors duration-200"
              size={30}
            />
          )}
          <FaForward
            onClick={forward}
            className="text-gray-400 cursor-pointer hover:text-white transition-colors duration-200"
            size={24}
          />
        </div>
        {/* Progress bar and time display */}
        <div className="flex items-center w-full max-md:hidden gap-2">
          {/* Current playback time */}
          <span className="text-xs font-light text-gray-300">
            {formatTime(currentTime)}
          </span>
          {/* Custom-styled progress bar */}
          <input
            type="range"
            className="flex-1 appearance-none h-1 rounded-lg bg-gray-600 cursor-pointer"
            min={0}
            max={duration}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            style={{
              background: `linear-gradient(to right, #3b82f6 ${(currentTime / duration) * 100}%, #4b5563 0%)`,
            }}
          />
          {/* Total duration */}
          <span className="text-xs font-light text-gray-300">
            {formatTime(duration)}
          </span>
          {/* Mute/unmute control */}
          {isMuted ? (
            <FaVolumeMute
              onClick={toggleMute}
              className="text-gray-400 cursor-pointer hover:text-white transition-colors duration-200"
              size={24}
            />
          ) : (
            <FaVolumeUp
              onClick={toggleMute}
              className="text-gray-400 cursor-pointer hover:text-white transition-colors duration-200"
              size={24}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default PodcastPlayerPlus;
