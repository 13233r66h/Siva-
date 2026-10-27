import React, { useEffect, useState } from 'react';
import { Timer, Plus, Minus, X, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import { sound } from '../utils/sound';

interface RestTimerWidgetProps {
  targetEndTime: number | null; // epoch timestamp
  totalDuration: number;
  onAdjustTime: (secondsDelta: number) => void;
  onCancelTimer: () => void;
  onTimerComplete: () => void;
}

export const RestTimerWidget: React.FC<RestTimerWidgetProps> = ({
  targetEndTime,
  totalDuration,
  onAdjustTime,
  onCancelTimer,
  onTimerComplete
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  useEffect(() => {
    if (!targetEndTime) {
      setSecondsRemaining(0);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const diffMs = targetEndTime - now;
      const secs = Math.max(0, Math.ceil(diffMs / 1000));
      setSecondsRemaining(secs);

      // Play beeps for final 3 seconds
      if (soundEnabled && secs <= 3 && secs > 0) {
        sound.playTick();
      }

      if (secs <= 0) {
        clearInterval(interval);
        if (soundEnabled) {
          sound.playCompleteChime();
        }
        onTimerComplete();
      }
    }, 500);

    return () => clearInterval(interval);
  }, [targetEndTime, soundEnabled, onTimerComplete]);

  if (!targetEndTime || secondsRemaining <= 0) {
    return null;
  }

  const progressPercent = totalDuration > 0
    ? Math.min(100, Math.max(0, ((totalDuration - secondsRemaining) / totalDuration) * 100))
    : 0;

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeDisplay = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  if (isMinimized) {
    return (
      <div className="fixed bottom-20 md:bottom-6 right-4 z-50 bg-[#161d24] border border-emerald-500/50 rounded-2xl p-2 shadow-2xl flex items-center gap-3 backdrop-blur-md glow-electric animate-in fade-in slide-in-from-bottom-4">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/60 text-emerald-400 font-bold text-sm tabular-nums"
        >
          <Timer className="w-4 h-4 animate-spin text-emerald-400" style={{ animationDuration: '4s' }} />
          <span>Rest {timeDisplay}</span>
          <Maximize2 className="w-3.5 h-3.5 text-slate-400 ml-1" />
        </button>
        <button
          onClick={onCancelTimer}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          title="Dismiss rest"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 max-w-md mx-auto z-50 bg-[#161d24]/95 backdrop-blur-xl border border-emerald-500/40 rounded-2xl p-3.5 shadow-2xl shadow-black/80 animate-in fade-in slide-in-from-bottom-4">
      
      {/* Header row */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center">
            <Timer className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Rest Timer</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1 rounded-md text-slate-400 hover:text-white"
            title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 rounded-md text-slate-400 hover:text-white"
            title="Minimize"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={onCancelTimer}
            className="p-1 rounded-md text-slate-400 hover:text-red-400"
            title="Skip Rest"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Timer Display and Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl font-black text-emerald-400 tabular-nums font-['Outfit'] tracking-tight">
            {timeDisplay}
          </div>
          <span className="text-xs text-slate-400">Next set ready</span>
        </div>

        {/* Quick adjustment buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onAdjustTime(-15)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-0.5 active:scale-95 transition-transform"
          >
            <Minus className="w-3 h-3" /> 15s
          </button>
          <button
            onClick={() => onAdjustTime(30)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-semibold flex items-center gap-0.5 active:scale-95 transition-transform"
          >
            <Plus className="w-3 h-3" /> 30s
          </button>
          <button
            onClick={onCancelTimer}
            className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold active:scale-95 transition-transform"
          >
            Skip
          </button>
        </div>
      </div>

      {/* Progress track */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
        <div
          className="bg-gradient-to-r from-emerald-500 to-green-400 h-full transition-all duration-500 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

    </div>
  );
};
