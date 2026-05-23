// types/result.ts
export interface ResultData {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  before: {
    title: string | null;
    description: string | null;
    weight: number | null;
    muscle_mass: number | null;
    fat_percentage: number | null;
    image_url: string | null;
  };
  
  after: {
    title: string | null;
    description: string | null;
    weight: number | null;
    muscle_mass: number | null;
    fat_percentage: number | null;
    image_url: string | null;
  };
  
  progress: {
    weight: {
      before: number;
      after: number;
      change: number;
      percentage: number;
      status: 'loss' | 'gain' | 'stable';
    } | null;
    muscle_mass: {
      before: number;
      after: number;
      change: number;
      percentage: number;
      status: 'loss' | 'gain' | 'stable';
    } | null;
    fat_percentage: {
      before: number;
      after: number;
      change: number;
      percentage: number;
      status: 'loss' | 'gain' | 'stable';
    } | null;
  };
  
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}