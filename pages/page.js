// ==== app/page.js ====
'use client';
import Navbar from './components/Navbar';
import VideoPlayer from './components/VideoPlayer';
import SearchBar from './components/SearchBar';

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '1rem', maxWidth: '1000px', margin: '0 auto' }}>
        <SearchBar />
        <VideoPlayer />
      </div>
    </div>
  );
}
