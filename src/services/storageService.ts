import {
  UserProfile,
  WorkoutRoutine,
  WorkoutSession,
  WeightEntry,
  ProgressPhoto,
  Exercise,
  PersonalRecord,
  ActiveWorkoutExercise
} from '../types';
import { DEFAULT_ROUTINES } from '../data/mockRoutines';
import { EXERCISES_DATABASE } from '../data/mockExercises';

const STORAGE_KEY_PROFILE = 'gymbuddy_user_profile_v1';
const STORAGE_KEY_ROUTINES = 'gymbuddy_routines_v1';
const STORAGE_KEY_SESSIONS = 'gymbuddy_sessions_v1';
const STORAGE_KEY_WEIGHTS = 'gymbuddy_weights_v1';
const STORAGE_KEY_PHOTOS = 'gymbuddy_photos_v1';
const STORAGE_KEY_ACTIVE_WORKOUT = 'gymbuddy_active_workout_v1';
const STORAGE_KEY_CUSTOM_EXERCISES = 'gymbuddy_custom_exercises_v1';

export interface ActiveWorkoutState {
  routineId?: string;
  routineName: string;
  startTime: string; // ISO
  elapsedSeconds: number;
  exercises: ActiveWorkoutExercise[];
  isPaused: boolean;
  restTimerTargetTime: number | null; // Date.now() timestamp when timer finishes
  restTimerTotalDuration: number;
}

