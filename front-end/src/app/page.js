"use client";

import React, { useState } from 'react';
import Input from '@/components/input';
import Button from '@/components/button';

const Page = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Nom: ${formData.username}\nEmail: ${formData.email}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Inscription</h1>
        <form onSubmit={handleSubmit}>
          <Input
            label="Nom d'utilisateur"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Jean Dupont"
          />
          <Input
            label="Adresse email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="jean@example.com"
          />
          <Button 
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white hover:bg-blue-700"
          >
            S'inscrire 
          </Button>
          <p className="mt-4 text-sm text-center text-gray-600">
            Déjà inscrit ? <a href="/login" className="text-blue-600 hover:underline">Connectez-vous</a>  
          </p>
        </form>
      </div>
    </div>
  );
};

export default Page;
