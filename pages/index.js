'use client';

import Navbar from './components/Navbar';
import VideoPlayer from './components/VideoPlayer';
import SearchBar from './components/SearchBar';
import { useState } from 'react';

export default function HomePage() {
  // State untuk query pencarian yang dikirim ke VideoPlayer (jika mau filter)
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ padding: '1rem', maxWidth: '1000px', margin: '0 auto', flex: 1 }}>
        <SearchBar onSearch={(q) => setSearchTerm(q)} />
        <VideoPlayer searchQuery={searchTerm} />
      </main>
    </div>
  );
}
