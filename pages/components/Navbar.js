// ==== app/components/Navbar.js ====
'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{ padding: '1rem', backgroundColor: '#222', display: 'flex', justifyContent: 'space-between' }}>
      <h2 style={{ margin: 0 }}>🎥 FankyX Videos</h2>
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>
          ⋮
        </button>
        {menuOpen && (
          <div style={{ position: 'absolute', right: 0, top: '2rem', backgroundColor: '#333', borderRadius: '6px', overflow: 'hidden', zIndex: 10 }}>
            <button onClick={() => router.push('/auth')} style={menuBtn}>Login</button>
            <button onClick={() => router.push('/settings')} style={menuBtn}>Pengaturan</button>
            <button onClick={() => router.push('/contact')} style={menuBtn}>Kontak</button>
          </div>
        )}
      </div>
    </nav>
  );
}

const menuBtn = {
  padding: '0.75rem 1.5rem',
  width: '100%',
  background: 'none',
  border: 'none',
  textAlign: 'left',
  color: 'white',
  cursor: 'pointer',
};
