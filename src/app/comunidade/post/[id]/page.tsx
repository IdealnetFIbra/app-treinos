"use client";

import { Navbar } from "@/components/custom/navbar";
import { useState } from "react";
import { Heart, MessageCircle, Share2, Bookmark, Send, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
}

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      user: {
        name: "Juliana Mendes",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
      },
      text: "Parabéns pelo resultado! Muito inspirador 💪",
      timestamp: "há 5 min"
    },
    {
      id: "2",
      user: {
        name: "Pedro Alves",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
      },
      text: "Qual foi a dieta que você seguiu?",
      timestamp: "há 15 min"
    },
    {
      id: "3",
      user: {
        name: "Camila Santos",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
      },
      text: "Incrível! Quantas vezes por semana você treina?",
      timestamp: "há 30 min"
    }
  ]);

  // Mock data do post (em produção viria do Supabase)
  const post = {
    id: params.id,
    type: "resultado",
    user: {
      name: "Mariana Costa",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      unit: "Simplifit — Centro"
    },
    timestamp: "há 5h",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=1000&fit=crop",
    imageSecondary: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=1000&fit=crop",
    caption: "Último treino da semana finalizado! Rumo ao objetivo 🔥\n\n6 semanas de muito foco, disciplina e dedicação. Os resultados estão aparecendo e isso me motiva ainda mais! 💪\n\nDica: consistência é a chave. Não desista nos dias difíceis!",
    likes: 128,
    commentsCount: comments.length
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: {
        name: "Você",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
      },
      text: newComment,
      timestamp: "agora"
    };

    setComments([comment, ...comments]);
    setNewComment("");
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B]">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto">
        {/* Botão Voltar */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>

        <div className="bg-[#1A1A1A] rounded-xl overflow-hidden shadow-lg">
          {/* Topo do Post */}
          <div className="p-6 flex items-center gap-4 border-b border-gray-800">
            <img
              src={post.user.avatar}
              alt={post.user.name}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div className="flex-1">
              <h2 className="text-white font-bold text-lg">{post.user.name}</h2>
              <p className="text-gray-400 text-sm">{post.user.unit}</p>
            </div>
            <span className="text-gray-500 text-sm">{post.timestamp}</span>
          </div>

          {/* Imagens */}
          <div className="relative">
            {post.imageSecondary ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                <div className="relative">
                  <img
                    src={post.image}
                    alt="Antes"
                    className="w-full h-[500px] md:h-[600px] object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Antes
                  </div>
                </div>
                <div className="relative">
                  <img
                    src={post.imageSecondary}
                    alt="Depois"
                    className="w-full h-[500px] md:h-[600px] object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-[#E50914] text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Depois
                  </div>
                </div>
              </div>
            ) : (
              <img
                src={post.image}
                alt="Post"
                className="w-full h-[600px] object-cover"
              />
            )}
          </div>

          {/* Ações */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-6 mb-4">
              <button
                onClick={() => setLiked(!liked)}
                className={`flex items-center gap-2 transition ${
                  liked ? "text-[#E50914]" : "text-gray-400 hover:text-[#E50914]"
                }`}
              >
                <Heart className={`w-7 h-7 ${liked ? "fill-current" : ""}`} />
                <span className="text-lg font-semibold">{liked ? post.likes + 1 : post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                <MessageCircle className="w-7 h-7" />
                <span className="text-lg font-semibold">{post.commentsCount}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                <Share2 className="w-7 h-7" />
              </button>
              <button
                onClick={() => setSaved(!saved)}
                className={`ml-auto transition ${
                  saved ? "text-[#E50914]" : "text-gray-400 hover:text-white"
                }`}
              >
                <Bookmark className={`w-7 h-7 ${saved ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Legenda Completa */}
            <div className="mb-4">
              <p className="text-white text-lg leading-relaxed whitespace-pre-line">
                {post.caption}
              </p>
            </div>
          </div>

          {/* Seção de Comentários */}
          <div className="p-6">
            <h3 className="text-white font-bold text-xl mb-6">Comentários</h3>
            
            {/* Lista de Comentários */}
            <div className="space-y-6 mb-6 max-h-[500px] overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <img
                    src={comment.user.avatar}
                    alt={comment.user.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="bg-[#0B0B0B] rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white font-semibold text-sm">
                          {comment.user.name}
                        </span>
                        <span className="text-gray-500 text-xs">{comment.timestamp}</span>
                      </div>
                      <p className="text-gray-300 text-sm">{comment.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Caixa de Adicionar Comentário */}
            <div className="flex gap-3 items-start border-t border-gray-800 pt-6">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
                alt="Você"
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                  placeholder="Escreva um comentário…"
                  className="flex-1 bg-[#0B0B0B] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="bg-[#E50914] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#C4070F] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
