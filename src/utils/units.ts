import { UnitSystem } from '../types';

export function formatWeight(kg: number, system: UnitSystem = 'metric'): string {
  if (system === 'imperial') {
    const lbs = kg * 2.20462;
    return `${Math.round(lbs * 10) / 10} lbs`;
  }
  return `${Math.round(kg * 10) / 10} kg`;
}

export function weightNumber(kg: number, system: UnitSystem = 'metric'): number {
  if (system === 'imperial') {
    return Math.round(kg * 2.20462 * 10) / 10;
  }
  return Math.round(kg * 10) / 10;
}

export function toStoredKg(inputWeight: number, system: UnitSystem = 'metric'): number {
  if (system === 'imperial') {
    return Math.round((inputWeight / 2.20462) * 10) / 10;
  }
  return Math.round(inputWeight * 10) / 10;
}

export function formatHeight(cm: number, system: UnitSystem = 'metric'): string {
  if (system === 'imperial') {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}' ${inches}"`;
  }
  return `${Math.round(cm)} cm`;
}

export function formatDuration(totalSeconds: number): string {
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes < 60) {
    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}
