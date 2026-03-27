/**
 * Demo Adapters — simulates real connector behavior for all 10 pipeline types.
 * In production, replace each adapter with a real API call.
 * All functions are async and add realistic delays.
 */
import type { RuntimeNodeType, DecisionOutcome } from '../../types/pipeline';

// ── Demo seed data ────────────────────────────────────────────────

export const DEMO_EMAILS = [
  {
    id: 'email-001', subject: '[URGENT] Cần duyệt hợp đồng Q3 trước 17h hôm nay',
    sender: 'boss@company.com', sender_name: 'Nguyễn Giám đốc',
    preview: 'Anh/chị xem và duyệt giúp hợp đồng đính kèm. Khách đang chờ...',
    body: 'Kính gửi team, Nhờ xem và duyệt hợp đồng số HĐ-2024-089 đính kèm. Khách hàng Công ty ABC cần phản hồi trước 17h hôm nay để ký. Nếu có vấn đề gì vui lòng liên hệ trực tiếp. Trân trọng.',
    received_at: Date.now() - 1800000, priority: 'high', unread: true, labels: ['INBOX', 'Important'],
    attachments: [{ name: 'HĐ-2024-089.pdf', size: '248 KB' }],
  },
  {
    id: 'email-002', subject: 'Kết quả meeting tuần trước + action items',
    sender: 'pm@company.com', sender_name: 'Trần Project Manager',
    preview: 'Tóm tắt meeting và các việc cần làm tuần này...',
    body: 'Hi all, Theo như đã thảo luận trong buổi họp thứ 3, đây là các action items:\n1. Dev team: hoàn thành API login trước T6\n2. Design: update UI theo feedback client\n3. QA: test regression module payment\nDeadline: cuối tuần này. Update tiến độ vào thứ 5.',
    received_at: Date.now() - 3600000, priority: 'medium', unread: false, labels: ['INBOX'],
    attachments: [],
  },
  {
    id: 'email-003', subject: 'Yêu cầu đặt lịch demo sản phẩm',
    sender: 'client@bigcorp.vn', sender_name: 'Lê Khách Hàng (BigCorp)',
    preview: 'Chúng tôi muốn xem demo sản phẩm của các bạn vào tuần tới...',
    body: 'Xin chào, Qua giới thiệu của đối tác, chúng tôi quan tâm đến giải pháp của công ty bạn. Chúng tôi có thể arrange một buổi demo 60 phút vào tuần tới không? Prefer thứ 3 hoặc thứ 4, buổi sáng. Trân trọng, Lê Văn A - Director of Operations, BigCorp Vietnam',
    received_at: Date.now() - 7200000, priority: 'high', unread: true, labels: ['INBOX'],
    attachments: [],
  },
  {
    id: 'email-004', subject: 'Newsletter tháng 7 - Tin tức công nghệ',
    sender: 'newsletter@techweekly.com', sender_name: 'Tech Weekly',
    preview: 'Những xu hướng AI nổi bật tháng này...',
    body: 'Chào độc giả, Đây là bản tóm tắt tin công nghệ tháng 7...',
    received_at: Date.now() - 14400000, priority: 'low', unread: false, labels: ['INBOX'],
    attachments: [],
  },
];

export const DEMO_TASKS = [
  { id: 'task-001', title: 'Review PR #247 - Authentication module', assignee: 'dev@company.com', due: new Date(Date.now() + 86400000).toISOString().split('T')[0], priority: 'high', status: 'pending', project: 'Platform v2' },
  { id: 'task-002', title: 'Cập nhật tài liệu API cho đối tác', assignee: 'me@company.com', due: new Date(Date.now() + 259200000).toISOString().split('T')[0], priority: 'medium', status: 'pending', project: 'Partnership' },
  { id: 'task-003', title: 'Họp demo sản phẩm với khách hàng ABC', assignee: 'me@company.com', due: new Date(Date.now() - 86400000).toISOString().split('T')[0], priority: 'critical', status: 'overdue', project: 'Sales' },
  { id: 'task-004', title: 'Viết báo cáo tháng cho ban giám đốc', assignee: 'me@company.com', due: new Date(Date.now() + 172800000).toISOString().split('T')[0], priority: 'high', status: 'pending', project: 'Management' },
];

