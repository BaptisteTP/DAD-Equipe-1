'use client';

import React, { useEffect, useState, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import UserList from '@/components/userList';
import Post from '@/components/post';

export default function HomePage() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [likedIds, setLikedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navbarRef = useRef(null);

  // 1) Récupérer le feed
  useEffect(() => {
    async function fetchFeed() {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Vous devez être connecté pour voir le fil.');

        // Vérifier le token
        jwtDecode(token);

        const res = await fetch('http://localhost:4002/api/posts/feed', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(`Erreur serveur (${res.status})`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('Données serveur invalides.');
        setPosts(data);
        // IDs pré-likés
        setLikedIds(data.filter(p => p.isLiked).map(p => p._id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFeed();
  }, []);

  // 2) Toggle like/unlike
  const handleToggleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Non connecté.');
      const isLiked = likedIds.includes(postId);

      const res = await fetch(`http://localhost:4002/api/posts/${postId}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || 'Erreur like.');

      // Met à jour l’état
      setLikedIds(ids =>
          isLiked ? ids.filter(id => id !== postId) : [...ids, postId]
      );
      setPosts(ps =>
          ps.map(p =>
              p._id === postId
                  ? { ...p, likesCount: p.likesCount + (isLiked ? -1 : 1) }
                  : p
          )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // 3) Fermer menu mobile
  useEffect(() => {
    function onClickOutside(e) {
      if (navbarRef.current && !navbarRef.current.contains(e.target)) {
        setIsNavbarOpen(false);
      }
    }
    if (isNavbarOpen) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [isNavbarOpen]);

  return (
      <div className="flex flex-col min-h-screen bg-white text-gray-900">
        <div className="block lg:hidden">
          <Header onProfileClick={() => setIsNavbarOpen(o => !o)} />
        </div>
        <div className="flex flex-1">
          {isNavbarOpen && (
              <div ref={navbarRef}
                   className="fixed inset-y-0 left-0 z-40 w-64 bg-base-100 shadow-lg lg:hidden">
                <Navbar />
              </div>
          )}
          <div className="hidden lg:block"><Navbar /></div>

          <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
            {loading && <p>Chargement des posts…</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && posts.length === 0 && <p>Aucun post.</p>}
            {!loading && !error && posts.map(post => (
                <Post
                    key={post._id}
                    image={post.authorAvatarUrl}
                    username={post.authorUsername}
                    content={post.content}
                    like={post.likesCount}
                    comment={post.commentsCount ?? 0}
                    share={0}
                    liked={likedIds.includes(post._id)}
                    onToggleLike={() => handleToggleLike(post._id)}
                />
            ))}
          </main>

          <UserList />
        </div>
        <div className="block lg:hidden"><Footer /></div>
      </div>
  );
}
