import React, { useState } from 'react';
import {
  Dumbbell,
  Sparkles,
  ArrowRight,
  Check,
  Target,
  Zap,
  Shield,
  Activity
} from 'lucide-react';
import { UserProfile, FitnessGoal, ExperienceLevel, EquipmentType, UnitSystem } from '../types';
import { storage } from '../services/storageService';
import { toStoredKg } from '../utils/units';

interface OnboardingModalProps {
  onComplete: (profile: UserProfile) => void;
  onCancel?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<number>(1);
  
  // Form fields
  const [name, setName] = useState<string>('Alex Mercer');
  const [goal, setGoal] = useState<FitnessGoal>('muscle_gain');
  const [level, setLevel] = useState<ExperienceLevel>('intermediate');
  const [equipment, setEquipment] = useState<EquipmentType>('full_gym');
  const [days, setDays] = useState<number>(4);
  const [age, setAge] = useState<number>(27);
  const [height, setHeight] = useState<number>(180);
  const [currentWeight, setCurrentWeight] = useState<number>(78);
  const [targetWeight, setTargetWeight] = useState<number>(82);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');

  const goals = [
    {
      id: 'muscle_gain',
      title: 'Muscle Gain (Hypertrophy)',
      desc: 'Build size, aesthetic definition, and high volume progressive overload.',
      icon: Dumbbell
    },
    {
      id: 'strength',
      title: 'Pure Strength',
      desc: 'Maximal force output, heavy compound lifts (squat, bench, deadlift).',
      icon: Zap
    },
    {
      id: 'fat_loss',
      title: 'Fat Loss & Conditioning',
      desc: 'High-density circuits, caloric burn, and muscle retention.',
      icon: Target
    },
    {
      id: 'general_fitness',
      title: 'General Fitness & Health',
      desc: 'Balanced functional endurance, core stability, and vitality.',
      icon: Activity
    }
  ];

  const levels = [
    { id: 'beginner', title: 'Beginner', desc: 'Under 1 year of consistent lifting. Learning movement mechanics.' },
    { id: 'intermediate', title: 'Intermediate', desc: '1 to 3 years of barbell and free-weight training.' },
    { id: 'advanced', title: 'Advanced', desc: '3+ years of dedicated structured periodization.' }
  ];

  const equipments = [
    { id: 'full_gym', title: 'Full Commercial Gym', desc: 'Barbells, dumbbells, cable stacks, and machines.' },
    { id: 'dumbbells', title: 'Dumbbells & Bench', desc: 'Adjustable dumbbells, bench, and pull-up bar.' },
    { id: 'bodyweight', title: 'Bodyweight Only', desc: 'Calisthenics, push-up variations, core, and pull-ups.' }
  ];

  const handleFinish = () => {
    const finalProfile: UserProfile = {
      id: `user-${Date.now()}`,
      name: name.trim() || 'Athlete',
      email: 'athlete@gymbuddy.app',
      age: age || 25,
      height: height || 178,
      heightUnit: unitSystem === 'imperial' ? 'in' : 'cm',
      currentWeight: currentWeight || 75,
      targetWeight: targetWeight || 80,
      weightUnit: unitSystem === 'imperial' ? 'lbs' : 'kg',
      fitnessGoal: goal,
      experienceLevel: level,
      daysPerWeek: days,
      equipment,
      unitSystem,
      theme: 'dark',
      remindersEnabled: true,
      reminderTime: '07:30',
      reminderDays: [1, 2, 4, 5],
      createdAt: new Date().toISOString(),
      onboardingCompleted: true
    };

    storage.saveProfile(finalProfile);
    onComplete(finalProfile);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0e12]/95 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#12171e] rounded-3xl border border-slate-800 w-full max-w-xl p-6 sm:p-8 shadow-2xl space-y-6 my-auto animate-in zoom-in-95">
        
        {/* Brand Logo & Step Tracker */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/src/assets/images/gymbuddy_app_logo_1792231266446.jpg"
              alt="GymBuddy Logo"
              className="w-10 h-10 rounded-xl object-cover border border-emerald-500/40 shadow-lg shadow-emerald-500/20"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="text-lg font-black text-white font-['Outfit'] flex items-center gap-1">
                GymBuddy
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </span>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                Setup Your Plan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  step === s ? 'bg-emerald-400 w-6' : step > s ? 'bg-emerald-600' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Goal Selection */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
                What is your primary fitness goal?
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                We will configure workout intensity, rep ranges, and rest protocols to match.
              </p>
            </div>

            <div className="space-y-2.5">
              {goals.map(g => {
                const Icon = g.icon;
                const isSelected = goal === g.id;
                return (
                  <div
                    key={g.id}
                    onClick={() => setGoal(g.id as FitnessGoal)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500 shadow-sm shadow-emerald-500/20'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{g.title}</h4>
                        <p className="text-xs text-slate-400">{g.desc}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-emerald-400 shrink-0" />}
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Experience & Equipment */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
                Experience & Available Equipment
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Tell us where and how you will be working out.
              </p>
            </div>

            {/* Experience level */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Experience Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {levels.map(l => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLevel(l.id as ExperienceLevel)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      level === l.id
                        ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">{l.title}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{l.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Equipment */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Equipment Setup
              </label>
              <div className="space-y-2">
                {equipments.map(eq => (
                  <div
                    key={eq.id}
                    onClick={() => setEquipment(eq.id as EquipmentType)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      equipment === eq.id
                        ? 'bg-emerald-950/40 border-emerald-500'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white">{eq.title}</h4>
                      <p className="text-[11px] text-slate-400">{eq.desc}</p>
                    </div>
                    {equipment === eq.id && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-slate-400 hover:text-white"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Schedule */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
                How often can you train?
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                We recommend starting with 3–4 days to allow adequate muscular and CNS recovery.
              </p>
            </div>

            <div className="space-y-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-4xl font-black text-emerald-400 font-['Outfit'] tabular-nums">
                {days}
              </span>
              <span className="text-sm font-bold text-white block">Days per week</span>
              <input
                type="range"
                min="2"
                max="6"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value) || 4)}
                className="w-full accent-emerald-500 mt-2"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold px-1">
                <span>2 Days (Light)</span>
                <span>4 Days (Optimal)</span>
                <span>6 Days (Intense)</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-xs text-emerald-300">
              💡 Based on {days} days/week, we will program a <strong>{days <= 3 ? 'Full Body' : days === 4 ? 'Upper / Lower' : 'Push / Pull / Legs'}</strong> split.
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs font-semibold text-slate-400 hover:text-white"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Body Metrics & Complete */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
                Your Baseline Profile
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Final details to track your body composition and progressive overload.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="E.g. Alex Mercer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 25)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 tabular-nums"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Height (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value) || 178)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 tabular-nums"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Current Weight (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(parseFloat(e.target.value) || 75)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 tabular-nums"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Goal Weight (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(parseFloat(e.target.value) || 80)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 tabular-nums"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="text-xs font-semibold text-slate-400 hover:text-white"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-2 glow-electric"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Launch GymBuddy</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
