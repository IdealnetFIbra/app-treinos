"use client";

import { Navbar } from "@/components/custom/navbar";
import { HeroBanner } from "@/components/custom/hero-banner";
import { VideoCarousel } from "@/components/custom/video-carousel";

// Mock data - será substituído por dados reais do backend
const continueWatching = [
  {
    id: 1,
    title: "HIIT Cardio Explosivo",
    duration: "25 min",
    level: "Avançado",
    thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=225&fit=crop",
  },
  {
    id: 2,
    title: "Yoga para Iniciantes",
    duration: "30 min",
    level: "Iniciante",
    thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=225&fit=crop",
  },
  {
    id: 3,
    title: "Treino de Glúteos",
    duration: "20 min",
    level: "Intermediário",
    thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=225&fit=crop",
  },
  {
    id: 4,
    title: "Alongamento Completo",
    duration: "15 min",
    level: "Todos os níveis",
    thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=225&fit=crop",
  },
  {
    id: 5,
    title: "Treino de Braços",
    duration: "30 min",
    level: "Intermediário",
    thumbnail: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=225&fit=crop",
  },
];

const recommended = [
  {
    id: 6,
    title: "Funcional Intenso",
    duration: "40 min",
    level: "Avançado",
    thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=225&fit=crop",
  },
  {
    id: 7,
    title: "Pilates Reformer",
    duration: "45 min",
    level: "Intermediário",
    thumbnail: "https://images.unsplash.com/photo-1518310952931-b1de897abd40?w=400&h=225&fit=crop",
  },
  {
    id: 8,
    title: "Treino de Core",
    duration: "20 min",
    level: "Todos os níveis",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop",
  },
  {
    id: 9,
    title: "Dança Fitness",
    duration: "35 min",
    level: "Iniciante",
    thumbnail: "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=400&h=225&fit=crop",
  },
  {
    id: 10,
    title: "Treino de Pernas",
    duration: "30 min",
    level: "Intermediário",
    thumbnail: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400&h=225&fit=crop",
  },
];

const quickWorkouts = [
  {
    id: 11,
    title: "Abdômen em 10 Min",
    duration: "10 min",
    level: "Todos os níveis",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop",
  },
  {
    id: 12,
    title: "Cardio Rápido",
    duration: "8 min",
    level: "Intermediário",
    thumbnail: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=225&fit=crop",
  },
  {
    id: 13,
    title: "Alongamento Express",
    duration: "5 min",
    level: "Todos os níveis",
    thumbnail: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=225&fit=crop",
  },
  {
    id: 14,
    title: "Glúteos em 10 Min",
    duration: "10 min",
    level: "Iniciante",
    thumbnail: "https://images.unsplash.com/photo-1550259979-ed79b48d2a30?w=400&h=225&fit=crop",
  },
  {
    id: 15,
    title: "Mobilidade Matinal",
    duration: "7 min",
    level: "Todos os níveis",
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=225&fit=crop",
  },
];

const glutesFocus = [
  {
    id: 16,
    title: "Glúteos Definidos",
    duration: "25 min",
    level: "Intermediário",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop",
  },
  {
    id: 17,
    title: "Treino de Pernas e Glúteos",
    duration: "35 min",
    level: "Avançado",
    thumbnail: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400&h=225&fit=crop",
  },
  {
    id: 18,
    title: "Glúteos com Elástico",
    duration: "20 min",
    level: "Iniciante",
    thumbnail: "https://images.unsplash.com/photo-1550259979-ed79b48d2a30?w=400&h=225&fit=crop",
  },
  {
    id: 19,
    title: "Glúteos e Core",
    duration: "30 min",
    level: "Intermediário",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop",
  },
  {
    id: 20,
    title: "Glúteos Explosivos",
    duration: "28 min",
    level: "Avançado",
    thumbnail: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400&h=225&fit=crop",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#000000]">
      <Navbar />
      <HeroBanner />
      
      <div className="pb-12">
        <VideoCarousel title="Continuar Assistindo" videos={continueWatching} />
        <VideoCarousel title="Recomendados para Você" videos={recommended} />
        <VideoCarousel title="Aulas Rápidas (até 10 min)" videos={quickWorkouts} />
        <VideoCarousel title="Foco em Glúteos" videos={glutesFocus} />
      </div>
    </div>
  );
}
