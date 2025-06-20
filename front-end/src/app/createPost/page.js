'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export default function CreatePostPage() {
  const [content, setContent] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loadingUser, setLoadingUser] = useState(true);
  const router = useRouter();

  // Récupération de l'utilisateur connecté (comme ta page de profil)
  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Utilisateur non connecté.");
        setLoadingUser(false);
        return;
      }

      let userId;
      try {
        const decoded = jwtDecode(token);
        userId = decoded.userId;
        if (!userId) throw new Error();
      } catch {
        setError("Token invalide.");
        setLoadingUser(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:4001/api/users/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || 'Erreur lors du chargement de l’utilisateur.');
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingUser(false);
      }
    }

    fetchUser();
  }, []);

  const handlePost = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Utilisateur non connecté.");
      return;
    }

    try {
      const res = await fetch('http://localhost:4002/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.errors?.[0]?.msg || 'Erreur lors de la création du post.');
        return;
      }

      setContent('');
      setError('');
      router.push('/');
    } catch (err) {
      setError('Erreur réseau.');
    }
  };

  if (loadingUser) return <p className="text-center mt-10">Chargement utilisateur...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!user) return <p className="text-center mt-10">Utilisateur introuvable.</p>;

  return (
    <div className="p-4 max-w-xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => router.back()} className="text-blue-500 text-sm">Cancel</button>
        <button
          onClick={handlePost}
          disabled={content.trim().length === 0}
          className={`px-4 py-1 rounded-full text-white font-semibold text-sm transition 
            ${content.trim().length > 0 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-200 cursor-not-allowed'}`}
        >
          Post
        </button>
      </div>

      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value.slice(0, 280));
          setError('');
        }}
        placeholder={`Que veux-tu dire, ${user.username} ?`}
        className="w-full h-40 p-3 text-base border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
}
