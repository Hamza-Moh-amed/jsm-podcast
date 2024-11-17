import { GeneratePodcastProps } from "@/types";
import React, { ChangeEvent, useRef, useState } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from "uuid";
import { Input } from "./ui/input";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Image from "next/image";

const AddAudio = ({
  setAudioStorageId,
  setAudio,
  voiceType,
  audio,
  voicePrompt,
  setVoicePrompt,
  setAudioDuration,
}: GeneratePodcastProps) => {
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isAiAudio, setIsAiAudio] = useState(false);
  const { toast } = useToast();
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);

  const getPodcastAudio = useAction(api.openai.generateAudioAction);

  const getAudioUrl = useMutation(api.podcasts.geturl);
  const audioRef = useRef<HTMLInputElement>(null);

  {
    /*
  const handleAudio = async (blob: Blob, fileName: string) => {
    setIsAudioLoading(true);
    setAudio("");

    try {
      const file = new File([blob], fileName, { type: "audio/mp3" });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setIsAudioLoading(storageId);

      const audioUrl = await getAudioUrl({ storageId });
      setAudio(audioUrl!);
      setIsAudioLoading(false);
      toast({
        title: "Audio Generated Successfully",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error generating Audio",
        variant: "destructive",
      });
    }
  };
*/
  }

  const handleAudio = async (blob: Blob, fileName: string) => {
    setIsAudioLoading(true);
    setAudio("");

    try {
      const file = new File([blob], fileName, { type: "audio/mp3" });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setAudioStorageId(storageId);

      const audioUrl = await getAudioUrl({ storageId });
      setAudio(audioUrl!);
      setIsAudioLoading(false);
      toast({
        title: "Audio Generated Successfully",
      });
    } catch (error) {
      console.error("Error generating audio:", error);
      toast({
        title: "Error generating Audio",
        variant: "destructive",
      });
      setIsAudioLoading(false);
    }
  };

  const generatePodcast = async () => {
    setIsAudioLoading(true);
    setAudio("");

    if (!voicePrompt) {
      toast({
        title: "Please provide a voiceType to generate a podcast",
      });
      return setIsAudioLoading(false);
    }

    try {
      const response = await getPodcastAudio({
        voice: voiceType,
        input: voicePrompt,
      });

      const blob = new Blob([response], { type: "audio/mp3" });
      const fileName = `podcast-${uuidv4()}.mp3`;
      const file = new File([blob], fileName, { type: "audio/mp3" });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setAudioStorageId(storageId);

      const audioUrl = await getAudioUrl({ storageId });
      setAudio(audioUrl!);
      setIsAudioLoading(false);
      toast({
        title: "Podcast generated successfully",
      });
    } catch (error) {
      console.log("Error generating podcast", error);
      toast({
        title: "Error creating a podcast",
        variant: "destructive",
      });
      setIsAudioLoading(false);
    }
  };

  const uploadAudio = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const file = files[0];
      const blob = await file
        .arrayBuffer()
        .then((buffer) => new Blob([buffer]));
      handleAudio(blob, file.name);
    } catch (error) {
      console.error("Error uploading audio:", error);
      toast({
        title: "Error loading audio",
        variant: "destructive",
      });
    }
  };

  {
    /*
  const uploadAudio = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      const files = e.target.files;

      if (!files) return;

      const file = files[0];

      const blob = await file
        .arrayBuffer()
        .then((arrayBuffer) => new Blob([arrayBuffer]));

      handleAudio(blob, file.name);
    } catch (error) {
      console.log(error);
     toast({
        title: "Error loading audio",
        variant: "destructive",
      });
    }
  };
  */
  }

  return (
    <section>
      <div className="generate_thumbnail">
        <Button
          type="button"
          variant="plain"
          onClick={() => setIsAiAudio(true)}
          className={cn("", { "bg-black-6": isAiAudio })}
        >
          Use AI to generate Audio
        </Button>
        <Button
          type="button"
          variant="plain"
          onClick={() => setIsAiAudio(false)}
          className={cn("", { "bg-black-6": !isAiAudio })}
        >
          Upload Custom Audio
        </Button>
      </div>

      {isAiAudio ? (
        <div className="mt-5">
          <div className="flex flex-col gap-2.5">
            <Label className="text-16 font-bold text-white-1">
              AI Prompt to generate Podcast
            </Label>
            <Textarea
              className="input-class font-light focus-visible:ring-offset-orange-1"
              placeholder="Provide text to generate audio"
              rows={5}
              value={voicePrompt}
              onChange={(e) => setVoicePrompt(e.target.value)}
            />
          </div>
          <div className="mt-5 w-full max-w-[200px]">
            <Button
              type="submit"
              className="text-16 bg-orange-1 py-4 font-bold text-white-1"
              onClick={generatePodcast}
            >
              {isAudioLoading ? (
                <>
                  Generating
                  <Loader size={20} className="animate-spin ml-2" />
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </div>
          {audio && (
            <audio
              controls
              src={audio}
              autoPlay
              className="mt-5"
              onLoadedMetadata={(e) =>
                setAudioDuration(e.currentTarget.duration)
              }
            />
          )}
        </div>
      ) : (
        <div className="image_div" onClick={() => audioRef?.current?.click()}>
          <Input
            type="file"
            accept="audio"
            onChange={(e) => uploadAudio(e)}
            ref={audioRef}
            className=""
          />

          {!isAudioLoading ? (
            <Image
              src="icons/upload-image.svg"
              alt="upload"
              width={40}
              height={40}
            />
          ) : (
            <div className="text-16 flex-center font-medium text-white-1">
              uploading
              <Loader size={20} className="animate-spin ml-2" />
            </div>
          )}
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-12 font-bold text-orange-1">Click to upload</h2>
            <p className="text-12 font-normal text-gray-1">
              SVG, PNG, JPG, or GIF (max. 1080x1080px)
            </p>
          </div>
        </div>
      )}

      {audio && (
        <>
          <audio
            controls
            src={audio}
            autoPlay
            className="mt-5"
            onLoadedMetadata={(e) => setAudioDuration(e.currentTarget.duration)}
          />
        </>
      )}
    </section>
  );
};

export default AddAudio;
