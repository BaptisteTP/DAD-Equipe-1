import logo from '../assets/breezy.png';

export default function Header() {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="h-8 w-8" />
          <span className="text-sm">© 2023 Mon Application</span>
        </div>
        <nav className="space-x-4">
          <a href="/about" className="text-sm hover:underline">À propos</a>
          <a href="/contact" className="text-sm hover:underline">Contact</a>
        </nav>
      </div>
    </footer>
  );
}