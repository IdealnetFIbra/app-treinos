"use client";

import { Navbar } from "@/components/custom/navbar";
import { useEffect, useState } from "react";
import { getAllVideos } from "@/lib/api/videos";
import { Video } from "@/lib/database.types";
import { useRouter } from "next/navigation";
import { Play, Clock, TrendingUp, Loader2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TreinosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const router = useRouter();

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

  // Obter níveis e categorias únicos
  const levels = ["all", ...Array.from(new Set(videos.map((v) => v.level).filter(Boolean)))];
  const categories = ["all", ...Array.from(new Set(videos.map((v) => v.category).filter(Boolean)))];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <Navbar />
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
          <p className="text-white/70">Carregando treinos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000]">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative pt-24 pb-12 px-4 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Todos os Treinos
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl">
            Explore nossa biblioteca completa de exercícios e encontre o treino perfeito para você.
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="px-4 md:px-12 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Filter className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">Filtros:</span>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {/* Filtro de Nível */}
            <div className="flex flex-wrap gap-2">
              {levels.map((level) => (
                <Button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  variant={selectedLevel === level ? "default" : "outline"}
                  className={
                    selectedLevel === level
                      ? "bg-white text-black hover:bg-white/90"
                      : "border-white/30 text-white hover:bg-white/10"
                  }
                >
                  {level === "all" ? "Todos os Níveis" : level}
                </Button>
              ))}
            </div>

            {/* Filtro de Categoria */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={
                    selectedCategory === category
                      ? "bg-white text-black hover:bg-white/90"
                      : "border-white/30 text-white hover:bg-white/10"
                  }
                >
                  {category === "all" ? "Todas as Categorias" : category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Vídeos */}
      <div className="px-4 md:px-12 pb-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-white/60 mb-6">
            {filteredVideos.length} {filteredVideos.length === 1 ? "treino encontrado" : "treinos encontrados"}
          </p>
          
          {filteredVideos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/60 text-lg">Nenhum treino encontrado com os filtros selecionados.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => router.push(`/exercicio/${video.id}`)}
                  className="group cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-[#121212] mb-3">
                    <img
                      src={video.thumbnail_url || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=225&fit=crop"}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    
                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                        <Play className="w-7 h-7 text-white fill-white" />
                      </div>
                    </div>

                    {/* Duration Badge */}
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
                        {video.duration} min
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <h3 className="text-white font-semibold text-base mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-sm text-white/60">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {video.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {video.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
