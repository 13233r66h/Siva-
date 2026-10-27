import { WorkoutRoutine } from '../types';

export const DEFAULT_ROUTINES: WorkoutRoutine[] = [
  // 1. PUSH / PULL / LEGS - Push Day
  {
    id: 'ppl-push-a',
    name: 'Push Day A — Chest, Shoulders & Triceps',
    description: 'High-volume pressing workout focused on building upper-body pressing strength and chest development.',
    category: 'push_pull_legs',
    targetGoal: 'muscle_gain',
    difficulty: 'intermediate',
    durationMinutes: 55,
    equipmentNeeded: 'full_gym',
    isFavorite: true,
    exercises: [
      { exerciseId: 'barbell-bench-press', sets: 4, targetReps: '6-8', restSeconds: 120 },
      { exerciseId: 'incline-dumbbell-press', sets: 3, targetReps: '8-10', restSeconds: 90 },
      { exerciseId: 'overhead-press', sets: 3, targetReps: '8-10', restSeconds: 90 },
      { exerciseId: 'dumbbell-lateral-raise', sets: 4, targetReps: '12-15', restSeconds: 60 },
      { exerciseId: 'triceps-rope-pushdown', sets: 3, targetReps: '10-12', restSeconds: 60 }
    ]
  },
  // 2. PUSH / PULL / LEGS - Pull Day
  {
    id: 'ppl-pull-a',
    name: 'Pull Day A — Back & Biceps',
    description: 'Complete pulling routine targeting lat width, mid-back thickness, and bicep peaks.',
    category: 'push_pull_legs',
    targetGoal: 'muscle_gain',
    difficulty: 'intermediate',
    durationMinutes: 50,
    equipmentNeeded: 'full_gym',
    isFavorite: true,
    exercises: [
      { exerciseId: 'barbell-deadlift', sets: 3, targetReps: '5', restSeconds: 150 },
      { exerciseId: 'pull-up', sets: 4, targetReps: '6-10', restSeconds: 90 },
      { exerciseId: 'barbell-bent-over-row', sets: 3, targetReps: '8-10', restSeconds: 90 },
      { exerciseId: 'cable-face-pull', sets: 3, targetReps: '15-20', restSeconds: 60 },
      { exerciseId: 'barbell-bicep-curl', sets: 3, targetReps: '10-12', restSeconds: 60 }
    ]
  },
  // 3. PUSH / PULL / LEGS - Legs Day
  {
    id: 'ppl-legs-a',
    name: 'Legs & Core Day A',
    description: 'Quad-dominant lower body power session paired with core stabilization.',
    category: 'push_pull_legs',
    targetGoal: 'strength',
    difficulty: 'intermediate',
    durationMinutes: 55,
    equipmentNeeded: 'full_gym',
    isFavorite: true,
    exercises: [
      { exerciseId: 'barbell-back-squat', sets: 4, targetReps: '6-8', restSeconds: 120 },
      { exerciseId: 'romanian-deadlift', sets: 3, targetReps: '8-10', restSeconds: 90 },
      { exerciseId: 'walking-dumbbell-lunges', sets: 3, targetReps: '12 steps', restSeconds: 75 },
      { exerciseId: 'standing-calf-raise', sets: 4, targetReps: '12-15', restSeconds: 60 },
      { exerciseId: 'hanging-leg-raise', sets: 3, targetReps: '12-15', restSeconds: 60 }
    ]
  },
  // 4. UPPER BODY / LOWER BODY - Upper
  {
    id: 'upper-lower-upper',
    name: 'Upper Body Power & Hypertrophy',
    description: 'Balanced upper body routine suitable for 4-day training splits.',
    category: 'upper_lower',
    targetGoal: 'muscle_gain',
    difficulty: 'intermediate',
    durationMinutes: 50,
    equipmentNeeded: 'full_gym',
    exercises: [
      { exerciseId: 'barbell-bench-press', sets: 4, targetReps: '8', restSeconds: 90 },
      { exerciseId: 'seated-cable-row', sets: 4, targetReps: '10', restSeconds: 75 },
      { exerciseId: 'overhead-press', sets: 3, targetReps: '8-10', restSeconds: 90 },
      { exerciseId: 'lat-pulldown', sets: 3, targetReps: '10-12', restSeconds: 75 },
      { exerciseId: 'incline-dumbbell-curl', sets: 3, targetReps: '12', restSeconds: 60 },
      { exerciseId: 'skull-crusher', sets: 3, targetReps: '12', restSeconds: 60 }
    ]
  },
  // 5. UPPER BODY / LOWER BODY - Lower
  {
    id: 'upper-lower-lower',
    name: 'Lower Body Strength & Posterior Chain',
    description: 'Squat and deadlift variations to build powerful legs and athletic hips.',
    category: 'upper_lower',
    targetGoal: 'strength',
    difficulty: 'intermediate',
    durationMinutes: 45,
    equipmentNeeded: 'full_gym',
    exercises: [
      { exerciseId: 'barbell-back-squat', sets: 4, targetReps: '6-8', restSeconds: 120 },
      { exerciseId: 'romanian-deadlift', sets: 3, targetReps: '8-10', restSeconds: 90 },
      { exerciseId: 'leg-press', sets: 3, targetReps: '10-12', restSeconds: 90 },
      { exerciseId: 'plank-hold', sets: 3, targetReps: '60s', restSeconds: 60 }
    ]
  },
  // 6. FULL BODY
  {
    id: 'full-body-foundation',
    name: 'Full Body Total Strength',
    description: 'Time-efficient full body routine hitting every major muscle group 3x weekly.',
    category: 'full_body',
    targetGoal: 'general_fitness',
    difficulty: 'intermediate',
    durationMinutes: 60,
    equipmentNeeded: 'full_gym',
    exercises: [
      { exerciseId: 'barbell-back-squat', sets: 3, targetReps: '8', restSeconds: 120 },
      { exerciseId: 'barbell-bench-press', sets: 3, targetReps: '8', restSeconds: 90 },
      { exerciseId: 'seated-cable-row', sets: 3, targetReps: '10', restSeconds: 75 },
      { exerciseId: 'dumbbell-lateral-raise', sets: 3, targetReps: '12-15', restSeconds: 60 },
      { exerciseId: 'hanging-leg-raise', sets: 3, targetReps: '12', restSeconds: 60 }
    ]
  },
  // 7. BEGINNER GYM ROUTINE
  {
    id: 'beginner-gym-starter',
    name: 'Beginner Gym Foundation Routine',
    description: 'Simple, approachable machine and basic free-weight exercises designed for beginners to learn form and build confidence.',
    category: 'beginner',
    targetGoal: 'general_fitness',
    difficulty: 'beginner',
    durationMinutes: 40,
    equipmentNeeded: 'full_gym',
    exercises: [
      { exerciseId: 'leg-press', sets: 3, targetReps: '10-12', restSeconds: 90 },
      { exerciseId: 'lat-pulldown', sets: 3, targetReps: '10-12', restSeconds: 75 },
      { exerciseId: 'cable-chest-flye', sets: 3, targetReps: '12', restSeconds: 60 },
      { exerciseId: 'dumbbell-lateral-raise', sets: 3, targetReps: '12-15', restSeconds: 60 },
      { exerciseId: 'plank-hold', sets: 3, targetReps: '30-45s', restSeconds: 60 }
    ]
  },
  // 8. FAT LOSS METABOLIC ROUTINE
  {
    id: 'fat-loss-metabolic',
    name: 'Fat Loss High-Density Circuit',
    description: 'Fast-paced compound routine designed to maximize caloric expenditure while preserving lean muscle mass.',
    category: 'fat_loss',
    targetGoal: 'fat_loss',
    difficulty: 'intermediate',
    durationMinutes: 40,
    equipmentNeeded: 'dumbbells',
    exercises: [
      { exerciseId: 'walking-dumbbell-lunges', sets: 3, targetReps: '14 steps', restSeconds: 45 },
      { exerciseId: 'push-up', sets: 3, targetReps: '15-20', restSeconds: 45 },
      { exerciseId: 'incline-dumbbell-press', sets: 3, targetReps: '10-12', restSeconds: 45 },
      { exerciseId: 'dumbbell-lateral-raise', sets: 3, targetReps: '15', restSeconds: 45 },
      { exerciseId: 'plank-hold', sets: 3, targetReps: '45s', restSeconds: 45 }
    ]
  },
  // 9. HOME BODYWEIGHT WORKOUT
  {
    id: 'home-bodyweight-shred',
    name: 'Home Bodyweight Calisthenics',
    description: 'Zero gym equipment needed. High-intensity bodyweight protocol to build strength, endurance, and core firmness anywhere.',
    category: 'home',
    targetGoal: 'general_fitness',
    difficulty: 'beginner',
    durationMinutes: 30,
    equipmentNeeded: 'bodyweight',
    exercises: [
      { exerciseId: 'push-up', sets: 4, targetReps: '12-18', restSeconds: 60 },
      { exerciseId: 'pull-up', sets: 3, targetReps: '6-10', restSeconds: 75 },
      { exerciseId: 'plank-hold', sets: 4, targetReps: '45-60s', restSeconds: 60 },
      { exerciseId: 'hanging-leg-raise', sets: 3, targetReps: '12', restSeconds: 60 }
    ]
  }
];
