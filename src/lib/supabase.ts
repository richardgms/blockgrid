import { createClient } from '@supabase/supabase-js';
import { ScoreEntry, LeaderboardEntry } from '@/types/game';
import { generateDeviceHash } from '@/utils/gameUtils';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Score management functions
export const submitScore = async (playerName: string, score: number): Promise<ScoreEntry | null> => {
  try {
    const deviceHash = generateDeviceHash();
    
    const { data, error } = await supabase
      .from('scores')
      .insert([
        {
          player_name: playerName,
          score: score,
          device_hash: deviceHash,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error submitting score:', error);
      return null;
    }

    return {
      id: data.id,
      playerName: data.player_name,
      score: data.score,
      deviceHash: data.device_hash,
      createdAt: new Date(data.created_at),
    };
  } catch (error) {
    console.error('Error submitting score:', error);
    return null;
  }
};

export const getTopScores = async (limit: number = 10): Promise<LeaderboardEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .order('score', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching top scores:', error);
      return [];
    }

    const deviceHash = generateDeviceHash();
    
    return data.map((score, index) => ({
      rank: index + 1,
      playerName: score.player_name,
      score: score.score,
      createdAt: new Date(score.created_at),
      isCurrentPlayer: score.device_hash === deviceHash,
    }));
  } catch (error) {
    console.error('Error fetching top scores:', error);
    return [];
  }
};

export const getUserBestScore = async (): Promise<number> => {
  try {
    const deviceHash = generateDeviceHash();
    
    const { data, error } = await supabase
      .from('scores')
      .select('score')
      .eq('device_hash', deviceHash)
      .order('score', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // No scores found for this device
      return 0;
    }

    return data.score;
  } catch (error) {
    console.error('Error fetching user best score:', error);
    return 0;
  }
};

export const getUserScoreHistory = async (limit: number = 20): Promise<ScoreEntry[]> => {
  try {
    const deviceHash = generateDeviceHash();
    
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('device_hash', deviceHash)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching user score history:', error);
      return [];
    }

    return data.map((score) => ({
      id: score.id,
      playerName: score.player_name,
      score: score.score,
      deviceHash: score.device_hash,
      createdAt: new Date(score.created_at),
    }));
  } catch (error) {
    console.error('Error fetching user score history:', error);
    return [];
  }
};

// Utility function to check if Supabase is properly configured
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('scores')
      .select('count(*)')
      .limit(1);

    return !error;
  } catch (error) {
    console.error('Supabase connection check failed:', error);
    return false;
  }
};

// Types for the database schema
export interface Database {
  public: {
    Tables: {
      scores: {
        Row: {
          id: string;
          player_name: string;
          score: number;
          device_hash: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          player_name: string;
          score: number;
          device_hash: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          player_name?: string;
          score?: number;
          device_hash?: string;
          created_at?: string;
        };
      };
    };
  };
} 