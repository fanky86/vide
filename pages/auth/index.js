'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const registerWithEmail = async () => {
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (error) {
      setMessage('Registrasi gagal: ' + error.message);
    } else {
      setMessage('Registrasi berhasil! Cek email Anda untuk verifikasi.');
      setTimeout(() => {
        router.push('/');
      }, 2500);
    }
  };

  const registerWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage('Login Google gagal: ' + error.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '3rem auto', background: '#222', padding: 24, borderRadius: 12, color: 'white' }}>
      <h2 style={{ marginBottom: '1rem' }}>Register</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ width: '100%', padding: 12, marginBottom: 12, borderRadius: 8, border: 'none' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 8, border: 'none' }}
      />

      <button
        onClick={registerWithEmail}
        disabled={loading}
        style={{
          width: '100%',
          padding: 12,
          backgroundColor: '#4caf50',
          border: 'none',
          borderRadius: 8,
          color: 'white',
          fontSize: 16,
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: 12,
        }}
      >
        {loading ? 'Loading...' : 'Daftar dengan Email'}
      </button>

      <button
        onClick={registerWithGoogle}
        style={{
          width: '100%',
          padding: 12,
          backgroundColor: '#db4437',
          border: 'none',
          borderRadius: 8,
          color: 'white',
          fontSize: 16,
          cursor: 'pointer',
        }}
      >
        Daftar dengan Google
      </button>

      {message && (
        <p style={{ marginTop: 16, color: message.includes('berhasil') ? 'lightgreen' : 'salmon' }}>
          {message}
        </p>
      )}
    </div>
  );
}
