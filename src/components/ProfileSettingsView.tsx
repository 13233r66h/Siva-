import React, { useState } from 'react';
import {
  User,
  Settings,
  Bell,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Check,
  Moon,
  Sun,
  Shield,
  HelpCircle,
  Save,
  LogOut
} from 'lucide-react';
import { UserProfile, FitnessGoal, ExperienceLevel, EquipmentType, UnitSystem } from '../types';
import { storage } from '../services/storageService';
import { formatWeight, formatHeight, weightNumber, toStoredKg } from '../utils/units';

interface ProfileSettingsViewProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onOpenOnboarding: () => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  profile,
  onUpdateProfile,
  onOpenOnboarding
}) => {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [importStatus, setImportStatus] = useState<string>('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storage.saveProfile(formData);
    onUpdateProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleUnitToggle = (unit: UnitSystem) => {
    const updated = { ...formData, unitSystem: unit };
    setFormData(updated);
    storage.saveProfile(updated);
    onUpdateProfile(updated);
  };

  const handleThemeToggle = (theme: 'dark' | 'light') => {
    const updated = { ...formData, theme };
    setFormData(updated);
    storage.saveProfile(updated);
    onUpdateProfile(updated);
  };

  const handleExportData = () => {
    const jsonStr = storage.exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gymbuddy_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const success = storage.importData(reader.result);
          if (success) {
            setImportStatus('Backup restored successfully!');
            setFormData(storage.getProfile());
            onUpdateProfile(storage.getProfile());
          } else {
            setImportStatus('Failed to restore backup. Invalid JSON file.');
          }
          setTimeout(() => setImportStatus(''), 4000);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetDemo = () => {
    if (confirm('Reset application to demo data? This will restore sample workouts and weight logs.')) {
      storage.resetToDemo();
      setFormData(storage.getProfile());
      onUpdateProfile(storage.getProfile());
      alert('Demo data restored successfully.');
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Delete all your data and reset your profile? This action is permanent.')) {
      storage.resetToDemo();
      onOpenOnboarding();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
          Profile & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Customize your athletic metrics, workout schedule, measurement units, and reminders.
        </p>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="bg-[#12171e] rounded-3xl p-5 sm:p-7 border border-slate-800 shadow-xl space-y-6">
        
        {/* User Card Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800/80">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xl font-black text-emerald-400 font-['Outfit']">
            {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-['Outfit']">
              {formData.name || 'Athlete'}
            </h2>
            <p className="text-xs text-slate-400">
              {formData.email || 'Free Member'}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
                {formData.experienceLevel}
              </span>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider px-2 py-0.5 rounded bg-blue-950/60 border border-blue-500/30">
                {formData.fitnessGoal.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Personal Details */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Personal Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Age</label>
              <input
                type="number"
                min="14"
                max="100"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 25 })}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 tabular-nums"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Height (cm)</label>
              <input
                type="number"
                min="100"
                max="250"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || 175 })}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 tabular-nums"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Current Weight ({formData.unitSystem === 'imperial' ? 'lbs' : 'kg'})
              </label>
              <input
                type="number"
                step="0.1"
                value={weightNumber(formData.currentWeight, formData.unitSystem)}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 75;
                  setFormData({ ...formData, currentWeight: toStoredKg(val, formData.unitSystem) });
                }}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 tabular-nums"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Target Weight ({formData.unitSystem === 'imperial' ? 'lbs' : 'kg'})
              </label>
              <input
                type="number"
                step="0.1"
                value={weightNumber(formData.targetWeight, formData.unitSystem)}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 80;
                  setFormData({ ...formData, targetWeight: toStoredKg(val, formData.unitSystem) });
                }}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Training Goals & Setup */}
        <div className="space-y-4 pt-4 border-t border-slate-800/80">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Training Goals & Setup
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Fitness Goal</label>
              <select
                value={formData.fitnessGoal}
                onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value as FitnessGoal })}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="muscle_gain">Muscle Gain</option>
                <option value="strength">Pure Strength</option>
                <option value="fat_loss">Fat Loss</option>
                <option value="general_fitness">General Fitness</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Experience Level</label>
              <select
                value={formData.experienceLevel}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as ExperienceLevel })}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="beginner">Beginner (&lt; 1 yr)</option>
                <option value="intermediate">Intermediate (1-3 yrs)</option>
                <option value="advanced">Advanced (3+ yrs)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Equipment Access</label>
              <select
                value={formData.equipment}
                onChange={(e) => setFormData({ ...formData, equipment: e.target.value as EquipmentType })}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="full_gym">Full Gym (Barbells/Machines)</option>
                <option value="dumbbells">Dumbbells & Bench</option>
                <option value="bodyweight">Bodyweight Only</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Target Training Days per Week</span>
              <strong className="text-emerald-400 text-sm font-bold">{formData.daysPerWeek} days</strong>
            </label>
            <input
              type="range"
              min="2"
              max="6"
              value={formData.daysPerWeek}
              onChange={(e) => setFormData({ ...formData, daysPerWeek: parseInt(e.target.value) || 4 })}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-bold px-1">
              <span>2 Days</span>
              <span>3 Days</span>
              <span>4 Days</span>
              <span>5 Days</span>
              <span>6 Days</span>
            </div>
          </div>
        </div>

        {/* Section 3: Units and Preferences */}
        <div className="space-y-4 pt-4 border-t border-slate-800/80">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Units & Appearance
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Units Toggle */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Measurement Units</label>
              <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => handleUnitToggle('metric')}
                  className={`py-2 text-xs font-bold rounded-lg transition-colors ${
                    formData.unitSystem === 'metric'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Metric (kg / cm)
                </button>
                <button
                  type="button"
                  onClick={() => handleUnitToggle('imperial')}
                  className={`py-2 text-xs font-bold rounded-lg transition-colors ${
                    formData.unitSystem === 'imperial'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Imperial (lbs / in)
                </button>
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Visual Theme</label>
              <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => handleThemeToggle('dark')}
                  className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                    formData.theme === 'dark'
                      ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" /> Dark Black
                </button>
                <button
                  type="button"
                  onClick={() => handleThemeToggle('light')}
                  className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                    formData.theme === 'light'
                      ? 'bg-slate-200 text-slate-900 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" /> Clean Light
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Reminders */}
        <div className="space-y-4 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Workout Reminders
              </h3>
              <p className="text-xs text-slate-400">
                Receive scheduled training nudges to stay consistent with your routine.
              </p>
            </div>
            <input
              type="checkbox"
              checked={formData.remindersEnabled}
              onChange={(e) => setFormData({ ...formData, remindersEnabled: e.target.checked })}
              className="w-5 h-5 accent-emerald-500 cursor-pointer"
            />
          </div>

          {formData.remindersEnabled && (
            <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Preferred Reminder Time</label>
                <input
                  type="time"
                  value={formData.reminderTime}
                  onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                  className="p-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Save CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
          {saveSuccess ? (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Profile updated successfully!</span>
            </div>
          ) : (
            <div className="text-xs text-slate-500">
              Changes apply instantly across all routines.
            </div>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>

      </form>

      {/* Data Management, Export/Import & Reset */}
      <div className="bg-[#12171e] rounded-3xl p-5 sm:p-7 border border-slate-800 shadow-xl space-y-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Data Backup & Management
        </h3>

        {importStatus && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-semibold">
            {importStatus}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Export JSON */}
          <button
            type="button"
            onClick={handleExportData}
            className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center gap-3 text-left transition-colors group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Export Workout Data</div>
              <div className="text-[11px] text-slate-400">Download JSON backup of all workouts & weights</div>
            </div>
          </button>

          {/* Import JSON */}
          <label className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center gap-3 text-left transition-colors group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Restore from Backup</div>
              <div className="text-[11px] text-slate-400">Upload JSON file to restore past logs</div>
            </div>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>
        </div>

        {/* Reset & Account Delete */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetDemo}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to Demo Data</span>
          </button>

          <button
            type="button"
            onClick={handleDeleteAccount}
            className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Data & Restart Onboarding</span>
          </button>
        </div>
      </div>

    </div>
  );
};
