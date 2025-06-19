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
  const navbarRef = useRef(null);

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

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <div className="block lg:hidden">
        <Header onProfileClick={() => setIsNavbarOpen(!isNavbarOpen)} />
      </div>

      <div className="flex flex-1">
        {isNavbarOpen && (
          <div
            ref={navbarRef}
            className="fixed z-40 inset-y-0 left-0 w-64 bg-white shadow-lg border-r border-gray-200 lg:hidden"
          >
            <Navbar />
          </div>
        )}

        <div className="hidden lg:block">
          <Navbar />
        </div>

        <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
          <Post
            title="Premier post"
            image={User}
            username="Baptiste"
            content="Voici le contenu de mon premier post !"
            like={5}
            comment={2}
            share={1}
          />
          <Post
            title="Deuxième post"
            image={User}
            username="Claire"
            content="Un autre post avec plus de contenu pour tester l'affichage responsive."
            like={10}
            comment={5}
            share={2}
          />
        </main>

        <UserList />
      </div>

      <div className="block lg:hidden">
        <Footer />
      </div>
    </div>
  );
}
