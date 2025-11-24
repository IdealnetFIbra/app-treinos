"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/custom/navbar";
import { Play, Clock, TrendingUp, Heart, Share2, ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getVideoById, incrementVideoViews } from "@/lib/api/videos";
import { Video } from "@/lib/database.types";

export default function ExerciseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const exerciseId = params.id as string;
  
  const [exercise, setExercise] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadExercise() {
      try {
        setLoading(true);
        const data = await getVideoById(exerciseId);
        
        if (data) {
          setExercise(data);
          // Incrementar visualizações
          await incrementVideoViews(exerciseId);
        } else {
          setError("Exercício não encontrado");
        }
      } catch (err) {
        console.error("Erro ao carregar exercício:", err);
        setError("Erro ao carregar exercício");
      } finally {
        setLoading(false);
      }
    }

    if (exerciseId) {
      loadExercise();
    }
  }, [exerciseId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <Navbar />
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
          <p className="text-white/70">Carregando exercício...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !exercise) {
    return (
      <div className="min-h-screen bg-[#000000]">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
          <p className="text-white text-xl">{error || "Exercício não encontrado"}</p>
          <Button onClick={() => router.back()} className="bg-white text-black hover:bg-white/90">
            <ChevronLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000]">
      <Navbar />
      
      {/* Hero Section com Thumbnail */}
      <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh]">
        <img
          src={exercise.thumbnail_url}
          alt={exercise.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/60 to-transparent" />
        
        {/* Botão Voltar */}
        <button
          onClick={() => router.back()}
          className="absolute top-24 left-4 md:left-8 z-10 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="text-sm font-medium">Voltar</span>
        </button>

        {/* Informações sobre o vídeo */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {exercise.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6 text-white/90">
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {exercise.duration}
              </span>
              <span className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                {exercise.level}
              </span>
              <span className="text-sm">{exercise.views?.toLocaleString() || 0} visualizações</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button className="bg-white text-black hover:bg-white/90 font-semibold px-8 py-6 text-lg">
                <Play className="w-5 h-5 mr-2" />
                Assistir Agora
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-6 py-6">
                <Heart className="w-5 h-5 mr-2" />
                Favoritar
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-6 py-6">
                <Share2 className="w-5 h-5 mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Descrição */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Sobre este treino</h2>
              <p className="text-white/70 leading-relaxed">{exercise.description}</p>
            </section>

            {/* Exercícios do Treino */}
            {exercise.exercises && exercise.exercises.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Exercícios</h2>
                <div className="space-y-3">
                  {exercise.exercises.map((ex: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors rounded-lg p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold">
                          {index + 1}
                        </div>
                        <span className="text-white font-medium">{ex.name}</span>
                      </div>
                      <span className="text-white/60 text-sm">{ex.duration}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Benefícios */}
            {exercise.benefits && exercise.benefits.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Benefícios</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {exercise.benefits.map((benefit: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-white/5 rounded-lg p-4"
                    >
                      <div className="w-2 h-2 rounded-full bg-white" />
                      <span className="text-white/80">{benefit}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informações do Instrutor */}
            {exercise.instructor && (
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Instrutor</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
                    {exercise.instructor.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{exercise.instructor}</p>
                    <p className="text-white/60 text-sm">Personal Trainer</p>
                  </div>
                </div>
              </div>
            )}

            {/* Detalhes do Treino */}
            <div className="bg-white/5 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-bold text-white mb-4">Detalhes</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-white/60 text-sm mb-1">Categoria</p>
                  <p className="text-white font-medium">{exercise.category}</p>
                </div>
                
                {exercise.calories && (
                  <div>
                    <p className="text-white/60 text-sm mb-1">Calorias Queimadas</p>
                    <p className="text-white font-medium">{exercise.calories}</p>
                  </div>
                )}
                
                {exercise.equipment && (
                  <div>
                    <p className="text-white/60 text-sm mb-1">Equipamento</p>
                    <p className="text-white font-medium">{exercise.equipment}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-white/60 text-sm mb-1">Nível</p>
                  <p className="text-white font-medium">{exercise.level}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
