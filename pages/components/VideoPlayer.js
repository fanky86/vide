'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function VideoPlayer({ searchQuery }) {
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    if (videos.length > 0 && searchQuery) {
      // Filter video yang mengandung searchQuery di nama file
      const filtered = videos.filter((v) =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setCurrentVideo(filtered[0]?.url || null);
    } else if (videos.length > 0 && !searchQuery) {
      setCurrentVideo(videos[0].url);
    }
  }, [searchQuery, videos]);

  async function fetchVideos() {
    const { data, error } = await supabase.storage.from('videos').list('', {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (error) {
      console.error('Gagal mengambil daftar video:', error.message);
      return;
    }

    if (data) {
      const urls = await Promise.all(
        data.map(async (file) => {
          const { data: fileUrl } = await supabase.storage
            .from('videos')
            .getPublicUrl(file.name);
          return { name: file.name, url: fileUrl.publicUrl };
        })
      );
      setVideos(urls);
      setCurrentVideo(urls[0]?.url);
    }
  }

  return (
    <div>
      {currentVideo ? (
        <video
          src={currentVideo}
          controls
          autoPlay
          style={{ width: '100%', borderRadius: '12px' }}
        />
      ) : (
        <p>Tidak ada video untuk diputar.</p>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '1rem',
          marginTop: '1rem',
        }}
      >
        {videos.map((v, i) => (
          <video
            key={i}
            src={v.url}
            style={{
              width: '100%',
              cursor: 'pointer',
              borderRadius: '10px',
              height: '100px',
              objectFit: 'cover',
            }}
            onClick={() => setCurrentVideo(v.url)}
            title={v.name}
          />
        ))}
      </div>
    </div>
  );
}
