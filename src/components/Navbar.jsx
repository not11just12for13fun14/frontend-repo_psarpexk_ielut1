import { Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-30 bg-black/60 backdrop-blur border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-500 to-cyan-400" />
          <span className="text-white font-semibold">BlueBank</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-blue-200">
          <a href="#catalog" className="hover:text-white transition">Catalog</a>
          <a href="#cabinet" className="hover:text-white transition">Cabinets</a>
          <a href="#about" className="hover:text-white transition">About</a>
        </nav>
        <button className="md:hidden text-blue-200" aria-label="Menu">
          <Menu />
        </button>
      </div>
    </header>
  );
}
