import breezyLogo from "@/assets/breezy.png";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import { useThemeLang } from '@/context/ThemeLangContext';

export default function Header({ onProfileClick }) {
  const [user, setUser] = useState(null);
  const { themeClasses } = useThemeLang();

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("token");
      if (!token) return;

      let userId;
      try {
        const decoded = jwtDecode(token);
        userId = decoded.userId;
        if (!userId) throw new Error();
      } catch {
        console.error("Token JWT invalide.");
        return;
      }

      try {
        const res = await fetch(`http://localhost:4001/api/users/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Erreur utilisateur");
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Erreur récupération user :", err.message);
      }
    }

    fetchUser();
  }, []);

  return (
    <header className="relative border-b rounded-b-md py-2 px-6 flex items-center w-full h-16">
      <div
        className={`flex flex-col min-h-screen transition-colors duration-300 ${themeClasses}`}
        onClick={onProfileClick}
      >
        {user?.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt="Icône de profil"
            className="h-full w-full object-cover rounded-full"
            width={60}
            height={60}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
            ?
          </div>
        )}
      </div>

      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <Image
          src={breezyLogo}
          alt="Logo Breezy"
          className="h-8 w-auto"
          priority
        />
      </div>

      <div className="h-10 w-10" />
    </header>
  );
}
