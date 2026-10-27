import React, { useState } from 'react';
import {
  Play,
  Star,
  Plus,
  Clock,
  Dumbbell,
  ChevronRight,
  Trash2,
  X,
  Search,
  Check,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { WorkoutRoutine, WorkoutRoutineExercise, UserProfile, Exercise } from '../types';
import { storage } from '../services/storageService';

interface WorkoutsViewProps {
  profile: UserProfile;
  routines: WorkoutRoutine[];
  onStartRoutine: (routine: WorkoutRoutine) => void;
}

export const WorkoutsView: React.FC<WorkoutsViewProps> = ({
  profile,
  routines,
  onStartRoutine
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRoutine, setSelectedRoutine] = useState<WorkoutRoutine | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // New Custom Routine Form State
  const [customName, setCustomName] = useState<string>('');
  const [customDesc, setCustomDesc] = useState<string>('');
  const [customGoal, setCustomGoal] = useState<any>('muscle_gain');
  const [customLevel, setCustomLevel] = useState<any>('intermediate');
  const [customEquipment, setCustomEquipment] = useState<any>('full_gym');
  const [customExercises, setCustomExercises] = useState<WorkoutRoutineExercise[]>([]);
  const [showExercisePicker, setShowExercisePicker] = useState<boolean>(false);
  const [pickerSearch, setPickerSearch] = useState<string>('');

  const allExercises = storage.getAllExercises();

  // Categories
  const categories = [
    { id: 'all', label: 'All Routines' },
    { id: 'push_pull_legs', label: 'Push / Pull / Legs' },
    { id: 'upper_lower', label: 'Upper / Lower' },
    { id: 'full_body', label: 'Full Body' },
    { id: 'muscle_gain', label: 'Muscle Gain' },
    { id: 'fat_loss', label: 'Fat Loss' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'home', label: 'Home' },
    { id: 'custom', label: 'My Custom' },
  ];

  // Filtering
  const filteredRoutines = routines.filter(r => {
    if (selectedCategory === 'custom') {
      if (!r.isCustom) return false;
    } else if (selectedCategory !== 'all') {
      if (r.category !== selectedCategory) return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = r.name.toLowerCase().includes(q);
      const matchDesc = r.description.toLowerCase().includes(q);
      return matchName || matchDesc;
    }

    return true;
  });

  const handleToggleFavorite = (e: React.MouseEvent, routineId: string) => {
    e.stopPropagation();
    storage.toggleFavoriteRoutine(routineId);
  };

  const handleDeleteRoutine = (e: React.MouseEvent, routineId: string) => {
    e.stopPropagation();
    if (confirm('Delete this custom routine?')) {
      storage.deleteRoutine(routineId);
      if (selectedRoutine?.id === routineId) setSelectedRoutine(null);
    }
  };

  const handleSaveCustomRoutine = () => {
    if (!customName.trim()) {
      alert('Please enter a routine name.');
      return;
    }
    if (customExercises.length === 0) {
      alert('Please add at least one exercise to your routine.');
      return;
    }

    const newRoutine: WorkoutRoutine = {
      id: `custom-routine-${Date.now()}`,
      name: customName.trim(),
      description: customDesc.trim() || 'Custom tailored workout program',
      category: 'muscle_gain',
      targetGoal: customGoal,
      difficulty: customLevel,
      durationMinutes: Math.max(30, customExercises.length * 9),
      equipmentNeeded: customEquipment,
      exercises: customExercises,
      isCustom: true,
      isFavorite: true
    };

    storage.addCustomRoutine(newRoutine);
    setShowCreateModal(false);
    // Reset form
    setCustomName('');
    setCustomDesc('');
    setCustomExercises([]);
    setSelectedCategory('custom');
  };

  const handleAddExerciseToCustom = (ex: Exercise) => {
    setCustomExercises(prev => [
      ...prev,
      {
        exerciseId: ex.id,
        sets: ex.defaultSets || 3,
        targetReps: ex.defaultReps || '10',
        restSeconds: ex.defaultRestSeconds || 60
      }
    ]);
    setShowExercisePicker(false);
  };

  const handleRemoveCustomExercise = (idx: number) => {
    setCustomExercises(prev => prev.filter((_, i) => i !== idx));
  };

  const handleMoveCustomExercise = (idx: number, direction: 'up' | 'down') => {
    setCustomExercises(prev => {
      const copy = [...prev];
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= copy.length) return prev;
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
            Workout Routines
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Choose a proven training program or build your own custom workout split.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Custom Routine</span>
        </button>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search routines by title, goal, or target muscle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#12171e] border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Scrollable Category Segmented Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(cat => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'bg-[#12171e] text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Routine Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRoutines.map(routine => {
          return (
            <div
              key={routine.id}
              onClick={() => setSelectedRoutine(routine)}
              className="bg-[#12171e] rounded-2xl border border-slate-800/90 hover:border-emerald-500/40 p-5 flex flex-col justify-between shadow-md hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="space-y-3">
                
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/30">
                      {routine.difficulty}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mt-1 font-['Outfit']">
                      {routine.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleToggleFavorite(e, routine.id)}
                      className="p-1.5 text-slate-400 hover:text-yellow-400 transition-colors"
                      title="Favorite routine"
                    >
                      <Star className={`w-4 h-4 ${routine.isFavorite ? 'text-yellow-400 fill-yellow-400' : ''}`} />
                    </button>
                    {routine.isCustom && (
                      <button
                        onClick={(e) => handleDeleteRoutine(e, routine.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                        title="Delete custom routine"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {routine.description}
                </p>

                {/* Exercises preview pills */}
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="text-[11px] text-slate-500 mb-1.5 uppercase tracking-wider font-semibold">
                    Exercises ({routine.exercises.length})
                  </div>
                  <div className="flex flex-wrap gap-1 text-[11px] text-slate-300">
                    {routine.exercises.slice(0, 3).map((item, i) => {
                      const ex = allExercises.find(e => e.id === item.exerciseId);
                      return (
                        <span key={i} className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                          {ex ? ex.name : item.exerciseId}
                        </span>
                      );
                    })}
                    {routine.exercises.length > 3 && (
                      <span className="text-slate-500 self-center text-xs">
                        +{routine.exercises.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

              </div>

              {/* Bottom Meta & Start Action */}
              <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>~{routine.durationMinutes} min</span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{routine.equipmentNeeded.replace('_', ' ')}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartRoutine(routine);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Start</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {filteredRoutines.length === 0 && (
        <div className="text-center py-12 bg-[#12171e] rounded-3xl border border-slate-800 p-8 space-y-3">
          <Dumbbell className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-white">No Routines Found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No routines matched your filters. Clear your search or create a custom workout routine tailored to your goals.
          </p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Routine Detail & Preview Modal */}
      {selectedRoutine && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12171e] rounded-3xl border border-slate-800 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            
            <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900/60">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/30">
                  {selectedRoutine.difficulty} · {selectedRoutine.category.replace('_', ' ')}
                </span>
                <h3 className="text-xl font-bold text-white font-['Outfit']">
                  {selectedRoutine.name}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedRoutine.description}
                </p>
              </div>

              <button
                onClick={() => setSelectedRoutine(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Exercises List in Modal */}
            <div className="overflow-y-auto p-5 space-y-3 flex-1">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Target Exercises ({selectedRoutine.exercises.length})
              </div>

              {selectedRoutine.exercises.map((item, idx) => {
                const ex = allExercises.find(e => e.id === item.exerciseId);
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-slate-800 text-[11px] font-bold text-slate-300 flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          {ex ? ex.name : item.exerciseId}
                        </h4>
                      </div>

                      {ex && (
                        <div className="text-xs text-slate-400 pl-7">
                          Target: <span className="capitalize text-slate-300">{ex.targetMuscle}</span>
                          {ex.secondaryMuscles.length > 0 && ` (${ex.secondaryMuscles.join(', ')})`}
                        </div>
                      )}

                      {ex?.instructions && ex.instructions[0] && (
                        <p className="text-[11px] text-slate-500 pl-7 line-clamp-1 italic">
                          "{ex.instructions[0]}"
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-emerald-400 tabular-nums">
                        {item.sets} sets × {item.targetReps}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.restSeconds}s rest
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Bottom CTA */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                Duration: <strong className="text-white font-mono">~{selectedRoutine.durationMinutes} mins</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedRoutine(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const r = selectedRoutine;
                    setSelectedRoutine(null);
                    onStartRoutine(r);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-1.5 glow-electric"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start This Workout</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Create Custom Workout Routine Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12171e] rounded-3xl border border-slate-800 w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                Create Custom Routine
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-4 sm:p-5 space-y-4 flex-1">
              {/* Routine Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Routine Name *</label>
                <input
                  type="text"
                  placeholder="E.g., Chest & Arms Blaster"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Description</label>
                <input
                  type="text"
                  placeholder="Focus points, target split, or rest tempo..."
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Goal & Equipment */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Target Goal</label>
                  <select
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="strength">Strength</option>
                    <option value="fat_loss">Fat Loss</option>
                    <option value="general_fitness">General Fitness</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Equipment</label>
                  <select
                    value={customEquipment}
                    onChange={(e) => setCustomEquipment(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="full_gym">Full Gym</option>
                    <option value="dumbbells">Dumbbells Only</option>
                    <option value="bodyweight">Bodyweight Only</option>
                  </select>
                </div>
              </div>

              {/* Exercises in Routine */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Routine Exercises ({customExercises.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowExercisePicker(true)}
                    className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Exercise
                  </button>
                </div>

                {customExercises.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-slate-800 rounded-2xl text-xs text-slate-500">
                    No exercises added yet. Tap "+ Add Exercise" to choose from the library.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {customExercises.map((item, idx) => {
                      const ex = allExercises.find(e => e.id === item.exerciseId);
                      return (
                        <div
                          key={idx}
                          className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded bg-slate-800 text-[10px] font-bold text-slate-400 flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-bold text-white">
                              {ex ? ex.name : item.exerciseId}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-xs">
                              <input
                                type="number"
                                min="1"
                                max="10"
                                value={item.sets}
                                onChange={(e) => {
                                  const sets = parseInt(e.target.value) || 3;
                                  setCustomExercises(prev => prev.map((it, i) => i === idx ? { ...it, sets } : it));
                                }}
                                className="w-10 text-center p-1 bg-slate-800 border border-slate-700 rounded text-xs text-white"
                              />
                              <span className="text-slate-400">sets</span>
                            </div>

                            {/* Reorder buttons */}
                            <div className="flex flex-col">
                              {idx > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveCustomExercise(idx, 'up')}
                                  className="text-[10px] text-slate-400 hover:text-white"
                                >
                                  ▲
                                </button>
                              )}
                              {idx < customExercises.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveCustomExercise(idx, 'down')}
                                  className="text-[10px] text-slate-400 hover:text-white"
                                >
                                  ▼
                                </button>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveCustomExercise(idx)}
                              className="p-1 text-slate-500 hover:text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCustomRoutine}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95"
              >
                Save Custom Routine
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Picker Modal for Custom Routine */}
      {showExercisePicker && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12171e] rounded-3xl border border-slate-800 w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h4 className="text-base font-bold text-white">Select Exercise</h4>
              <button
                onClick={() => setShowExercisePicker(false)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 border-b border-slate-800">
              <input
                type="text"
                placeholder="Search exercise..."
                value={pickerSearch}
                onChange={(e) => setPickerSearch(e.target.value)}
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="overflow-y-auto p-3 space-y-1.5 flex-1">
              {allExercises
                .filter(e => e.name.toLowerCase().includes(pickerSearch.toLowerCase()) || e.targetMuscle.includes(pickerSearch.toLowerCase()))
                .map(ex => (
                  <div
                    key={ex.id}
                    onClick={() => handleAddExerciseToCustom(ex)}
                    className="p-2.5 rounded-xl bg-slate-800/40 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/40 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{ex.name}</div>
                      <div className="text-[10px] text-slate-400 capitalize">{ex.targetMuscle} · {ex.equipment}</div>
                    </div>
                    <span className="text-xs text-emerald-400 font-semibold">+ Add</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
