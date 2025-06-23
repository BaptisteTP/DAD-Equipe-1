'use client';

import React, { useEffect, useState, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import UserList from '@/components/userList';
import Post from '@/components/post';
import { useThemeLang } from '@/context/ThemeLangContext';
import Link from 'next/link';
import plume from '@/assets/Plume.svg';
import { PlusIcon } from '@heroicons/react/24/solid';

export default function HomePage() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [likedIds, setLikedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navbarRef = useRef(null);
  const { themeClasses } = useThemeLang();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Connecte-toi pour accéder au fil.');

        jwtDecode(token);

        const [feedRes, likedRes] = await Promise.all([
          fetch('http://localhost:4002/api/posts/feed', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('http://localhost:4002/api/posts/liked', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (!feedRes.ok) throw new Error(`Feed erreur ${feedRes.status}`);
        if (!likedRes.ok) throw new Error(`Liked erreur ${likedRes.status}`);

        const feedData = await feedRes.json();
        const likedData = await likedRes.json();

        if (!Array.isArray(feedData)) throw new Error('Feed invalide');
        if (!Array.isArray(likedData)) throw new Error('Likés invalide');

        setPosts(feedData);
        setLikedIds(likedData.map(p => p._id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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

  useEffect(() => {
    function onOutside(e) {
      if (navbarRef.current && !navbarRef.current.contains(e.target)) {
        setIsNavbarOpen(false);
      }
    }
    if (isNavbarOpen) document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [isNavbarOpen]);

  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    function handleTouchStart(e) {
      if (window.innerWidth > 768) return;
      touchStartX = e.changedTouches[0].clientX;
    }

    function handleTouchEnd(e) {
      if (window.innerWidth > 768) return;
      touchEndX = e.changedTouches[0].clientX;

      const distance = touchEndX - touchStartX;
      if (distance > 60) setIsNavbarOpen(true);
      if (distance < -60) setIsNavbarOpen(false);
    }

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div
      className={`flex flex-col min-h-screen transition-colors duration-300 ${themeClasses}`}>
      <div className="block lg:hidden">
        <Header onProfileClick={() => setIsNavbarOpen(o => !o)} />
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <div
          ref={navbarRef}
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-base-100 shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
            isNavbarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Navbar />
        </div>

        <div className="hidden lg:block">
          <Navbar />
        </div>

        <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
          {loading && <p>Chargement des posts…</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && posts.length === 0 && (
            <p>Aucun post à afficher.</p>
          )}
          {!loading && !error &&
            posts.map(post => (
              <Post
                authorId={post.authorId}
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

      <div className="block lg:hidden">
        <Footer />
      </div>

      {/* 🔵 Bouton flottant rond */}
      <Link
        href="/createPost"
        className="fixed bottom-6 right-6 z-50 rounded-full bg-blue-600 text-white p-4 shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Créer un post"
      >
        <img
          className="h-6 w-6 invert"
          src={plume.src}
          alt="Créer un post"
        />
      </Link>
    </div>
  );
}
