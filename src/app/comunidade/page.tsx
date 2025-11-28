"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, MessageCircle, Share2, Image as ImageIcon, Video, Users, Target, Dumbbell, X, ArrowLeft, MoreVertical, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import ProfileMenu from "@/components/ProfileMenu";
import { getPosts, createPost, likePost, unlikePost, deletePost, Post, getPostComments, addComment, deleteComment, PostComment } from "@/lib/posts";

interface PostDisplay {
  id: string;
  type: "checkin" | "resultado" | "nutricao" | "aviso" | "momento";
  user: {
    name: string;
    avatar: string;
    unit: string;
  };
  user_id?: string;
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
  userHasLiked?: boolean;
}

export default function ComunidadePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { theme } = useTheme();
  const [newPostCaption, setNewPostCaption] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [posts, setPosts] = useState<PostDisplay[]>([]);
  const [shareSheetOpen, setShareSheetOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [deleteMenuOpen, setDeleteMenuOpen] = useState<string | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [selectedPostForComments, setSelectedPostForComments] = useState<PostDisplay | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  useEffect(() => {
    console.log("🔍 [Comunidade] Verificando autenticação. isAuthenticated:", isAuthenticated);
    if (!isAuthenticated) {
      console.log("❌ [Comunidade] Usuário não autenticado. Redirecionando para /login");
      router.push("/login");
    } else {
      console.log("✅ [Comunidade] Usuário autenticado. Carregando feed");
      console.log("👤 [Comunidade] Dados do usuário:", user);
      loadPosts();
    }
  }, [isAuthenticated, router, user]);

  // Fechar menu de delete ao clicar fora
  useEffect(() => {
    const handleClickOutside = () => {
      if (deleteMenuOpen) {
        setDeleteMenuOpen(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [deleteMenuOpen]);

  // Carregar comentários quando modal abre
  useEffect(() => {
    if (commentsModalOpen && selectedPostForComments) {
      loadComments(selectedPostForComments.id);
    }
  }, [commentsModalOpen, selectedPostForComments]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      console.log("📥 [Comunidade] Carregando posts do Supabase...");
      const data = await getPosts();
      
      // Converter formato do Supabase para formato do componente
      const formattedPosts: PostDisplay[] = data.map((post: Post) => ({
        id: post.id,
        type: post.type,
        user_id: post.user_id,
        user: {
          name: post.user?.user_metadata?.name || "Usuário",
          avatar: post.user?.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
          unit: post.user?.user_metadata?.unit || "Simplifit"
        },
        timestamp: formatTimestamp(post.created_at),
        image: post.image_url || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
        imageSecondary: post.image_secondary_url,
        caption: post.caption,
        likes: post.likes_count || 0,
        comments: post.comments_count || 0,
        nutrition: post.nutrition_protein ? {
          protein: post.nutrition_protein,
          carbs: post.nutrition_carbs || "",
          kcal: post.nutrition_kcal || ""
        } : undefined,
        isVideo: post.is_video,
        userHasLiked: post.user_has_liked
      }));

      setPosts(formattedPosts);
      console.log("✅ [Comunidade] Posts carregados:", formattedPosts.length);
    } catch (error) {
      console.error("❌ [Comunidade] Erro ao carregar posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (postId: string) => {
    try {
      setLoadingComments(true);
      console.log("💬 [Comunidade] Carregando comentários do post:", postId);
      const data = await getPostComments(postId);
      setComments(data);
      console.log("✅ [Comunidade] Comentários carregados:", data.length);
    } catch (error) {
      console.error("❌ [Comunidade] Erro ao carregar comentários:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diffMs = now.getTime() - postDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "agora";
    if (diffMins < 60) return `há ${diffMins}min`;
    if (diffHours < 24) return `há ${diffHours}h`;
    if (diffDays === 1) return "há 1 dia";
    if (diffDays < 7) return `há ${diffDays} dias`;
    return postDate.toLocaleDateString('pt-BR');
  };

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

  const handlePublish = async () => {
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

    try {
      setPublishing(true);
      console.log("📤 [Comunidade] Enviando post para Supabase...");
      
      await createPost({
        caption: newPostCaption,
        type: mediaType === "video" ? "momento" : "checkin",
        image_url: selectedMedia || undefined,
      });

      console.log("✅ [Comunidade] Post publicado com sucesso!");
      
      // Limpar formulário
      setNewPostCaption("");
      setSelectedMedia(null);
      setMediaType(null);
      
      // Recarregar posts
      await loadPosts();
      console.log("🔄 [Comunidade] Feed atualizado");
    } catch (error) {
      console.error("❌ [Comunidade] Erro ao publicar post:", error);
      alert("Erro ao publicar post. Tente novamente.");
    } finally {
      setPublishing(false);
    }
  };

  const handleLike = async (postId: string) => {
    console.log("❤️ [Comunidade] Tentando curtir post:", postId);
    if (!isAuthenticated) {
      console.log("❌ [Comunidade] Usuário não autenticado. Bloqueando curtida");
      alert("Você precisa estar logado para curtir");
      return;
    }

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      // Atualizar UI otimisticamente
      setPosts(posts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            likes: p.userHasLiked ? p.likes - 1 : p.likes + 1,
            userHasLiked: !p.userHasLiked
          };
        }
        return p;
      }));

      // Enviar para Supabase
      if (post.userHasLiked) {
        await unlikePost(postId);
        console.log("💔 [Comunidade] Post descurtido");
      } else {
        await likePost(postId);
        console.log("❤️ [Comunidade] Post curtido");
      }
    } catch (error) {
      console.error("❌ [Comunidade] Erro ao curtir post:", error);
      // Reverter mudança em caso de erro
      await loadPosts();
    }
  };

  const handleOpenCommentsModal = (post: PostDisplay) => {
    console.log("💬 [Comunidade] Abrindo modal de comentários para post:", post.id);
    setSelectedPostForComments(post);
    setCommentsModalOpen(true);
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedPostForComments) return;

    try {
      setAddingComment(true);
      console.log("💬 [Comunidade] Adicionando comentário...");
      
      await addComment(selectedPostForComments.id, newComment);
      
      console.log("✅ [Comunidade] Comentário adicionado com sucesso!");
      
      // Limpar input
      setNewComment("");
      
      // Recarregar comentários
      await loadComments(selectedPostForComments.id);
      
      // Atualizar contagem de comentários no post
      setPosts(posts.map(p => {
        if (p.id === selectedPostForComments.id) {
          return { ...p, comments: p.comments + 1 };
        }
        return p;
      }));
      
      // Atualizar post selecionado
      setSelectedPostForComments({
        ...selectedPostForComments,
        comments: selectedPostForComments.comments + 1
      });
    } catch (error) {
      console.error("❌ [Comunidade] Erro ao adicionar comentário:", error);
      alert("Erro ao adicionar comentário. Tente novamente.");
    } finally {
      setAddingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!selectedPostForComments) return;

    const confirmDelete = window.confirm("Tem certeza que deseja excluir este comentário?");
    if (!confirmDelete) return;

    try {
      setDeletingCommentId(commentId);
      console.log("🗑️ [Comunidade] Deletando comentário...");
      
      await deleteComment(commentId);
      
      console.log("✅ [Comunidade] Comentário deletado com sucesso!");
      
      // Recarregar comentários
      await loadComments(selectedPostForComments.id);
      
      // Atualizar contagem de comentários no post
      setPosts(posts.map(p => {
        if (p.id === selectedPostForComments.id) {
          return { ...p, comments: Math.max(0, p.comments - 1) };
        }
        return p;
      }));
      
      // Atualizar post selecionado
      setSelectedPostForComments({
        ...selectedPostForComments,
        comments: Math.max(0, selectedPostForComments.comments - 1)
      });
    } catch (error) {
      console.error("❌ [Comunidade] Erro ao deletar comentário:", error);
      alert("Erro ao deletar comentário. Tente novamente.");
    } finally {
      setDeletingCommentId(null);
    }
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

  const handleDeletePost = async (postId: string) => {
    console.log("🗑️ [Comunidade] Tentando deletar post:", postId);
    if (!isAuthenticated) {
      console.log("❌ [Comunidade] Usuário não autenticado. Bloqueando exclusão");
      alert("Você precisa estar logado para deletar");
      return;
    }

    const confirmDelete = window.confirm("Tem certeza que deseja excluir esta publicação?");
    if (!confirmDelete) return;

    try {
      setDeletingPostId(postId);
      console.log("🗑️ [Comunidade] Deletando post do Supabase...");
      
      await deletePost(postId);
      
      console.log("✅ [Comunidade] Post deletado com sucesso!");
      
      // Fechar menu
      setDeleteMenuOpen(null);
      
      // Recarregar posts
      await loadPosts();
      console.log("🔄 [Comunidade] Feed atualizado");
    } catch (error) {
      console.error("❌ [Comunidade] Erro ao deletar post:", error);
      alert("Erro ao deletar post. Tente novamente.");
    } finally {
      setDeletingPostId(null);
    }
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
                      disabled={!newPostCaption.trim() || publishing}
                      className="bg-[#E50914] text-white px-5 py-1.5 rounded-full text-sm font-semibold hover:bg-[#C4070F] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {publishing ? "Publicando..." : "Publicar"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className={`inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-current border-r-transparent ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}></div>
                <p className={`mt-4 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                  Carregando posts...
                </p>
              </div>
            )}

            {/* Feed de Posts */}
            {!loading && (
              <div className="space-y-6">
                {posts.length === 0 ? (
                  <div className={`text-center py-12 rounded-xl ${
                    theme === "light" ? "bg-white" : "bg-[#1A1A1A]"
                  }`}>
                    <p className={`text-lg ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                      Nenhum post ainda. Seja o primeiro a compartilhar!
                    </p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <div
                      key={post.id}
                      className={`rounded-xl overflow-hidden shadow-lg ${
                        post.type === "aviso" 
                          ? theme === "light"
                            ? "bg-gradient-to-br from-red-50 to-white"
                            : "bg-gradient-to-br from-[#E50914]/20 to-[#1A1A1A]"
                          : theme === "light"
                            ? "bg-white"
                            : "bg-[#1A1A1A]"
                      }`}
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
                        
                        {/* Menu de 3 pontinhos - apenas se for post do usuário */}
                        {user?.id === post.user_id && (
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteMenuOpen(deleteMenuOpen === post.id ? null : post.id);
                              }}
                              className={`p-2 rounded-full transition ${
                                theme === "light" 
                                  ? "hover:bg-gray-100 text-gray-600" 
                                  : "hover:bg-gray-800 text-gray-400"
                              }`}
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>
                            
                            {/* Menu dropdown */}
                            {deleteMenuOpen === post.id && (
                              <div 
                                className={`absolute right-0 top-full mt-1 rounded-lg shadow-lg z-10 overflow-hidden ${
                                  theme === "light" ? "bg-white" : "bg-[#1A1A1A]"
                                }`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeletePost(post.id);
                                  }}
                                  disabled={deletingPostId === post.id}
                                  className={`flex items-center gap-2 px-4 py-3 w-full text-left transition ${
                                    theme === "light"
                                      ? "hover:bg-gray-50 text-red-600"
                                      : "hover:bg-black text-red-500"
                                  } disabled:opacity-50`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span className="text-sm font-medium whitespace-nowrap">
                                    {deletingPostId === post.id ? "Excluindo..." : "Excluir publicação"}
                                  </span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
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
                              post.userHasLiked
                                ? "text-[#E50914]"
                                : theme === "light"
                                  ? "text-gray-600 hover:text-[#E50914]"
                                  : "text-gray-400 hover:text-[#E50914]"
                            }`}
                          >
                            <Heart className={`w-6 h-6 ${post.userHasLiked ? "fill-current" : ""}`} />
                            <span className="text-sm font-semibold">{post.likes}</span>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenCommentsModal(post);
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
                            handleOpenCommentsModal(post);
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
                  ))
                )}
              </div>
            )}
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

      {/* Modal de Comentários */}
      {commentsModalOpen && selectedPostForComments && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setCommentsModalOpen(false)}
        >
          <div 
            className={`w-full max-w-2xl max-h-[80vh] rounded-3xl overflow-hidden ${
              theme === "light" ? "bg-white" : "bg-[#1A1A1A]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <div className={`flex justify-between items-center p-4 border-b ${
              theme === "light" ? "border-gray-200" : "border-gray-800"
            }`}>
              <h3 className={`text-lg font-bold ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}>
                Comentários
              </h3>
              <button
                onClick={() => setCommentsModalOpen(false)}
                className={`p-1 rounded-full transition ${
                  theme === "light" 
                    ? "hover:bg-gray-100 text-gray-600" 
                    : "hover:bg-gray-800 text-gray-400"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="overflow-y-auto max-h-[60vh] p-4">
              {/* Post Original */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={selectedPostForComments.user.avatar}
                    alt={selectedPostForComments.user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className={`font-semibold ${
                      theme === "light" ? "text-gray-900" : "text-white"
                    }`}>
                      {selectedPostForComments.user.name}
                    </h4>
                    <p className={`text-xs ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}>
                      {selectedPostForComments.user.unit} • {selectedPostForComments.timestamp}
                    </p>
                  </div>
                </div>
                <p className={`text-sm ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}>
                  {selectedPostForComments.caption}
                </p>
              </div>

              {/* Lista de Comentários */}
              <div className={`border-t pt-4 ${
                theme === "light" ? "border-gray-200" : "border-gray-800"
              }`}>
                {loadingComments ? (
                  <div className="text-center py-8">
                    <div className={`inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-current border-r-transparent ${
                      theme === "light" ? "text-gray-900" : "text-white"
                    }`}></div>
                  </div>
                ) : comments.length === 0 ? (
                  <p className={`text-center py-8 ${
                    theme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}>
                    Nenhum comentário ainda. Seja o primeiro a comentar!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <img
                          src={comment.user?.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"}
                          alt={comment.user?.user_metadata?.name || "Usuário"}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h5 className={`font-semibold text-sm ${
                                theme === "light" ? "text-gray-900" : "text-white"
                              }`}>
                                {comment.user?.user_metadata?.name || "Usuário"}
                              </h5>
                              <p className={`text-xs ${
                                theme === "light" ? "text-gray-600" : "text-gray-400"
                              }`}>
                                {comment.user?.user_metadata?.unit || "Simplifit"} • {formatTimestamp(comment.created_at)}
                              </p>
                            </div>
                            {user?.id === comment.user_id && (
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                disabled={deletingCommentId === comment.id}
                                className={`p-1 rounded-full transition ${
                                  theme === "light"
                                    ? "hover:bg-gray-100 text-gray-500"
                                    : "hover:bg-gray-800 text-gray-400"
                                } disabled:opacity-50`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <p className={`text-sm mt-1 ${
                            theme === "light" ? "text-gray-900" : "text-white"
                          }`}>
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Input de Comentário */}
            <div className={`p-4 border-t ${
              theme === "light" ? "border-gray-200" : "border-gray-800"
            }`}>
              <div className="flex gap-3">
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"}
                  alt="Seu avatar"
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !addingComment && newComment.trim()) {
                      handleAddComment();
                    }
                  }}
                  placeholder="Adicione um comentário..."
                  disabled={addingComment}
                  className={`flex-1 bg-transparent border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E50914] ${
                    theme === "light" 
                      ? "border-gray-300 text-gray-900 placeholder-gray-400" 
                      : "border-gray-700 text-white placeholder-gray-500"
                  } disabled:opacity-50`}
                />
                <button 
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || addingComment}
                  className="bg-[#E50914] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#C4070F] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingComment ? "..." : "Enviar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
