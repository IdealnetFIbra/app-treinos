import { supabase } from './supabase';

export interface Post {
  id: string;
  user_id: string;
  type: 'checkin' | 'resultado' | 'nutricao' | 'aviso' | 'momento';
  caption: string;
  image_url?: string;
  image_secondary_url?: string;
  nutrition_protein?: string;
  nutrition_carbs?: string;
  nutrition_kcal?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    email: string;
    user_metadata: {
      name: string;
      avatar_url: string;
      unit: string;
    };
  };
  likes_count?: number;
  comments_count?: number;
  user_has_liked?: boolean;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    email: string;
    user_metadata: {
      name: string;
      avatar_url: string;
      unit: string;
    };
  };
}

// Cache de usuários para evitar múltiplas chamadas
const userCache = new Map<string, any>();

// Função auxiliar para buscar dados do usuário de uma tabela profiles
async function getUserData(userId: string) {
  // Verificar cache primeiro
  if (userCache.has(userId)) {
    return userCache.get(userId);
  }

  try {
    // Buscar usuário atual autenticado
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    // Se for o próprio usuário logado, usar seus dados
    if (currentUser && currentUser.id === userId) {
      const userData = {
        id: currentUser.id,
        email: currentUser.email || '',
        user_metadata: {
          name: currentUser.user_metadata?.name || currentUser.user_metadata?.full_name || 'Usuário',
          avatar_url: currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
          unit: currentUser.user_metadata?.unit || 'Simplifit'
        }
      };
      
      console.log('✅ [getUserData] Dados do usuário atual (logado):', userData);
      userCache.set(userId, userData);
      return userData;
    }

    // Para outros usuários, tentar buscar da tabela profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (!profileError && profileData) {
      const userData = {
        id: profileData.id,
        email: '',
        user_metadata: {
          name: profileData.name || 'Usuário',
          avatar_url: profileData.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
          unit: profileData.unit || 'Simplifit'
        }
      };
      
      console.log('✅ [getUserData] Dados do usuário buscado da tabela profiles:', userData);
      userCache.set(userId, userData);
      return userData;
    }

    console.warn('⚠️ [getUserData] Perfil não encontrado na tabela profiles para userId:', userId);
    
    // Retornar dados padrão se não encontrar
    const defaultData = {
      id: userId,
      email: '',
      user_metadata: {
        name: 'Usuário',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        unit: 'Simplifit'
      }
    };
    userCache.set(userId, defaultData);
    return defaultData;
  } catch (error) {
    console.error('❌ [getUserData] Erro ao buscar usuário:', error);
    // Retornar dados padrão em caso de erro
    const defaultData = {
      id: userId,
      email: '',
      user_metadata: {
        name: 'Usuário',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        unit: 'Simplifit'
      }
    };
    userCache.set(userId, defaultData);
    return defaultData;
  }
}

// Criar novo post
export async function createPost(data: {
  caption: string;
  type: 'checkin' | 'resultado' | 'nutricao' | 'aviso' | 'momento';
  image_url?: string;
  image_secondary_url?: string;
  nutrition_protein?: string;
  nutrition_carbs?: string;
  nutrition_kcal?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  // Garantir que o perfil do usuário existe na tabela profiles
  await ensureUserProfile(user);

  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      caption: data.caption,
      type: data.type,
      image_url: data.image_url,
      image_secondary_url: data.image_secondary_url,
      nutrition_protein: data.nutrition_protein,
      nutrition_carbs: data.nutrition_carbs,
      nutrition_kcal: data.nutrition_kcal,
    })
    .select()
    .single();

  if (error) throw error;
  return post;
}

// Função auxiliar para garantir que o perfil do usuário existe
async function ensureUserProfile(user: any) {
  try {
    // Verificar se perfil já existe
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!existingProfile) {
      // Criar perfil se não existir
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          name: user.user_metadata?.name || user.user_metadata?.full_name || 'Usuário',
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
          unit: user.user_metadata?.unit || 'Simplifit'
        });

      if (insertError) {
        console.warn('⚠️ [ensureUserProfile] Erro ao criar perfil:', insertError);
      } else {
        console.log('✅ [ensureUserProfile] Perfil criado com sucesso para:', user.id);
      }
    }
  } catch (error) {
    console.warn('⚠️ [ensureUserProfile] Erro ao verificar/criar perfil:', error);
  }
}

