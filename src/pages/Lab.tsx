import React, { useState, useCallback } from 'react';
import { PipelineProvider } from '../contexts/PipelineContext';
import { usePipeline } from '../contexts/PipelineContext';
import LabHome from '../components/lab/LabHome';
import PipelineBuilder from '../components/lab/PipelineBuilder';
import ApprovalCenter from '../components/lab/ApprovalCenter';
import NotificationCenter from '../components/lab/NotificationCenter';
import ExecutionLogs from '../components/lab/ExecutionLogs';

type LabView = 'home' | 'builder' | 'logs' | 'approvals' | 'notifications';

function LabInner() {
  const [view, setView] = useState<LabView>('home');
  const [editingPipelineId, setEditingPipelineId] = useState<string | null>(null);
  const [logsForPipelineId, setLogsForPipelineId] = useState<string | undefined>(undefined);

  const { createPipeline } = usePipeline();

  const handleCreateNew = useCallback(() => {
    const p = createPipeline();
    setEditingPipelineId(p.id);
    setView('builder');
  }, [createPipeline]);

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
