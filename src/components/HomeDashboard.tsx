import React from 'react';
import {
  Play,
  Flame,
  Award,
  TrendingUp,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Dumbbell,
  Sparkles,
  ArrowUpRight,
  Clock,
  HeartPulse
} from 'lucide-react';
import { UserProfile, WorkoutRoutine, WorkoutSession } from '../types';
import { formatWeight, formatDuration } from '../utils/units';
import { generateRecommendations } from '../services/recommendationEngine';
import { storage } from '../services/storageService';

interface HomeDashboardProps {
  profile: UserProfile;
  routines: WorkoutRoutine[];
  sessions: WorkoutSession[];
  onStartRoutine: (routine: WorkoutRoutine) => void;
  onNavigateTab: (tab: string) => void;
  onOpenLiveWorkout: () => void;
  streak: number;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  profile,
  routines,
  sessions,
  onStartRoutine,
  onNavigateTab,
  onOpenLiveWorkout,
  streak
}) => {
  const weeklyCompletion = storage.getWeeklyCompletion();
  const recommendation = generateRecommendations(profile, routines);
  const prs = storage.getPersonalRecords();
  const weightEntries = storage.getWeightEntries();

  // Calculate weight change from earliest entry to current
  const earliestWeight = weightEntries.length > 0 ? weightEntries[0].weight : profile.currentWeight;
  const weightDelta = Number((profile.currentWeight - earliestWeight).toFixed(1));

  // Determine today's planned or suggested workout
  const todaysWorkout = recommendation.primaryRoutine;

  // Most recent session
  const lastSession = sessions.length > 0 ? sessions[0] : null;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Welcome Card */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-[#12171e] shadow-2xl">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/gymbuddy_hero_banner_1792231267162.jpg"
            alt="Gym training facility"
            className="w-full h-full object-cover opacity-20 filter contrast-125"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0d1217] via-[#0d1217]/90 to-transparent" />
        </div>

        <div className="relative z-10 p-5 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Ready for Today's Session</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
              Welcome back, {profile.name || 'Athlete'}!
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Target for today: <strong className="text-emerald-400 font-semibold">{todaysWorkout.name}</strong>. Keep your {streak}w streak alive and stay consistent with your {profile.fitnessGoal.replace('_', ' ')} plan.
            </p>

            {/* Quick Metadata */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-400">
              <span>{profile.experienceLevel.toUpperCase()}</span>
              <span aria-hidden="true">·</span>
              <span>{profile.equipment.replace('_', ' ').toUpperCase()}</span>
              <span aria-hidden="true">·</span>
              <span>{profile.daysPerWeek} DAYS / WK</span>
            </div>
          </div>

          {/* Big Start Today's Workout Button */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={() => onStartRoutine(todaysWorkout)}
              className="px-6 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/25 active:scale-95 transition-all glow-electric"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start Today's Workout</span>
            </button>

            <button
              onClick={() => onNavigateTab('workouts')}
              className="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Explore All Routines</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Workout Adherence Calendar Bar */}
      <div className="bg-[#12171e] rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white tracking-tight uppercase">
              Weekly Training Adherence
            </h2>
          </div>
          <span className="text-xs text-emerald-400 font-semibold tabular-nums">
            {weeklyCompletion.filter(d => d.isCompleted).length} / {profile.daysPerWeek} target days
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weeklyCompletion.map((day, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border transition-all ${
                day.isCompleted
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-500/10'
                  : day.isToday
                  ? 'bg-slate-800 border-emerald-400/40 text-white'
                  : 'bg-slate-900/60 border-slate-800/80 text-slate-500'
              }`}
            >
              <span className="text-[10px] font-semibold uppercase">{day.dayName}</span>
              <span className="text-xs font-bold tabular-nums mt-0.5">{day.shortDate}</span>
              <div className="mt-1.5">
                {day.isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <div className={`w-2 h-2 rounded-full ${day.isToday ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700'}`} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Key Performance Indicator (KPI) Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Workouts */}
        <div 
          onClick={() => onNavigateTab('history')}
          className="bg-[#12171e] p-4 rounded-2xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Sessions</span>
            <Dumbbell className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tabular-nums">
            {sessions.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span>Completed to date</span>
            <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </div>
        </div>

        {/* Current Weight & Progress */}
        <div 
          onClick={() => onNavigateTab('progress')}
          className="bg-[#12171e] p-4 rounded-2xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Current Weight</span>
            <HeartPulse className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tabular-nums">
            {formatWeight(profile.currentWeight, profile.unitSystem)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className={weightDelta >= 0 ? 'text-emerald-400 font-semibold' : 'text-cyan-400 font-semibold'}>
              {weightDelta >= 0 ? `+${weightDelta} kg` : `${weightDelta} kg`}
            </span>
            <span>since tracking</span>
          </div>
        </div>

        {/* Streak */}
        <div className="bg-[#12171e] p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Streak</span>
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tabular-nums flex items-baseline gap-1">
            {streak}
            <span className="text-sm font-semibold text-slate-400">weeks</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Consistency level: <strong className="text-orange-400">High</strong>
          </div>
        </div>

        {/* Top Personal Record */}
        <div 
          onClick={() => onNavigateTab('progress')}
          className="bg-[#12171e] p-4 rounded-2xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Top Lift (1RM)</span>
            <Award className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tabular-nums truncate">
            {prs.length > 0 ? formatWeight(prs[0].estimatedOneRepMax, profile.unitSystem) : '--'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 truncate">
            {prs.length > 0 ? prs[0].exerciseName : 'Log sets to unlock'}
          </div>
        </div>

      </div>

      {/* Two Column Layout on Desktop: Personalized Recommendation & Recent Workout Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* Recommendation Spotlight */}
        <div className="bg-[#12171e] rounded-3xl p-5 sm:p-6 border border-slate-800 flex flex-col justify-between shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Personalized Recommendation
                </h3>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30">
                Matched for you
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-bold text-white font-['Outfit']">
                {recommendation.primaryRoutine.name}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {recommendation.reason}
              </p>
            </div>

            {/* Split & Recovery Guidance */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-2 text-xs">
              <div className="text-slate-300">
                <strong className="text-emerald-400">Split Blueprint: </strong>
                {recommendation.splitAdvice}
              </div>
              <div className="text-slate-400">
                <strong className="text-slate-300">Rest-Day Protocol: </strong>
                {recommendation.restDayGuidance}
              </div>
            </div>
          </div>

          <div className="pt-5 flex items-center justify-between border-t border-slate-800/80 mt-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{recommendation.primaryRoutine.durationMinutes} mins</span>
              <span aria-hidden="true">·</span>
              <span>{recommendation.primaryRoutine.exercises.length} exercises</span>
            </div>

            <button
              onClick={() => onStartRoutine(recommendation.primaryRoutine)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Start Routine</span>
            </button>
          </div>
        </div>

        {/* Recent Workout & Quick Repeat */}
        <div className="bg-[#12171e] rounded-3xl p-5 sm:p-6 border border-slate-800 flex flex-col justify-between shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Latest Completed Session
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('history')}
                className="text-xs text-emerald-400 hover:underline flex items-center gap-0.5"
              >
                View all ({sessions.length})
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {lastSession ? (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-white">
                      {lastSession.routineName}
                    </h4>
                    <span className="text-xs text-slate-400">
                      {new Date(lastSession.startTime).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 text-center border-t border-slate-800/80 pt-2.5">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Duration</span>
                      <p className="text-xs font-semibold text-white font-mono">
                        {formatDuration(lastSession.durationSeconds)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Volume</span>
                      <p className="text-xs font-semibold text-emerald-400 tabular-nums">
                        {formatWeight(lastSession.totalVolume, profile.unitSystem)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Sets</span>
                      <p className="text-xs font-semibold text-white tabular-nums">
                        {lastSession.totalSetsCompleted}
                      </p>
                    </div>
                  </div>

                  {lastSession.notes && (
                    <p className="text-xs text-slate-400 italic mt-2.5 bg-slate-950/40 p-2 rounded-lg">
                      "{lastSession.notes}"
                    </p>
                  )}
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Progressive overload logged across {lastSession.exercises.length} exercises.</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">
                No previous sessions recorded yet. Start your first workout today!
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-end">
            {lastSession && (
              <button
                onClick={() => {
                  const routine = routines.find(r => r.id === lastSession.routineId) || todaysWorkout;
                  onStartRoutine(routine);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
                <span>Repeat This Workout</span>
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