// Generate realistic mock history for initial experience
function generateSeedSessions(): WorkoutSession[] {
  const now = new Date();
  const sessions: WorkoutSession[] = [];

  const pastDays = [24, 21, 18, 15, 12, 9, 6, 4, 2];
  const routineTemplates = [
    { name: 'Push Day A — Chest & Shoulders', id: 'ppl-push-a', benchWeight: 75, ohpWeight: 45 },
    { name: 'Pull Day A — Back & Biceps', id: 'ppl-pull-a', benchWeight: 0, ohpWeight: 0 },
    { name: 'Legs & Core Day A', id: 'ppl-legs-a', benchWeight: 0, ohpWeight: 0 },
    { name: 'Push Day A — Chest & Shoulders', id: 'ppl-push-a', benchWeight: 77.5, ohpWeight: 47.5 },
    { name: 'Pull Day A — Back & Biceps', id: 'ppl-pull-a', benchWeight: 0, ohpWeight: 0 },
    { name: 'Legs & Core Day A', id: 'ppl-legs-a', benchWeight: 0, ohpWeight: 0 },
    { name: 'Push Day A — Chest & Shoulders', id: 'ppl-push-a', benchWeight: 80, ohpWeight: 50 },
    { name: 'Pull Day A — Back & Biceps', id: 'ppl-pull-a', benchWeight: 0, ohpWeight: 0 },
    { name: 'Legs & Core Day A', id: 'ppl-legs-a', benchWeight: 0, ohpWeight: 0 }
  ];

  pastDays.forEach((daysAgo, idx) => {
    const tmpl = routineTemplates[idx];
    const d = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    d.setHours(17, 30, 0, 0);

    const end = new Date(d.getTime() + 52 * 60 * 1000);
    const benchW = tmpl.benchWeight || 75;

    let exercises: ActiveWorkoutExercise[] = [];
    let vol = 0;

    if (tmpl.id === 'ppl-push-a') {
      exercises = [
        {
          exerciseId: 'barbell-bench-press',
          exerciseName: 'Barbell Bench Press',
          targetMuscle: 'chest',
          sets: [
            { id: '1', setNumber: 1, weight: benchW, reps: 8, completed: true },
            { id: '2', setNumber: 2, weight: benchW, reps: 8, completed: true },
            { id: '3', setNumber: 3, weight: benchW, reps: 7, completed: true },
            { id: '4', setNumber: 4, weight: benchW, reps: 6, completed: true }
          ]
        },
        {
          exerciseId: 'incline-dumbbell-press',
          exerciseName: 'Incline Dumbbell Press',
          targetMuscle: 'chest',
          sets: [
            { id: '1', setNumber: 1, weight: 26, reps: 10, completed: true },
            { id: '2', setNumber: 2, weight: 26, reps: 9, completed: true },
            { id: '3', setNumber: 3, weight: 26, reps: 8, completed: true }
          ]
        },
        {
          exerciseId: 'overhead-press',
          exerciseName: 'Barbell Overhead Press (OHP)',
          targetMuscle: 'shoulders',
          sets: [
            { id: '1', setNumber: 1, weight: tmpl.ohpWeight || 45, reps: 8, completed: true },
            { id: '2', setNumber: 2, weight: tmpl.ohpWeight || 45, reps: 8, completed: true },
            { id: '3', setNumber: 3, weight: tmpl.ohpWeight || 45, reps: 7, completed: true }
          ]
        },
        {
          exerciseId: 'triceps-rope-pushdown',
          exerciseName: 'Cable Triceps Rope Pushdown',
          targetMuscle: 'triceps',
          sets: [
            { id: '1', setNumber: 1, weight: 25, reps: 12, completed: true },
            { id: '2', setNumber: 2, weight: 25, reps: 12, completed: true },
            { id: '3', setNumber: 3, weight: 25, reps: 11, completed: true }
          ]
        }
      ];
    } else if (tmpl.id === 'ppl-pull-a') {
      exercises = [
        {
          exerciseId: 'barbell-deadlift',
          exerciseName: 'Barbell Conventional Deadlift',
          targetMuscle: 'back',
          sets: [
            { id: '1', setNumber: 1, weight: 110, reps: 5, completed: true },
            { id: '2', setNumber: 2, weight: 115, reps: 5, completed: true },
            { id: '3', setNumber: 3, weight: 120, reps: 5, completed: true }
          ]
        },
        {
          exerciseId: 'lat-pulldown',
          exerciseName: 'Lat Pulldown',
          targetMuscle: 'back',
          sets: [
            { id: '1', setNumber: 1, weight: 60, reps: 10, completed: true },
            { id: '2', setNumber: 2, weight: 60, reps: 10, completed: true },
            { id: '3', setNumber: 3, weight: 65, reps: 8, completed: true }
          ]
        },
        {
          exerciseId: 'barbell-bicep-curl',
          exerciseName: 'Barbell Bicep Curl',
          targetMuscle: 'biceps',
          sets: [
            { id: '1', setNumber: 1, weight: 30, reps: 10, completed: true },
            { id: '2', setNumber: 2, weight: 30, reps: 10, completed: true },
            { id: '3', setNumber: 3, weight: 30, reps: 9, completed: true }
          ]
        }
      ];
    } else {
      exercises = [
        {
          exerciseId: 'barbell-back-squat',
          exerciseName: 'Barbell Back Squat',
          targetMuscle: 'legs',
          sets: [
            { id: '1', setNumber: 1, weight: 90, reps: 8, completed: true },
            { id: '2', setNumber: 2, weight: 95, reps: 7, completed: true },
            { id: '3', setNumber: 3, weight: 100, reps: 6, completed: true }
          ]
        },
        {
          exerciseId: 'romanian-deadlift',
          exerciseName: 'Romanian Deadlift (RDL)',
          targetMuscle: 'glutes',
          sets: [
            { id: '1', setNumber: 1, weight: 80, reps: 10, completed: true },
            { id: '2', setNumber: 2, weight: 80, reps: 10, completed: true },
            { id: '3', setNumber: 3, weight: 85, reps: 8, completed: true }
          ]
        },
        {
          exerciseId: 'standing-calf-raise',
          exerciseName: 'Standing Calf Raise',
          targetMuscle: 'legs',
          sets: [
            { id: '1', setNumber: 1, weight: 50, reps: 15, completed: true },
            { id: '2', setNumber: 2, weight: 50, reps: 15, completed: true }
          ]
        }
      ];
    }

    exercises.forEach(ex => {
      ex.sets.forEach(s => {
        if (s.completed && !s.isWarmup) vol += (s.weight || 0) * (s.reps || 0);
      });
    });

    sessions.push({
      id: `seed-session-${idx}`,
      routineId: tmpl.id,
      routineName: tmpl.name,
      startTime: d.toISOString(),
      endTime: end.toISOString(),
      durationSeconds: 52 * 60,
      exercises,
      totalVolume: vol,
      totalSetsCompleted: exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0),
      notes: idx % 2 === 0 ? 'Felt energetic. Good progressive overload.' : 'Smooth technique, focused on squeeze.',
      rating: 5,
      prCount: idx === pastDays.length - 1 ? 1 : 0
    });
  });

  return sessions;
}