export const DEMO_EVENTS = [
  { id: 'evt-001', title: 'Daily Standup', start: new Date(Date.now() + 3600000).toISOString(), end: new Date(Date.now() + 5400000).toISOString(), attendees: ['dev@company.com', 'pm@company.com'], type: 'recurring' },
  { id: 'evt-002', title: 'Demo sản phẩm - BigCorp', start: new Date(Date.now() + 172800000).toISOString(), end: new Date(Date.now() + 176400000).toISOString(), attendees: ['client@bigcorp.vn', 'sales@company.com', 'me@company.com'], type: 'meeting' },
  { id: 'evt-003', title: 'Sprint Planning Q3', start: new Date(Date.now() + 259200000).toISOString(), end: new Date(Date.now() + 266400000).toISOString(), attendees: ['dev@company.com', 'pm@company.com', 'me@company.com'], type: 'planning' },
];

export const DEMO_CRM_LEADS = [
  { id: 'lead-001', name: 'Công ty BigCorp Vietnam', contact: 'Lê Văn A', email: 'client@bigcorp.vn', score: 85, status: 'hot', last_contact: new Date(Date.now() - 7200000).toISOString(), stage: 'demo_requested' },
  { id: 'lead-002', name: 'StartupXYZ', contact: 'Nguyễn Thị B', email: 'b@startupxyz.com', score: 45, status: 'warm', last_contact: new Date(Date.now() - 864000000).toISOString(), stage: 'initial_contact' },
  { id: 'lead-003', name: 'TechCorp Ltd', contact: 'Trần C', email: 'c@techcorp.com', score: 20, status: 'cold', last_contact: new Date(Date.now() - 2592000000).toISOString(), stage: 'initial_contact' },
];

export const DEMO_DOCS = [
  { id: 'doc-001', title: 'Product Requirements v2.3', type: 'gdoc', last_modified: new Date(Date.now() - 1800000).toISOString(), modifier: 'pm@company.com', changes: 'Cập nhật section 3: Authentication flow. Thêm OAuth 2.0 requirements.', change_size: 'medium' },
  { id: 'doc-002', title: 'Q3 Marketing Plan', type: 'gdoc', last_modified: new Date(Date.now() - 86400000).toISOString(), modifier: 'marketing@company.com', changes: 'Cập nhật budget allocation và KPI targets.', change_size: 'large' },
];

// ── AI summaries (pre-written for demo realism) ───────────────────

const AI_SUMMARIES: Record<string, string> = {
  'summarize': '📋 **Tóm tắt AI:**\n• Email từ Giám đốc yêu cầu duyệt hợp đồng HĐ-2024-089 gấp\n• Deadline: 17h hôm nay\n• Khách hàng: Công ty ABC đang chờ phản hồi\n• File đính kèm: HĐ-2024-089.pdf (248 KB)',
  'extract-actions': '✅ **Action items được trích xuất:**\n1. [Tôi] Đọc và review hợp đồng HĐ-2024-089 - **Deadline: Hôm nay 17h** 🔴\n2. [PM] Liên hệ khách hàng ABC xác nhận điều khoản\n3. [Legal] Ký duyệt nếu không có vấn đề pháp lý',
  'identify-intent': '🎯 **Intent nhận diện:** `approval_needed` (confidence: 94%)\n• Loại: Yêu cầu phê duyệt tài liệu\n• Urgency: Critical\n• Action needed from: Tôi (recipient)',
  'identify-meeting': '📅 **Thông tin họp được trích xuất:**\n• Loại: Product Demo\n• Thời lượng: 60 phút\n• Preferred: Thứ 3 hoặc Thứ 4, buổi sáng tuần tới\n• Attendees: Client (BigCorp) + Sales team\n• Intent: Xem demo sản phẩm trước khi mua',
  'classify': '🏷️ **Phân loại:** `urgent` (confidence: 89%)\n• Lý do: Keyword "urgent", "17h hôm nay", từ Giám đốc\n• Secondary: `approval_needed`',
  'suggest-reply': '💬 **3 phương án trả lời:**\n\n**Option 1 (Chấp nhận):** "Kính gửi Anh/Chị, em đã nhận được hợp đồng và sẽ review ngay. Em sẽ phản hồi trước 16:30h. Trân trọng."\n\n**Option 2 (Cần thêm thời gian):** "Xin chào, em cần thêm 30 phút để review kỹ hơn. Em sẽ gửi feedback lúc 17h. Cảm ơn."\n\n**Option 3 (Từ chối):** "Kính gửi Anh, em hiện đang bận meeting. Có thể nhờ anh Thành review thay được không?"',
  'suggest-meeting': '📅 **3 khung giờ phù hợp:**\n1. **Thứ 3, 09:00-10:00** — Lịch trống, phòng A còn chỗ ✅\n2. **Thứ 4, 10:30-11:30** — Lịch trống ✅  \n3. **Thứ 3, 14:00-15:00** — Có meeting nhỏ 13:45, buffer ok ✅\n\n*Recommend: Option 1 - sáng thứ 3 để có thêm thời gian chuẩn bị*',
  'suggest-followup': '📞 **Kế hoạch follow-up cho lead BigCorp:**\n• Ngày 1-2: Gửi email cảm ơn + đính kèm case study phù hợp ngành\n• Ngày 5: Gọi điện check: "Anh/chị đã xem tài liệu chưa?"\n• Ngày 10: Nếu im lặng, gửi email "Offer 30 ngày dùng thử miễn phí"',
};

