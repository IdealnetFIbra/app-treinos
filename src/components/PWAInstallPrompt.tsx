"use client";

import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Verificar se já está instalado
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone) return;

    // Verificar se já foi dispensado
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) return;

    // Capturar evento de instalação
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("PWA instalado");
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa-install-dismissed", "true");
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-in slide-in-from-bottom-5">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl shadow-2xl p-4">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Download className="w-6 h-6" />
          </div>
          <div className="flex-1 pr-6">
            <h3 className="font-bold text-lg mb-1">Instalar FITSTREAM</h3>
            <p className="text-sm text-white/90 mb-3">
              Acesse mais rápido instalando o app na sua tela inicial
            </p>
            <button
              onClick={handleInstall}
              className="w-full bg-white text-emerald-600 font-semibold py-2 px-4 rounded-lg hover:bg-white/90 transition-colors"
            >
              Instalar Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
