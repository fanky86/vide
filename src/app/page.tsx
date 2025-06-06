// src/app/page.tsx

"use client";
import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, Maximize } from "lucide-react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleProgress = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    setProgress((current / duration) * 100);
  };

  const handleFullscreen = () => {
    if (videoRef.current?.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.addEventListener("timeupdate", handleProgress);
    return () => video.removeEventListener("timeupdate", handleProgress);
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-4xl aspect-video relative group rounded-lg overflow-hidden shadow-lg">
        <video
          ref={videoRef}
          src="https://your-supabase-url.supabase.co/storage/v1/object/public/videos/video.mp4"
          className="w-full h-full object-cover"
          poster="/thumbnail.jpg"
        />

        {/* Kontrol video */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
          <input
            type="range"
            value={progress}
            onChange={() => {}}
            className="w-full h-1 accent-red-500"
          />

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="p-2 bg-white/10 rounded-full hover:bg-white/20"
              >
                {isPlaying ? (
                  <Pause size={20} className="text-white" />
                ) : (
                  <Play size={20} className="text-white" />
                )}
              </button>

              <button className="p-2 bg-white/10 rounded-full hover:bg-white/20">
                <Volume2 size={20} className="text-white" />
              </button>
            </div>

            <div>
              <button
                onClick={handleFullscreen}
                className="p-2 bg-white/10 rounded-full hover:bg-white/20"
              >
                <Maximize size={20} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