// ── Block executor ────────────────────────────────────────────────

export interface BlockExecutionResult {
  output: Record<string, any>;
  logs: string[];
  outcome?: DecisionOutcome;
  waitForApproval?: boolean;
  notificationCreated?: boolean;
}

type DemoAdapter = (
  blockId: string,
  config: Record<string, any>,
  context: Record<string, any>,
) => BlockExecutionResult;

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function ts(): string {
  return new Date().toLocaleTimeString('vi-VN');
}

const ADAPTERS: Record<RuntimeNodeType, DemoAdapter> = {
  watch: (blockId, config, _ctx) => {
    const source = config.mailbox || config.channel || config.source || config.calendar || 'demo';
    return {
      output: {
        trigger_source: source,
        triggered_at: Date.now(),
        trigger_data: blockId === 'new-email' ? DEMO_EMAILS.slice(0, 2)
          : blockId === 'near-deadline'        ? DEMO_TASKS.filter(t => t.status === 'overdue')
          : blockId === 'new-meeting-invite'   ? DEMO_EVENTS.slice(0, 1)
          : blockId === 'new-lead'             ? DEMO_CRM_LEADS.slice(0, 1)
          : [{ id: 'demo-trigger', type: blockId }],
      },
      logs: [
        `[${ts()}] [DEMO] Kích hoạt: ${blockId}`,
        `[${ts()}] [DEMO] Nguồn: ${source}`,
        `[${ts()}] [DEMO] Đã nhận trigger data`,
      ],
    };
  },

  source: (blockId, config, ctx) => {
    let items: any[] = [];
    let sourceName = '';
    if (blockId === 'read-email') {
      items = DEMO_EMAILS.slice(0, config.count || 10);
      sourceName = 'Demo Gmail';
    } else if (blockId === 'read-tasks') {
      items = DEMO_TASKS.filter(t =>
        config.status_filter === 'all' ? true :
        config.status_filter === 'overdue' ? t.status === 'overdue' : t.status === 'pending'
      );
      sourceName = 'Demo Tasks';
    } else if (blockId === 'read-calendar') {
      items = DEMO_EVENTS;
      sourceName = 'Demo Calendar';
    } else if (blockId === 'read-crm') {
      items = DEMO_CRM_LEADS;
      sourceName = 'Demo CRM';
    } else if (blockId === 'read-docs') {
      items = DEMO_DOCS;
      sourceName = 'Demo Drive';
    } else if (blockId === 'read-chat') {
      items = [{ id: 'msg-001', sender: '@pm', content: 'Deploy xong chưa vậy?', channel: config.channel || '#general' }];
      sourceName = 'Demo Chat';
    } else {
      items = ctx.trigger_data || [];
      sourceName = 'Demo';
    }
    return {
      output: { items, count: items.length, source: sourceName },
      logs: [
        `[${ts()}] [DEMO] Kết nối đến ${sourceName}`,
        `[${ts()}] [DEMO] Đọc ${items.length} item(s)`,
        `[${ts()}] [DEMO] ✓ Đã lấy dữ liệu thành công`,
      ],
    };
  },

  filter: (blockId, _config, ctx) => {
    const rawItems = ctx.items || ctx.trigger_data || [];
    const items = Array.isArray(rawItems) ? rawItems : [rawItems];
    // Demo: keep items that seem "important" (have priority high/critical, or are overdue)
    const filtered = items.filter((item: any) =>
      item.priority === 'high' || item.priority === 'critical' || item.status === 'overdue'
        || (item.unread && item.priority !== 'low') || items.length === 1
    );
    const passed = filtered.length > 0 ? filtered : items.slice(0, 2);
    return {
      output: { items: passed, filtered_count: passed.length, original_count: items.length },
      logs: [
        `[${ts()}] [DEMO] Lọc: ${blockId}`,
        `[${ts()}] [DEMO] Đầu vào: ${items.length} item(s)`,
        `[${ts()}] [DEMO] Đầu ra: ${passed.length} item(s) qua lọc`,
      ],
    };
  },

  understand: (blockId, _config, ctx) => {
    const summary = AI_SUMMARIES[blockId] || '🤖 AI phân tích hoàn tất. Kết quả đã được xử lý.';
    const items = ctx.items || ctx.trigger_data || [];
    return {
      output: {
        summary,
        action_items: [
          { id: 'ai-1', text: 'Review và duyệt tài liệu đính kèm', owner: 'me', deadline: 'Hôm nay 17h', priority: 'critical' },
          { id: 'ai-2', text: 'Thông báo cho team về kết quả', owner: 'me', deadline: 'Ngày mai', priority: 'medium' },
        ],
        intent: 'approval_needed',
        priority: 'high',
        confidence: 0.91,
        item_count: Array.isArray(items) ? items.length : 1,
      },
      logs: [
        `[${ts()}] [DEMO] Gọi AI: ${blockId}`,
        `[${ts()}] [DEMO] Model: Gemini 1.5 Pro (simulated)`,
        `[${ts()}] [DEMO] ✓ Phân tích xong`,
        `[${ts()}] [DEMO] Confidence: 91%`,
      ],
    };
  },

  condition: (blockId, config, ctx) => {
    // Risk scoring
    let score = 70;
    const items = ctx.items || [];
    if (Array.isArray(items)) {
      const hasHighPriority = items.some((i: any) => i.priority === 'high' || i.priority === 'critical');
      const hasOverdue = items.some((i: any) => i.status === 'overdue');
      score = hasHighPriority ? 85 : hasOverdue ? 90 : 55;
    }
    const threshold = config.threshold || 70;
    const result = score >= threshold;
    return {
      output: {
        condition_met: result,
        branch: result ? 'yes' : 'no',
        risk_score: score,
        threshold,
        confidence: 0.88,
      },
      logs: [
        `[${ts()}] [DEMO] Đánh giá: ${blockId}`,
        `[${ts()}] [DEMO] Score: ${score}/100 (ngưỡng: ${threshold})`,
        `[${ts()}] [DEMO] Kết quả: ${result ? '✓ Đạt ngưỡng → Nhánh HIGH' : '✗ Không đạt → Nhánh NORMAL'}`,
      ],
    };
  },

  decide: (blockId, config, _ctx) => {
    const outcome = (config.default_outcome || 'NOTIFY') as DecisionOutcome;
    return {
      output: { decision: outcome, confidence: 0.87, reasoning: `Demo: Áp dụng outcome "${outcome}" theo cấu hình` },
      logs: [
        `[${ts()}] [DEMO] Quyết định: ${blockId}`,
        `[${ts()}] [DEMO] Outcome: ${outcome}`,
        `[${ts()}] [DEMO] Confidence: 87%`,
      ],
      outcome,
    };
  },

  wait: (blockId, config, ctx) => {
    const action = config.action_description || 'Hành động cần được phê duyệt';
    return {
      output: {
        approval_requested: true,
        proposed_action: action,
        context_snapshot: ctx,
      },
      logs: [
        `[${ts()}] [DEMO] Dừng: ${blockId}`,
        `[${ts()}] [DEMO] Tạo yêu cầu duyệt: "${action}"`,
        `[${ts()}] [DEMO] Đang chờ phê duyệt từ người dùng...`,
      ],
      waitForApproval: true,
    };
  },

  act: (blockId, config, ctx) => {
    const summary = ctx.summary || '';
    let output: Record<string, any> = { action_taken: blockId, result: 'success', item_id: `demo-${Date.now()}` };
    let actionDesc = '';

    if (blockId === 'create-task') {
      output = { ...output, task: { id: `task-${Date.now()}`, title: 'Review hợp đồng HĐ-2024-089', priority: 'critical', assignee: 'me', due: new Date(Date.now() + 7200000).toISOString() }};
      actionDesc = 'Tạo task "Review hợp đồng HĐ-2024-089"';
    } else if (blockId === 'create-event') {
      output = { ...output, event: { id: `evt-${Date.now()}`, title: 'Demo sản phẩm - BigCorp', start: new Date(Date.now() + 172800000).toISOString(), attendees: ['client@bigcorp.vn'] }};
      actionDesc = 'Tạo lịch họp "Demo sản phẩm - BigCorp"';
    } else if (blockId === 'draft-email') {
      output = { ...output, draft: { to: 'boss@company.com', subject: 'Re: Duyệt hợp đồng', body: `Kính gửi Anh/Chị,\n\nEm đã review hợp đồng HĐ-2024-089. ${summary ? '\nTóm tắt: ' + summary.substring(0, 100) : ''}\n\nTrân trọng.` }};
      actionDesc = 'Tạo draft email reply';
    } else if (blockId === 'send-email') {
      actionDesc = `Gửi email đến ${config.to || '{{sender}}'}`;
    } else if (blockId === 'update-crm') {
      actionDesc = `Cập nhật CRM: ${config.field} = ${config.value}`;
    } else if (blockId === 'send-message') {
      actionDesc = `Gửi tin nhắn đến ${config.channel || '#general'}`;
    } else {
      actionDesc = `Thực thi: ${blockId}`;
    }

    return {
      output,
      logs: [
        `[${ts()}] [DEMO] Hành động: ${blockId}`,
        `[${ts()}] [DEMO] ${actionDesc}`,
        `[${ts()}] [DEMO] ✓ Hoàn thành thành công`,
      ],
    };
  },

  notify: (blockId, config, ctx) => {
    const title = interpolate(config.title || 'Thông báo từ pipeline', ctx);
    const body = interpolate(config.message || ctx.summary || 'Pipeline hoàn tất.', ctx);
    return {
      output: { notification_sent: true, title, body, type: config.type || 'info' },
      logs: [
        `[${ts()}] [DEMO] Thông báo: ${blockId}`,
        `[${ts()}] [DEMO] Tiêu đề: "${title.substring(0, 50)}"`,
        `[${ts()}] [DEMO] ✓ Gửi thành công (in-app)`,
      ],
      notificationCreated: true,
    };
  },

  state: (blockId, config, _ctx) => {
    const key = config.state_key || 'state';
    return {
      output: { state_updated: true, key, action: blockId },
      logs: [
        `[${ts()}] [DEMO] Trạng thái: ${blockId}`,
        `[${ts()}] [DEMO] Key: "${key}"`,
        `[${ts()}] [DEMO] ✓ Đã lưu`,
      ],
    };
  },
};

/** Simple {{field}} interpolation */
function interpolate(template: string, ctx: Record<string, any>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const val = ctx[key];
    return val !== undefined ? String(val) : `{{${key}}}`;
  });
}

/** Execute a block with realistic delay */
export async function executeDemoBlock(
  runtimeMapping: RuntimeNodeType,
  blockId: string,
  config: Record<string, any>,
  context: Record<string, any>,
): Promise<BlockExecutionResult> {
  await delay(400 + Math.random() * 600);
  const adapter = ADAPTERS[runtimeMapping];
  if (!adapter) {
    return {
      output: {},
      logs: [`[DEMO] Unknown runtime mapping: ${runtimeMapping}`],
    };
  }
  return adapter(blockId, config, context);
}