function generateSeedWeights(): WeightEntry[] {
  const entries: WeightEntry[] = [];
  const now = new Date();
  const baseWeight = 76.5;

  for (let i = 8; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split('T')[0];
    const w = Number((baseWeight + (8 - i) * 0.22).toFixed(1));
    entries.push({
      id: `weight-${i}`,
      date: dateStr,
      weight: w,
      note: i === 0 ? 'Current weekly weigh-in' : 'Morning fasting weight'
    });
  }
  return entries;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'user_default',
  name: 'Alex Mercer',
  email: 'alex.fitness@example.com',
  age: 27,
  height: 182,
  heightUnit: 'cm',
  currentWeight: 78.3,
  targetWeight: 82.0,
  weightUnit: 'kg',
  fitnessGoal: 'muscle_gain',
  experienceLevel: 'intermediate',
  daysPerWeek: 4,
  equipment: 'full_gym',
  unitSystem: 'metric',
  theme: 'dark',
  remindersEnabled: true,
  reminderTime: '07:00',
  reminderDays: [1, 2, 4, 5], // Mon, Tue, Thu, Fri
  createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  onboardingCompleted: true
};

class StorageService {
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEY_PROFILE)) {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(DEFAULT_PROFILE));
    }
    if (!localStorage.getItem(STORAGE_KEY_ROUTINES)) {
      localStorage.setItem(STORAGE_KEY_ROUTINES, JSON.stringify(DEFAULT_ROUTINES));
    }
    if (!localStorage.getItem(STORAGE_KEY_SESSIONS)) {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(generateSeedSessions()));
    }
    if (!localStorage.getItem(STORAGE_KEY_WEIGHTS)) {
      localStorage.setItem(STORAGE_KEY_WEIGHTS, JSON.stringify(generateSeedWeights()));
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  // Profile
  public getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PROFILE);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  }

  public saveProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    this.notify();
  }

  // Routines
  public getRoutines(): WorkoutRoutine[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_ROUTINES);
      return data ? JSON.parse(data) : DEFAULT_ROUTINES;
    } catch {
      return DEFAULT_ROUTINES;
    }
  }

  public saveRoutines(routines: WorkoutRoutine[]): void {
    localStorage.setItem(STORAGE_KEY_ROUTINES, JSON.stringify(routines));
    this.notify();
  }

  public addCustomRoutine(routine: WorkoutRoutine): void {
    const list = this.getRoutines();
    list.unshift(routine);
    this.saveRoutines(list);
  }

  public toggleFavoriteRoutine(routineId: string): void {
    const list = this.getRoutines();
    const updated = list.map(r => r.id === routineId ? { ...r, isFavorite: !r.isFavorite } : r);
    this.saveRoutines(updated);
  }

  public deleteRoutine(routineId: string): void {
    const list = this.getRoutines();
    const filtered = list.filter(r => r.id !== routineId);
    this.saveRoutines(filtered);
  }

  // Sessions / Workout History
  public getSessions(): WorkoutSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SESSIONS);
      const list: WorkoutSession[] = data ? JSON.parse(data) : [];
      return list.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    } catch {
      return [];
    }
  }

  public saveSession(session: WorkoutSession): void {
    const list = this.getSessions();
    list.unshift(session);
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(list));
    this.notify();
  }

  public deleteSession(sessionId: string): void {
    const list = this.getSessions().filter(s => s.id !== sessionId);
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(list));
    this.notify();
  }

  // Weight entries
  public getWeightEntries(): WeightEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_WEIGHTS);
      const list: WeightEntry[] = data ? JSON.parse(data) : [];
      return list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } catch {
      return [];
    }
  }

  public logWeight(weight: number, dateStr?: string, note?: string): void {
    const list = this.getWeightEntries();
    const date = dateStr || new Date().toISOString().split('T')[0];
    const existingIdx = list.findIndex(e => e.date === date);

    if (existingIdx >= 0) {
      list[existingIdx] = { ...list[existingIdx], weight, note };
    } else {
      list.push({
        id: `weight-${Date.now()}`,
        date,
        weight,
        note
      });
    }

    list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    localStorage.setItem(STORAGE_KEY_WEIGHTS, JSON.stringify(list));

    // Update current weight in profile too
    const profile = this.getProfile();
    profile.currentWeight = weight;
    this.saveProfile(profile);

    this.notify();
  }

  // Active workout draft persistence
  public getActiveWorkoutDraft(): ActiveWorkoutState | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY_ACTIVE_WORKOUT);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  public saveActiveWorkoutDraft(state: ActiveWorkoutState | null): void {
    if (state === null) {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_WORKOUT);
    } else {
      localStorage.setItem(STORAGE_KEY_ACTIVE_WORKOUT, JSON.stringify(state));
    }
    this.notify();
  }

  // Custom Exercises
  public getAllExercises(): Exercise[] {
    try {
      const customStr = localStorage.getItem(STORAGE_KEY_CUSTOM_EXERCISES);
      const custom: Exercise[] = customStr ? JSON.parse(customStr) : [];
      return [...EXERCISES_DATABASE, ...custom];
    } catch {
      return EXERCISES_DATABASE;
    }
  }

  public addCustomExercise(exercise: Exercise): void {
    try {
      const customStr = localStorage.getItem(STORAGE_KEY_CUSTOM_EXERCISES);
      const custom: Exercise[] = customStr ? JSON.parse(customStr) : [];
      custom.push(exercise);
      localStorage.setItem(STORAGE_KEY_CUSTOM_EXERCISES, JSON.stringify(custom));
      this.notify();
    } catch {
      // Error handling
    }
  }

  // Progress photos
  public getProgressPhotos(): ProgressPhoto[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PHOTOS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public saveProgressPhoto(photo: ProgressPhoto): void {
    const list = this.getProgressPhotos();
    list.unshift(photo);
    localStorage.setItem(STORAGE_KEY_PHOTOS, JSON.stringify(list));
    this.notify();
  }

  public deleteProgressPhoto(id: string): void {
    const list = this.getProgressPhotos().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY_PHOTOS, JSON.stringify(list));
    this.notify();
  }

  // Statistical calculations
  public getWorkoutStreak(): number {
    const sessions = this.getSessions();
    if (sessions.length === 0) return 0;

    const workoutDates = new Set(
      sessions.map(s => s.startTime.split('T')[0])
    );

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if workout done today or yesterday to continue streak
    let checkDate = new Date(today);
    const todayKey = checkDate.toISOString().split('T')[0];

    if (!workoutDates.has(todayKey)) {
      // Check yesterday
      checkDate.setDate(checkDate.getDate() - 1);
      const yesterdayKey = checkDate.toISOString().split('T')[0];
      if (!workoutDates.has(yesterdayKey)) {
        return 0; // Streak broken
      }
    }

    // Count backwards day by day (or allow 1 rest day gap)
    let allowedRestDays = 1;
    while (true) {
      const key = checkDate.toISOString().split('T')[0];
      if (workoutDates.has(key)) {
        streak++;
        allowedRestDays = 1; // reset allowance after a workout
      } else {
        if (allowedRestDays > 0) {
          allowedRestDays--;
        } else {
          break;
        }
      }
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return Math.max(streak, 1);
  }

  public getWeeklyCompletion(): { dayName: string; shortDate: string; isCompleted: boolean; isToday: boolean }[] {
    const sessions = this.getSessions();
    const sessionDates = new Set(sessions.map(s => s.startTime.split('T')[0]));

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Find Monday of current week
    const currentDay = today.getDay(); // 0 is Sun, 1 is Mon...
    const distanceToMonday = (currentDay + 6) % 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - distanceToMonday);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const result = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dStr = d.toISOString().split('T')[0];
      result.push({
        dayName: days[i],
        shortDate: `${d.getDate()}`,
        isCompleted: sessionDates.has(dStr),
        isToday: dStr === todayStr
      });
    }

    return result;
  }

  public getPersonalRecords(): PersonalRecord[] {
    const sessions = this.getSessions();
    const prMap = new Map<string, PersonalRecord>();

    sessions.forEach(session => {
      session.exercises.forEach(ex => {
        ex.sets.forEach(set => {
          if (set.completed && !set.isWarmup && set.weight > 0 && set.reps > 0) {
            // Epley 1RM Formula: Weight * (1 + Reps / 30)
            const estimated1RM = Math.round(set.weight * (1 + set.reps / 30));
            const existing = prMap.get(ex.exerciseId);

            if (!existing || set.weight > existing.maxWeight || estimated1RM > existing.estimatedOneRepMax) {
              prMap.set(ex.exerciseId, {
                exerciseId: ex.exerciseId,
                exerciseName: ex.exerciseName,
                maxWeight: Math.max(existing?.maxWeight || 0, set.weight),
                reps: set.reps,
                dateAchieved: session.startTime.split('T')[0],
                estimatedOneRepMax: Math.max(existing?.estimatedOneRepMax || 0, estimated1RM)
              });
            }
          }
        });
      });
    });

    return Array.from(prMap.values()).sort((a, b) => b.estimatedOneRepMax - a.estimatedOneRepMax);
  }

  public getPreviousExercisePerformance(exerciseId: string): { weight: number; reps: number; sets: number; date: string } | null {
    const sessions = this.getSessions();
    for (const session of sessions) {
      const match = session.exercises.find(e => e.exerciseId === exerciseId);
      if (match) {
        // Exclude warmup sets when retrieving previous performance reference
        const completedSets = match.sets.filter(s => s.completed && !s.isWarmup && s.weight > 0);
        if (completedSets.length > 0) {
          const topSet = completedSets.reduce((prev, curr) => (curr.weight > prev.weight ? curr : prev), completedSets[0]);
          return {
            weight: topSet.weight,
            reps: topSet.reps,
            sets: completedSets.length,
            date: new Date(session.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
          };
        }
      }
    }
    return null;
  }

  // Backup & Restore
  public exportData(): string {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile: this.getProfile(),
      routines: this.getRoutines(),
      sessions: this.getSessions(),
      weights: this.getWeightEntries(),
      photos: this.getProgressPhotos()
    };
    return JSON.stringify(backup, null, 2);
  }

  public importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.profile) localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(data.profile));
      if (data.routines) localStorage.setItem(STORAGE_KEY_ROUTINES, JSON.stringify(data.routines));
      if (data.sessions) localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(data.sessions));
      if (data.weights) localStorage.setItem(STORAGE_KEY_WEIGHTS, JSON.stringify(data.weights));
      if (data.photos) localStorage.setItem(STORAGE_KEY_PHOTOS, JSON.stringify(data.photos));
      this.notify();
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }

  public resetToDemo(): void {
    localStorage.removeItem(STORAGE_KEY_PROFILE);
    localStorage.removeItem(STORAGE_KEY_ROUTINES);
    localStorage.removeItem(STORAGE_KEY_SESSIONS);
    localStorage.removeItem(STORAGE_KEY_WEIGHTS);
    localStorage.removeItem(STORAGE_KEY_PHOTOS);
    localStorage.removeItem(STORAGE_KEY_ACTIVE_WORKOUT);
    localStorage.removeItem(STORAGE_KEY_CUSTOM_EXERCISES);
    this.ensureInitialized();
    this.notify();
  }
}

export const storage = new StorageService();
