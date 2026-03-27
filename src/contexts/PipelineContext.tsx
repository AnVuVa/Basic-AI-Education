import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type {
  Pipeline, PipelineRun, ApprovalRequest, NotificationItem,
  PipelineTemplate, PipelineStatus, PipelineContextValue, DEFAULT_POLICY,
} from '../types/pipeline';
import { pipelineStorage } from '../lib/pipelineStorage';
import { executePipeline } from '../lib/pipelineRuntime';
import { PIPELINE_TEMPLATES } from '../data/pipeline/pipelineTemplates';

// Re-export for convenience
export type { PipelineContextValue };
import type { } from '../types/pipeline'; // side-effect-only
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DEFAULT_POLICY as _DP } from '../types/pipeline';

const PipelineContext = createContext<PipelineContextValue | undefined>(undefined);

let _idCounter = 1;
const uid = () => `${Date.now()}-${_idCounter++}`;

// ── Seed initial demo pipelines ───────────────────────────────────

function buildSeedPipelines(): Pipeline[] {
  const now = Date.now();
  return PIPELINE_TEMPLATES.slice(0, 3).map((tpl, i) => ({
    id: `seed-${i + 1}`,
    name: tpl.name,
    description: tpl.description,
    status: (i === 0 ? 'active' : i === 1 ? 'draft' : 'active') as PipelineStatus,
    templateId: tpl.id,
    nodes: tpl.nodes,
    edges: tpl.edges,
    policy: { ..._DP, ...tpl.policy } as Pipeline['policy'],
    connectors: tpl.connectors,
    tags: [tpl.category],
    createdAt: now - i * 86400000,
    updatedAt: now - i * 3600000,
    lastRunAt: i === 0 ? now - 1800000 : i === 1 ? undefined : now - 7200000,
    lastRunStatus: i === 0 ? 'success' : i === 1 ? undefined : 'pending_approval',
    todayTriggerCount: i === 0 ? 4 : i === 2 ? 1 : 0,
    pendingApprovalCount: i === 2 ? 1 : 0,
  }));
}

function buildSeedNotifications(pipelines: Pipeline[]): NotificationItem[] {
  const now = Date.now();
  if (!pipelines[0]) return [];
  return [
    {
      id: 'notif-seed-1', pipelineId: pipelines[0].id, pipelineName: pipelines[0].name,
      type: 'action', title: 'Email quan trọng từ boss@company.com',
      body: '📋 [URGENT] Cần duyệt hợp đồng Q3 trước 17h hôm nay. AI đã tóm tắt nội dung.',
      read: false, createdAt: now - 1800000,
    },
  ];
}

function buildSeedApprovals(pipelines: Pipeline[]): ApprovalRequest[] {
  const now = Date.now();
  const p = pipelines.find(p => p.pendingApprovalCount > 0);
  if (!p) return [];
  return [
    {
      id: 'approval-seed-1', pipelineId: p.id, pipelineName: p.name,
      runId: 'run-seed-1', status: 'pending',
      reason: 'Cần phê duyệt trước khi tạo lịch họp',
      proposedAction: 'Tạo lịch Demo sản phẩm với BigCorp Vietnam\nThứ 3, 09:00-10:00 tại Google Meet',
      context: { company: 'BigCorp Vietnam', contact: 'Lê Văn A', duration: '60 phút' },
      createdAt: now - 7200000, expiresAt: now + 86400000,
    },
  ];
}

// ── Provider ──────────────────────────────────────────────────────

