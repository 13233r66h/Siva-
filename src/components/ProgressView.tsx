import React, { useState } from 'react';
import {
  Award,
  TrendingUp,
  Scale,
  Calendar,
  Camera,
  Plus,
  Trash2,
  X,
  Dumbbell,
  Clock,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { UserProfile, WeightEntry, PersonalRecord, ProgressPhoto } from '../types';
import { storage } from '../services/storageService';
import { formatWeight, weightNumber, toStoredKg } from '../utils/units';

interface ProgressViewProps {
  profile: UserProfile;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ profile }) => {
  const [weightFilterRange, setWeightFilterRange] = useState<'1M' | '3M' | '6M' | 'ALL'>('ALL');
  const [showLogWeightModal, setShowLogWeightModal] = useState<boolean>(false);
  const [newWeightInput, setNewWeightInput] = useState<string>('');
  const [newWeightDate, setNewWeightDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newWeightNote, setNewWeightNote] = useState<string>('');

  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);
  const [photoType, setPhotoType] = useState<'front' | 'side' | 'back'>('front');
  const [photoData, setPhotoData] = useState<string>('');
  const [photoNote, setPhotoNote] = useState<string>('');

  const weightEntries = storage.getWeightEntries();
  const sessions = storage.getSessions();
  const prs = storage.getPersonalRecords();
  const photos = storage.getProgressPhotos();

  // Filter weight entries
  const now = new Date();
  const filteredWeights = weightEntries.filter(entry => {
    if (weightFilterRange === 'ALL') return true;
    const entryDate = new Date(entry.date);
    const diffMonths = (now.getFullYear() - entryDate.getFullYear()) * 12 + (now.getMonth() - entryDate.getMonth());
    if (weightFilterRange === '1M') return diffMonths <= 1;
    if (weightFilterRange === '3M') return diffMonths <= 3;
    if (weightFilterRange === '6M') return diffMonths <= 6;
    return true;
  });

  const handleSaveWeight = () => {
    const val = parseFloat(newWeightInput);
    if (isNaN(val) || val <= 20 || val >= 300) {
      alert('Please enter a valid weight.');
      return;
    }

    const storedKg = toStoredKg(val, profile.unitSystem);
    storage.logWeight(storedKg, newWeightDate, newWeightNote.trim());
    setShowLogWeightModal(false);
    setNewWeightInput('');
    setNewWeightNote('');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotoData(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = () => {
    if (!photoData) {
      alert('Please upload an image.');
      return;
    }

    const newPhoto: ProgressPhoto = {
      id: `photo-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      weight: profile.currentWeight,
      note: photoNote.trim(),
      photoDataUrl: photoData,
      type: photoType
    };

    storage.saveProgressPhoto(newPhoto);
    setShowPhotoModal(false);
    setPhotoData('');
    setPhotoNote('');
  };

  // SVG Chart Calculation for Body Weight
  const chartWidth = 600;
  const chartHeight = 180;
  const paddingX = 40;
  const paddingY = 30;

  const weights = filteredWeights.map(e => weightNumber(e.weight, profile.unitSystem));
  const minW = weights.length > 0 ? Math.floor(Math.min(...weights) - 1) : 70;
  const maxW = weights.length > 0 ? Math.ceil(Math.max(...weights) + 1) : 85;
  const rangeW = Math.max(1, maxW - minW);

  const points = filteredWeights.map((e, idx) => {
    const x = paddingX + (idx / Math.max(1, filteredWeights.length - 1)) * (chartWidth - paddingX * 2);
    const currentVal = weightNumber(e.weight, profile.unitSystem);
    const y = chartHeight - paddingY - ((currentVal - minW) / rangeW) * (chartHeight - paddingY * 2);
    return { x, y, date: e.date, val: currentVal };
  });

  const pathD = points.length > 1
    ? points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '')
    : '';

  // Calculate total volume per month / weekly
  const totalVolumeAllTime = sessions.reduce((sum, s) => sum + s.totalVolume, 0);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
            Progress & Performance
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track body metrics, personal record milestones, and total training volume.
          </p>
        </div>

        <button
          onClick={() => setShowLogWeightModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0"
        >
          <Scale className="w-4 h-4" />
          <span>Log Weight</span>
        </button>
      </div>

      {/* Body Weight Progression Chart */}
      <div className="bg-[#12171e] rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Body Weight History
              </h2>
            </div>
            <div className="text-2xl font-black text-white font-['Outfit'] tabular-nums flex items-baseline gap-2">
              {formatWeight(profile.currentWeight, profile.unitSystem)}
              <span className="text-xs font-semibold text-slate-400">
                Target: {formatWeight(profile.targetWeight, profile.unitSystem)}
              </span>
            </div>
          </div>

          {/* Time range filters */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
            {(['1M', '3M', '6M', 'ALL'] as const).map(range => (
              <button
                key={range}
                onClick={() => setWeightFilterRange(range)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                  weightFilterRange === range
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Interactive Line Chart */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[500px]">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44 overflow-visible">
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="#1e293b" strokeDasharray="3 3" />
              <line x1={paddingX} y1={chartHeight / 2} x2={chartWidth - paddingX} y2={chartHeight / 2} stroke="#1e293b" strokeDasharray="3 3" />
              <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="#1e293b" strokeDasharray="3 3" />

              {/* Y Axis Labels */}
              <text x={paddingX - 8} y={paddingY + 4} fill="#64748b" fontSize="10" textAnchor="end" className="tabular-nums font-mono">{maxW}</text>
              <text x={paddingX - 8} y={chartHeight / 2 + 4} fill="#64748b" fontSize="10" textAnchor="end" className="tabular-nums font-mono">{((maxW + minW) / 2).toFixed(1)}</text>
              <text x={paddingX - 8} y={chartHeight - paddingY + 4} fill="#64748b" fontSize="10" textAnchor="end" className="tabular-nums font-mono">{minW}</text>

              {/* Area Under Line */}
              {points.length > 1 && (
                <path
                  d={`${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`}
                  fill="url(#weightGrad)"
                />
              )}

              {/* Stroke line */}
              {points.length > 1 && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Point dots */}
              {points.map((p, idx) => (
                <g key={idx} className="group cursor-pointer">
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill="#10b981"
                    stroke="#0f172a"
                    strokeWidth="2"
                    className="hover:r-6 transition-all"
                  />
                  <text
                    x={p.x}
                    y={p.y - 8}
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="opacity-0 group-hover:opacity-100 transition-opacity tabular-nums font-mono"
                  >
                    {p.val}
                  </text>
                  <text
                    x={p.x}
                    y={chartHeight - paddingY + 16}
                    fill="#64748b"
                    fontSize="9"
                    textAnchor="middle"
                  >
                    {p.date.slice(5)}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Personal Records (PR) Hall of Fame */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            <h2 className="text-base sm:text-lg font-bold text-white font-['Outfit']">
              Personal Records (PR)
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Estimated 1-Rep Max based on working sets (warmup sets excluded)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {prs.map(pr => (
            <div
              key={pr.exerciseId}
              className="bg-[#12171e] rounded-2xl border border-slate-800 p-4 flex flex-col justify-between shadow-sm hover:border-yellow-500/40 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider px-2 py-0.5 rounded-md bg-yellow-950/40 border border-yellow-500/30">
                    PR
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(pr.dateAchieved).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white font-['Outfit'] mt-1">
                  {pr.exerciseName}
                </h3>
              </div>

              <div className="pt-3 border-t border-slate-800/80 mt-3 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Top Weight</span>
                  <span className="text-lg font-black text-white tabular-nums">
                    {formatWeight(pr.maxWeight, profile.unitSystem)} × {pr.reps}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Est. 1RM</span>
                  <span className="text-base font-black text-emerald-400 tabular-nums">
                    {formatWeight(pr.estimatedOneRepMax, profile.unitSystem)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Training Volume Progression Section */}
      <div className="bg-[#12171e] rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white font-['Outfit']">
                Training Volume Progression
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              True mechanical working volume. Warmup sets are automatically excluded.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">All-Time Working Volume:</span>
            <span className="text-sm font-bold text-emerald-400 tabular-nums">
              {formatWeight(totalVolumeAllTime, profile.unitSystem)}
            </span>
          </div>
        </div>

        {/* Volume over recent sessions bar breakdown */}
        <div className="space-y-2 pt-2">
          {sessions.slice(0, 5).map((s, idx) => {
            const maxVol = Math.max(...sessions.slice(0, 5).map(it => it.totalVolume), 1);
            const pct = Math.min(100, Math.max(10, Math.round((s.totalVolume / maxVol) * 100)));
            const workingSets = s.exercises.reduce((acc, ex) => acc + ex.sets.filter(st => st.completed && !st.isWarmup).length, 0);
            const warmupSets = s.exercises.reduce((acc, ex) => acc + ex.sets.filter(st => st.completed && st.isWarmup).length, 0);

            return (
              <div key={s.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white truncate max-w-[200px] sm:max-w-xs">{s.routineName}</span>
                    <span className="text-slate-500 text-[11px]">{new Date(s.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-emerald-400 tabular-nums">{formatWeight(s.totalVolume, profile.unitSystem)}</span>
                    <span className="text-[10px] text-slate-400">({workingSets} working{warmupSets > 0 ? `, ${warmupSets} warmup` : ''})</span>
                  </div>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-green-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Photos Gallery Section */}
      <div className="bg-[#12171e] rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-white font-['Outfit']">
                Progress Photos & Body Composition
              </h2>
              <p className="text-xs text-slate-400">
                Visual transformation timeline. Photos stay safe on your device.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowPhotoModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add Photo</span>
          </button>
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-slate-800 rounded-2xl p-6 text-slate-400 space-y-2">
            <Camera className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs">No progress photos uploaded yet.</p>
            <p className="text-[11px] text-slate-500">Take front, side, or back photos every 2–4 weeks to monitor body changes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {photos.map(p => (
              <div key={p.id} className="relative rounded-2xl overflow-hidden border border-slate-800 group bg-slate-900">
                <img
                  src={p.photoDataUrl}
                  alt="Progress photo"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5">
                  <div className="flex items-center justify-between text-[11px] text-white font-semibold">
                    <span>{p.date}</span>
                    <span className="text-emerald-400">{formatWeight(p.weight, profile.unitSystem)}</span>
                  </div>
                  <span className="text-[10px] text-slate-300 capitalize">{p.type} view</span>
                </div>
                <button
                  onClick={() => storage.deleteProgressPhoto(p.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Weight Modal */}
      {showLogWeightModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12171e] rounded-3xl border border-slate-800 w-full max-w-sm p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Log Current Weight</h3>
              <button onClick={() => setShowLogWeightModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Weight ({profile.unitSystem === 'imperial' ? 'lbs' : 'kg'}) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder={String(weightNumber(profile.currentWeight, profile.unitSystem))}
                  value={newWeightInput}
                  onChange={(e) => setNewWeightInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-base font-bold text-white focus:outline-none focus:border-emerald-500 tabular-nums"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Date</label>
                <input
                  type="date"
                  value={newWeightDate}
                  onChange={(e) => setNewWeightDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Note (optional)</label>
                <input
                  type="text"
                  placeholder="Morning fasting, post workout, etc."
                  value={newWeightNote}
                  onChange={(e) => setNewWeightNote(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowLogWeightModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveWeight}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95"
              >
                Save Weight
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Photo Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12171e] rounded-3xl border border-slate-800 w-full max-w-sm p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Add Progress Photo</h3>
              <button onClick={() => setShowPhotoModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Angle / Pose</label>
                <select
                  value={photoType}
                  onChange={(e) => setPhotoType(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="front">Front View</option>
                  <option value="side">Side Profile</option>
                  <option value="back">Back View</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Upload Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-emerald-400 hover:file:bg-slate-700"
                />
              </div>

              {photoData && (
                <div className="w-full h-36 rounded-xl overflow-hidden border border-slate-700">
                  <img src={photoData} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Notes (optional)</label>
                <input
                  type="text"
                  placeholder="Week 4 of hypertrophy block..."
                  value={photoNote}
                  onChange={(e) => setPhotoNote(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowPhotoModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePhoto}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95"
              >
                Save Photo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
