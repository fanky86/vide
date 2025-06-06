// ==== app/auth/page.js ====
'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };

  const register = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert('Cek email kamu untuk verifikasi.');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '3rem auto', background: '#222', padding: '2rem', borderRadius: '12px' }}>
      <h2>Login / Daftar</h2>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={inputStyle} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={inputStyle} />
      <button onClick={login} style={btnStyle}>Login</button>
      <button onClick={register} style={{ ...btnStyle, background: '#2196f3' }}>Daftar</button>
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
  width: '100%',
  padding: '0.75rem',
  background: '#4caf50',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  marginBottom: '1rem',
};
