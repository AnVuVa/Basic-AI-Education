import React, { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PipelineProvider } from '../contexts/PipelineContext';
import { usePipeline } from '../contexts/PipelineContext';
import LabHome from '../components/lab/LabHome';
import PipelineBuilder from '../components/lab/PipelineBuilder';
import ApprovalCenter from '../components/lab/ApprovalCenter';
import NotificationCenter from '../components/lab/NotificationCenter';
import ExecutionLogs from '../components/lab/ExecutionLogs';
import { PIPELINE_TEMPLATES } from '../data/pipeline/pipelineTemplates';
import type { PipelineTemplate } from '../types/pipeline';

type LabView = 'home' | 'builder' | 'logs' | 'approvals' | 'notifications';

function LabInner() {
  const [view, setView] = useState<LabView>('home');
  const [editingPipelineId, setEditingPipelineId] = useState<string | null>(null);
  const [logsForPipelineId, setLogsForPipelineId] = useState<string | undefined>(undefined);
  const location = useLocation();

  const { createPipeline } = usePipeline();

  const handleCreateNew = useCallback(() => {
    const p = createPipeline();
    setEditingPipelineId(p.id);
    setView('builder');
  }, [createPipeline]);

  // Handle navigation state from Home page / Sidebar ("Tạo mới", frame clicks)
  useEffect(() => {
    const state = location.state as { skipToBuilder?: boolean; chatSeed?: string } | null;
    if (!state?.skipToBuilder && !state?.chatSeed) return;

    let template: PipelineTemplate | undefined;
    if (state.chatSeed) {
      const q = state.chatSeed.toLowerCase();
      let bestScore = 0;
      for (const tpl of PIPELINE_TEMPLATES) {
        const words = (tpl.name + ' ' + tpl.description).toLowerCase().split(/\s+/).filter(w => w.length >= 3);
        const score = words.filter(w => q.includes(w)).length;
        if (score > bestScore) { bestScore = score; template = tpl; }
      }
      if (bestScore < 2) template = undefined;
    }

    const p = createPipeline(template);
    setEditingPipelineId(p.id);
    setView('builder');
    // Clear state so browser refresh doesn't re-open builder
    window.history.replaceState({}, '', location.pathname);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEditPipeline = useCallback((id: string) => {
    setEditingPipelineId(id);
    setView('builder');
  }, []);

  const handleViewLogs = useCallback((pipelineId: string) => {
    setLogsForPipelineId(pipelineId);
    setView('logs');
  }, []);

  const handleBack = useCallback(() => setView('home'), []);

  switch (view) {
    case 'builder':
      return editingPipelineId
        ? <PipelineBuilder pipelineId={editingPipelineId} onBack={handleBack} />
        : null;

    case 'logs':
      return <ExecutionLogs onBack={handleBack} pipelineId={logsForPipelineId} />;

    case 'approvals':
      return <ApprovalCenter onBack={handleBack} />;

    case 'notifications':
      return <NotificationCenter onBack={handleBack} />;

    default:
      return (
        <LabHome
          onCreateNew={handleCreateNew}
          onEditPipeline={handleEditPipeline}
          onViewLogs={handleViewLogs}
          onOpenApprovals={() => setView('approvals')}
          onOpenNotifications={() => setView('notifications')}
        />
      );
  }
}

export default function Lab() {
  return (
    <PipelineProvider>
      <LabInner />
    </PipelineProvider>
  );
}
