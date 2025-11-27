"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Verificar se há um hash na URL (token de confirmação)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const type = hashParams.get("type");
        const error = hashParams.get("error");
        const errorDescription = hashParams.get("error_description");

        console.log("🔍 [Auth Callback] Parâmetros da URL:", {
          type,
          hasAccessToken: !!accessToken,
          error,
          errorDescription
        });

        // Se houver erro na URL
        if (error) {
          console.error("❌ [Auth Callback] Erro na confirmação:", error, errorDescription);
          setStatus("error");
          
          if (error === "access_denied" && errorDescription?.includes("expired")) {
            setMessage("Link de confirmação expirado. Solicite um novo link de confirmação.");
          } else {
            setMessage(errorDescription || "Erro ao confirmar e-mail. Tente novamente.");
          }
          
          // Redirecionar para login após 5 segundos
          setTimeout(() => {
            router.push("/login");
          }, 5000);
          return;
        }

        // Se for confirmação de email
        if (type === "signup" || type === "email") {
          console.log("✅ [Auth Callback] Confirmação de e-mail detectada");
          
          // Verificar sessão atual
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error("❌ [Auth Callback] Erro ao obter sessão:", sessionError);
            setStatus("error");
            setMessage("Erro ao confirmar e-mail. Tente fazer login.");
            setTimeout(() => router.push("/login"), 3000);
            return;
          }

          if (session) {
            console.log("✅ [Auth Callback] E-mail confirmado com sucesso!");
            setStatus("success");
            setMessage("E-mail confirmado com sucesso! Redirecionando...");
            
            // Redirecionar para comunidade após 2 segundos
            setTimeout(() => {
              router.push("/comunidade");
            }, 2000);
          } else {
            console.log("⚠️ [Auth Callback] E-mail confirmado, mas sem sessão ativa");
            setStatus("success");
            setMessage("E-mail confirmado! Faça login para continuar.");
            
            // Redirecionar para login após 3 segundos
            setTimeout(() => {
              router.push("/login");
            }, 3000);
          }
        } else {
          // Sem tipo específico - redirecionar para login
          console.log("⚠️ [Auth Callback] Sem tipo de confirmação detectado");
          setStatus("error");
          setMessage("Link inválido. Redirecionando para login...");
          setTimeout(() => router.push("/login"), 3000);
        }
      } catch (err) {
        console.error("❌ [Auth Callback] Erro inesperado:", err);
        setStatus("error");
        setMessage("Erro inesperado. Tente fazer login.");
        setTimeout(() => router.push("/login"), 3000);
      }
    };

    handleEmailConfirmation();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
          {/* Logo */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold">
              <span className="text-red-600">FIT</span>
              <span className="text-gray-900">STREAM</span>
            </h1>
          </div>

          {/* Status Icon */}
          <div className="mb-6">
            {status === "loading" && (
              <Loader2 className="w-16 h-16 text-red-600 animate-spin mx-auto" />
            )}
            {status === "success" && (
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
            )}
            {status === "error" && (
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto" />
            )}
          </div>

          {/* Message */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {status === "loading" && "Confirmando e-mail..."}
              {status === "success" && "E-mail confirmado!"}
              {status === "error" && "Erro na confirmação"}
            </h2>
            <p className="text-gray-600">
              {message || "Processando sua confirmação..."}
            </p>
          </div>

          {/* Loading indicator */}
          {status === "loading" && (
            <div className="mt-6">
              <div className="flex justify-center space-x-2">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
