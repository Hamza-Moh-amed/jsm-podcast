"use client";

import { AudioContextType, AudioProps } from "@/types";
import { usePathname } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

const AudioContexct = createContext<AudioContextType | undefined>(undefined);

const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [audio, setAudio] = useState<AudioProps | undefined>();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/create-podcast") setAudio(undefined);
  }, [pathname]);

  return (
    <AudioContexct.Provider value={{ audio, setAudio }}>
      {children}
    </AudioContexct.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContexct);

  if (!context)
    throw new Error("useAudio must be used within an audio provider");

  return context;
};

export default AudioProvider;
