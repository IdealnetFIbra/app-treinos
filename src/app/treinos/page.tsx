"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Clock, TrendingUp, Users, Target, Dumbbell, ArrowLeft } from "lucide-react";
import { getAllVideos } from "@/lib/api/videos";
import { Video } from "@/lib/database.types";
import { useTheme } from "@/contexts/ThemeContext";
import ProfileMenu from "@/components/ProfileMenu";

export default function TreinosPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    async function loadVideos() {
      try {
        const data = await getAllVideos();
        setVideos(data);
      } catch (error) {
        console.error("Erro ao carregar vídeos:", error);
      } finally {
        setLoading(false);
      }
    }

    loadVideos();
  }, []);

  // Filtrar vídeos
  const filteredVideos = videos.filter((video) => {
    const levelMatch = selectedLevel === "all" || video.level === selectedLevel;
    const categoryMatch = selectedCategory === "all" || video.category === selectedCategory;
    return levelMatch && categoryMatch;
  });

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center pb-20 ${
        theme === "light" ? "bg-gray-50" : "bg-[#0B0B0B]"
      }`}>
        <div className={`text-xl ${
          theme === "light" ? "text-gray-900" : "text-white"
        }`}>
          Carregando treinos...
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-20 ${
      theme === "light" ? "bg-gray-50" : "bg-[#0B0B0B]"
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
          <button
            onClick={() => router.push("/comunidade")}
            className="text-2xl font-bold hover:opacity-80 transition-opacity"
          >
            <span className="text-red-600">FIT</span>
            <span className={theme === "light" ? "text-gray-900" : "text-white"}>STREAM</span>
          </button>
          <ProfileMenu />
        </div>
      </header>

      {/* Espaçamento para header fixo */}
      <div className="h-16"></div>

      {/* Hero Section */}
      <div className="relative pt-4 pb-4 px-4 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${
            theme === "light" ? "text-gray-900" : "text-white"
          }`}>
            Biblioteca de Treinos
          </h1>
          <p className={`text-sm md:text-base max-w-2xl ${
            theme === "light" ? "text-gray-600" : "text-gray-400"
          }`}>
            Explore nossa coleção completa de treinos para todos os níveis e objetivos.
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="px-4 md:px-12 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-4">
            {/* Filtro de Nível */}
            <div>
              <label className={`text-sm mb-2 block ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}>
                Nível
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className={`rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 ${
                  theme === "light"
                    ? "bg-white border-2 border-gray-300 text-gray-900"
                    : "bg-white/10 text-white"
                }`}
              >
                <option value="all">Todos os níveis</option>
                <option value="Iniciante">Iniciante</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
              </select>
            </div>

            {/* Filtro de Categoria */}
            <div>
              <label className={`text-sm mb-2 block ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}>
                Categoria
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 ${
                  theme === "light"
                    ? "bg-white border-2 border-gray-300 text-gray-900"
                    : "bg-white/10 text-white"
                }`}
              >
                <option value="all">Todas as categorias</option>
                <option value="Cardio">Cardio</option>
                <option value="Força">Força</option>
                <option value="Flexibilidade">Flexibilidade</option>
                <option value="HIIT">HIIT</option>
                <option value="Yoga">Yoga</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Treinos */}
      <div className="px-4 md:px-12 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className={`group rounded-lg overflow-hidden transition-all duration-300 cursor-pointer ${
                  theme === "light"
                    ? "bg-white hover:shadow-xl"
                    : "bg-white/5 hover:bg-white/10"
                }`}
                onClick={() => router.push(`/exercicio/${video.id}`)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video">
                  <img
                    src={video.thumbnail_url || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop"}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                  </div>

                  {/* Duração */}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration} min
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-4">
                  <h3 className={`font-bold mb-2 line-clamp-2 ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  }`}>
                    {video.title}
                  </h3>
                  
                  <div className={`flex items-center gap-3 text-sm mb-3 ${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                  }`}>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {video.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {video.level}
                    </span>
                  </div>

                  {video.category && (
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      theme === "light"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-white/10 text-white/80"
                    }`}>
                      {video.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredVideos.length === 0 && (
            <div className={`text-center py-12 ${
              theme === "light" ? "text-gray-600" : "text-gray-400"
            }`}>
              <p className="text-lg">Nenhum treino encontrado com os filtros selecionados.</p>
            </div>
          )}
        </div>
      </div>

      {/* BARRA DE NAVEGAÇÃO INFERIOR */}
      <nav className={`fixed bottom-0 left-0 right-0 border-t z-50 ${
        theme === "light" 
          ? "bg-white border-gray-200" 
          : "bg-black border-gray-800"
      }`}>
        <div className="flex items-center justify-around py-3">
          <button
            onClick={() => router.push("/comunidade")}
            className="flex flex-col items-center gap-1"
          >
            <Users className={`w-6 h-6 ${
              theme === "light" ? "text-gray-500" : "text-gray-500"
            }`} />
            <span className={`text-xs ${
              theme === "light" ? "text-gray-500" : "text-gray-500"
            }`}>
              Comunidade
            </span>
          </button>
          <button
            onClick={() => router.push("/programas")}
            className="flex flex-col items-center gap-1"
          >
            <Target className={`w-6 h-6 ${
              theme === "light" ? "text-gray-500" : "text-gray-500"
            }`} />
            <span className={`text-xs ${
              theme === "light" ? "text-gray-500" : "text-gray-500"
            }`}>
              Programas
            </span>
          </button>
          <button
            onClick={() => router.push("/treinos")}
            className="flex flex-col items-center gap-1"
          >
            <Dumbbell className={`w-6 h-6 ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`} />
            <span className={`text-xs font-semibold ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}>
              Treinos
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}
