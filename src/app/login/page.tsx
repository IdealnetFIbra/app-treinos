"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Mail, Lock, Chrome, Apple, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, login, loginWithGoogle, loginWithApple } = useAuth();
  const { theme } = useTheme();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("🔍 [Login] Verificando autenticação. isAuthenticated:", isAuthenticated);
    if (isAuthenticated) {
      console.log("✅ [Login] Usuário já autenticado. Redirecionando para /comunidade");
      router.push("/comunidade");
    }
  }, [isAuthenticated, router]);

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    console.log("📧 [Login] Iniciando login com e-mail");
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    console.log("📧 [Login] Dados do formulário:", { email, password: "***" });
    
    try {
      await login(email, password);
      console.log("✅ [Login] Login realizado com sucesso");
    } catch (err: any) {
      console.error("❌ [Login] Erro no login:", err);
      
      // Mensagens de erro amigáveis
      if (err.message?.includes("Invalid login credentials")) {
        setError("E-mail ou senha incorretos. Verifique seus dados e tente novamente.");
      } else if (err.message?.includes("Email not confirmed")) {
        setError("Por favor, confirme seu e-mail antes de fazer login. Verifique sua caixa de entrada.");
      } else if (err.message?.includes("User not found")) {
        setError("Usuário não encontrado. Verifique o e-mail ou crie uma conta.");
      } else {
        setError("Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    console.log("🔐 [Login] Botão Google clicado");
    setError("");
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error("❌ [Login] Erro no login com Google:", err);
      setError("Erro ao fazer login com Google. Tente novamente.");
    }
  };

  const handleAppleLogin = async () => {
    console.log("🍎 [Login] Botão Apple clicado");
    setError("");
    try {
      await loginWithApple();
    } catch (err: any) {
      console.error("❌ [Login] Erro no login com Apple:", err);
      setError("Erro ao fazer login com Apple. Tente novamente.");
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${
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

        {/* Card de Login */}
        <div className={`rounded-2xl p-8 shadow-xl ${
          theme === "light" 
            ? "bg-white" 
            : "bg-[#1A1A1A]"
        }`}>
          <h2 className={`text-2xl font-bold mb-2 ${
            theme === "light" ? "text-gray-900" : "text-white"
          }`}>
            Entre na sua conta
          </h2>
          <p className={`mb-6 ${
            theme === "light" ? "text-gray-600" : "text-gray-400"
          }`}>
            Faça login ou crie seu cadastro para usar o app.
          </p>

          {/* Mensagem de Erro */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Botões de Login Social */}
          <div className="space-y-3 mb-6">
            <button 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-3 py-3 rounded-lg font-semibold transition ${
                theme === "light"
                  ? "bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                  : "bg-[#0B0B0B] border-2 border-gray-700 text-white hover:bg-black"
              } disabled:opacity-50 disabled:cursor-not-allowed`}>
              <Chrome className="w-5 h-5" />
              Entrar com Google
            </button>
            <button 
              onClick={handleAppleLogin}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-3 py-3 rounded-lg font-semibold transition ${
                theme === "light"
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-white text-black hover:bg-gray-200"
              } disabled:opacity-50 disabled:cursor-not-allowed`}>
              <Apple className="w-5 h-5" />
              Entrar com Apple
            </button>
          </div>

          {/* Separador */}
          <div className="relative mb-6">
            <div className={`absolute inset-0 flex items-center ${
              theme === "light" ? "text-gray-300" : "text-gray-700"
            }`}>
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-4 ${
                theme === "light" ? "bg-white text-gray-500" : "bg-[#1A1A1A] text-gray-400"
              }`}>
                ou
              </span>
            </div>
          </div>

          {/* Formulário de Login */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
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
                  disabled={isLoading}
                  placeholder="seu@email.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-red-600 transition ${
                    theme === "light"
                      ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      : "bg-[#0B0B0B] border-gray-700 text-white placeholder-gray-500"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
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
                  disabled={isLoading}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-red-600 transition ${
                    theme === "light"
                      ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      : "bg-[#0B0B0B] border-gray-700 text-white placeholder-gray-500"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E50914] text-white py-3 rounded-lg font-semibold hover:bg-[#C4070F] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* Link Esqueci Senha */}
          <div className="text-center mt-4">
            <button 
              className="text-red-600 text-sm font-medium hover:underline"
              disabled={isLoading}
            >
              Esqueci minha senha
            </button>
          </div>

          {/* Link Cadastro */}
          <div className={`text-center mt-6 pt-6 border-t ${
            theme === "light" ? "border-gray-200" : "border-gray-800"
          }`}>
            <p className={theme === "light" ? "text-gray-600" : "text-gray-400"}>
              Ainda não tem conta?{" "}
              <button
                onClick={() => {
                  console.log("🔗 [Login] Redirecionando para /cadastro");
                  router.push("/cadastro");
                }}
                disabled={isLoading}
                className="text-red-600 font-semibold hover:underline disabled:opacity-50"
              >
                Criar cadastro
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
