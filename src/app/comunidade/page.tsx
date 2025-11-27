"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, MessageCircle, Share2, Image as ImageIcon, Video, Users, Target, Dumbbell, X, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import ProfileMenu from "@/components/ProfileMenu";

interface Post {
  id: string;
  type: "checkin" | "resultado" | "nutricao" | "aviso" | "momento";
  user: {
    name: string;
    avatar: string;
    unit: string;
  };
  timestamp: string;
  image: string;
  imageSecondary?: string;
  caption: string;
  likes: number;
  comments: number;
  nutrition?: {
    protein: string;
    carbs: string;
    kcal: string;
  };
  isVideo?: boolean;
}

const mockPosts: Post[] = [
  {
    id: "1",
    type: "checkin",
    user: {
      name: "Carlos Silva",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop",
      unit: "Simplifit — Zona Norte"
    },
    timestamp: "há 2h",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
    caption: "Check-in feito! Hoje foi treino de peito 💥",
    likes: 42,
    comments: 8
  },
  {
    id: "2",
    type: "resultado",
    user: {
      name: "Mariana Costa",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      unit: "Simplifit — Centro"
    },
    timestamp: "há 5h",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
    imageSecondary: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=600&fit=crop",
    caption: "6 semanas focado. Rumo ao próximo nível! 🔥💪",
    likes: 128,
    comments: 24
  },
  {
    id: "3",
    type: "nutricao",
    user: {
      name: "Rafael Mendes",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      unit: "Simplifit — Zona Sul"
    },
    timestamp: "há 8h",
    image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800&h=600&fit=crop",
    caption: "Overnight de Whey — receita na descrição! 🥣",
    likes: 67,
    comments: 15,
    nutrition: {
      protein: "28g",
      carbs: "32g",
      kcal: "390"
    }
  },
  {
    id: "4",
    type: "aviso",
    user: {
      name: "Simplifit Oficial",
      avatar: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=100&h=100&fit=crop",
      unit: "Simplifit — Todas as Unidades"
    },
    timestamp: "há 1 dia",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
    caption: "🚨 AVISO: Nova turma de funcional às 6h! Vagas limitadas. Garanta a sua!",
    likes: 203,
    comments: 45
  }
];

