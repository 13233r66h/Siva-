import { UserProfile, WorkoutRoutine } from '../types';

export interface RecommendationResult {
  primaryRoutine: WorkoutRoutine;
  reason: string;
  splitAdvice: string;
  restDayGuidance: string;
  techniqueTip: string;
  alternativeRoutines: WorkoutRoutine[];
}

export function generateRecommendations(
  profile: UserProfile,
  allRoutines: WorkoutRoutine[]
): RecommendationResult {
  const { fitnessGoal, experienceLevel, equipment, daysPerWeek } = profile;

  let filtered = allRoutines.filter(r => {
    // Equipment match
    if (equipment === 'bodyweight') return r.equipmentNeeded === 'bodyweight';
    if (equipment === 'dumbbells') return r.equipmentNeeded === 'dumbbells' || r.equipmentNeeded === 'bodyweight';
    return true; // full gym can do anything
  });

  if (filtered.length === 0) {
    filtered = allRoutines;
  }

  // Find best match based on goal & level
  let primary: WorkoutRoutine | undefined;

  if (experienceLevel === 'beginner') {
    primary = filtered.find(r => r.category === 'beginner') ||
      filtered.find(r => r.category === 'full_body');
  } else if (fitnessGoal === 'fat_loss') {
    primary = filtered.find(r => r.category === 'fat_loss') ||
      filtered.find(r => r.category === 'full_body');
  } else if (fitnessGoal === 'strength') {
    primary = filtered.find(r => r.category === 'push_pull_legs') ||
      filtered.find(r => r.category === 'upper_lower');
  } else {
    // Muscle gain / general
    if (daysPerWeek >= 4) {
      primary = filtered.find(r => r.category === 'push_pull_legs') ||
        filtered.find(r => r.category === 'upper_lower');
    } else {
      primary = filtered.find(r => r.category === 'full_body') ||
        filtered.find(r => r.category === 'upper_lower');
    }
  }

  if (!primary) {
    primary = filtered[0] || allRoutines[0];
  }

  const alternativeRoutines = filtered.filter(r => r.id !== primary!.id).slice(0, 3);

  // Split advice
  let splitAdvice = '';
  if (daysPerWeek <= 3) {
    splitAdvice = 'A 3-day full-body or alternating push/pull cadence provides maximum frequency per muscle group with ample 48-hour recovery windows.';
  } else if (daysPerWeek === 4) {
    splitAdvice = 'An Upper / Lower 4-day split (e.g., Mon/Tue, Thu/Fri) balances muscular overload with dedicated mid-week and weekend nervous system restoration.';
  } else {
    splitAdvice = 'A Push / Pull / Legs rotation allows each muscle group to be trained with high volume while antagonists recover.';
  }

  const reason = `Curated for your ${fitnessGoal.replace('_', ' ')} focus, ${experienceLevel} level, and ${equipment.replace('_', ' ')} setup over ${daysPerWeek} training days.`;

  const restDayGuidance = 'Muscles repair and grow during rest, not during lifting. On non-training days, prioritize 7–9 hours of sleep, 2–3 liters of water, and light active recovery (walking, foam rolling, dynamic hip openers).';

  const techniqueTip = 'Consistency and progressive overload beat maxing out every session. Always control the eccentric (lowering) phase for 2 seconds and maintain full active range of motion.';

  return {
    primaryRoutine: primary,
    reason,
    splitAdvice,
    restDayGuidance,
    techniqueTip,
    alternativeRoutines
  };
}
