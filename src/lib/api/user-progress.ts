import { supabase } from '@/lib/supabase';
import { UserProgress } from '@/lib/database.types';

export async function getUserProgress(userId: string, videoId: string): Promise<UserProgress | null> {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('video_id', videoId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Erro ao buscar progresso:', error);
    return null;
  }

  return data;
}

export async function updateUserProgress(
  userId: string,
  videoId: string,
  watchedDuration: number,
  completed: boolean
): Promise<void> {
  const { error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      video_id: videoId,
      watched_duration: watchedDuration,
      completed,
      last_watched_at: new Date().toISOString()
    });

  if (error) {
    console.error('Erro ao atualizar progresso:', error);
  }
}

export async function getContinueWatching(userId: string) {
  const { data, error } = await supabase
    .from('user_progress')
    .select(`
      *,
      videos (*)
    `)
    .eq('user_id', userId)
    .eq('completed', false)
    .order('last_watched_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Erro ao buscar vídeos para continuar:', error);
    return [];
  }

  return data || [];
}

export async function getCompletedVideos(userId: string) {
  const { data, error } = await supabase
    .from('user_progress')
    .select(`
      *,
      videos (*)
    `)
    .eq('user_id', userId)
    .eq('completed', true)
    .order('last_watched_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar vídeos completos:', error);
    return [];
  }

  return data || [];
}
