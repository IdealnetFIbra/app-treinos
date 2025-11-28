import { supabase } from './supabase';

export interface Post {
  id: string;
  user_id: string;
  type: 'checkin' | 'resultado' | 'nutricao' | 'aviso' | 'momento';
  caption: string;
  image_url?: string;
  image_secondary_url?: string;
  is_video: boolean;
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
    };
  };
}

// Criar novo post
export async function createPost(data: {
  caption: string;
  type: 'checkin' | 'resultado' | 'nutricao' | 'aviso' | 'momento';
  image_url?: string;
  image_secondary_url?: string;
  is_video?: boolean;
  nutrition_protein?: string;
  nutrition_carbs?: string;
  nutrition_kcal?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      caption: data.caption,
      type: data.type,
      image_url: data.image_url,
      image_secondary_url: data.image_secondary_url,
      is_video: data.is_video || false,
      nutrition_protein: data.nutrition_protein,
      nutrition_carbs: data.nutrition_carbs,
      nutrition_kcal: data.nutrition_kcal,
    })
    .select()
    .single();

  if (error) throw error;
  return post;
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
    .select(`
      *,
      user:user_id (
        id,
        email,
        user_metadata
      )
    `)
    .order('created_at', { ascending: false });

  if (postsError) throw postsError;

  // Para cada post, buscar contagem de likes e comentários
  const postsWithCounts = await Promise.all(
    (posts || []).map(async (post) => {
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
    .select(`
      *,
      user:user_id (
        id,
        email,
        user_metadata
      )
    `)
    .eq('id', postId)
    .single();

  if (error) throw error;

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
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single();

  if (error) throw error;
}

// Adicionar comentário
export async function addComment(postId: string, content: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

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
    .select(`
      *,
      user:user_id (
        id,
        email,
        user_metadata
      )
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return comments as PostComment[];
}
