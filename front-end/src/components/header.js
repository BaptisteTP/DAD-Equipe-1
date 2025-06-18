import breezyLogo from "@/assets/breezy.svg";
import profileIcon from "@/assets/default_user.svg";
import Image from "next/image";

export default function Header() {
  return (
    <header className="relative border-b rounded-b-md py-2 px-6 flex items-center w-full bg-white h-16">
      {/* Icône profil à gauche */}
      <div className="h-10 w-10 rounded-full border border-gray-300 overflow-hidden z-10">
        <Image
          src={profileIcon}
          alt="Profile Icon"
          className="h-full w-full object-cover rounded-full"
        />
      </div>

      {/* Logo centré avec position absolue */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <Image
          src={breezyLogo}
          alt="Breezy Logo"
          className="h-25 w-auto" // ← plus grand
        />
      </div>
      <div className="h-10 w-10" />
    </header>
  );
}
