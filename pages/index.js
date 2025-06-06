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
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
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
    const { error } = await supabase.storage.from("videos").upload(fileName, file);

    if (!error) {
      await fetchVideos();
    } else {
      alert("Upload gagal: " + error.message);
    }

    setUploading(false);
  };

  const handleDelete = async (fileName) => {
    const { error } = await supabase.storage.from("videos").remove([fileName]);
    if (!error) {
      await fetchVideos();
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Login gagal: " + error.message);
    else setShowLoginForm(false);
  };

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert("Gagal daftar: " + error.message);
    else alert("Cek email kamu untuk verifikasi.");
  };

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const filteredVideos = videoList.filter((video) =>
    video.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ background: "#111", minHeight: "100vh", padding: "1rem", color: "#fff" }}>
      {/* Menu pojok kanan */}
      <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ fontSize: "1.5rem", background: "none", color: "white", border: "none", cursor: "pointer" }}>⋮</button>
        {menuOpen && (
          <div style={{ background: "#222", borderRadius: "8px", padding: "0.5rem", position: "absolute", top: "2.5rem", right: "0", zIndex: 1000 }}>
            {!user && <div onClick={() => setShowLoginForm(true)} style={{ cursor: "pointer", padding: "0.25rem 0.5rem" }}>🔐 Login / Daftar</div>}
            {user && <div onClick={handleLogout} style={{ cursor: "pointer", padding: "0.25rem 0.5rem" }}>🚪 Logout</div>}
            <div style={{ cursor: "pointer", padding: "0.25rem 0.5rem" }}>⚙️ Pengaturan</div>
            <div style={{ cursor: "pointer", padding: "0.25rem 0.5rem" }}>📞 Kontak</div>
          </div>
        )}
      </div>

      {showLoginForm && (
        <div style={{ maxWidth: "600px", margin: "3rem auto", background: "#222", padding: "2rem", borderRadius: "12px" }}>
          <h2 style={{ textAlign: "center" }}>🔐 Login atau Daftar</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem", borderRadius: "8px", border: "none" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem", borderRadius: "8px", border: "none" }}
          />
          <button onClick={handleLogin} style={{ width: "100%", padding: "0.75rem", marginBottom: "0.5rem", background: "#4caf50", color: "white", border: "none", borderRadius: "8px" }}>Login</button>
          <button onClick={handleRegister} style={{ width: "100%", padding: "0.75rem", marginBottom: "0.5rem", background: "#2196f3", color: "white", border: "none", borderRadius: "8px" }}>Daftar</button>
          <button onClick={loginWithGoogle} style={{ width: "100%", padding: "0.75rem", background: "#f44336", color: "white", border: "none", borderRadius: "8px" }}>Login dengan Google</button>
        </div>
      )}

      {user && (
        <div style={{ maxWidth: "600px", margin: "1rem auto" }}>
          <p>👋 Hai, {user.email}</p>
          <input type="file" accept="video/*" onChange={handleVideoUpload} disabled={uploading} style={{ display: "block", marginBottom: "1rem" }} />
          {uploading && <p>Mengunggah...</p>}
        </div>
      )}

      <div style={{ maxWidth: "900px", margin: "2rem auto 1rem" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>🎥 Koleksi Video Publik</h2>

        <input
          type="text"
          placeholder="Cari video..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", marginBottom: "1rem", border: "none" }}
        />

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
          {filteredVideos.map((video, idx) => (
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
          <p>© {new Date().getFullYear()} Video islamic</p>
          <p><a href="#" style={{ color: "#ccc", textDecoration: "underline" }}>Contact</a> | <a href="#" style={{ color: "#ccc", textDecoration: "underline" }}>Terms</a></p>
        </footer>
      </div>
    </div>
  );
}
