'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login'); // login / register
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) alert(error.message);
    else alert('Login berhasil!');
  };

  const register = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) alert(error.message);
    else alert('Registrasi berhasil! Cek email untuk verifikasi.');
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '3rem auto',
        background: '#222',
        padding: '2rem',
        borderRadius: '12px',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
        {mode === 'login' ? 'Login' : 'Daftar'}
      </h2>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        style={inputStyle}
        autoComplete="email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        style={inputStyle}
        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
      />

      {mode === 'login' ? (
        <button onClick={login} disabled={loading} style={btnStyle}>
          {loading ? 'Loading...' : 'Login'}
        </button>
      ) : (
        <button onClick={register} disabled={loading} style={btnStyle}>
          {loading ? 'Loading...' : 'Daftar'}
        </button>
      )}

      <p style={{ marginTop: '1rem', textAlign: 'center', color: '#bbb' }}>
        {mode === 'login' ? (
          <>
            Belum punya akun?{' '}
            <button
              style={linkBtn}
              onClick={() => setMode('register')}
              disabled={loading}
            >
              Daftar
            </button>
          </>
        ) : (
          <>
            Sudah punya akun?{' '}
            <button
              style={linkBtn}
              onClick={() => setMode('login')}
              disabled={loading}
            >
              Login
            </button>
          </>
        )}
      </p>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  marginBottom: '1rem',
  borderRadius: '8px',
  border: 'none',
  fontSize: '1rem',
};

const btnStyle = {
  width: '100%',
  padding: '0.75rem',
  backgroundColor: '#4caf50',
  border: 'none',
  color: 'white',
  fontSize: '1rem',
  borderRadius: '8px',
  cursor: 'pointer',
  userSelect: 'none',
};

const linkBtn = {
  background: 'none',
  border: 'none',
  color: '#4caf50',
  cursor: 'pointer',
  textDecoration: 'underline',
  fontSize: '1rem',
  userSelect: 'none',
};
