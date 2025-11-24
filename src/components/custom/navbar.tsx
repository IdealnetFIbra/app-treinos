"use client";

import { Search, Bell, User } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setScrolled(window.scrollY > 50);
    });
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#000000]" : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-12 py-4">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <h1 
            onClick={() => router.push("/")}
            className="text-[#E50914] text-2xl md:text-3xl font-bold cursor-pointer hover:opacity-80 transition"
          >
            FIT<span className="text-white">STREAM</span>
          </h1>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <button 
              onClick={() => router.push("/")}
              className="text-white hover:text-gray-300 transition"
            >
              Início
            </button>
            <button 
              onClick={() => router.push("/treinos")}
              className="text-white hover:text-gray-300 transition"
            >
              Treinos
            </button>
            <button className="text-white hover:text-gray-300 transition">Lives</button>
            <button 
              onClick={() => router.push("/programas")}
              className="text-white hover:text-gray-300 transition"
            >
              Programas
            </button>
            <button className="text-white hover:text-gray-300 transition">Comunidade</button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="text-white hover:text-gray-300 transition">
            <Search className="w-5 h-5" />
          </button>
          <button className="text-white hover:text-gray-300 transition">
            <Bell className="w-5 h-5" />
          </button>
          <button className="text-white hover:text-gray-300 transition">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
