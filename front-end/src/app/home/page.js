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

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Connecte-toi pour accéder au fil.');

        // valide grossièrement le token
        jwtDecode(token);

        // on récupère feed et liked en parallèle
        const [feedRes, likedRes] = await Promise.all([
          fetch('http://localhost:4002/api/posts/feed', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('http://localhost:4002/api/posts/liked', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (!feedRes.ok)  throw new Error(`Feed erreur ${feedRes.status}`);
        if (!likedRes.ok) throw new Error(`Liked erreur ${likedRes.status}`);

        const feedData  = await feedRes.json();
        const likedData = await likedRes.json();

        if (!Array.isArray(feedData))  throw new Error('Feed invalide');
        if (!Array.isArray(likedData)) throw new Error('Likés invalide');

        setPosts(feedData);
        // on extrait les IDs des posts likés
        setLikedIds(likedData.map(p => p._id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // toggle like/unlike
  const handleToggleLike = async postId => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Non connecté.');

      const isLiked = likedIds.includes(postId);
      const res = await fetch(
          `http://localhost:4002/api/posts/${postId}/like`,
          {
            method: isLiked ? 'DELETE' : 'POST',
            headers: { Authorization: `Bearer ${token}` },
          }
      );
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || 'Erreur like.');

      setLikedIds(ids =>
          isLiked
              ? ids.filter(id => id !== postId)
              : [...ids, postId]
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

  // fermer navbar mobile quand on clique en dehors
  useEffect(() => {
    function onOutside(e) {
      if (navbarRef.current && !navbarRef.current.contains(e.target)) {
        setIsNavbarOpen(false);
      }
    }
    if (isNavbarOpen) document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [isNavbarOpen]);

  return (
      <div className="flex flex-col min-h-screen bg-white text-gray-900">
        <div className="block lg:hidden">
          <Header onProfileClick={() => setIsNavbarOpen(o => !o)} />
        </div>
        <div className="flex flex-1">
          {isNavbarOpen && (
              <div
                  ref={navbarRef}
                  className="fixed inset-y-0 left-0 z-40 w-64 bg-base-100 shadow-lg lg:hidden"
              >
                <Navbar />
              </div>
          )}
          <div className="hidden lg:block"><Navbar /></div>

          <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
            {loading && <p>Chargement des posts…</p>}
            {error   && <p className="text-red-500">{error}</p>}
            {!loading && !error && posts.length === 0 && (
                <p>Aucun post à afficher.</p>
            )}
            {!loading && !error && posts.map(post => (
                <Post
                    key={post._id}
                    image={post.authorAvatarUrl}
                    username={post.authorUsername}
                    content={post.content}
                    like={post.likesCount}
                    comment={post.commentsCount ?? 0}
                    share={0}
                    liked={likedIds.includes(post._id)}           // cœur rouge si dans likedIds
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
