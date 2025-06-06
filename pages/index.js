"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const videoRef = useRef(null);
  const [user, setUser] = useState(null);
  const [videoList, setVideoList] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Cek user login
  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    fetchVideos();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Ambil semua video dari storage
  async function fetchVideos() {
    const { data, error } = await supabase.storage
      .from("videos")
      .list("", { limit: 100, sortBy: { column: "created_at", order: "desc" } });

    if (!error && data.length) {
      const videoURLs = await Promise.all(
        data.map(async (file) => {
          const { data: urlData } = await supabase.storage
            .from("videos")
            .getPublicUrl(file.name);
          return { name: file.name, url: urlData.publicUrl };
        })
      );
      setVideoList(videoURLs);
      setCurrentVideo(videoURLs[0]?.url || null);
    }
  }

  // Upload video ke Supabase
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileName = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
      .from("videos")
      .upload(fileName, file);

    if (!error) {
      await fetchVideos();
    }

    setUploading(false);
  };

  // Hapus video
  const handleDelete = async (fileName) => {
    const { error } = await supabase.storage.from("videos").remove([fileName]);
    if (!error) {
      await fetchVideos();
    }
  };

  // Login pakai email/password (testing)
  const handleLogin = async () => {
    const email = prompt("Email:");
    const password = prompt("Password:");
    await supabase.auth.signInWithPassword({ email, password });
  };

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div style={{ background: "#000", minHeight: "100vh", padding: "1rem", color: "#fff" }}>
      <div style={{ maxWidth: "800px", margin: "auto" }}>
        <h2 style={{ textAlign: "center" }}>🎬 Panel Video Admin</h2>

        {currentVideo && (
          <video
            ref={videoRef}
            src={currentVideo}
            controls
            autoPlay
            style={{ width: "100%", borderRadius: "12px" }}
          ></video>
        )}

        {user ? (
          <>
            <div style={{ margin: "1rem 0" }}>
              <input type="file" accept="video/*" onChange={handleVideoUpload} disabled={uploading} />
              {uploading && <p>Mengunggah...</p>}
              <button onClick={handleLogout} style={{ marginLeft: "1rem" }}>Logout</button>
            </div>
          </>
        ) : (
          <div style={{ margin: "1rem 0" }}>
            <button onClick={handleLogin}>Login Admin</button>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            marginTop: "1rem",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {videoList.map((video, idx) => (
            <div key={idx} style={{ position: "relative" }}>
              <video
                src={video.url}
                style={{ width: "100%", cursor: "pointer", borderRadius: "10px" }}
                onClick={() => setCurrentVideo(video.url)}
              ></video>
              {user && (
                <button
                  onClick={() => handleDelete(video.name)}
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    background: "red",
                    color: "#fff",
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Hapus
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
