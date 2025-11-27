"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ArrowLeft, User, Mail, Phone, MapPin, Camera, Lock, X } from "lucide-react";

export default function PerfilPage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const { theme } = useTheme();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [phone, setPhone] = useState(user?.phone || "");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [unit, setUnit] = useState(user?.unit || "");

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers
        .replace(/^(\d{2})(\d)/g, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }
    return phone;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  const handleSave = () => {
    updateUser({
      name,
      email,
      phone,
      unit,
    });
    router.push("/comunidade");
  };

  const handlePasswordChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Lógica de alteração de senha
    setShowPasswordModal(false);
  };

  return (
    <div className={`min-h-screen pb-20 ${
      theme === "light" 
        ? "bg-gray-50" 
        : "bg-[#0B0B0B]"
    }`}>
      {/* Header Fixo */}
      <header className={`fixed top-0 left-0 right-0 z-50 shadow-lg ${
        theme === "light" ? "bg-white" : "bg-black"
      }`}>
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => router.push("/comunidade")}
            className={`p-2 rounded-lg transition ${
              theme === "light"
                ? "hover:bg-gray-100"
                : "hover:bg-gray-800"
            }`}
          >
            <ArrowLeft className={`w-6 h-6 ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`} />
          </button>
          <h1 className={`text-xl font-bold ${
            theme === "light" ? "text-gray-900" : "text-white"
          }`}>
            Meu perfil
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Espaçamento para header fixo */}
      <div className="h-16"></div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Foto de Perfil */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"}
              alt="Foto de perfil"
              className="w-32 h-32 rounded-full object-cover"
            />
            <button className="absolute bottom-0 right-0 bg-[#E50914] text-white p-3 rounded-full hover:bg-[#C4070F] transition shadow-lg">
              <Camera className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Formulário */}
        <div className={`rounded-2xl p-6 shadow-lg space-y-4 ${
          theme === "light" 
            ? "bg-white" 
            : "bg-[#1A1A1A]"
        }`}>
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === "light" ? "text-gray-700" : "text-gray-300"
            }`}>
              Nome completo
            </label>
            <div className="relative">
              <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                theme === "light" ? "text-gray-400" : "text-gray-500"
              }`} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-red-600 transition ${
                  theme === "light"
                    ? "bg-white border-gray-300 text-gray-900"
                    : "bg-[#0B0B0B] border-gray-700 text-white"
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === "light" ? "text-gray-700" : "text-gray-300"
            }`}>
              E-mail
            </label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                theme === "light" ? "text-gray-400" : "text-gray-500"
              }`} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-red-600 transition ${
                  theme === "light"
                    ? "bg-white border-gray-300 text-gray-900"
                    : "bg-[#0B0B0B] border-gray-700 text-white"
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === "light" ? "text-gray-700" : "text-gray-300"
            }`}>
              Celular
            </label>
            <div className="relative">
              <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                theme === "light" ? "text-gray-400" : "text-gray-500"
              }`} />
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={15}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-red-600 transition ${
                  theme === "light"
                    ? "bg-white border-gray-300 text-gray-900"
                    : "bg-[#0B0B0B] border-gray-700 text-white"
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === "light" ? "text-gray-700" : "text-gray-300"
            }`}>
              Unidade Simplifit
            </label>
            <div className="relative">
              <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                theme === "light" ? "text-gray-400" : "text-gray-500"
              }`} />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-red-600 transition appearance-none ${
                  theme === "light"
                    ? "bg-white border-gray-300 text-gray-900"
                    : "bg-[#0B0B0B] border-gray-700 text-white"
                }`}
              >
                <option value="Simplifit — Zona Norte">Simplifit — Zona Norte</option>
                <option value="Simplifit — Dirceu">Simplifit — Dirceu</option>
                <option value="Simplifit — Kennedy 24h">Simplifit — Kennedy 24h</option>
                <option value="Simplifit — Zona Sul (Barão de Castelo Branco)">Simplifit — Zona Sul (Barão de Castelo Branco)</option>
                <option value="Simplifit — Timon">Simplifit — Timon</option>
                <option value="Não sou aluno da Simplifit">Não sou aluno da Simplifit</option>
              </select>
            </div>
          </div>

          {/* Botão Alterar Senha */}
          <button
            onClick={() => setShowPasswordModal(true)}
            className={`w-full py-3 rounded-lg border-2 font-semibold transition ${
              theme === "light"
                ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                : "border-gray-700 text-white hover:bg-[#0B0B0B]"
            }`}
          >
            Alterar senha
          </button>

          {/* Botão Salvar */}
          <button
            onClick={handleSave}
            className="w-full bg-[#E50914] text-white py-3 rounded-lg font-semibold hover:bg-[#C4070F] transition"
          >
            Salvar alterações
          </button>
        </div>
      </div>

      {/* Modal de Alteração de Senha */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className={`w-full max-w-md rounded-2xl p-6 ${
            theme === "light" ? "bg-white" : "bg-[#1A1A1A]"
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}>
                Alterar senha
              </h2>
              <button
                onClick={() => setShowPasswordModal(false)}
                className={`p-2 rounded-lg transition ${
                  theme === "light"
                    ? "hover:bg-gray-100"
                    : "hover:bg-gray-800"
                }`}
              >
                <X className={`w-5 h-5 ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`} />
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                }`}>
                  Senha atual
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    theme === "light" ? "text-gray-400" : "text-gray-500"
                  }`} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-red-600 transition ${
                      theme === "light"
                        ? "bg-white border-gray-300 text-gray-900"
                        : "bg-[#0B0B0B] border-gray-700 text-white"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                }`}>
                  Nova senha
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    theme === "light" ? "text-gray-400" : "text-gray-500"
                  }`} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    minLength={6}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-red-600 transition ${
                      theme === "light"
                        ? "bg-white border-gray-300 text-gray-900"
                        : "bg-[#0B0B0B] border-gray-700 text-white"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                }`}>
                  Confirmar nova senha
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    theme === "light" ? "text-gray-400" : "text-gray-500"
                  }`} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    minLength={6}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-red-600 transition ${
                      theme === "light"
                        ? "bg-white border-gray-300 text-gray-900"
                        : "bg-[#0B0B0B] border-gray-700 text-white"
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#E50914] text-white py-3 rounded-lg font-semibold hover:bg-[#C4070F] transition"
              >
                Salvar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
