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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
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

  const handleDelete = async (fileName) => {
    const { error } = await supabase.storage.from("videos").remove([fileName]);
    if (!error) {
      await fetchVideos();
    }
  };

  const handleLogin = async () => {
    const email = prompt("Email:");
    const password = prompt("Password:");
    await supabase.auth.signInWithPassword({ email, password });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div style={{ background: "#111", minHeight: "100vh", padding: "1rem", color: "#fff" }}>
      <div style={{ position: "fixed", top: "1rem", right: "1rem" }}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "#333", color: "#fff", border: "none", padding: "0.5rem", borderRadius: "8px" }}
        >
          ☰
        </button>
        {menuOpen && (
          <div style={{ position: "absolute", right: 0, top: "2.5rem", background: "#222", padding: "1rem", borderRadius: "8px" }}>
            {user ? (
              <>
                <button onClick={handleLogout} style={{ display: "block", marginBottom: "0.5rem" }}>Logout</button>
                <input type="file" accept="video/*" onChange={handleVideoUpload} disabled={uploading} />
                {uploading && <p style={{ fontSize: "0.8rem" }}>Mengunggah...</p>}
              </>
            ) : (
              <button onClick={handleLogin}>Login</button>
            )}
          </div>
        )}
      </div>

      <div style={{ maxWidth: "900px", margin: "4rem auto 1rem" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>🎥 Koleksi Video Publik</h2>

        {currentVideo && (
          <video
            ref={videoRef}
            src={currentVideo}
            controls
            autoPlay
            style={{ width: "100%", borderRadius: "12px" }}
          ></video>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "1rem",
            marginTop: "1.5rem",
            maxHeight: "500px",
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

        <footer style={{ textAlign: "center", marginTop: "3rem", color: "#aaa" }}>
          <p>© {new Date().getFullYear()} FankyX Video App</p>
          <p><a href="#" style={{ color: "#ccc", textDecoration: "underline" }}>Contact</a> | <a href="#" style={{ color: "#ccc", textDecoration: "underline" }}>Terms</a></p>
        </footer>
      </div>
    </div>
  );
}
