import { supabase } from '@/lib/supabase';

export async function addToFavorites(userId: string, videoId: string): Promise<boolean> {
  const { error } = await supabase
    .from('favorites')
    .insert({
      user_id: userId,
      video_id: videoId
    });

  if (error) {
    console.error('Erro ao adicionar favorito:', error);
    return false;
  }

  return true;
}

export async function removeFromFavorites(userId: string, videoId: string): Promise<boolean> {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('video_id', videoId);

  if (error) {
    console.error('Erro ao remover favorito:', error);
    return false;
  }

  return true;
}

export async function isFavorite(userId: string, videoId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('video_id', videoId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Erro ao verificar favorito:', error);
    return false;
  }

  return !!data;
}

export async function getFavorites(userId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      *,
      videos (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar favoritos:', error);
    return [];
  }

  return data || [];
}