export default function ComunidadePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { theme } = useTheme();
  const [newPostCaption, setNewPostCaption] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [shareSheetOpen, setShareSheetOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);

  useEffect(() => {
    console.log("🔍 [Comunidade] Verificando autenticação. isAuthenticated:", isAuthenticated);
    if (!isAuthenticated) {
      console.log("❌ [Comunidade] Usuário não autenticado. Redirecionando para /login");
      router.push("/login");
    } else {
      console.log("✅ [Comunidade] Usuário autenticado. Carregando feed");
      console.log("👤 [Comunidade] Dados do usuário:", user);
    }
  }, [isAuthenticated, router, user]);

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    console.log("📸 [Comunidade] Selecionando mídia. Tipo:", type);
    if (!isAuthenticated) {
      console.log("❌ [Comunidade] Usuário não autenticado. Bloqueando seleção de mídia");
      alert("Você precisa estar logado para adicionar mídia");
      return;
    }

    const file = e.target.files?.[0];
    if (file) {
      console.log("✅ [Comunidade] Arquivo selecionado:", {
        name: file.name,
        size: file.size,
        type: file.type
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedMedia(reader.result as string);
        setMediaType(type);
        console.log("✅ [Comunidade] Mídia carregada com sucesso");
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = () => {
    console.log("📝 [Comunidade] Tentando publicar post");
    if (!isAuthenticated) {
      console.log("❌ [Comunidade] Usuário não autenticado. Bloqueando publicação");
      alert("Você precisa estar logado para publicar");
      return;
    }

    if (!newPostCaption.trim() || !user) {
      console.log("❌ [Comunidade] Dados insuficientes para publicar. Caption:", newPostCaption.trim(), "User:", user);
      return;
    }

    const newPost: Post = {
      id: Date.now().toString(),
      type: mediaType === "video" ? "momento" : "checkin",
      user: {
        name: user.name,
        avatar: user.avatar,
        unit: user.unit
      },
      timestamp: "agora",
      image: selectedMedia || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
      caption: newPostCaption,
      likes: 0,
      comments: 0,
      isVideo: mediaType === "video"
    };

    console.log("✅ [Comunidade] Post criado com sucesso:", {
      id: newPost.id,
      type: newPost.type,
      user: newPost.user.name,
      caption: newPost.caption,
      hasMedia: !!selectedMedia
    });

    setPosts([newPost, ...posts]);
    console.log("📊 [Comunidade] Total de posts após publicação:", posts.length + 1);
    setNewPostCaption("");
    setSelectedMedia(null);
    setMediaType(null);
    console.log("🧹 [Comunidade] Formulário limpo");
  };

  const handleLike = (postId: string) => {
    console.log("❤️ [Comunidade] Tentando curtir post:", postId);
    if (!isAuthenticated) {
      console.log("❌ [Comunidade] Usuário não autenticado. Bloqueando curtida");
      alert("Você precisa estar logado para curtir");
      return;
    }

    setPosts(posts.map(post => {
      if (post.id === postId) {
        console.log("✅ [Comunidade] Post curtido. Likes antes:", post.likes, "Likes depois:", post.likes + 1);
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    }));
  };

  const handleComment = (postId: string) => {
    console.log("💬 [Comunidade] Tentando comentar no post:", postId);
    if (!isAuthenticated) {
      console.log("❌ [Comunidade] Usuário não autenticado. Bloqueando comentário");
      alert("Você precisa estar logado para comentar");
      return;
    }

    console.log("🚀 [Comunidade] Redirecionando para página do post:", `/comunidade/post/${postId}`);
    router.push(`/comunidade/post/${postId}`);
  };

  const handleShareClick = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    setSelectedPostId(postId);
    setShareSheetOpen(true);
  };

  const handleNativeShare = async () => {
    if (!selectedPostId) return;
    
    const postUrl = `${window.location.origin}/comunidade/post/${selectedPostId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Confira este post no FITSTREAM',
          text: 'Veja este post incrível da comunidade Simplifit!',
          url: postUrl,
        });
        setShareSheetOpen(false);
      } catch (err) {
        console.log('Compartilhamento cancelado ou erro:', err);
      }
    } else {
      // Fallback: copiar link
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    if (!selectedPostId) return;
    
    const postUrl = `${window.location.origin}/comunidade/post/${selectedPostId}`;
    navigator.clipboard.writeText(postUrl);
    
    setShowCopyFeedback(true);
    setTimeout(() => {
      setShowCopyFeedback(false);
      setShareSheetOpen(false);
    }, 2000);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`min-h-screen pb-20 ${
      theme === "light" ? "bg-gray-50" : "bg-[#0B0B0B]"
    }`}>
      {/* Header Fixo com 3 elementos */}
      <header className={`fixed top-0 left-0 right-0 z-50 shadow-lg ${
        theme === "light" ? "bg-white" : "bg-black"
      }`}>
        <div className="flex items-center justify-between px-4 py-4">
          {/* Seta de voltar (esquerda) */}
          <button
            onClick={() => router.back()}
            className={`p-2 rounded-full transition ${
              theme === "light" 
                ? "hover:bg-gray-100 text-gray-600" 
                : "hover:bg-gray-800 text-gray-400"
            }`}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          {/* Logo FITSTREAM (centro - sempre centralizado) */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <button
              onClick={() => router.push("/comunidade")}
              className="text-2xl font-bold hover:opacity-80 transition-opacity"
            >
              <span className="text-red-600">FIT</span>
              <span className={theme === "light" ? "text-gray-900" : "text-white"}>STREAM</span>
            </button>
          </div>

          {/* Ícone de avatar (direita) */}
          <ProfileMenu />
        </div>
      </header>

      {/* Espaçamento para header fixo */}
      <div className="h-16"></div>
      
      <div className="pt-8 pb-12 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feed Principal */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-4">
              <h1 className={`text-2xl md:text-3xl font-bold mb-1 ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}>
                Comunidade Simplifit
              </h1>
              <p className={`text-sm md:text-base ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}>
                Compartilhe seus treinos, veja resultados reais da galera e faça parte da rotina Simplifit.
              </p>
            </div>

            {/* Caixa de Criação de Post */}
            <div className={`rounded-xl p-4 mb-6 shadow-lg ${
              theme === "light" ? "bg-white" : "bg-[#1A1A1A]"
            }`}>
              <div className="flex gap-3">
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"}
                  alt="Seu avatar"
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <textarea
                    value={newPostCaption}
                    onChange={(e) => setNewPostCaption(e.target.value)}
                    placeholder="Compartilhe seu FITZ de hoje..."
                    className={`w-full bg-transparent resize-none focus:outline-none text-sm mb-3 ${
                      theme === "light" 
                        ? "text-gray-900 placeholder-gray-400" 
                        : "text-white placeholder-gray-500"
                    }`}
                    rows={2}
                  />
                  
                  {selectedMedia && (
                    <div className="mb-3 relative">
                      {mediaType === "video" ? (
                        <div className={`relative w-full h-48 rounded-lg flex items-center justify-center ${
                          theme === "light" ? "bg-gray-100" : "bg-black"
                        }`}>
                          <Video className={`w-12 h-12 ${
                            theme === "light" ? "text-gray-400" : "text-gray-500"
                          }`} />
                          <span className="absolute bottom-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                            Vídeo selecionado
                          </span>
                        </div>
                      ) : (
                        <img
                          src={selectedMedia}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      )}
                      <button
                        onClick={() => {
                          setSelectedMedia(null);
                          setMediaType(null);
                        }}
                        className="absolute top-2 right-2 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-black transition text-sm"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  <div className={`flex items-center justify-between pt-2 border-t ${
                    theme === "light" ? "border-gray-200" : "border-gray-800"
                  }`}>
                    <div className="flex items-center gap-3">
                      <label className={`flex items-center gap-1.5 cursor-pointer transition group ${
                        theme === "light" 
                          ? "text-gray-600 hover:text-gray-900" 
                          : "text-gray-400 hover:text-white"
                      }`}>
                        <ImageIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="text-xs">Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleMediaSelect(e, "image")}
                          className="hidden"
                        />
                      </label>
                      
                      <label className={`flex items-center gap-1.5 cursor-pointer transition group ${
                        theme === "light" 
                          ? "text-gray-600 hover:text-gray-900" 
                          : "text-gray-400 hover:text-white"
                      }`}>
                        <Video className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="text-xs">FITZ</span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleMediaSelect(e, "video")}
                          className="hidden"
                        />
                      </label>
                    </div>
                    
                    <button
                      onClick={handlePublish}
                      disabled={!newPostCaption.trim()}
                      className="bg-[#E50914] text-white px-5 py-1.5 rounded-full text-sm font-semibold hover:bg-[#C4070F] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Publicar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Feed de Posts */}
            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className={`rounded-xl overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-[1.01] ${
                    post.type === "aviso" 
                      ? theme === "light"
                        ? "bg-gradient-to-br from-red-50 to-white"
                        : "bg-gradient-to-br from-[#E50914]/20 to-[#1A1A1A]"
                      : theme === "light"
                        ? "bg-white"
                        : "bg-[#1A1A1A]"
                  }`}
                  onClick={() => router.push(`/comunidade/post/${post.id}`)}
                >
                  {/* Topo do Card */}
                  <div className="p-4 flex items-center gap-3">
                    <img
                      src={post.user.avatar}
                      alt={post.user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        theme === "light" ? "text-gray-900" : "text-white"
                      }`}>
                        {post.user.name}
                      </h3>
                      <p className={`text-sm ${
                        theme === "light" ? "text-gray-600" : "text-gray-400"
                      }`}>
                        {post.user.unit}
                      </p>
                    </div>
                    <span className={`text-sm ${
                      theme === "light" ? "text-gray-500" : "text-gray-500"
                    }`}>
                      {post.timestamp}
                    </span>
                  </div>

                  {/* Imagem(ns) ou Vídeo */}
                  <div className="relative">
                    {post.isVideo ? (
                      <div className={`relative w-full h-[500px] flex items-center justify-center ${
                        theme === "light" ? "bg-gray-100" : "bg-black"
                      }`}>
                        <Video className={`w-16 h-16 ${
                          theme === "light" ? "text-gray-400" : "text-gray-600"
                        }`} />
                        <div className="absolute top-4 left-4 bg-[#E50914] text-white text-xs px-2 py-1 rounded-full font-semibold">
                          FITZ
                        </div>
                      </div>
                    ) : post.imageSecondary ? (
                      <div className="grid grid-cols-2 gap-1">
                        <img
                          src={post.image}
                          alt="Antes"
                          className="w-full h-[400px] object-cover"
                        />
                        <img
                          src={post.imageSecondary}
                          alt="Depois"
                          className="w-full h-[400px] object-cover"
                        />
                      </div>
                    ) : (
                      <img
                        src={post.image}
                        alt="Post"
                        className="w-full h-[500px] object-cover"
                      />
                    )}
                  </div>

                  {/* Legenda */}
                  <div className="p-4">
                    <p className={`mb-3 ${
                      theme === "light" ? "text-gray-900" : "text-white"
                    }`}>
                      {post.caption}
                    </p>

                    {/* Box de Nutrição */}
                    {post.nutrition && (
                      <div className={`rounded-lg p-4 mb-3 grid grid-cols-3 gap-4 ${
                        theme === "light" ? "bg-gray-50" : "bg-[#0B0B0B]"
                      }`}>
                        <div className="text-center">
                          <p className={`text-xs mb-1 ${
                            theme === "light" ? "text-gray-600" : "text-gray-400"
                          }`}>
                            Proteína
                          </p>
                          <p className={`font-bold ${
                            theme === "light" ? "text-gray-900" : "text-white"
                          }`}>
                            {post.nutrition.protein}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className={`text-xs mb-1 ${
                            theme === "light" ? "text-gray-600" : "text-gray-400"
                          }`}>
                            Carboidratos
                          </p>
                          <p className={`font-bold ${
                            theme === "light" ? "text-gray-900" : "text-white"
                          }`}>
                            {post.nutrition.carbs}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className={`text-xs mb-1 ${
                            theme === "light" ? "text-gray-600" : "text-gray-400"
                          }`}>
                            Calorias
                          </p>
                          <p className={`font-bold ${
                            theme === "light" ? "text-gray-900" : "text-white"
                          }`}>
                            {post.nutrition.kcal}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Ações */}
                    <div className="flex items-center gap-6 mb-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(post.id);
                        }}
                        className={`flex items-center gap-2 transition ${
                          theme === "light"
                            ? "text-gray-600 hover:text-[#E50914]"
                            : "text-gray-400 hover:text-[#E50914]"
                        }`}
                      >
                        <Heart className="w-6 h-6" />
                        <span className="text-sm font-semibold">{post.likes}</span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleComment(post.id);
                        }}
                        className={`flex items-center gap-2 transition ${
                          theme === "light"
                            ? "text-gray-600 hover:text-gray-900"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        <MessageCircle className="w-6 h-6" />
                        <span className="text-sm font-semibold">{post.comments}</span>
                      </button>
                      <button 
                        onClick={(e) => handleShareClick(e, post.id)}
                        className={`flex items-center gap-2 transition ${
                          theme === "light"
                            ? "text-gray-600 hover:text-gray-900"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        <Share2 className="w-6 h-6" />
                      </button>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/comunidade/post/${post.id}`);
                      }}
                      className={`text-sm transition ${
                        theme === "light"
                          ? "text-gray-500 hover:text-gray-700"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      Ver todos os {post.comments} comentários
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Desktop */}
          <div className="hidden lg:block space-y-6">
            {/* Ranking da Semana */}
            <div className={`rounded-xl p-6 shadow-lg ${
              theme === "light" ? "bg-white" : "bg-[#1A1A1A]"
            }`}>
              <h3 className={`font-bold text-lg mb-4 ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}>
                🏆 Ranking da Semana
              </h3>
              <div className="space-y-4">
                {[
                  { name: "Ana Paula", points: 245, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
                  { name: "João Pedro", points: 198, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
                  { name: "Fernanda Lima", points: 176, avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop" },
                  { name: "Ricardo Santos", points: 154, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" },
                  { name: "Juliana Costa", points: 142, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" }
                ].map((user, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-[#E50914] font-bold text-lg w-6">{index + 1}</span>
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${
                        theme === "light" ? "text-gray-900" : "text-white"
                      }`}>
                        {user.name}
                      </p>
                      <p className={`text-xs ${
                        theme === "light" ? "text-gray-600" : "text-gray-400"
                      }`}>
                        {user.points} pontos
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desafios Ativos */}
            <div className={`rounded-xl p-6 shadow-lg ${
              theme === "light" ? "bg-white" : "bg-[#1A1A1A]"
            }`}>
              <h3 className={`font-bold text-lg mb-4 ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}>
                🎯 Desafios Ativos
              </h3>
              <div className="space-y-4">
                <div className={`rounded-lg p-4 ${
                  theme === "light" ? "bg-gray-50" : "bg-[#0B0B0B]"
                }`}>
                  <h4 className={`font-semibold mb-2 ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  }`}>
                    Desafio 10 treinos no mês
                  </h4>
                  <p className={`text-sm mb-3 ${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                  }`}>
                    Faltam 4 treinos
                  </p>
                  <button className="w-full bg-[#E50914] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#C4070F] transition">
                    Participar
                  </button>
                </div>
                <div className={`rounded-lg p-4 ${
                  theme === "light" ? "bg-gray-50" : "bg-[#0B0B0B]"
                }`}>
                  <h4 className={`font-semibold mb-2 ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  }`}>
                    Desafio 7 dias de abs
                  </h4>
                  <p className={`text-sm mb-3 ${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                  }`}>
                    Comece hoje!
                  </p>
                  <button className="w-full bg-[#E50914] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#C4070F] transition">
                    Participar
                  </button>
                </div>
              </div>
            </div>

            {/* Nutrição do Dia */}
            <div className={`rounded-xl p-6 shadow-lg ${
              theme === "light" ? "bg-white" : "bg-[#1A1A1A]"
            }`}>
              <h3 className={`font-bold text-lg mb-4 ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}>
                🥗 Nutrição do Dia
              </h3>
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop"
                alt="Receita"
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h4 className={`font-semibold mb-2 ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}>
                Bowl Proteico Pós-Treino
              </h4>
              <p className={`text-sm mb-3 ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}>
                Rico em proteínas e carboidratos complexos
              </p>
              <button className="w-full bg-[#E50914] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#C4070F] transition">
                Ver detalhes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sheet de Compartilhamento */}
      {shareSheetOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShareSheetOpen(false)}
        >
          <div 
            className={`w-full max-w-lg rounded-3xl p-6 pb-8 ${
              theme === "light" ? "bg-white" : "bg-[#1A1A1A]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-lg font-bold ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}>
                Compartilhar
              </h3>
              <button
                onClick={() => setShareSheetOpen(false)}
                className={`p-1 rounded-full transition ${
                  theme === "light" 
                    ? "hover:bg-gray-100 text-gray-600" 
                    : "hover:bg-gray-800 text-gray-400"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Enviar via apps nativos */}
              <button
                onClick={handleNativeShare}
                className={`w-full p-4 rounded-xl text-left transition ${
                  theme === "light"
                    ? "bg-gray-50 hover:bg-gray-100 text-gray-900"
                    : "bg-[#0B0B0B] hover:bg-black text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Share2 className="w-5 h-5" />
                  <div>
                    <p className="font-semibold">Enviar via WhatsApp / Instagram / Outros apps</p>
                    <p className={`text-sm ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}>
                      Compartilhar link da publicação
                    </p>
                  </div>
                </div>
              </button>

              {/* Copiar link */}
              <button
                onClick={handleCopyLink}
                className={`w-full p-4 rounded-xl text-left transition ${
                  theme === "light"
                    ? "bg-gray-50 hover:bg-gray-100 text-gray-900"
                    : "bg-[#0B0B0B] hover:bg-black text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-semibold">Copiar link</p>
                    <p className={`text-sm ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}>
                      Copiar para área de transferência
                    </p>
                  </div>
                </div>
              </button>

              {/* Cancelar */}
              <button
                onClick={() => setShareSheetOpen(false)}
                className={`w-full p-4 rounded-xl text-center font-semibold transition ${
                  theme === "light"
                    ? "bg-gray-100 hover:bg-gray-200 text-gray-900"
                    : "bg-[#0B0B0B] hover:bg-black text-white"
                }`}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback de Link Copiado */}
      {showCopyFeedback && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in">
          Link copiado!
        </div>
      )}

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
              theme === "light" ? "text-gray-900" : "text-white"
            }`} />
            <span className={`text-xs font-semibold ${
              theme === "light" ? "text-gray-900" : "text-white"
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
