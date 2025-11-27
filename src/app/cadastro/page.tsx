"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { User, Mail, Phone, MapPin, Lock } from "lucide-react";

export default function CadastroPage() {
  const router = useRouter();
  const { isAuthenticated, signup } = useAuth();
  const { theme } = useTheme();
  const [phone, setPhone] = useState("");

  useEffect(() => {
    console.log("🔍 [Cadastro] Verificando autenticação. isAuthenticated:", isAuthenticated);
    if (isAuthenticated) {
      console.log("✅ [Cadastro] Usuário já autenticado. Redirecionando para /comunidade");
      router.push("/comunidade");
    }
  }, [isAuthenticated, router]);

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
    console.log("📱 [Cadastro] Telefone formatado:", formatted);
    setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("📝 [Cadastro] Iniciando cadastro");
    const formData = new FormData(e.currentTarget);
    
    const signupData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      password: formData.get("password") as string,
      unit: formData.get("unit") as string,
    };

    console.log("📝 [Cadastro] Dados do formulário:", {
      ...signupData,
      password: "***"
    });

    await signup(signupData);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${
      theme === "light" 
        ? "bg-gray-50" 
        : "bg-[#0B0B0B]"
    }`}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-red-600">FIT</span>
            <span className={theme === "light" ? "text-gray-900" : "text-white"}>STREAM</span>
          </h1>
        </div>

        {/* Card de Cadastro */}
        <div className={`rounded-2xl p-8 shadow-xl ${
          theme === "light" 
            ? "bg-white" 
            : "bg-[#1A1A1A]"
        }`}>
          <h2 className={`text-2xl font-bold mb-2 ${
            theme === "light" ? "text-gray-900" : "text-white"
          }`}>
            Criar conta
          </h2>
          <p className={`mb-6 ${
            theme === "light" ? "text-gray-600" : "text-gray-400"
          }`}>
            Preencha os dados para começar a usar o app.
          </p>

          {/* Formulário de Cadastro */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  name="name"
                  required
                  placeholder="Seu nome completo"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-red-600 transition ${
                    theme === "light"
                      ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      : "bg-[#0B0B0B] border-gray-700 text-white placeholder-gray-500"
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
                  name="email"
                  required
                  placeholder="seu@email.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-red-600 transition ${
                    theme === "light"
                      ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      : "bg-[#0B0B0B] border-gray-700 text-white placeholder-gray-500"
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
                  name="phone"
                  required
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="(99) 99999-9999"
                  maxLength={15}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-red-600 transition ${
                    theme === "light"
                      ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      : "bg-[#0B0B0B] border-gray-700 text-white placeholder-gray-500"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === "light" ? "text-gray-700" : "text-gray-300"
              }`}>
                Senha
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  theme === "light" ? "text-gray-400" : "text-gray-500"
                }`} />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  minLength={6}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-red-600 transition ${
                    theme === "light"
                      ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      : "bg-[#0B0B0B] border-gray-700 text-white placeholder-gray-500"
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
                  name="unit"
                  required
                  onChange={(e) => console.log("🏢 [Cadastro] Unidade selecionada:", e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-red-600 transition appearance-none ${
                    theme === "light"
                      ? "bg-white border-gray-300 text-gray-900"
                      : "bg-[#0B0B0B] border-gray-700 text-white"
                  }`}
                >
                  <option value="">Selecione sua unidade</option>
                  <option value="Simplifit — Zona Norte">Simplifit — Zona Norte</option>
                  <option value="Simplifit — Dirceu">Simplifit — Dirceu</option>
                  <option value="Simplifit — Kennedy 24h">Simplifit — Kennedy 24h</option>
                  <option value="Simplifit — Zona Sul (Barão de Castelo Branco)">Simplifit — Zona Sul (Barão de Castelo Branco)</option>
                  <option value="Simplifit — Timon">Simplifit — Timon</option>
                  <option value="Não sou aluno da Simplifit">Não sou aluno da Simplifit</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#E50914] text-white py-3 rounded-lg font-semibold hover:bg-[#C4070F] transition mt-6"
            >
              Criar conta
            </button>
          </form>

          {/* Link Login */}
          <div className={`text-center mt-6 pt-6 border-t ${
            theme === "light" ? "border-gray-200" : "border-gray-800"
          }`}>
            <p className={theme === "light" ? "text-gray-600" : "text-gray-400"}>
              Já tem uma conta?{" "}
              <button
                onClick={() => {
                  console.log("🔗 [Cadastro] Redirecionando para /login");
                  router.push("/login");
                }}
                className="text-red-600 font-semibold hover:underline"
              >
                Fazer login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
