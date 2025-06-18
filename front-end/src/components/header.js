import breezyLogo from "@/assets/breezy.svg";
import profileIcon from "@/assets/default_user.svg";
import Image from "next/image";

export default function Header() {
  return (
    <header className="border border-blue-500 rounded-md py-2 px-4 flex justify-between items-center w-full bg-white">
      <Image src={profileIcon} alt="Profile Icon" className="h-8 w-8 rounded-full" />

      <div className="flex flex-col items-center">
        <Image src={breezyLogo} alt="Breezy Logo" className="h-25" />
      </div>
      <div className="flex items-center space-x-4">
      </div>

    </header>
  );
}
