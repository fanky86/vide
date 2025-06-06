"use client";

import React, { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const videoRef = useRef(null);

  // State
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Login form
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);

  // Load session & videos on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    fetchVideos();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Ambil daftar video
  async function fetchVideos() {
    const { data, error } = await supabase.storage
      .from("videos")
      .list("", { limit: 100, sortBy: { column: "created_at", order: "desc" } });

    if (error) {
      alert("Gagal mengambil video: " + error.message);
      return;
    }
    if (data.length) {
      const videoURLs = await Promise.all(
        data.map(async (file) => {
          const { data: urlData } = supabase.storage.from("videos").getPublicUrl(file.name);
          return { name: file.name, url: urlData.publicUrl };
        })
      );
      setVideos(videoURLs);
      setCurrentVideo(videoURLs[0]?.url || null);
    } else {
      setVideos([]);
      setCurrentVideo(null);
    }
  }

  // Upload video handler
  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileName = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("videos").upload(fileName, file);

    if (error) {
      alert("Upload gagal: " + error.message);
    } else {
      await fetchVideos();
      alert("Upload berhasil!");
    }
    setUploading(false);
    e.target.value = null;
  }

  // Hapus video
  async function handleDelete(fileName) {
    if (!confirm(`Hapus video "${fileName}"?`)) return;

    const { error } = await supabase.storage.from("videos").remove([fileName]);
    if (error) {
      alert("Hapus gagal: " + error.message);
    } else {
      await fetchVideos();
      alert("Video dihapus.");
    }
  }

  // Login submit
  async function handleLoginSubmit(e) {
    e.preventDefault();
    setLoadingLogin(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert("Login gagal: " + error.message);
    } else {
      setShowLoginForm(false);
      setEmail("");
      setPassword("");
      alert("Login berhasil!");
    }
    setLoadingLogin(false);
  }

  // Logout
  async function handleLogout() {
    await supabase.auth.signOut();
    alert("Logout berhasil!");
  }

  return (
    <>
      {/* Menu kanan atas */}
      <div style={{ position: "fixed", top: 12, right: 12, zIndex: 1000 }}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "#222",
            color: "#eee",
            border: "none",
            borderRadius: 8,
            padding: "0.6rem 1rem",
            fontSize: 20,
            cursor: "pointer",
          }}
          aria-label="Menu Toggle"
        >
          ☰
        </button>

        {menuOpen && (
          <div
            style={{
              background: "#111",
              marginTop: 8,
              borderRadius: 8,
              boxShadow: "0 0 10px #000",
              padding: "1rem",
              minWidth: 180,
              textAlign: "center",
              userSelect: "none",
            }}
          >
            {user ? (
              <>
                <p style={{ marginBottom: 8, color: "#ddd" }}>Halo, {user.email}</p>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  style={{
                    padding: "0.5rem 1rem",
                    marginBottom: 12,
                    width: "100%",
                    cursor: "pointer",
                    borderRadius: 6,
                    border: "none",
                    background: "#e74c3c",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  Logout
                </button>

                <input
                  type="file"
                  accept="video/*"
                  onChange={handleUpload}
                  disabled={uploading}
                  style={{ width: "100%" }}
                />
                {uploading && <p style={{ color: "#aaa" }}>Mengunggah video...</p>}
              </>
            ) : (
              <button
                onClick={() => {
                  setShowLoginForm(true);
                  setMenuOpen(false);
                }}
                style={{
                  padding: "0.5rem 1rem",
                  width: "100%",
                  cursor: "pointer",
                  borderRadius: 6,
                  border: "none",
                  background: "#27ae60",
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                Login
              </button>
            )}
          </div>
        )}
      </div>

      {/* Form login modal */}
      {showLoginForm && (
        <div
          onClick={() => setShowLoginForm(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleLoginSubmit}
            style={{
              background: "#222",
              padding: "2rem",
              borderRadius: 12,
              width: 320,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              color: "#eee",
              boxShadow: "0 0 10px #000",
            }}
          >
            <h2 style={{ margin: 0, marginBottom: 8, textAlign: "center" }}>Login</h2>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              style={{
                padding: "0.6rem",
                borderRadius: 6,
                border: "none",
                fontSize: 16,
                backgroundColor: "#333",
                color: "#eee",
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{
                padding: "0.6rem",
                borderRadius: 6,
                border: "none",
                fontSize: 16,
                backgroundColor: "#333",
                color: "#eee",
              }}
            />
            <button
              type="submit"
              disabled={loadingLogin}
              style={{
                background: "#27ae60",
                color: "#fff",
                fontWeight: "bold",
                padding: "0.8rem",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
              }}
            >
              {loadingLogin ? "Loading..." : "Login"}
            </button>
            <button
              type="button"
              onClick={() => setShowLoginForm(false)}
              style={{
                background: "#e74c3c",
                color: "#fff",
                padding: "0.8rem",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                marginTop: 4,
              }}
            >
              Batal
            </button>
          </form>
        </div>
      )}

      {/* Konten utama */}
      <main
        style={{
          maxWidth: 900,
          margin: "5rem auto 3rem",
          padding: "0 1rem",
          color: "#eee",
          userSelect: "none",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: 24 }}>🎥 Koleksi Video Publik</h1>

        {currentVideo ? (
          <video
            ref={videoRef}
            src={currentVideo}
            controls
            autoPlay
            style={{ width: "100%", borderRadius: 12, background: "#000" }}
          />
        ) : (
          <p style={{ textAlign: "center" }}>Belum ada video.</p>
        )}

        <section
          style={{
            marginTop: 24,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))",
            gap: 16,
            maxHeight: 500,
            overflowY: "auto",
            paddingRight: 8,
          }}
        >
          {videos.map((video) => (
            <div
              key={video.name}
              style={{
                position: "relative",
                cursor: "pointer",
                borderRadius: 12,
                overflow: "hidden",
                border: currentVideo === video.url ? "3px solid #27ae60" : "3px solid transparent",
              }}
              onClick={() => setCurrentVideo(video.url)}
              title={video.name}
            >
              <video
                src={video.url}
                style={{ width: "100%", height: 90, objectFit: "cover", borderRadius: 12 }}
                muted
                preload="metadata"
              />
              {user && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(video.name);
                  }}
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    background: "#e74c3c",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: 24,
                    height: 24,
                    fontWeight: "bold",
                    cursor: "pointer",
                    lineHeight: "22px",
                  }}
                  aria-label={`Hapus video ${video.name}`}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </section>

        <footer style={{ marginTop: 48, textAlign: "center", color: "#666" }}>
          <p>© {new Date().getFullYear()} FankyX Video App</p>
        </footer>
      </main>
    </>
  );
}
