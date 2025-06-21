'use client';

import React, { useRef, useState, useEffect } from 'react';
import User from '@/assets/default_user.svg';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Post from '@/components/post';
import Navbar from '@/components/navbar';
import UserList from '@/components/userList';

export default function App() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const navbarRef = useRef(null);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event) {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsNavbarOpen(false);
      }
    }

    if (isNavbarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNavbarOpen]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const token = localStorage.getItem('token'); 

        if (!token) {
          throw new Error('Token manquant. Veuillez vous connecter.');
        }

        const res = await fetch('http://localhost:4002/api/posts/feed', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Erreur HTTP ${res.status}`);
        }

        const data = await res.json();

        const postsArray = Array.isArray(data) ? data : data.posts;

        if (!Array.isArray(postsArray)) {
          throw new Error("Les données reçues ne sont pas un tableau.");
        }

        setPosts(postsArray);
      } catch (err) {
        console.error('Erreur lors de la récupération des posts:', err);
        setError(err.message);
      }
    }

    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <div className="block lg:hidden">
        <Header onProfileClick={() => setIsNavbarOpen(!isNavbarOpen)} />
      </div>

      <div className="flex flex-1">
        {isNavbarOpen && (
          <div
            ref={navbarRef}
            className="fixed z-40 inset-y-0 left-0 w-64 bg-base-100 shadow-lg border-r border-gray-200 lg:hidden"
          >
            <Navbar />
          </div>
        )}

        <div className="hidden lg:block">
          <Navbar />
        </div>

        <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : posts.length === 0 ? (
            <p>Chargement des posts...</p>
          ) : (
            posts.map((post) => (
              <Post
                key={post._id}
                image={post.authorAvatarUrl}
                username={post.authorUsername}
                content={post.content}
                like={post.like}
                comment={post.comment}
                share={post.share}
              />
            ))
          )}
        </main>

        <UserList />
      </div>

      <div className="block lg:hidden">
        <Footer />
      </div>
    </div>
  );
}
