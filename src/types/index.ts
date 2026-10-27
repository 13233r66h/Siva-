export type UnitSystem = 'metric' | 'imperial';
export type FitnessGoal = 'muscle_gain' | 'fat_loss' | 'strength' | 'general_fitness';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type EquipmentType = 'full_gym' | 'dumbbells' | 'bodyweight';

export type MuscleGroup = 
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'legs'
  | 'glutes'
  | 'abs'
  | 'cardio'
  | 'full_body';

export type EquipmentCategory = 
  | 'barbell'
  | 'dumbbell'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'kettlebell'
  | 'bands'
  | 'other';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  age: number;
  height: number; // in cm
  heightUnit: 'cm' | 'in';
  currentWeight: number; // in kg
  targetWeight: number; // in kg
  weightUnit: 'kg' | 'lbs';
  fitnessGoal: FitnessGoal;
  experienceLevel: ExperienceLevel;
  daysPerWeek: number;
  equipment: EquipmentType;
  unitSystem: UnitSystem;
  theme: 'dark' | 'light';
  remindersEnabled: boolean;
  reminderTime: string; // e.g. "07:30"
  reminderDays: number[]; // 0 = Sun, 1 = Mon ...
  createdAt: string;
  onboardingCompleted: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: MuscleGroup;
  secondaryMuscles: string[];
  equipment: EquipmentCategory;
  difficulty: ExperienceLevel;
  instructions: string[];
  mistakesToAvoid: string[];
  defaultSets: number;
  defaultReps: string;
  defaultRestSeconds: number;
  imageUrl?: string;
  category: 'compound' | 'isolation' | 'cardio';
}

export interface WorkoutSet {
  id: string;
  setNumber: number;
  weight: number; // stored in kg, converted in UI
  reps: number;
  completed: boolean;
  isWarmup?: boolean;
}

export interface ActiveWorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  targetMuscle: MuscleGroup;
  sets: WorkoutSet[];
  notes?: string;
}

export interface WorkoutRoutineExercise {
  exerciseId: string;
  sets: number;
  targetReps: string;
  restSeconds: number;
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  description: string;
  category: 'push_pull_legs' | 'upper_lower' | 'full_body' | 'muscle_gain' | 'fat_loss' | 'beginner' | 'home';
  targetGoal: FitnessGoal;
  difficulty: ExperienceLevel;
  durationMinutes: number;
  equipmentNeeded: EquipmentType;
  exercises: WorkoutRoutineExercise[];
  isCustom?: boolean;
  isFavorite?: boolean;
  imageBanner?: string;
}

export interface WorkoutSession {
  id: string;
  routineId?: string;
  routineName: string;
  startTime: string; // ISO date
  endTime: string; // ISO date
  durationSeconds: number;
  exercises: ActiveWorkoutExercise[];
  totalVolume: number; // total kg lifted
  totalSetsCompleted: number;
  notes?: string;
  rating?: number; // 1-5
  prCount?: number;
}

export interface WeightEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number; // in kg
  note?: string;
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  maxWeight: number; // kg
  reps: number;
  dateAchieved: string;
  estimatedOneRepMax: number;
}

export interface ProgressPhoto {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number;
  note?: string;
  photoDataUrl: string;
  type: 'front' | 'side' | 'back';
}
