/**
 * Pipeline Runtime — pure in-browser execution engine.
 * Executes pipeline nodes in topological order using demo adapters.
 * Produces PipelineRun with step-by-step logs.
 */
import type { Pipeline, PipelineRun, RunStep, StepStatus } from '../types/pipeline';
import { BLOCK_REGISTRY } from '../data/pipeline/blockRegistry';
import { executeDemoBlock } from '../data/pipeline/demoAdapters';

// ── Topological sort ──────────────────────────────────────────────

function topoSort(nodes: Pipeline['nodes'], edges: Pipeline['edges']): string[] {
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();

  nodes.forEach(n => { inDegree.set(n.id, 0); adj.set(n.id, []); });
  edges.forEach(e => {
    adj.get(e.source)?.push(e.target);
    inDegree.set(e.target, (inDegree.get(e.target) ?? 0) + 1);
  });

  const queue = nodes.filter(n => (inDegree.get(n.id) ?? 0) === 0).map(n => n.id);
  const order: string[] = [];
  while (queue.length) {
    const cur = queue.shift()!;
    order.push(cur);
    for (const nxt of adj.get(cur) ?? []) {
      const deg = (inDegree.get(nxt) ?? 1) - 1;
      inDegree.set(nxt, deg);
      if (deg === 0) queue.push(nxt);
    }
  }
  // Add any remaining (cycles / disconnected)
  nodes.forEach(n => { if (!order.includes(n.id)) order.push(n.id); });
  return order;
}

// ── Main executor ─────────────────────────────────────────────────

let _runIdCounter = 1;
function newRunId() { return `run-${Date.now()}-${_runIdCounter++}`; }

export interface RunResult {
  run: PipelineRun;
  /** notification to add if any notify block ran */
  notifications: Array<{ title: string; body: string; type: string }>;
  /** approval context if a wait block fired */
  approvalContext?: { reason: string; proposedAction: string; contextSnapshot: Record<string, any> };
}

export async function executePipeline(
  pipeline: Pipeline,
  triggerSource = 'manual',
): Promise<RunResult> {
  const runId = newRunId();
  const run: PipelineRun = {
    id: runId,
    pipelineId: pipeline.id,
    pipelineName: pipeline.name,
    startedAt: Date.now(),
    status: 'running',
    triggerSource,
    steps: [],
    notificationCount: 0,
  };

  const notifications: RunResult['notifications'] = [];
  let approvalContext: RunResult['approvalContext'] | undefined;

  const order = topoSort(pipeline.nodes, pipeline.edges);
  let ctx: Record<string, any> = { triggerSource, pipelineId: pipeline.id, timestamp: Date.now() };

  for (const nodeId of order) {
    const node = pipeline.nodes.find(n => n.id === nodeId);
    if (!node) continue;

    const block = BLOCK_REGISTRY[node.blockId];
    if (!block) {
      run.steps.push({
        nodeId, blockId: node.blockId, blockLabel: node.blockId,
        startedAt: Date.now(), finishedAt: Date.now(),
        status: 'failed', logs: [`Block not found: ${node.blockId}`],
      });
      continue;
    }

    const step: RunStep = {
      nodeId, blockId: block.id, blockLabel: block.label,
      startedAt: Date.now(), status: 'running', logs: [],
    };
    run.steps.push(step);

    try {
      const result = await executeDemoBlock(
        block.runtimeMapping,
        block.id,
        { ...block.defaultConfig, ...node.config },
        ctx,
      );

      step.status = result.waitForApproval ? 'waiting' : 'success';
      step.output = result.output;
      step.logs = result.logs;
      step.finishedAt = Date.now();

      if (result.outcome) run.outcome = result.outcome;

      // Merge output into context
      if (result.output) ctx = { ...ctx, ...result.output };

      if (result.notificationCreated) {
        run.notificationCount++;
        notifications.push({
          title: result.output?.title ?? `Pipeline: ${pipeline.name}`,
          body: result.output?.body ?? result.output?.message ?? '',
          type: result.output?.type ?? 'info',
        });
      }

      if (result.waitForApproval) {
        run.status = 'pending_approval';
        approvalContext = {
          reason: `Block "${block.label}" yêu cầu phê duyệt`,
          proposedAction: node.config.action_description || block.label,
          contextSnapshot: ctx,
        };
        break;
      }

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      step.status = 'failed';
      step.logs = [`[ERROR] ${msg}`];
      step.finishedAt = Date.now();
      run.status = 'failed';
      run.error = msg;
      break;
    }
  }

  if (run.status === 'running') run.status = 'success';
  run.finishedAt = Date.now();

  return { run, notifications, approvalContext };
}
