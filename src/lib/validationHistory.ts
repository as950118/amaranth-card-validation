const STORAGE_KEY = 'amaranth-validation-history';
const MAX_HISTORY = 50;

export interface ValidationHistoryItem {
  id: string;
  createdAt: number;
  recordCount: number;
  errorCount: number;
  warningCount: number;
  normalCount: number;
  /** 공유 링크 (hash 포함 전체 URL). 있으면 클릭 시 해당 링크로 이동 */
  shareUrl?: string;
}

export function getValidationHistory(): ValidationHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ValidationHistoryItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addValidationHistory(item: Omit<ValidationHistoryItem, 'id' | 'createdAt'>): void {
  const list = getValidationHistory();
  const newItem: ValidationHistoryItem = {
    ...item,
    id: crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: Date.now(),
  };
  const next = [newItem, ...list].slice(0, MAX_HISTORY);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore quota or parse errors
  }
}

/** 방금 추가된 이력 항목에 공유 링크 저장 (검증 후 hash가 설정된 뒤 호출) */
export function setShareUrlForLastHistoryItem(url: string): void {
  try {
    const list = getValidationHistory();
    if (list.length === 0) return;
    const next = [...list];
    next[0] = { ...next[0], shareUrl: url };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

export function clearValidationHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
