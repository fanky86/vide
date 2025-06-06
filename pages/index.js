// Folder: pages/index.js (Landing Page)
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import VideoList from "../components/VideoList";
import Header from "../components/Header";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const { data, error } = await supabase.storage.from("videos").list("");
    if (data && !error) {
      const urls = await Promise.all(
        data.map(async (v) => {
          const { data: urlData } = await supabase.storage
            .from("videos")
            .getPublicUrl(v.name);
          return { name: v.name, url: urlData.publicUrl };
        })
      );
      setVideos(urls);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/search?q=${search}`);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />

      <main className="max-w-5xl mx-auto p-4">
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Cari video..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-2 rounded bg-gray-800 focus:outline-none"
          />
          <button className="bg-blue-600 px-4 py-2 rounded">Cari</button>
        </form>
        <VideoList videos={videos} />
      </main>
    </div>
  );
}

// Folder: components/Header.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { MoreVertical } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Header() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user);
    });
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="flex justify-between items-center px-4 py-3 bg-gray-900 shadow">
      <h1 className="text-lg font-bold">FankyX Video</h1>
      <div className="relative">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          <MoreVertical className="text-white" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow z-10">
            <button
              onClick={() => router.push("/contact")}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Kontak
            </button>
            <button
              onClick={() => router.push("/settings")}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Pengaturan
            </button>
            {!user && (
              <button
                onClick={() => router.push("/auth")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Login / Daftar
              </button>
            )}
            {user && (
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

// Folder: components/VideoList.js
export default function VideoList({ videos }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {videos.map((video, idx) => (
        <video
          key={idx}
          src={video.url}
          controls
          className="w-full rounded-lg shadow"
        ></video>
      ))}
    </div>
  );
}
