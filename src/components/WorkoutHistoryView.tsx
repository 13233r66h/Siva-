import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Dumbbell,
  Trash2,
  ChevronRight,
  X,
  Play,
  Award,
  Bell,
  CheckCircle2
} from 'lucide-react';
import { WorkoutSession, UserProfile, WorkoutRoutine } from '../types';
import { storage } from '../services/storageService';
import { formatDuration, formatWeight } from '../utils/units';

interface WorkoutHistoryViewProps {
  profile: UserProfile;
  sessions: WorkoutSession[];
  onRepeatWorkout: (session: WorkoutSession) => void;
  onNavigateTab: (tab: string) => void;
}

export const WorkoutHistoryView: React.FC<WorkoutHistoryViewProps> = ({
  profile,
  sessions,
  onRepeatWorkout,
  onNavigateTab
}) => {
  const [selectedSession, setSelectedSession] = useState<WorkoutSession | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Generate calendar dates for the active month
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth(); // 0-11
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const totalDays = lastDay.getDate();

  // Day offset for starting day of week (0 = Sun, 1 = Mon...)
  const startDayOfWeek = (firstDay.getDay() + 6) % 7; // Convert to Mon=0...Sun=6

  // Map of completed workout dates
  const workoutDatesMap = new Map<string, WorkoutSession[]>();
  sessions.forEach(s => {
    const dStr = s.startTime.split('T')[0];
    const list = workoutDatesMap.get(dStr) || [];
    list.push(s);
    workoutDatesMap.set(dStr, list);
  });

  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this workout log?')) {
      storage.deleteSession(sessionId);
      if (selectedSession?.id === sessionId) setSelectedSession(null);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
            Workout History & Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review past training logs, volume trends, and consistency streaks.
          </p>
        </div>

        {/* Reminder alert banner button */}
        <button
          onClick={() => onNavigateTab('profile')}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto border border-slate-700/80"
        >
          <Bell className="w-4 h-4 text-emerald-400" />
          <span>Reminders: {profile.remindersEnabled ? `${profile.reminderTime}` : 'Disabled'}</span>
        </button>
      </div>

      {/* Interactive Month Calendar View */}
      <div className="bg-[#12171e] rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold text-white font-['Outfit']">
              {currentMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </h2>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-300"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-emerald-400"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-300"
            >
              Next
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center text-[11px] font-bold text-slate-500 uppercase py-1">
              {day}
            </div>
          ))}

          {/* Blank prefix boxes */}
          {Array.from({ length: startDayOfWeek }).map((_, i) => (
            <div key={`blank-${i}`} className="h-10 sm:h-14 rounded-xl bg-slate-900/30" />
          ))}

          {/* Actual days */}
          {Array.from({ length: totalDays }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const daySessions = workoutDatesMap.get(dateStr) || [];
            const hasWorkout = daySessions.length > 0;
            const isToday = dateStr === new Date().toISOString().split('T')[0];

            return (
              <div
                key={dayNum}
                onClick={() => {
                  if (hasWorkout) setSelectedSession(daySessions[0]);
                }}
                className={`h-11 sm:h-14 rounded-xl p-1 sm:p-2 border transition-all flex flex-col justify-between cursor-pointer ${
                  hasWorkout
                    ? 'bg-emerald-950/40 border-emerald-500/50 hover:border-emerald-400 hover:scale-[1.03] shadow-sm shadow-emerald-500/10'
                    : isToday
                    ? 'bg-slate-800/80 border-slate-700 text-white'
                    : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-800/50 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold tabular-nums ${isToday ? 'text-emerald-400 font-extrabold' : ''}`}>
                    {dayNum}
                  </span>
                  {hasWorkout && (
                    <div className="w-2 h-2 rounded-full bg-emerald-400 glow-electric" />
                  )}
                </div>

                {hasWorkout && (
                  <span className="text-[9px] font-medium text-emerald-300 truncate hidden sm:block">
                    {daySessions[0].routineName.split('—')[0]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Session Logs List */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-white font-['Outfit']">
          All Logged Workouts ({sessions.length})
        </h2>

        {sessions.length === 0 ? (
          <div className="text-center py-12 bg-[#12171e] rounded-3xl border border-slate-800 p-8 space-y-3">
            <Dumbbell className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-base font-bold text-white">No Workouts Recorded</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Start your first session to build your training history and unlock volume stats.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map(session => (
              <div
                key={session.id}
                onClick={() => setSelectedSession(session)}
                className="bg-[#12171e] rounded-2xl border border-slate-800 hover:border-emerald-500/40 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition-all shadow-sm group"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-emerald-400">
                      {new Date(session.startTime).toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-xs text-slate-400">
                      {new Date(session.startTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-400 transition-colors font-['Outfit']">
                    {session.routineName}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {formatDuration(session.durationSeconds)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{session.exercises.length} exercises</span>
                    <span aria-hidden="true">·</span>
                    <span>{session.totalSetsCompleted} sets</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-400 font-semibold tabular-nums">
                      {formatWeight(session.totalVolume, profile.unitSystem)} volume
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80 justify-between md:justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRepeatWorkout(session);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Repeat</span>
                  </button>

                  <button
                    onClick={(e) => handleDelete(e, session.id)}
                    className="p-2 text-slate-500 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-800"
                    title="Delete log"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors hidden sm:block" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detailed Workout Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12171e] rounded-3xl border border-slate-800 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            
            <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900/60">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-emerald-400">
                  {new Date(selectedSession.startTime).toLocaleDateString(undefined, {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                <h3 className="text-xl font-bold text-white font-['Outfit']">
                  {selectedSession.routineName}
                </h3>
              </div>

              <button
                onClick={() => setSelectedSession(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick KPI Strip */}
            <div className="grid grid-cols-3 gap-2 p-4 bg-slate-900/40 border-b border-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-500 uppercase">Duration</span>
                <p className="text-sm font-bold text-white font-mono">
                  {formatDuration(selectedSession.durationSeconds)}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase">Total Volume</span>
                <p className="text-sm font-bold text-emerald-400 tabular-nums">
                  {formatWeight(selectedSession.totalVolume, profile.unitSystem)}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase">Sets Completed</span>
                <p className="text-sm font-bold text-white tabular-nums">
                  {selectedSession.totalSetsCompleted}
                </p>
              </div>
            </div>

            {/* Exercise Breakdown */}
            <div className="overflow-y-auto p-5 space-y-4 flex-1">
              {selectedSession.notes && (
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300 italic">
                  <strong>Notes: </strong>"{selectedSession.notes}"
                </div>
              )}

              {selectedSession.exercises.map((ex, idx) => (
                <div key={idx} className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{ex.exerciseName}</h4>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
                      {ex.targetMuscle}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {ex.sets.map((set, sIdx) => (
                      <div
                        key={set.id}
                        className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-slate-800/40"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400 font-semibold">Set {sIdx + 1}</span>
                          {set.isWarmup && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-950/70 text-amber-400 border border-amber-500/30 uppercase tracking-tight">
                              Warmup
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold tabular-nums ${set.isWarmup ? 'text-amber-200/90' : 'text-white'}`}>
                            {formatWeight(set.weight, profile.unitSystem)} × {set.reps} reps
                          </span>
                          {set.completed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Bottom CTA */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedSession(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const s = selectedSession;
                  setSelectedSession(null);
                  onRepeatWorkout(s);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Repeat This Workout</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
