// types/training-program.ts
export interface Exercise {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
}

export interface ProgramExercise {
  id: number;
  sets: number | null;
  reps: number | null;
  rest_seconds: number | null;
  exercise: Exercise;
}

export interface ProgramDay {
  id: number;
  day_number: number;
  title: string;
  exercises: ProgramExercise[];
}

export interface TrainingProgram {
  id: number;
  title: string;
  description: string | null;
  active: boolean;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
  };
  days: ProgramDay[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
}