import React from 'react';
import { Dumbbell, Flame, Play, Clock, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { ActiveWorkoutState } from '../services/storageService';
import { formatDuration } from '../utils/units';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  profile: UserProfile;
  streak: number;
  activeWorkout: ActiveWorkoutState | null;
  onResumeWorkout: () => void;
  onOpenOnboarding: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  profile,
  streak,
  activeWorkout,
  onResumeWorkout,
  onOpenOnboarding
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0d1217]/90 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Single element brand wordmark */}
        <div 
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Dumbbell className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5 font-['Outfit']">
              GymBuddy
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {[
            { id: 'home', label: 'Home' },
            { id: 'workouts', label: 'Workouts' },
            { id: 'exercises', label: 'Exercise Library' },
            { id: 'progress', label: 'Progress & PRs' },
            { id: 'history', label: 'History' },
            { id: 'profile', label: 'Profile' },
          ].map(item => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-3.5 py-1.5 text-xs lg:text-sm font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions & Streak */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Streak indicator */}
          <div 
            title={`${streak} week streak`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-950/40 border border-orange-500/30 text-orange-400 text-xs font-semibold tabular-nums cursor-default"
          >
            <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
            <span>{streak}w</span>
          </div>

          {/* Active Workout Resume button or New Workout CTA */}
          {activeWorkout ? (
            <button
              onClick={onResumeWorkout}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all glow-electric whitespace-nowrap"
            >
              <Clock className="w-4 h-4 animate-spin text-slate-950" style={{ animationDuration: '3s' }} />
              <span>Resume ({formatDuration(activeWorkout.elapsedSeconds)})</span>
            </button>
          ) : (
            <button
              onClick={() => onSelectTab('workouts')}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs sm:text-sm shadow-md shadow-emerald-500/20 active:scale-95 transition-all whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Start Workout</span>
              <span className="sm:hidden">Start</span>
            </button>
          )}

          {/* User profile avatar thumbnail */}
          <button
            onClick={() => onSelectTab('profile')}
            aria-label="User Profile"
            className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-emerald-400 hover:border-emerald-500 transition-colors"
          >
            {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
          </button>
        </div>

      </div>
    </header>
  );
};
