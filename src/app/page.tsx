"use client";

import { useRef, useState, useEffect } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
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
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          aspectRatio: "16 / 9",
          position: "relative",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow:
            "0 4px 20px rgba(0,0,0,0.5), 0 0 10px rgba(255,0,0,0.5)",
        }}
      >
        <video
          ref={videoRef}
          src="https://fdhdccjrmpwuyzptuhsd.supabase.co/storage/v1/object/public/videos/demo.mp4"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          poster="/thumbnail.jpg"
          controls={false}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
            opacity: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "1rem",
            transition: "opacity 0.3s ease",
          }}
          className="video-controls"
        >
          <input
            type="range"
            value={progress}
            readOnly
            style={{
              width: "100%",
              height: "6px",
              accentColor: "red",
              cursor: "pointer",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "0.75rem",
              color: "white",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={togglePlay}
                style={{
                  padding: "0.5rem",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.25rem",
                }}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? "⏸️" : "▶️"}
              </button>

              <button
                onClick={() => {
                  if (!videoRef.current) return;
                  videoRef.current.muted = !videoRef.current.muted;
                }}
                style={{
                  padding: "0.5rem",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.25rem",
                }}
                aria-label="Mute/Unmute"
              >
                🔈
              </button>
            </div>

            <button
              onClick={handleFullscreen}
              style={{
                padding: "0.5rem",
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                fontSize: "1.25rem",
              }}
              aria-label="Fullscreen"
            >
              ⛶
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .video-controls {
          opacity: 0;
        }
        div:hover > .video-controls,
        div:focus-within > .video-controls,
        div.group:hover > .video-controls {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
