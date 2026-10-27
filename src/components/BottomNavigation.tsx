import React from 'react';
import { Home, Dumbbell, Play, TrendingUp, User, Clock } from 'lucide-react';
import { ActiveWorkoutState } from '../services/storageService';

interface BottomNavigationProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  activeWorkout: ActiveWorkoutState | null;
  onOpenLiveWorkout: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onSelectTab,
  activeWorkout,
  onOpenLiveWorkout
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d1217]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 pb-safe">
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto">
        
        {/* Tab 1: Home */}
        <button
          onClick={() => onSelectTab('home')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            currentTab === 'home' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className={`w-5 h-5 ${currentTab === 'home' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Home</span>
        </button>

        {/* Tab 2: Workouts */}
        <button
          onClick={() => onSelectTab('workouts')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            currentTab === 'workouts' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Dumbbell className={`w-5 h-5 ${currentTab === 'workouts' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Workouts</span>
        </button>

        {/* Tab 3: Start Workout (Prominent Center Button) */}
        <div className="flex items-center justify-center">
          <button
            onClick={() => {
              if (activeWorkout) {
                onOpenLiveWorkout();
              } else {
                onSelectTab('workouts');
              }
            }}
            aria-label={activeWorkout ? "Resume active workout" : "Start workout"}
            className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center shadow-lg active:scale-95 transition-all -translate-y-2 border-2 ${
              activeWorkout
                ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-emerald-500/40 glow-electric'
                : 'bg-emerald-500 text-slate-950 border-emerald-400/50 shadow-emerald-500/30 hover:bg-emerald-400'
            }`}
          >
            {activeWorkout ? (
              <Clock className="w-5 h-5 text-slate-950 animate-pulse stroke-[2.5]" />
            ) : (
              <Play className="w-5 h-5 text-slate-950 fill-current ml-0.5" />
            )}
            <span className="text-[8px] font-bold text-slate-950 tracking-tighter uppercase leading-none mt-0.5">
              {activeWorkout ? 'Active' : 'Start'}
            </span>
          </button>
        </div>

        {/* Tab 4: Progress */}
        <button
          onClick={() => onSelectTab('progress')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            currentTab === 'progress' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className={`w-5 h-5 ${currentTab === 'progress' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Progress</span>
        </button>

        {/* Tab 5: Profile */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            currentTab === 'profile' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className={`w-5 h-5 ${currentTab === 'profile' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Profile</span>
        </button>

      </div>
    </div>
  );
};
