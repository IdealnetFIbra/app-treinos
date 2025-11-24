export interface Video {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  category: string | null;
  duration_minutes: number | null;
  views: number | null;
  created_at: string | null;
}

export interface UserProgress {
  id: string;
  user_id: string;
  video_id: string;
  watched_duration: number;
  completed: boolean;
  last_watched_at: string;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  video_id: string;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  fitness_level: string | null;
  goals: string[] | null;
  created_at: string;
  updated_at: string;
}
