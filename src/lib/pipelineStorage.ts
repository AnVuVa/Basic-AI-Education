import type { Pipeline, PipelineRun, ApprovalRequest, NotificationItem } from '../types/pipeline';

const KEYS = {
  PIPELINES:     'baiedu_pipelines',
  RUNS:          'baiedu_runs',
  APPROVALS:     'baiedu_approvals',
  NOTIFICATIONS: 'baiedu_notifications',
  SEEDED:        'baiedu_pipeline_seeded',
} as const;

function load<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function save<T>(key: string, data: T[]): void {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

export const pipelineStorage = {
  getPipelines:      (): Pipeline[]          => load(KEYS.PIPELINES),
  savePipelines:     (d: Pipeline[])         => save(KEYS.PIPELINES, d),

  getRuns:           (): PipelineRun[]       => load(KEYS.RUNS),
  saveRuns:          (d: PipelineRun[])      => save(KEYS.RUNS, d),

  getApprovals:      (): ApprovalRequest[]   => load(KEYS.APPROVALS),
  saveApprovals:     (d: ApprovalRequest[])  => save(KEYS.APPROVALS, d),

  getNotifications:  (): NotificationItem[]  => load(KEYS.NOTIFICATIONS),
  saveNotifications: (d: NotificationItem[]) => save(KEYS.NOTIFICATIONS, d),

  isSeeded:   (): boolean => localStorage.getItem(KEYS.SEEDED) === '1',
  markSeeded: ()          => localStorage.setItem(KEYS.SEEDED, '1'),

  clearAll: () => Object.values(KEYS).forEach(k => localStorage.removeItem(k)),
};
