// ==== app/profile/page.js ====
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        setUsername(user.user_metadata?.username || '');
        setAvatar(user.user_metadata?.avatar || '');
      } else {
        router.push('/auth');
      }
    });
  }, []);

  const updateProfile = async () => {
    const { error } = await supabase.auth.updateUser({
      data: {
        username,
        avatar
      }
    });
    if (error) alert(error.message);
    else alert('Profil berhasil diperbarui.');
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', background: '#222', padding: '2rem', borderRadius: '12px' }}>
      <h2>Profil Saya</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Nama Pengguna"
        style={inputStyle}
      />
      <input
        type="text"
        value={avatar}
        onChange={(e) => setAvatar(e.target.value)}
        placeholder="URL Foto Profil"
        style={inputStyle}
      />
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={updateProfile} style={btnStyle}>Simpan</button>
        <button onClick={() => router.push('/')} style={{ ...btnStyle, background: '#888' }}>Kembali</button>
        <button onClick={logout} style={{ ...btnStyle, background: '#f44336' }}>Logout</button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.5rem',
  marginBottom: '1rem',
  borderRadius: '8px',
  border: 'none',
};

const btnStyle = {
  flex: 1,
  padding: '0.75rem',
  background: '#4caf50',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
};
