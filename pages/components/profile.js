'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleUpload = async () => {
    if (!image || !user) return;
    const fileExt = image.name.split('.').pop();
    const filePath = `avatars/${user.id}.${fileExt}`;

    const { error } = await supabase.storage.from('avatars').upload(filePath, image, {
      cacheControl: '3600',
      upsert: true
    });

    if (!error) {
      const { data: urlData } = await supabase.storage.from('avatars').getPublicUrl(filePath);
      await supabase.from('profiles').update({ avatar_url: urlData.publicUrl }).eq('id', user.id);
      alert('Foto profil berhasil diunggah!');
    } else {
      console.error(error);
      alert('Gagal mengunggah foto profil.');
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-semibold text-center">Profil Saya</h2>
      {preview && <img src={preview} alt="Preview" width={120} className="rounded-full mx-auto" />}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          setImage(file);
          setPreview(URL.createObjectURL(file));
        }}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <button
        onClick={handleUpload}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Upload Foto Profil
      </button>
    </div>
  );
}
