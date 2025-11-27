"use client";

import { useRouter } from "next/navigation";
import { Play, Clock, TrendingUp, Calendar, Target, Users, Dumbbell, Trophy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import ProfileMenu from "@/components/ProfileMenu";

// Ranking de usuários (tipo stories)
const rankingUsers = [
  { 
    id: "1", 
    name: "Ana Paula", 
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    points: 1245,
    position: 1
  },
  { 
    id: "2", 
    name: "João Pedro", 
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    points: 1198,
    position: 2
  },
  { 
    id: "3", 
    name: "Fernanda Lima", 
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
    points: 1176,
    position: 3
  },
];

// Dados mockados de programas
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
  const { theme } = useTheme();

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

      {/* RANKING TIPO STORIES - TOP 3 */}
      <div className={`px-4 py-6 ${
        theme === "light" 
          ? "bg-gradient-to-b from-white to-transparent" 
          : "bg-gradient-to-b from-black to-transparent"
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h2 className={`font-bold text-lg ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}>
              Top 3 do Ranking
            </h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {rankingUsers.map((user) => (
              <div
                key={user.id}
                className="flex-shrink-0 flex flex-col items-center gap-2"
              >
                {/* Avatar com borda de ranking */}
                <div className="relative">
                  <div
                    className={`w-20 h-20 rounded-full p-1 ${
                      user.position === 1
                        ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                        : user.position === 2
                        ? "bg-gradient-to-br from-gray-300 to-gray-500"
                        : "bg-gradient-to-br from-orange-400 to-orange-600"
                    }`}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className={`w-full h-full rounded-full object-cover border-2 ${
                        theme === "light" ? "border-white" : "border-black"
                      }`}
                    />
                  </div>
                  {/* Badge de posição */}
                  <div
                    className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      user.position === 1
                        ? "bg-yellow-500"
                        : user.position === 2
                        ? "bg-gray-400"
                        : "bg-orange-500"
                    }`}
                  >
                    {user.position}º
                  </div>
                </div>
                {/* Nome e pontos */}
                <div className="text-center">
                  <p className={`text-sm font-semibold max-w-[80px] truncate ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  }`}>
                    {user.name}
                  </p>
                  <p className={`text-xs ${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                  }`}>
                    {user.points} pts
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="relative pt-4 pb-6 px-4 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${
            theme === "light" ? "text-gray-900" : "text-white"
          }`}>
            Programas de Treino
          </h1>
          <p className={`text-sm md:text-base max-w-2xl ${
            theme === "light" ? "text-gray-600" : "text-gray-400"
          }`}>
            Programas completos e estruturados
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
                className={`group rounded-lg overflow-hidden transition-all duration-300 cursor-pointer ${
                  theme === "light"
                    ? "bg-white hover:shadow-xl"
                    : "bg-white/5 hover:bg-white/10"
                }`}
                onClick={() => {
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
                    <h3 className={`text-xl md:text-2xl font-bold mb-2 ${
                      theme === "light" ? "text-gray-900" : "text-white"
                    }`}>
                      {program.title}
                    </h3>
                    
                    <p className={`text-sm mb-4 line-clamp-2 ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}>
                      {program.description}
                    </p>

                    {/* Informações */}
                    <div className={`flex flex-wrap items-center gap-4 mb-4 text-sm ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}>
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
                      <p className={`text-xs mb-2 ${
                        theme === "light" ? "text-gray-600" : "text-gray-400"
                      }`}>
                        Objetivos:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {program.goals.map((goal, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 rounded text-xs ${
                              theme === "light"
                                ? "bg-gray-100 text-gray-700"
                                : "bg-white/10 text-white/80"
                            }`}
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
                      <span className={`text-sm ${
                        theme === "light" ? "text-gray-600" : "text-gray-400"
                      }`}>
                        {program.instructor}
                      </span>
                    </div>

                    {/* Botão */}
                    <Button className={`w-full font-semibold ${
                      theme === "light"
                        ? "bg-[#E50914] text-white hover:bg-[#C4070F]"
                        : "bg-white text-black hover:bg-white/90"
                    }`}>
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
              theme === "light" ? "text-gray-900" : "text-white"
            }`} />
            <span className={`text-xs font-semibold ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}>
              Programas
            </span>
          </button>
          <button
            onClick={() => router.push("/treinos")}
            className="flex flex-col items-center gap-1"
          >
            <Dumbbell className={`w-6 h-6 ${
              theme === "light" ? "text-gray-500" : "text-gray-500"
            }`} />
            <span className={`text-xs ${
              theme === "light" ? "text-gray-500" : "text-gray-500"
            }`}>
              Treinos
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}