// Deletar post
export async function deletePost(postId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  // Verificar se o post pertence ao usuário
  const { data: post } = await supabase
    .from('posts')
    .select('user_id')
    .eq('id', postId)
    .single();

  if (!post || post.user_id !== user.id) {
    throw new Error('Você não tem permissão para deletar este post');
  }

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);

  if (error) throw error;
}

// Buscar posts com contagem de likes e comentários
export async function getPosts() {
  const { data: { user } } = await supabase.auth.getUser();
  
  // Buscar posts
  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (postsError) throw postsError;

  // Para cada post, buscar dados do usuário, contagem de likes e comentários
  const postsWithCounts = await Promise.all(
    (posts || []).map(async (post) => {
      // Buscar dados do usuário
      const userData = await getUserData(post.user_id);

      // Contar likes
      const { count: likesCount } = await supabase
        .from('post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id);

      // Contar comentários
      const { count: commentsCount } = await supabase
        .from('post_comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id);

      // Verificar se usuário atual curtiu
      let userHasLiked = false;
      if (user) {
        const { data: like } = await supabase
          .from('post_likes')
          .select('id')
          .eq('post_id', post.id)
          .eq('user_id', user.id)
          .single();
        
        userHasLiked = !!like;
      }

      return {
        ...post,
        user: userData,
        likes_count: likesCount || 0,
        comments_count: commentsCount || 0,
        user_has_liked: userHasLiked,
      };
    })
  );

  return postsWithCounts;
}

// Buscar post específico
export async function getPost(postId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .single();

  if (error) throw error;

  // Buscar dados do usuário
  const userData = await getUserData(post.user_id);

  // Contar likes
  const { count: likesCount } = await supabase
    .from('post_likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', post.id);

  // Contar comentários
  const { count: commentsCount } = await supabase
    .from('post_comments')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', post.id);

  // Verificar se usuário atual curtiu
  let userHasLiked = false;
  if (user) {
    const { data: like } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', post.id)
      .eq('user_id', user.id)
      .single();
    
    userHasLiked = !!like;
  }

  return {
    ...post,
    user: userData,
    likes_count: likesCount || 0,
    comments_count: commentsCount || 0,
    user_has_liked: userHasLiked,
  };
}

// Curtir post
export async function likePost(postId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  const { error } = await supabase
    .from('post_likes')
    .insert({
      post_id: postId,
      user_id: user.id,
    });

  if (error) throw error;
}

// Descurtir post
export async function unlikePost(postId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  const { error } = await supabase
    .from('post_likes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', user.id);

  if (error) throw error;
}

// Adicionar comentário
export async function addComment(postId: string, content: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  // Garantir que o perfil do usuário existe
  await ensureUserProfile(user);

  const { data: comment, error } = await supabase
    .from('post_comments')
    .insert({
      post_id: postId,
      user_id: user.id,
      content,
    })
    .select()
    .single();

  if (error) throw error;
  return comment;
}

// Buscar comentários de um post
export async function getPostComments(postId: string) {
  const { data: comments, error } = await supabase
    .from('post_comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  // Buscar dados dos usuários para cada comentário
  const commentsWithUsers = await Promise.all(
    (comments || []).map(async (comment) => {
      const userData = await getUserData(comment.user_id);
      
      return {
        ...comment,
        user: userData,
      };
    })
  );

  return commentsWithUsers as PostComment[];
}

// Deletar comentário
export async function deleteComment(commentId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  // Verificar se o comentário pertence ao usuário
  const { data: comment } = await supabase
    .from('post_comments')
    .select('user_id')
    .eq('id', commentId)
    .single();

  if (!comment || comment.user_id !== user.id) {
    throw new Error('Você não tem permissão para deletar este comentário');
  }

  const { error } = await supabase
    .from('post_comments')
    .delete()
    .eq('id', commentId);

  if (error) throw error;
}
