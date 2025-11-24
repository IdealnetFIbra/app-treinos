import { supabase } from '@/lib/supabase';
import { Video } from '@/lib/database.types';

export async function getAllVideos(): Promise<Video[]> {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar vídeos:', error);
    return [];
  }

  return data || [];
}

export async function getVideosByCategory(category: string): Promise<Video[]> {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar vídeos por categoria:', error);
    return [];
  }

  return data || [];
}

export async function getVideoById(id: string): Promise<Video | null> {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar vídeo:', error);
    return null;
  }

  return data;
}

export async function incrementVideoViews(videoId: string): Promise<void> {
  const { error } = await supabase.rpc('increment_video_views', {
    video_id: videoId
  });

  if (error) {
    console.error('Erro ao incrementar visualizações:', error);
  }
}

export async function searchVideos(query: string): Promise<Video[]> {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar vídeos:', error);
    return [];
  }

  return data || [];
}
