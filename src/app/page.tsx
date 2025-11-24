"use client";

import { Navbar } from "@/components/custom/navbar";
import { HeroBanner } from "@/components/custom/hero-banner";
import { VideoCarousel } from "@/components/custom/video-carousel";
import { useEffect, useState } from "react";
import { getAllVideos } from "@/lib/api/videos";
import { Video } from "@/lib/database.types";

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Filtrar vídeos por categorias
  const continueWatching = videos.filter(v => v.category === "continue_watching").slice(0, 5);
  const recommended = videos.filter(v => v.category === "recommended").slice(0, 5);
  const quickWorkouts = videos.filter(v => v.duration && parseInt(v.duration) <= 10).slice(0, 5);
  const glutesFocus = videos.filter(v => v.title.toLowerCase().includes("glúteo") || v.title.toLowerCase().includes("perna")).slice(0, 5);

  // Fallback: se não houver vídeos em categorias específicas, usar todos os vídeos
  const allVideos = videos.length > 0 ? videos : [];
  const displayContinueWatching = continueWatching.length > 0 ? continueWatching : allVideos.slice(0, 5);
  const displayRecommended = recommended.length > 0 ? recommended : allVideos.slice(5, 10);
  const displayQuickWorkouts = quickWorkouts.length > 0 ? quickWorkouts : allVideos.slice(10, 15);
  const displayGlutesFocus = glutesFocus.length > 0 ? glutesFocus : allVideos.slice(15, 20);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="text-white text-xl">Carregando exercícios...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000]">
      <Navbar />
      <HeroBanner />
      
      <div className="pb-12">
        {displayContinueWatching.length > 0 && (
          <VideoCarousel title="Continuar Assistindo" videos={displayContinueWatching} />
        )}
        {displayRecommended.length > 0 && (
          <VideoCarousel title="Recomendados para Você" videos={displayRecommended} />
        )}
        {displayQuickWorkouts.length > 0 && (
          <VideoCarousel title="Aulas Rápidas (até 10 min)" videos={displayQuickWorkouts} />
        )}
        {displayGlutesFocus.length > 0 && (
          <VideoCarousel title="Foco em Glúteos" videos={displayGlutesFocus} />
        )}
        
        {videos.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            <p>Nenhum exercício disponível no momento.</p>
            <p className="text-sm mt-2">Adicione vídeos no Supabase para começar.</p>
          </div>
        )}
      </div>
    </div>
  );
}
