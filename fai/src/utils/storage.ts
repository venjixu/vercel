import { CareerPlan } from '../types';

const PLANS_STORAGE_KEY = 'india_ai_career_coach_plans';
const CHECKPOINTS_STORAGE_KEY = 'india_ai_career_coach_checkpoints';

export function savePlanToStorage(plan: CareerPlan): void {
  try {
    const existing = getSavedPlans();
    // Ensure id
    const planWithId: CareerPlan = {
      ...plan,
      id: plan.id || `plan_${Date.now()}`,
      createdAt: plan.createdAt || new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };
    // Keep max 10 plans
    const updated = [planWithId, ...existing.filter(p => p.id !== planWithId.id)].slice(0, 10);
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save plan to storage', e);
  }
}

export function getSavedPlans(): CareerPlan[] {
  try {
    const raw = localStorage.getItem(PLANS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load plans from storage', e);
    return [];
  }
}

export function deletePlanFromStorage(id: string): CareerPlan[] {
  try {
    const existing = getSavedPlans();
    const updated = existing.filter(p => p.id !== id);
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete plan', e);
    return [];
  }
}

export function getCompletedCheckpoints(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(CHECKPOINTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function toggleCheckpoint(key: string): Record<string, boolean> {
  try {
    const current = getCompletedCheckpoints();
    const updated = { ...current, [key]: !current[key] };
    localStorage.setItem(CHECKPOINTS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return {};
  }
}
