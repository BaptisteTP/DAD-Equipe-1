'use client';

import React from 'react';
import User from '@/assets/default_user.svg';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Post from '@/components/post';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        <Post
          title="Premier post"
          image= {User}
          username="Baptiste"
          content="Voici le contenu de mon premier post !"
          like={5}
          comment={2}
          share={1}
        />
        <Post
          title="Deuxième post"
          image= {User}
          username="Claire"
          content="Un autre post avec plus de contenu pour tester l'affichage responsive."
          like={10}
          comment={5}
          share={2}
        />
        {/* Tu peux ajouter d'autres <Post /> ici */}
      </main>
      
      <Footer />
    </div>
  );
}
