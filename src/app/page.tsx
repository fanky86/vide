"use client";

import { useRef, useState, useEffect } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videos, setVideos] = useState<string[]>([]);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(true); // Ganti ini sesuai autentikasi admin

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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setVideos(prev => [...prev, url]);
    setCurrentVideo(url);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.addEventListener("timeupdate", handleProgress);
    return () => video.removeEventListener("timeupdate", handleProgress);
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "black", padding: "1rem" }}>
      {currentVideo && (
        <div
          style={{
            width: "100%",
            maxWidth: "800px",
            margin: "0 auto",
            position: "relative",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5), 0 0 10px rgba(255,0,0,0.5)",
          }}
        >
          <video
            ref={videoRef}
            src={currentVideo}
            style={{ width: "100%", height: "auto" }}
            controls
          />
        </div>
      )}

      {isAdmin && (
        <div style={{ textAlign: "center", margin: "1rem 0" }}>
          <input type="file" accept="video/*" onChange={handleUpload} />
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          maxWidth: "800px",
          margin: "2rem auto",
          overflowY: "auto",
        }}
      >
        {videos.map((vid, index) => (
          <div
            key={index}
            onClick={() => setCurrentVideo(vid)}
            style={{
              cursor: "pointer",
              border: "2px solid red",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <video
              src={vid}
              style={{ width: "100%", height: "auto" }}
              muted
            />
          </div>
        ))}
      </div>
    </div>
  );
}
