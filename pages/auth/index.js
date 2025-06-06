// Struktur dasar autentikasi + role admin
// Gunakan Supabase Auth & Supabase Storage

'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.push('/');
    });
  }, []);

  const login = async () => {
    setLoading(true);
    setMessage(null);

    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    if (error) {
      setMessage('Login gagal: ' + error.message);
    } else {
      setMessage('Login berhasil!');
      setTimeout(() => router.push('/'), 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 text-white rounded-xl mt-12">
      <h2 className="text-2xl mb-4">Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full p-2 mb-3 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full p-2 mb-4 rounded"
      />

      <button
        onClick={login}
        disabled={loading}
        className="w-full bg-green-600 p-2 rounded hover:bg-green-700"
      >
        {loading ? 'Loading...' : 'Login'}
      </button>

      {message && (
        <p className="mt-4 text-sm text-center text-red-400">{message}</p>
      )}

      <p className="text-sm mt-6 text-center">
        Belum punya akun?{' '}
        <a href="/register" className="text-blue-400 hover:underline">
          Daftar sekarang
        </a>
      </p>
    </div>
  );
}

// Admin Panel (upload/hapus video) bisa dicek pakai email tertentu
// Misalnya: admin@fankyxd.xyz bisa tampil tombol upload & delete
// Halaman home bisa include cek role dan akses fitur sesuai email
