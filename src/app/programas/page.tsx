"use client";

import { Navbar } from "@/components/custom/navbar";
import { useRouter } from "next/navigation";
import { Play, Clock, TrendingUp, Calendar, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

// Dados mockados de programas (podem ser substituídos por dados do Supabase futuramente)
const programs = [
  {
    id: "1",
    title: "Programa Emagrecimento 30 Dias",
    description: "Programa completo de 30 dias focado em perda de peso e definição muscular. Combine treinos intensos com orientações nutricionais.",
    thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=450&fit=crop",
    duration: "30 dias",
    level: "Intermediário",
    workouts: 24,
    daysPerWeek: 5,
    goals: ["Perda de peso", "Definição muscular", "Resistência cardiovascular"],
    instructor: "Ana Silva",
  },
  {
    id: "2",
    title: "Ganho de Massa Muscular - 8 Semanas",
    description: "Programa intensivo de 8 semanas para hipertrofia muscular. Treinos focados em força e volume com progressão de carga.",
    thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=450&fit=crop",
    duration: "8 semanas",
    level: "Avançado",
    workouts: 40,
    daysPerWeek: 5,
    goals: ["Ganho de massa", "Força muscular", "Hipertrofia"],
    instructor: "Carlos Mendes",
  },
  {
    id: "3",
    title: "Iniciante Total - 4 Semanas",
    description: "Perfeito para quem está começando! Aprenda os fundamentos do treino físico com exercícios simples e eficazes.",
    thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=450&fit=crop",
    duration: "4 semanas",
    level: "Iniciante",
    workouts: 16,
    daysPerWeek: 4,
    goals: ["Condicionamento físico", "Aprendizado de técnicas", "Criação de hábitos"],
    instructor: "Juliana Costa",
  },
  {
    id: "4",
    title: "Yoga & Flexibilidade - 6 Semanas",
    description: "Programa de yoga e alongamento para melhorar flexibilidade, equilíbrio e bem-estar mental.",
    thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=450&fit=crop",
    duration: "6 semanas",
    level: "Todos os níveis",
    workouts: 30,
    daysPerWeek: 5,
    goals: ["Flexibilidade", "Equilíbrio", "Relaxamento"],
    instructor: "Marina Santos",
  },
  {
    id: "5",
    title: "HIIT Extremo - 12 Semanas",
    description: "Treinos de alta intensidade para queima máxima de calorias e condicionamento cardiovascular superior.",
    thumbnail: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&h=450&fit=crop",
    duration: "12 semanas",
    level: "Avançado",
    workouts: 48,
    daysPerWeek: 4,
    goals: ["Queima de gordura", "Condicionamento", "Resistência"],
    instructor: "Roberto Lima",
  },
  {
    id: "6",
    title: "Glúteos Perfeitos - 6 Semanas",
    description: "Programa especializado em fortalecimento e definição dos glúteos e pernas.",
    thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=450&fit=crop",
    duration: "6 semanas",
    level: "Intermediário",
    workouts: 24,
    daysPerWeek: 4,
    goals: ["Fortalecimento de glúteos", "Definição de pernas", "Tonificação"],
    instructor: "Fernanda Oliveira",
  },
];

export default function ProgramasPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#000000]">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative pt-24 pb-12 px-4 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Programas de Treino
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl">
            Programas completos e estruturados para você alcançar seus objetivos fitness de forma consistente.
          </p>
        </div>
      </div>

      {/* Grid de Programas */}
      <div className="px-4 md:px-12 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {programs.map((program) => (
              <div
                key={program.id}
                className="group bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all duration-300 cursor-pointer"
                onClick={() => {
                  // Futuramente pode redirecionar para página de detalhes do programa
                  console.log("Programa selecionado:", program.id);
                }}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Thumbnail */}
                  <div className="relative w-full md:w-2/5 aspect-video md:aspect-auto">
                    <img
                      src={program.thumbnail}
                      alt={program.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                        <Play className="w-7 h-7 text-white fill-white" />
                      </div>
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 p-6">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                      {program.title}
                    </h3>
                    
                    <p className="text-white/70 text-sm mb-4 line-clamp-2">
                      {program.description}
                    </p>

                    {/* Informações */}
                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-white/60">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {program.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {program.level}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {program.workouts} treinos
                      </span>
                    </div>

                    {/* Objetivos */}
                    <div className="mb-4">
                      <p className="text-white/60 text-xs mb-2">Objetivos:</p>
                      <div className="flex flex-wrap gap-2">
                        {program.goals.map((goal, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-white/10 rounded text-xs text-white/80"
                          >
                            {goal}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Instrutor */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                        {program.instructor.charAt(0)}
                      </div>
                      <span className="text-white/70 text-sm">{program.instructor}</span>
                    </div>

                    {/* Botão */}
                    <Button className="w-full bg-white text-black hover:bg-white/90 font-semibold">
                      <Target className="w-4 h-4 mr-2" />
                      Começar Programa
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
