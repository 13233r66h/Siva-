import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Check,
  Plus,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  Award,
  Clock,
  Sparkles,
  Search,
  Dumbbell,
  Timer
} from 'lucide-react';
import { ActiveWorkoutExercise, WorkoutSet, Exercise, UserProfile, WorkoutSession } from '../types';
import { ActiveWorkoutState, storage } from '../services/storageService';
import { formatDuration, formatWeight, weightNumber, toStoredKg } from '../utils/units';
import { RestTimerWidget } from './RestTimerWidget';

interface ActiveWorkoutTrackerProps {
  workoutState: ActiveWorkoutState;
  profile: UserProfile;
  onUpdateState: (state: ActiveWorkoutState) => void;
  onFinishWorkout: (session: WorkoutSession) => void;
  onCancelWorkout: () => void;
}

export const ActiveWorkoutTracker: React.FC<ActiveWorkoutTrackerProps> = ({
  workoutState,
  profile,
  onUpdateState,
  onFinishWorkout,
  onCancelWorkout
}) => {
  const [exercises, setExercises] = useState<ActiveWorkoutExercise[]>(workoutState.exercises);
  const [elapsed, setElapsed] = useState<number>(workoutState.elapsedSeconds);
  const [isPaused, setIsPaused] = useState<boolean>(workoutState.isPaused);
  const [restTargetTime, setRestTargetTime] = useState<number | null>(workoutState.restTimerTargetTime);
  const [restDuration, setRestDuration] = useState<number>(workoutState.restTimerTotalDuration);

  const [showAddExerciseModal, setShowAddExerciseModal] = useState<boolean>(false);
  const [exerciseSearch, setExerciseSearch] = useState<string>('');
  const [showFinishSummary, setShowFinishSummary] = useState<boolean>(false);
  const [workoutNotes, setWorkoutNotes] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState<boolean>(false);

  const allExercises = storage.getAllExercises();

  // Timer interval for elapsed workout duration
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setElapsed(prev => {
        const next = prev + 1;
        // Periodic sync to storage so progress is never lost
        if (next % 5 === 0) {
          storage.saveActiveWorkoutDraft({
            ...workoutState,
            exercises,
            elapsedSeconds: next,
            isPaused,
            restTimerTargetTime: restTargetTime,
            restTimerTotalDuration: restDuration
          });
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, workoutState, exercises, restTargetTime, restDuration]);

  // Sync state changes back to parent
  const syncDraft = (
    newExercises: ActiveWorkoutExercise[],
    newPaused = isPaused,
    newRestTarget = restTargetTime,
    newRestDuration = restDuration
  ) => {
    setExercises(newExercises);
    const updated: ActiveWorkoutState = {
      ...workoutState,
      exercises: newExercises,
      elapsedSeconds: elapsed,
      isPaused: newPaused,
      restTimerTargetTime: newRestTarget,
      restTimerTotalDuration: newRestDuration
    };
    onUpdateState(updated);
    storage.saveActiveWorkoutDraft(updated);
  };

  // Toggle set completion and trigger rest timer
  const handleToggleSetComplete = (exerciseIdx: number, setIdx: number) => {
    const updated = [...exercises];
    const set = updated[exerciseIdx].sets[setIdx];
    const willComplete = !set.completed;
    set.completed = willComplete;

    if (willComplete) {
      // Find default rest time for this exercise
      const exMeta = allExercises.find(e => e.id === updated[exerciseIdx].exerciseId);
      const restSecs = exMeta?.defaultRestSeconds || 60;
      const targetTime = Date.now() + restSecs * 1000;
      setRestTargetTime(targetTime);
      setRestDuration(restSecs);
      syncDraft(updated, isPaused, targetTime, restSecs);
    } else {
      syncDraft(updated);
    }
  };

  // Update set weight
  const handleUpdateWeight = (exerciseIdx: number, setIdx: number, displayedVal: number) => {
    const updated = [...exercises];
    const storedKg = toStoredKg(displayedVal, profile.unitSystem);
    updated[exerciseIdx].sets[setIdx].weight = storedKg;
    syncDraft(updated);
  };

  // Quick bump weight (+/- 2.5 kg or 5 lbs)
  const handleBumpWeight = (exerciseIdx: number, setIdx: number, delta: number) => {
    const updated = [...exercises];
    const currKg = updated[exerciseIdx].sets[setIdx].weight || 0;
    const currDisplay = weightNumber(currKg, profile.unitSystem);
    const newDisplay = Math.max(0, currDisplay + delta);
    updated[exerciseIdx].sets[setIdx].weight = toStoredKg(newDisplay, profile.unitSystem);
    syncDraft(updated);
  };

  // Update set reps
  const handleUpdateReps = (exerciseIdx: number, setIdx: number, repsVal: number) => {
    const updated = [...exercises];
    updated[exerciseIdx].sets[setIdx].reps = Math.max(0, repsVal);
    syncDraft(updated);
  };

  // Add a set to an exercise
  const handleAddSet = (exerciseIdx: number) => {
    const updated = [...exercises];
    const targetEx = updated[exerciseIdx];
    const lastSet = targetEx.sets[targetEx.sets.length - 1];
    const nextSetNumber = targetEx.sets.length + 1;

    targetEx.sets.push({
      id: `set-${Date.now()}-${nextSetNumber}`,
      setNumber: nextSetNumber,
      weight: lastSet ? lastSet.weight : 50,
      reps: lastSet ? lastSet.reps : 10,
      completed: false
    });

    syncDraft(updated);
  };

  // Remove a set
  const handleRemoveSet = (exerciseIdx: number, setIdx: number) => {
    const updated = [...exercises];
    updated[exerciseIdx].sets.splice(setIdx, 1);
    // Renumber remaining sets
    updated[exerciseIdx].sets.forEach((s, idx) => {
      s.setNumber = idx + 1;
    });
    syncDraft(updated);
  };

  // Remove entire exercise
  const handleRemoveExercise = (exerciseIdx: number) => {
    const updated = [...exercises];
    updated.splice(exerciseIdx, 1);
    syncDraft(updated);
  };

  // Add exercise from library
  const handleAddExerciseToWorkout = (exercise: Exercise) => {
    const newEx: ActiveWorkoutExercise = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      targetMuscle: exercise.targetMuscle,
      sets: Array.from({ length: exercise.defaultSets || 3 }).map((_, i) => ({
        id: `set-${Date.now()}-${i + 1}`,
        setNumber: i + 1,
        weight: 40,
        reps: 10,
        completed: false
      }))
    };

    const updated = [...exercises, newEx];
    syncDraft(updated);
    setShowAddExerciseModal(false);
  };

  // Rest Timer adjust / cancel
  const handleAdjustRest = (delta: number) => {
    if (!restTargetTime) return;
    const newTarget = Math.max(Date.now(), restTargetTime + delta * 1000);
    const newTotal = restDuration + delta;
    setRestTargetTime(newTarget);
    setRestDuration(newTotal);
    syncDraft(exercises, isPaused, newTarget, newTotal);
  };

  const handleCancelRest = () => {
    setRestTargetTime(null);
    syncDraft(exercises, isPaused, null, 0);
  };

  // Toggle warmup status for a set
  const handleToggleWarmup = (exerciseIdx: number, setIdx: number) => {
    const updated = [...exercises];
    const set = updated[exerciseIdx].sets[setIdx];
    set.isWarmup = !set.isWarmup;
    syncDraft(updated);
  };

  // Calculate totals for finish (excluding warmup sets from totalVol)
  let totalVol = 0;
  let totalCompletedSets = 0;
  let warmupSetsCount = 0;
  let workingSetsCount = 0;

  exercises.forEach(ex => {
    ex.sets.forEach(s => {
      if (s.completed && s.weight && s.reps) {
        if (!s.isWarmup) {
          totalVol += s.weight * s.reps;
          workingSetsCount++;
        } else {
          warmupSetsCount++;
        }
        totalCompletedSets++;
      }
    });
  });

  const handleCompleteWorkout = () => {
    const newSession: WorkoutSession = {
      id: `session-${Date.now()}`,
      routineId: workoutState.routineId,
      routineName: workoutState.routineName,
      startTime: workoutState.startTime,
      endTime: new Date().toISOString(),
      durationSeconds: elapsed,
      exercises,
      totalVolume: totalVol,
      totalSetsCompleted: totalCompletedSets,
      notes: workoutNotes,
      rating
    };

    // Save session in database and clear active draft
    storage.saveSession(newSession);
    storage.saveActiveWorkoutDraft(null);
    onFinishWorkout(newSession);
  };

  return (
    <div className="min-h-screen bg-[#0a0e12] text-slate-100 pb-28 md:pb-20">
      
      {/* Sticky Workout HUD Header */}
      <div className="sticky top-0 z-30 bg-[#0f141a]/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight truncate max-w-[200px] sm:max-w-md">
                {workoutState.routineName}
              </h1>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1 font-mono text-emerald-400 font-semibold tabular-nums">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDuration(elapsed)}
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{totalCompletedSets} sets done</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Pause / Resume */}
            <button
              onClick={() => {
                const nextPause = !isPaused;
                setIsPaused(nextPause);
                syncDraft(exercises, nextPause);
              }}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title={isPaused ? "Resume workout" : "Pause workout"}
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-400 fill-current" /> : <Pause className="w-4 h-4" />}
            </button>

            {/* Finish Workout CTA */}
            <button
              onClick={() => setShowFinishSummary(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all glow-electric whitespace-nowrap"
            >
              Finish
            </button>

            {/* Cancel / Discard */}
            <button
              onClick={() => setShowDiscardConfirm(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
              title="Discard workout"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Main workout logging body */}
      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">

        {/* Exercises list */}
        {exercises.map((exercise, exIdx) => {
          const exMeta = allExercises.find(e => e.id === exercise.exerciseId);
          const prevPerf = storage.getPreviousExercisePerformance(exercise.exerciseId);

          return (
            <div
              key={`${exercise.exerciseId}-${exIdx}`}
              className="bg-[#12171e] rounded-2xl border border-slate-800/90 overflow-hidden shadow-md"
            >
              {/* Exercise Header */}
              <div className="p-4 bg-slate-900/60 border-b border-slate-800/60 flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white tracking-tight">
                      {exercise.exerciseName}
                    </h2>
                    <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/30">
                      {exercise.targetMuscle}
                    </span>
                  </div>

                  {prevPerf && (
                    <span className="text-xs text-slate-400 mt-1">
                      Last time: <strong className="text-slate-300 tabular-nums">{formatWeight(prevPerf.weight, profile.unitSystem)}</strong> × <strong className="text-slate-300 tabular-nums">{prevPerf.reps}</strong> ({prevPerf.date})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleRemoveExercise(exIdx)}
                    className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Remove exercise"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Set Headers */}
              <div className="px-4 py-2 bg-slate-900/30 text-[11px] font-bold text-slate-400 uppercase tracking-wider grid grid-cols-12 gap-2 text-center">
                <div className="col-span-3 text-left flex items-center gap-1.5">
                  <span>Set</span>
                  <span className="text-[9px] text-slate-500 lowercase hidden sm:inline">(w = warmup)</span>
                </div>
                <div className="col-span-4">
                  Weight ({profile.unitSystem === 'imperial' ? 'lbs' : 'kg'})
                </div>
                <div className="col-span-3">Reps</div>
                <div className="col-span-2 text-right">Done</div>
              </div>

              {/* Sets List */}
              <div className="divide-y divide-slate-800/50 p-2 sm:p-4 space-y-2">
                {exercise.sets.map((set, setIdx) => {
                  const displayWeight = weightNumber(set.weight, profile.unitSystem);
                  const isCompleted = set.completed;

                  return (
                    <div
                      key={set.id}
                      className={`grid grid-cols-12 gap-2 items-center p-2 rounded-xl transition-colors ${
                        isCompleted
                          ? set.isWarmup
                            ? 'bg-amber-950/20 border border-amber-500/30'
                            : 'bg-emerald-950/20 border border-emerald-500/20'
                          : set.isWarmup
                          ? 'bg-amber-950/10 border border-amber-500/20 hover:bg-amber-950/20'
                          : 'bg-slate-800/30 hover:bg-slate-800/50'
                      }`}
                    >
                      {/* Set Number & Warmup Toggle */}
                      <div className="col-span-3 flex items-center gap-1 sm:gap-1.5">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold tabular-nums shrink-0 ${
                          set.isWarmup
                            ? 'bg-amber-950/80 text-amber-400 border border-amber-500/40'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {set.setNumber}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleToggleWarmup(exIdx, setIdx)}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tight transition-all uppercase shrink-0 ${
                            set.isWarmup
                              ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
                              : 'text-slate-500 hover:text-amber-400 hover:bg-slate-800'
                          }`}
                          title={set.isWarmup ? "Warmup set (excluded from volume & PRs). Tap to convert to working set." : "Tap to mark as Warmup set (excludes from volume and PRs)"}
                        >
                          {set.isWarmup ? 'Warmup' : 'W'}
                        </button>
                      </div>

                      {/* Weight input with quick bumps */}
                      <div className="col-span-4 flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleBumpWeight(exIdx, setIdx, profile.unitSystem === 'imperial' ? -5 : -2.5)}
                          className="w-6 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-bold hidden sm:flex items-center justify-center active:scale-95"
                          title="-2.5kg"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          step={profile.unitSystem === 'imperial' ? '5' : '2.5'}
                          min="0"
                          value={displayWeight || ''}
                          onChange={(e) => handleUpdateWeight(exIdx, setIdx, parseFloat(e.target.value) || 0)}
                          className="w-16 sm:w-20 text-center py-1.5 px-1 bg-slate-900 border border-slate-700 rounded-lg text-sm font-semibold text-white focus:outline-none focus:border-emerald-500 tabular-nums"
                          placeholder="0"
                        />
                        <button
                          onClick={() => handleBumpWeight(exIdx, setIdx, profile.unitSystem === 'imperial' ? 5 : 2.5)}
                          className="w-6 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-bold hidden sm:flex items-center justify-center active:scale-95"
                          title="+2.5kg"
                        >
                          +
                        </button>
                      </div>

                      {/* Reps input */}
                      <div className="col-span-3 flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleUpdateReps(exIdx, setIdx, Math.max(0, set.reps - 1))}
                          className="w-6 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-bold hidden sm:flex items-center justify-center active:scale-95"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={set.reps || ''}
                          onChange={(e) => handleUpdateReps(exIdx, setIdx, parseInt(e.target.value) || 0)}
                          className="w-12 sm:w-14 text-center py-1.5 px-1 bg-slate-900 border border-slate-700 rounded-lg text-sm font-semibold text-white focus:outline-none focus:border-emerald-500 tabular-nums"
                          placeholder="0"
                        />
                        <button
                          onClick={() => handleUpdateReps(exIdx, setIdx, set.reps + 1)}
                          className="w-6 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-bold hidden sm:flex items-center justify-center active:scale-95"
                        >
                          +
                        </button>
                      </div>

                      {/* Check Complete Button */}
                      <div className="col-span-2 flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggleSetComplete(exIdx, setIdx)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                            isCompleted
                              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30 active:scale-95'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
                          }`}
                          title={isCompleted ? "Mark incomplete" : "Mark completed & start rest"}
                        >
                          <Check className="w-5 h-5 stroke-[3]" />
                        </button>
                        {exercise.sets.length > 1 && (
                          <button
                            onClick={() => handleRemoveSet(exIdx, setIdx)}
                            className="p-1 text-slate-500 hover:text-red-400 hidden sm:block"
                            title="Delete set"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Set button */}
              <div className="p-3 bg-slate-900/40 border-t border-slate-800/60 flex items-center justify-between">
                <button
                  onClick={() => handleAddSet(exIdx)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 py-1 px-2.5 rounded-lg hover:bg-emerald-950/40 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Set
                </button>
                <div className="text-xs text-slate-400">
                  Rest target: <strong className="text-slate-300 tabular-nums">{exMeta?.defaultRestSeconds || 60}s</strong>
                </div>
              </div>

            </div>
          );
        })}

        {/* Add Exercise CTA Button */}
        <button
          onClick={() => setShowAddExerciseModal(true)}
          className="w-full py-3.5 rounded-2xl border-2 border-dashed border-slate-800 hover:border-emerald-500/50 bg-slate-900/40 hover:bg-emerald-950/10 text-slate-300 hover:text-emerald-400 font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
        >
          <Plus className="w-5 h-5" /> Add Exercise to Workout
        </button>

      </div>

      {/* Floating Rest Timer Widget */}
      <RestTimerWidget
        targetEndTime={restTargetTime}
        totalDuration={restDuration}
        onAdjustTime={handleAdjustRest}
        onCancelTimer={handleCancelRest}
        onTimerComplete={handleCancelRest}
      />

      {/* Add Exercise Modal */}
      {showAddExerciseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12171e] rounded-3xl border border-slate-800 w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white font-['Outfit']">Add Exercise</h3>
              <button
                onClick={() => setShowAddExerciseModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/50">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search exercise name or muscle..."
                  value={exerciseSearch}
                  onChange={(e) => setExerciseSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Exercise List */}
            <div className="overflow-y-auto p-4 space-y-2 flex-1">
              {allExercises
                .filter(ex => 
                  ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
                  ex.targetMuscle.toLowerCase().includes(exerciseSearch.toLowerCase())
                )
                .map(exercise => (
                  <div
                    key={exercise.id}
                    onClick={() => handleAddExerciseToWorkout(exercise)}
                    className="p-3 rounded-xl bg-slate-800/40 hover:bg-emerald-950/30 border border-slate-800 hover:border-emerald-500/40 flex items-center justify-between cursor-pointer transition-colors group"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {exercise.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="capitalize">{exercise.targetMuscle}</span>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize">{exercise.equipment}</span>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-slate-800 group-hover:bg-emerald-500 group-hover:text-slate-950 text-xs font-semibold text-emerald-400 transition-colors">
                      Add
                    </button>
                  </div>
                ))}
            </div>

          </div>
        </div>
      )}

      {/* Finish Workout Summary Modal */}
      {showFinishSummary && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12171e] rounded-3xl border border-slate-800 w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 space-y-5">
            
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/10">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-white font-['Outfit']">
                Workout Complete!
              </h3>
              <p className="text-xs text-slate-400">
                Outstanding effort. Here is your session summary.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5 bg-slate-900/80 rounded-2xl p-3 border border-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Duration</span>
                <span className="text-base font-bold text-white font-mono tabular-nums">
                  {formatDuration(elapsed)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Working Vol</span>
                <span className="text-base font-bold text-emerald-400 tabular-nums">
                  {formatWeight(totalVol, profile.unitSystem)}
                </span>
                {warmupSetsCount > 0 && (
                  <span className="text-[9px] text-amber-400/90 block mt-0.5 font-medium">
                    ({warmupSetsCount} warmup excluded)
                  </span>
                )}
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Sets Done</span>
                <span className="text-base font-bold text-white tabular-nums">
                  {workingSetsCount} <span className="text-xs font-normal text-slate-400">({warmupSetsCount} W)</span>
                </span>
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">How did it feel?</label>
              <div className="flex items-center justify-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-xl p-1 transition-transform hover:scale-125 ${
                      rating >= star ? 'text-yellow-400' : 'text-slate-600'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Workout Notes (optional)</label>
              <textarea
                value={workoutNotes}
                onChange={(e) => setWorkoutNotes(e.target.value)}
                placeholder="E.g. Great chest pump, bench press felt lighter than usual..."
                rows={3}
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowFinishSummary(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs sm:text-sm transition-colors"
              >
                Back to Workout
              </button>
              <button
                onClick={handleCompleteWorkout}
                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
              >
                Save & Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Discard confirmation dialog */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161d24] rounded-2xl border border-slate-800 p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <h4 className="text-base font-bold text-white">Discard Workout?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to discard this workout session? Your recorded sets will not be saved to your history.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDiscardConfirm(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium text-xs hover:bg-slate-700"
              >
                Keep Going
              </button>
              <button
                onClick={() => {
                  storage.saveActiveWorkoutDraft(null);
                  onCancelWorkout();
                }}
                className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-md shadow-red-600/30"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
