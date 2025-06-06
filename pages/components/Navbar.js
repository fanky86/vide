'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  // Klik di luar menu untuk menutup
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav
      style={{
        padding: '1rem',
        backgroundColor: '#222',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <h2 style={{ margin: 0, cursor: 'pointer' }} onClick={() => router.push('/')}>
        🎥 FankyX Videos
      </h2>

      <div style={{ position: 'relative' }} ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.8rem',
            cursor: 'pointer',
            userSelect: 'none',
          }}
          aria-label="Menu"
          title="Menu"
        >
          ⋮
        </button>

        {menuOpen && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: '2.5rem',
              backgroundColor: '#333',
              borderRadius: '6px',
              overflow: 'hidden',
              zIndex: 20,
              boxShadow: '0 0 10px rgba(0,0,0,0.8)',
              minWidth: '140px',
            }}
          >
            <button onClick={() => { setMenuOpen(false); router.push('/auth'); }} style={menuBtn}>
              Login
            </button>
            <button onClick={() => { setMenuOpen(false); router.push('/settings'); }} style={menuBtn}>
              Pengaturan
            </button>
            <button onClick={() => { setMenuOpen(false); router.push('/contact'); }} style={menuBtn}>
              Kontak
            </button>
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
  fontSize: '1rem',
  borderBottom: '1px solid #444',
  userSelect: 'none',
};