export function PipelineProvider({ children }: { children: ReactNode }) {
  const [pipelines, setPipelines]     = useState<Pipeline[]>([]);
  const [runs,      setRuns]          = useState<PipelineRun[]>([]);
  const [approvals, setApprovals]     = useState<ApprovalRequest[]>([]);
  const [notifications, setNotifs]   = useState<NotificationItem[]>([]);
  const [isRunning, setIsRunning]     = useState(false);

  // Load from localStorage on mount (or seed if first time)
  useEffect(() => {
    if (!pipelineStorage.isSeeded()) {
      const seedPipelines = buildSeedPipelines();
      const seedNotifs    = buildSeedNotifications(seedPipelines);
      const seedApprovals = buildSeedApprovals(seedPipelines);
      pipelineStorage.savePipelines(seedPipelines);
      pipelineStorage.saveNotifications(seedNotifs);
      pipelineStorage.saveApprovals(seedApprovals);
      pipelineStorage.markSeeded();
      setPipelines(seedPipelines);
      setNotifs(seedNotifs);
      setApprovals(seedApprovals);
    } else {
      setPipelines(pipelineStorage.getPipelines());
      setRuns(pipelineStorage.getRuns());
      setApprovals(pipelineStorage.getApprovals());
      setNotifs(pipelineStorage.getNotifications());
    }
  }, []);

  // Persist helpers
  const savePipelines = useCallback((data: Pipeline[]) => {
    setPipelines(data); pipelineStorage.savePipelines(data);
  }, []);
  const saveRuns = useCallback((data: PipelineRun[]) => {
    setRuns(data); pipelineStorage.saveRuns(data);
  }, []);
  const saveApprovals = useCallback((data: ApprovalRequest[]) => {
    setApprovals(data); pipelineStorage.saveApprovals(data);
  }, []);
  const saveNotifs = useCallback((data: NotificationItem[]) => {
    setNotifs(data); pipelineStorage.saveNotifications(data);
  }, []);

  // ── Actions ────────────────────────────────────────────────────

  const createPipeline = useCallback((template?: PipelineTemplate): Pipeline => {
    const now = Date.now();
    const p: Pipeline = {
      id: `pl-${uid()}`,
      name: template ? template.name : 'Pipeline mới',
      description: template ? template.description : '',
      status: 'draft',
      templateId: template?.id,
      nodes: template ? template.nodes : [],
      edges: template ? template.edges : [],
      policy: { ..._DP, ...(template?.policy ?? {}) } as Pipeline['policy'],
      connectors: template?.connectors ?? [],
      tags: template ? [template.category] : [],
      createdAt: now, updatedAt: now,
      todayTriggerCount: 0, pendingApprovalCount: 0,
    };
    savePipelines([...pipelines, p]);
    return p;
  }, [pipelines, savePipelines]);

  const updatePipeline = useCallback((id: string, partial: Partial<Pipeline>) => {
    savePipelines(pipelines.map(p =>
      p.id === id ? { ...p, ...partial, updatedAt: Date.now() } : p
    ));
  }, [pipelines, savePipelines]);

  const deletePipeline = useCallback((id: string) => {
    savePipelines(pipelines.filter(p => p.id !== id));
  }, [pipelines, savePipelines]);

  const duplicatePipeline = useCallback((id: string): Pipeline => {
    const src = pipelines.find(p => p.id === id)!;
    const now = Date.now();
    const copy: Pipeline = {
      ...src, id: `pl-${uid()}`, name: `${src.name} (bản sao)`,
      status: 'draft', createdAt: now, updatedAt: now,
      lastRunAt: undefined, lastRunStatus: undefined,
      todayTriggerCount: 0, pendingApprovalCount: 0,
    };
    savePipelines([...pipelines, copy]);
    return copy;
  }, [pipelines, savePipelines]);

  const publishPipeline = useCallback((id: string) => {
    savePipelines(pipelines.map(p =>
      p.id === id ? { ...p, status: 'active', updatedAt: Date.now() } : p
    ));
  }, [pipelines, savePipelines]);

  const togglePipelineActive = useCallback((id: string) => {
    savePipelines(pipelines.map(p => {
      if (p.id !== id) return p;
      const next: PipelineStatus = p.status === 'active' ? 'disabled' : 'active';
      return { ...p, status: next, updatedAt: Date.now() };
    }));
  }, [pipelines, savePipelines]);

  const runPipeline = useCallback(async (id: string, triggerSource = 'manual') => {
    const pipeline = pipelines.find(p => p.id === id);
    if (!pipeline) return;
    setIsRunning(true);

    // Mark pipeline as running
    savePipelines(pipelines.map(p => p.id === id ? { ...p, lastRunStatus: 'running' } : p));

    try {
      const { run, notifications: notifs, approvalContext } = await executePipeline(pipeline, triggerSource);

      // Save run
      const allRuns = [...runs, run];
      saveRuns(allRuns);

      // Update pipeline stats
      const now = Date.now();
      savePipelines(pipelines.map(p => {
        if (p.id !== id) return p;
        return {
          ...p,
          lastRunAt: now,
          lastRunStatus: run.status,
          todayTriggerCount: (p.todayTriggerCount || 0) + 1,
          pendingApprovalCount: approvalContext ? (p.pendingApprovalCount || 0) + 1 : p.pendingApprovalCount,
        };
      }));

      // Add notifications from run
      if (notifs.length > 0) {
        const newNotifs: NotificationItem[] = notifs.map(n => ({
          id: `notif-${uid()}`,
          pipelineId: id,
          pipelineName: pipeline.name,
          runId: run.id,
          type: n.type as NotificationItem['type'],
          title: n.title,
          body: n.body,
          read: false,
          createdAt: Date.now(),
        }));
        saveNotifs([...notifications, ...newNotifs]);
      }

      // Add approval if needed
      if (approvalContext) {
        const approval: ApprovalRequest = {
          id: `appr-${uid()}`,
          pipelineId: id,
          pipelineName: pipeline.name,
          runId: run.id,
          reason: approvalContext.reason,
          proposedAction: approvalContext.proposedAction,
          context: approvalContext.contextSnapshot,
          status: 'pending',
          createdAt: Date.now(),
          expiresAt: Date.now() + 86400000,
        };
        saveApprovals([...approvals, approval]);

        // Also add a notification for the approval
        const apprNotif: NotificationItem = {
          id: `notif-appr-${uid()}`,
          pipelineId: id,
          pipelineName: pipeline.name,
          runId: run.id,
          type: 'action',
          title: `Cần duyệt: ${pipeline.name}`,
          body: approvalContext.proposedAction.substring(0, 100),
          read: false,
          createdAt: Date.now(),
        };
        saveNotifs([...notifications, apprNotif]);
      }

    } catch {
      savePipelines(pipelines.map(p =>
        p.id === id ? { ...p, lastRunStatus: 'failed' } : p
      ));
    } finally {
      setIsRunning(false);
    }
  }, [pipelines, runs, approvals, notifications, savePipelines, saveRuns, saveApprovals, saveNotifs]);

  const approveAction = useCallback((approvalId: string) => {
    const now = Date.now();
    const updated = approvals.map(a =>
      a.id === approvalId ? { ...a, status: 'approved' as const, decidedAt: now } : a
    );
    saveApprovals(updated);
    const appr = approvals.find(a => a.id === approvalId);
    if (appr) {
      // Update pipeline pending count
      savePipelines(pipelines.map(p =>
        p.id === appr.pipelineId
          ? { ...p, pendingApprovalCount: Math.max(0, (p.pendingApprovalCount || 1) - 1) }
          : p
      ));
      // Notify
      const notif: NotificationItem = {
        id: `notif-${uid()}`, pipelineId: appr.pipelineId, pipelineName: appr.pipelineName,
        runId: appr.runId, type: 'info',
        title: `✅ Đã phê duyệt: ${appr.pipelineName}`,
        body: `Hành động đã được xác nhận: ${appr.proposedAction.substring(0, 80)}`,
        read: false, createdAt: now,
      };
      saveNotifs([...notifications, notif]);
    }
  }, [approvals, pipelines, notifications, saveApprovals, savePipelines, saveNotifs]);

  const rejectAction = useCallback((approvalId: string) => {
    const now = Date.now();
    const updated = approvals.map(a =>
      a.id === approvalId ? { ...a, status: 'rejected' as const, decidedAt: now } : a
    );
    saveApprovals(updated);
    const appr = approvals.find(a => a.id === approvalId);
    if (appr) {
      savePipelines(pipelines.map(p =>
        p.id === appr.pipelineId
          ? { ...p, pendingApprovalCount: Math.max(0, (p.pendingApprovalCount || 1) - 1) }
          : p
      ));
    }
  }, [approvals, pipelines, saveApprovals, savePipelines]);

  const snoozeAction = useCallback((approvalId: string, hours = 4) => {
    saveApprovals(approvals.map(a =>
      a.id === approvalId
        ? { ...a, status: 'snoozed' as const, expiresAt: Date.now() + hours * 3600000 }
        : a
    ));
  }, [approvals, saveApprovals]);

  const markNotificationRead = useCallback((id: string) => {
    saveNotifs(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  }, [notifications, saveNotifs]);

  const markAllNotificationsRead = useCallback(() => {
    saveNotifs(notifications.map(n => ({ ...n, read: true })));
  }, [notifications, saveNotifs]);

  const clearRuns = useCallback((pipelineId: string) => {
    saveRuns(runs.filter(r => r.pipelineId !== pipelineId));
  }, [runs, saveRuns]);

  const value: PipelineContextValue = {
    pipelines, runs, approvals, notifications, isRunning,
    createPipeline, updatePipeline, deletePipeline, duplicatePipeline,
    publishPipeline, togglePipelineActive, runPipeline,
    approveAction, rejectAction, snoozeAction,
    markNotificationRead, markAllNotificationsRead, clearRuns,
  };

  return <PipelineContext.Provider value={value}>{children}</PipelineContext.Provider>;
}

export function usePipeline(): PipelineContextValue {
  const ctx = useContext(PipelineContext);
  if (!ctx) throw new Error('usePipeline must be used within PipelineProvider');
  return ctx;
}
