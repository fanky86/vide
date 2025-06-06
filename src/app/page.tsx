"use client";

import { useRef, useState } from "react";

export default function Home() { const videoRef = useRef(null); const [videoList, setVideoList] = useState([ "https://fdhdccjrmpwuyzptuhsd.supabase.co/storage/v1/object/public/videos/Tik_1750512376651.mp4", ]); const [currentVideo, setCurrentVideo] = useState(videoList[0]); const [isAdmin, setIsAdmin] = useState(true);

const handleVideoUpload = (e) => { const file = e.target.files[0]; if (!file) return; const url = URL.createObjectURL(file); setVideoList((prev) => [url, ...prev]); setCurrentVideo(url); };

return ( <div style={{ background: "#000", minHeight: "100vh", padding: "1rem" }}> <div style={{ maxWidth: "800px", margin: "auto" }}> <video ref={videoRef} src={currentVideo} controls style={{ width: "100%", borderRadius: "12px" }} ></video>

{isAdmin && (
      <div style={{ margin: "1rem 0" }}>
        <input type="file" accept="video/*" onChange={handleVideoUpload} />
      </div>
    )}

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1rem",
        marginTop: "1rem",
        maxHeight: "300px",
        overflowY: "auto",
      }}
    >
      {videoList.map((video, idx) => (
        <video
          key={idx}
          src={video}
          style={{ width: "100%", cursor: "pointer" }}
          onClick={() => setCurrentVideo(video)}
        ></video>
      ))}
    </div>
  </div>
</div>

); }

