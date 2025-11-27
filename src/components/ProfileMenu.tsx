"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserCircle2, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      {/* Ícone de Perfil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-800 transition"
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="Perfil"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <UserCircle2 className="w-8 h-8 text-gray-400" />
        )}
      </button>

      {/* Menu Dropdown */}
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-64 rounded-xl shadow-2xl overflow-hidden z-50 ${
          theme === "light" 
            ? "bg-white border border-gray-200" 
            : "bg-[#1A1A1A] border border-gray-800"
        }`}>
          {/* Alternar Tema */}
          <div className={`px-4 py-3 border-b ${
            theme === "light" ? "border-gray-200" : "border-gray-800"
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${
                theme === "light" ? "text-gray-700" : "text-gray-300"
              }`}>
                Tema
              </span>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  theme === "light" ? "bg-gray-300" : "bg-[#E50914]"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    theme === "light" ? "translate-x-1" : "translate-x-6"
                  }`}
                />
                {theme === "light" ? (
                  <Sun className="absolute left-1 w-3 h-3 text-gray-600" />
                ) : (
                  <Moon className="absolute right-1 w-3 h-3 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Meu Perfil */}
          <button
            onClick={() => {
              router.push("/perfil");
              setIsOpen(false);
            }}
            className={`w-full px-4 py-3 text-left text-sm font-medium transition ${
              theme === "light"
                ? "text-gray-700 hover:bg-gray-50"
                : "text-gray-300 hover:bg-[#0B0B0B]"
            }`}
          >
            Meu Perfil
          </button>
        </div>
      )}
    </div>
  );
}
