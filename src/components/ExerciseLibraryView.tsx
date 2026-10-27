import React, { useState } from 'react';
import {
  Search,
  Dumbbell,
  AlertTriangle,
  CheckCircle,
  Award,
  ChevronRight,
  X,
  Filter,
  Play
} from 'lucide-react';
import { Exercise, MuscleGroup, EquipmentCategory, ExperienceLevel, UserProfile, WorkoutRoutine } from '../types';
import { storage } from '../services/storageService';
import { formatWeight } from '../utils/units';

interface ExerciseLibraryViewProps {
  profile: UserProfile;
  onStartSingleExercise: (exercise: Exercise) => void;
}

export const ExerciseLibraryView: React.FC<ExerciseLibraryViewProps> = ({
  profile,
  onStartSingleExercise
}) => {
  const [search, setSearch] = useState<string>('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const exercises = storage.getAllExercises();

  const muscleGroups: { id: string; label: string }[] = [
    { id: 'all', label: 'All Muscles' },
    { id: 'chest', label: 'Chest' },
    { id: 'back', label: 'Back' },
    { id: 'legs', label: 'Legs' },
    { id: 'glutes', label: 'Glutes' },
    { id: 'shoulders', label: 'Shoulders' },
    { id: 'biceps', label: 'Biceps' },
    { id: 'triceps', label: 'Triceps' },
    { id: 'abs', label: 'Abs & Core' },
  ];

  const equipmentList: { id: string; label: string }[] = [
    { id: 'all', label: 'All Equipment' },
    { id: 'barbell', label: 'Barbell' },
    { id: 'dumbbell', label: 'Dumbbell' },
    { id: 'cable', label: 'Cable' },
    { id: 'machine', label: 'Machine' },
    { id: 'bodyweight', label: 'Bodyweight' },
  ];

  const filtered = exercises.filter(ex => {
    if (selectedMuscle !== 'all' && ex.targetMuscle !== selectedMuscle) return false;
    if (selectedEquipment !== 'all' && ex.equipment !== selectedEquipment) return false;
    if (selectedDifficulty !== 'all' && ex.difficulty !== selectedDifficulty) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = ex.name.toLowerCase().includes(q);
      const matchMuscle = ex.targetMuscle.toLowerCase().includes(q);
      const matchSecondary = ex.secondaryMuscles.some(m => m.toLowerCase().includes(q));
      return matchName || matchMuscle || matchSecondary;
    }

    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
          Exercise Library
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Explore step-by-step biomechanical cues, common form mistakes to avoid, and target muscle activation.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="space-y-3 bg-[#12171e] p-4 rounded-2xl border border-slate-800 shadow-md">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search exercises by name, primary or secondary muscle..."
            value={search}
            onChange={(e) => setSearch}
            onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Muscle group tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {muscleGroups.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedMuscle(m.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                selectedMuscle === m.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Secondary filters: Equipment & Difficulty */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs text-slate-400">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Equipment:</span>
            {equipmentList.map(eq => (
              <button
                key={eq.id}
                onClick={() => setSelectedEquipment(eq.id)}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                  selectedEquipment === eq.id
                    ? 'bg-slate-700 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {eq.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Grid of Exercises */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.map(ex => {
          const pr = storage.getPreviousExercisePerformance(ex.id);

          return (
            <div
              key={ex.id}
              onClick={() => setSelectedExercise(ex)}
              className="bg-[#12171e] rounded-2xl border border-slate-800/90 hover:border-emerald-500/40 p-4 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors font-['Outfit']">
                    {ex.name}
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/30 shrink-0">
                    {ex.targetMuscle}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="capitalize">{ex.equipment}</span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{ex.difficulty}</span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{ex.category}</span>
                </div>

                {ex.instructions[0] && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {ex.instructions[0]}
                  </p>
                )}

                {pr && (
                  <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold tabular-nums">
                    <Award className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Last: {formatWeight(pr.weight, profile.unitSystem)} × {pr.reps} reps</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 mt-3 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {ex.defaultSets} sets · {ex.defaultReps} reps
                </span>
                <span className="text-xs text-emerald-400 font-medium group-hover:underline flex items-center gap-0.5">
                  View Form Guide
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-[#12171e] rounded-3xl border border-slate-800 p-8 space-y-3">
          <Dumbbell className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-white">No Exercises Matched</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search terms or clearing the muscle/equipment filters.
          </p>
        </div>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12171e] rounded-3xl border border-slate-800 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900/60">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/30">
                    {selectedExercise.targetMuscle}
                  </span>
                  <span className="text-xs text-slate-400 capitalize">
                    {selectedExercise.equipment} · {selectedExercise.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white font-['Outfit']">
                  {selectedExercise.name}
                </h3>
              </div>

              <button
                onClick={() => setSelectedExercise(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto p-5 space-y-5 flex-1">
              
              {/* Muscle targets */}
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap gap-4 text-xs">
                <div>
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] block">Primary Target</span>
                  <strong className="text-white capitalize">{selectedExercise.targetMuscle}</strong>
                </div>
                {selectedExercise.secondaryMuscles.length > 0 && (
                  <div>
                    <span className="text-slate-500 uppercase tracking-wider text-[10px] block">Secondary Muscles</span>
                    <span className="text-slate-300 capitalize">{selectedExercise.secondaryMuscles.join(', ')}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] block">Default Targets</span>
                  <span className="text-emerald-400 font-semibold">{selectedExercise.defaultSets} sets × {selectedExercise.defaultReps} reps ({selectedExercise.defaultRestSeconds}s rest)</span>
                </div>
              </div>

              {/* Step by Step Execution Instructions */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <CheckCircle className="w-4 h-4" />
                  <span>Execution & Form Cues</span>
                </div>
                <div className="space-y-2">
                  {selectedExercise.instructions.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Form Mistakes to Avoid */}
              {selectedExercise.mistakesToAvoid.length > 0 && (
                <div className="space-y-2.5 p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Common Mistakes to Avoid</span>
                  </div>
                  <ul className="space-y-1.5 pl-2">
                    {selectedExercise.mistakesToAvoid.map((mistake, idx) => (
                      <li key={idx} className="text-xs text-amber-200/90 list-disc list-inside">
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>

            {/* Modal Bottom CTA */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedExercise(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const ex = selectedExercise;
                  setSelectedExercise(null);
                  onStartSingleExercise(ex);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Quick Log / Train This</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
