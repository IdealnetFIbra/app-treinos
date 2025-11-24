"use client";

import { Play, Info } from "lucide-react";

export function HeroBanner() {
  return (
    <div className="relative h-[80vh] w-full">
      {/* Background Image/Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#121212]/50 to-transparent">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-4 md:px-12 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Treino Funcional Intenso
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-6 line-clamp-3">
          40 minutos de treino funcional completo para queimar calorias e definir o corpo. 
          Sem equipamentos, apenas você e sua determinação.
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-8">
          <span className="text-[#E50914] font-bold">NOVO</span>
          <span>40 min</span>
          <span>Intermediário</span>
          <span>Sem equipamentos</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-md font-semibold hover:bg-gray-200 transition">
            <Play className="w-5 h-5 fill-black" />
            Assistir
          </button>
          <button className="flex items-center gap-2 bg-gray-500/50 text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-500/70 transition">
            <Info className="w-5 h-5" />
            Mais Informações
          </button>
        </div>
      </div>

      {/* Gradient Fade Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#000000] to-transparent" />
    </div>
  );
}
