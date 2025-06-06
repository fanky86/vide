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

  // Modal & form login/register
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(false);

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

  async function handleAuthSubmit(e) {
    e.preventDefault();
    setLoadingAuth(true);

    if (isRegister) {
      // Register user baru
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        alert("Registrasi gagal: " + error.message);
        setLoadingAuth(false);
        return;
      }
      alert(
        "Registrasi berhasil! Silakan cek email kamu untuk verifikasi (kalau diaktifkan). Jika tidak ada verifikasi, kamu sudah bisa login."
      );
      // Otomatis login setelah signUp tidak selalu aktif, jadi kita minta login manual:
      setIsRegister(false);
      setEmail("");
      setPassword("");
      setLoadingAuth(false);
      return;
    } else {
      // Login
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        alert("Login gagal: " + error.message);
        setLoadingAuth(false);
        return;
      }
      setShowAuthForm(false);
      setEmail("");
      setPassword("");
      alert("Login berhasil!");
      setLoadingAuth(false);
    }
  }

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
                  setShowAuthForm(true);
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
                Login / Register
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal form login/register */}
      {showAuthForm && (
        <div
          onClick={() => setShowAuthForm(false)}
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
            onSubmit={handleAuthSubmit}
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
            <h2 style={{ margin: 0, marginBottom: 8, textAlign: "center" }}>
              {isRegister ? "Register" : "Login"}
            </h2>

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
              autoComplete={isRegister ? "new-password" : "current-password"}
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
              disabled={loadingAuth}
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
              {loadingAuth ? "Loading..." : isRegister ? "Register" : "Login"}
            </button>

            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              style={{
                background: "transparent",
                color: "#27ae60",
                padding: "0.5rem 0",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              {isRegister
                ? "Sudah punya akun? Login di sini"
                : "Belum punya akun? Register di sini"}
            </button>

            <button
              type="button"
              onClick={() => setShowAuthForm(false)}
              style={{
                background: "transparent",
                color: "#ccc",
                padding: "0.5rem 0",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                marginTop: 8,
              }}
            >
              Batal
            </button>
          </form>
        </div>
      )}

      {/* Video Player */}
      <main
        style={{
          maxWidth: 800,
          margin: "4rem auto 2rem",
          padding: "0 1rem",
          userSelect: "none",
        }}
      >
        <h1
          style={{
            fontWeight: "bold",
            textAlign: "center",
            color: "#eee",
            textShadow: "0 0 4px #000",
          }}
        >
          Video Player
        </h1>

        {currentVideo ? (
          <video
            ref={videoRef}
            key={currentVideo}
            controls
            src={currentVideo}
            style={{ width: "100%", borderRadius: 12 }}
          />
        ) : (
          <p style={{ color: "#bbb", textAlign: "center" }}>Tidak ada video</p>
        )}

        <div
          style={{
            marginTop: 16,
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            justifyContent: "center",
          }}
        >
          {videos.map(({ name, url }) => (
            <div
              key={name}
              style={{
                position: "relative",
                borderRadius: 10,
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: currentVideo === url ? "0 0 10px #27ae60" : "none",
                border: currentVideo === url ? "2px solid #27ae60" : "1px solid #444",
                width: 160,
                height: 90,
              }}
            >
              <video
                src={url}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                muted
                onClick={() => setCurrentVideo(url)}
              />
              {user && (
                <button
                  onClick={() => handleDelete(name)}
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    background: "rgba(231, 76, 60, 0.8)",
                    border: "none",
                    borderRadius: "50%",
                    width: 26,
                    height: 26,
                    color: "#fff",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                  title="Hapus video"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
