import breezyLogo from "@/assets/breezy.svg";
import profileIcon from "@/assets/default_user.svg";
import Image from "next/image";

export default function Header({ onProfileClick }) {
  return (
    <header className="relative border-b rounded-b-md py-2 px-6 flex items-center w-full bg-white h-16">
      <div
        className="h-10 w-10 rounded-full border border-gray-300 overflow-hidden z-10 cursor-pointer"
        onClick={onProfileClick}
      >
        <Image
          src={profileIcon}
          alt="Profile Icon"
          className="h-full w-full object-cover rounded-full"
        />
      </div>

      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <Image
          src={breezyLogo}
          alt="Breezy Logo"
          className="h-25 w-auto"
        />
      </div>

      <div className="h-10 w-10" />
    </header>
  );
}

