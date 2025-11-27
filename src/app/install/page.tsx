"use client";

import { useState, useEffect } from "react";
import { Download, Smartphone, Apple, Chrome } from "lucide-react";

export default function InstallPage() {
  const [deviceType, setDeviceType] = useState<"android" | "ios" | "desktop">("desktop");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Detectar tipo de dispositivo
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    if (isIOS) {
      setDeviceType("ios");
    } else if (isAndroid) {
      setDeviceType("android");
    } else {
      setDeviceType("desktop");
    }

    // Capturar evento de instalação PWA
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      console.log("PWA instalado com sucesso");
    }
    
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const handleDownloadAPK = () => {
    // Link para download do APK (você precisará hospedar o APK)
    window.location.href = "/fitstream.apk";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center shadow-lg">
            <svg
              className="w-16 h-16 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            FITSTREAM
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sua Comunidade Fitness
          </p>
        </div>

        {/* Instruções baseadas no dispositivo */}
        <div className="space-y-6">
          {deviceType === "android" && (
            <>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 border-2 border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-3 mb-4">
                  <Smartphone className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Android Detectado
                  </h2>
                </div>
                
                {isInstallable ? (
                  <>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Instale o FITSTREAM diretamente no seu dispositivo!
                    </p>
                    <button
                      onClick={handleInstallPWA}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-4 rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Instalar Agora (PWA)
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Baixe o aplicativo APK ou adicione à tela inicial:
                    </p>
                    <button
                      onClick={handleDownloadAPK}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-4 rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg flex items-center justify-center gap-2 mb-3"
                    >
                      <Download className="w-5 h-5" />
                      Baixar APK
                    </button>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p className="font-medium mb-2">Ou adicione à tela inicial:</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Toque no menu do navegador (⋮)</li>
                        <li>Selecione "Adicionar à tela inicial"</li>
                        <li>Confirme a instalação</li>
                      </ol>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {deviceType === "ios" && (
            <>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-4">
                  <Apple className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    iPhone/iPad Detectado
                  </h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Instale o FITSTREAM na sua tela inicial:
                </p>
                <div className="bg-white dark:bg-gray-700 rounded-xl p-4 space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-blue-600 dark:text-blue-400">
                      1
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 pt-1">
                      Toque no botão de <strong>Compartilhar</strong> (
                      <svg className="inline w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z"/>
                      </svg>
                      ) na barra inferior do Safari
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-blue-600 dark:text-blue-400">
                      2
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 pt-1">
                      Role para baixo e toque em <strong>"Adicionar à Tela de Início"</strong>
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-blue-600 dark:text-blue-400">
                      3
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 pt-1">
                      Toque em <strong>"Adicionar"</strong> no canto superior direito
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                    ⚠️ <strong>Importante:</strong> Use o Safari para instalar. Outros navegadores não suportam instalação PWA no iOS.
                  </p>
                </div>
              </div>
            </>
          )}

          {deviceType === "desktop" && (
            <>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-3 mb-4">
                  <Chrome className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Desktop Detectado
                  </h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Instale o FITSTREAM no seu computador:
                </p>
                <div className="bg-white dark:bg-gray-700 rounded-xl p-4 space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-purple-600 dark:text-purple-400">
                      1
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 pt-1">
                      Clique no ícone de <strong>instalação</strong> na barra de endereço (Chrome/Edge)
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-purple-600 dark:text-purple-400">
                      2
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 pt-1">
                      Ou acesse o menu (⋮) e selecione <strong>"Instalar FITSTREAM"</strong>
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Link direto para o app */}
          <div className="text-center pt-4">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors"
            >
              Ou acesse o app diretamente
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            FITSTREAM - Sua Comunidade Fitness
          </p>
        </div>
      </div>
    </div>
  );
}
