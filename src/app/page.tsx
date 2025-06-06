// src/app/page.tsx

"use client";
import { useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-white/10 bg-[#1e1e1e]">
        <video
          ref={videoRef}
          className="w-full h-[400px] object-cover bg-black"
          controls={false}
          poster="/thumbnail.jpg" // Ganti dengan thumbnail kamu
        >
          <source src="/video.mp4" type="video/mp4" />
          Browser kamu tidak mendukung tag video.
        </video>

        <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Judul Video Keren</h1>
            <p className="text-sm text-white/60">Durasi: 2:45</p>
          </div>

          <button
            onClick={togglePlay}
            className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>
      </div>
    </div>
  );
}
