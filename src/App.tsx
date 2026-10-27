import React, { useState, useEffect } from 'react';
import { UserProfile, WorkoutRoutine, WorkoutSession, Exercise } from './types';
import { storage, ActiveWorkoutState } from './services/storageService';
import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';
import { HomeDashboard } from './components/HomeDashboard';
import { WorkoutsView } from './components/WorkoutsView';
import { ExerciseLibraryView } from './components/ExerciseLibraryView';
import { ProgressView } from './components/ProgressView';
import { WorkoutHistoryView } from './components/WorkoutHistoryView';
import { ProfileSettingsView } from './components/ProfileSettingsView';
import { ActiveWorkoutTracker } from './components/ActiveWorkoutTracker';
import { OnboardingModal } from './components/OnboardingModal';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(storage.getProfile());
  const [routines, setRoutines] = useState<WorkoutRoutine[]>(storage.getRoutines());
  const [sessions, setSessions] = useState<WorkoutSession[]>(storage.getSessions());
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkoutState | null>(storage.getActiveWorkoutDraft());

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [showLiveTracker, setShowLiveTracker] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(!profile.onboardingCompleted);

  // Subscribe to persistent storage events
  useEffect(() => {
    const unsubscribe = storage.subscribe(() => {
      setProfile(storage.getProfile());
      setRoutines(storage.getRoutines());
      setSessions(storage.getSessions());
      setActiveWorkout(storage.getActiveWorkoutDraft());
    });
    return () => unsubscribe();
  }, []);

  // Theme application
  useEffect(() => {
    if (profile.theme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  }, [profile.theme]);

  const streak = storage.getWorkoutStreak();

  // Start routine into live tracker
  const handleStartRoutine = (routine: WorkoutRoutine) => {
    const allExercises = storage.getAllExercises();
    const activeExercises = routine.exercises.map(item => {
      const exMeta = allExercises.find(e => e.id === item.exerciseId);
      const prev = storage.getPreviousExercisePerformance(item.exerciseId);
      const defaultWeight = prev ? prev.weight : 40;

      return {
        exerciseId: item.exerciseId,
        exerciseName: exMeta ? exMeta.name : item.exerciseId,
        targetMuscle: exMeta ? exMeta.targetMuscle : 'chest',
        sets: Array.from({ length: item.sets || 3 }).map((_, i) => ({
          id: `set-${Date.now()}-${i + 1}`,
          setNumber: i + 1,
          weight: defaultWeight,
          reps: 10,
          completed: false
        }))
      };
    });

    const newState: ActiveWorkoutState = {
      routineId: routine.id,
      routineName: routine.name,
      startTime: new Date().toISOString(),
      elapsedSeconds: 0,
      exercises: activeExercises,
      isPaused: false,
      restTimerTargetTime: null,
      restTimerTotalDuration: 60
    };

    storage.saveActiveWorkoutDraft(newState);
    setActiveWorkout(newState);
    setShowLiveTracker(true);
  };

  // Start single exercise (e.g. from Exercise Library)
  const handleStartSingleExercise = (exercise: Exercise) => {
    const prev = storage.getPreviousExercisePerformance(exercise.id);
    const defaultWeight = prev ? prev.weight : 30;

    const newState: ActiveWorkoutState = {
      routineName: `Quick Session — ${exercise.name}`,
      startTime: new Date().toISOString(),
      elapsedSeconds: 0,
      exercises: [
        {
          exerciseId: exercise.id,
          exerciseName: exercise.name,
          targetMuscle: exercise.targetMuscle,
          sets: Array.from({ length: exercise.defaultSets || 3 }).map((_, i) => ({
            id: `set-${Date.now()}-${i + 1}`,
            setNumber: i + 1,
            weight: defaultWeight,
            reps: 10,
            completed: false
          }))
        }
      ],
      isPaused: false,
      restTimerTargetTime: null,
      restTimerTotalDuration: exercise.defaultRestSeconds || 60
    };

    storage.saveActiveWorkoutDraft(newState);
    setActiveWorkout(newState);
    setShowLiveTracker(true);
  };

  // Repeat a past workout session
  const handleRepeatWorkout = (session: WorkoutSession) => {
    const activeExercises = session.exercises.map(ex => ({
      exerciseId: ex.exerciseId,
      exerciseName: ex.exerciseName,
      targetMuscle: ex.targetMuscle,
      sets: ex.sets.map((s, idx) => ({
        id: `set-${Date.now()}-${idx + 1}`,
        setNumber: idx + 1,
        weight: s.weight,
        reps: s.reps,
        completed: false
      }))
    }));

    const newState: ActiveWorkoutState = {
      routineId: session.routineId,
      routineName: session.routineName,
      startTime: new Date().toISOString(),
      elapsedSeconds: 0,
      exercises: activeExercises,
      isPaused: false,
      restTimerTargetTime: null,
      restTimerTotalDuration: 60
    };

    storage.saveActiveWorkoutDraft(newState);
    setActiveWorkout(newState);
    setShowLiveTracker(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0f13] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans']">
      
      {/* Top Bar Contract Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        profile={profile}
        streak={streak}
        activeWorkout={activeWorkout}
        onResumeWorkout={() => setShowLiveTracker(true)}
        onOpenOnboarding={() => setShowOnboarding(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
        {currentTab === 'home' && (
          <HomeDashboard
            profile={profile}
            routines={routines}
            sessions={sessions}
            onStartRoutine={handleStartRoutine}
            onNavigateTab={setCurrentTab}
            onOpenLiveWorkout={() => setShowLiveTracker(true)}
            streak={streak}
          />
        )}

        {currentTab === 'workouts' && (
          <WorkoutsView
            profile={profile}
            routines={routines}
            onStartRoutine={handleStartRoutine}
          />
        )}

        {currentTab === 'exercises' && (
          <ExerciseLibraryView
            profile={profile}
            onStartSingleExercise={handleStartSingleExercise}
          />
        )}

        {currentTab === 'progress' && (
          <ProgressView
            profile={profile}
          />
        )}

        {currentTab === 'history' && (
          <WorkoutHistoryView
            profile={profile}
            sessions={sessions}
            onRepeatWorkout={handleRepeatWorkout}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileSettingsView
            profile={profile}
            onUpdateProfile={setProfile}
            onOpenOnboarding={() => setShowOnboarding(true)}
          />
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar (5 tabs) */}
      <BottomNavigation
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeWorkout={activeWorkout}
        onOpenLiveWorkout={() => setShowLiveTracker(true)}
      />

      {/* Live Active Workout Overlay Modal */}
      {showLiveTracker && activeWorkout && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0a0e12] animate-in fade-in duration-200">
          <ActiveWorkoutTracker
            workoutState={activeWorkout}
            profile={profile}
            onUpdateState={(st) => setActiveWorkout(st)}
            onFinishWorkout={(session) => {
              setShowLiveTracker(false);
              setActiveWorkout(null);
              setCurrentTab('history');
            }}
            onCancelWorkout={() => {
              setShowLiveTracker(false);
              setActiveWorkout(null);
            }}
          />
        </div>
      )}

      {/* Onboarding / Setup Profile Modal */}
      {showOnboarding && (
        <OnboardingModal
          onComplete={(newProfile) => {
            setProfile(newProfile);
            setShowOnboarding(false);
            setCurrentTab('home');
          }}
          onCancel={() => setShowOnboarding(false)}
        />
      )}

    </div>
  );
}
