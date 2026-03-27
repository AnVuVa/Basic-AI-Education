import type { PipelineTemplate, PipelineNode, PipelineEdge } from '../../types/pipeline';

/** Build linear node array (left→right, 220px gap) */
function linearNodes(specs: Array<[string, string, Record<string, any>?]>, startY = 80): PipelineNode[] {
  return specs.map(([id, blockId, config = {}], i) => ({
    id, blockId, position: { x: 60 + i * 240, y: startY }, config,
  }));
}
function linearEdges(ids: string[]): PipelineEdge[] {
  return ids.slice(0, -1).map((src, i) => ({
    id: `${src}-${ids[i + 1]}`, source: src, target: ids[i + 1],
  }));
}
function connect(src: string, tgt: string, srcHandle?: string): PipelineEdge {
  return { id: `${src}-${tgt}`, source: src, target: tgt, sourceHandle: srcHandle };
}

// ── 10 Pipeline Templates ─────────────────────────────────────────

export const PIPELINE_TEMPLATES: PipelineTemplate[] = [
  // ── 1. Theo dõi Gmail quan trọng ─────────────────────────────────
  {
    id: 'tpl-gmail-monitor',
    name: 'Theo dõi Gmail quan trọng',
    description: 'Tự động phát hiện email quan trọng, tóm tắt và thông báo ngay',
    category: 'Email',
    icon: 'Mail',
    color: 'from-blue-500 to-blue-700',
    connectors: ['demo-gmail'],
    useCase: 'Không bỏ sót email quan trọng từ sếp, khách hàng. Nhận thông báo ngay với tóm tắt AI.',
    canDemoRun: true,
    nodes: linearNodes([
      ['n1', 'new-email',          { mailbox: 'demo-gmail', watch_mode: 'all' }],
      ['n2', 'read-email',         { count: 10, include_thread: true }],
      ['n3', 'filter-priority',    { min_priority: 'high' }],
      ['n4', 'summarize',          { max_length: 150, language: 'vi' }],
      ['n5', 'decide-action',      { default_outcome: 'NOTIFY' }],
      ['n6', 'send-notification',  { title: 'Email quan trọng từ {{sender}}', message: '{{summary}}', type: 'action' }],
    ]),
    edges: linearEdges(['n1','n2','n3','n4','n5','n6']),
    policy: { approvalMode: 'notify_only', autoActAllowed: ['send-notification'] },
  },

  // ── 2. Mail thành task ───────────────────────────────────────────
  {
    id: 'tpl-mail-to-task',
    name: 'Mail thành task',
    description: 'Trích xuất action items từ email và tạo task tự động',
    category: 'Email',
    icon: 'CheckSquare',
    color: 'from-emerald-500 to-emerald-700',
    connectors: ['demo-gmail', 'demo-tasks'],
    useCase: 'Chuyển email action items thành task được assign sẵn, không cần tạo tay.',
    canDemoRun: true,
    nodes: linearNodes([
      ['n1', 'new-email',      { mailbox: 'demo-gmail', watch_mode: 'all' }],
      ['n2', 'read-email',     { count: 5 }],
      ['n3', 'extract-actions',{ detect_owner: true, detect_deadline: true }],
      ['n4', 'risk-score',     { threshold: 60 }],
      ['n5', 'ask-user',       { action_description: 'Tạo các task sau từ email:\n• Review hợp đồng HĐ-2024-089 (deadline: hôm nay)\n• Thông báo team về kết quả họp', timeout_hours: 12 }],
      ['n6', 'create-task',    { title: '{{action_item}}', assignee: '{{owner}}', priority: 'high' }],
      ['n7', 'send-recap',     { include_items: ['actions', 'summary'] }],
    ]),
    edges: [
      ...linearEdges(['n1','n2','n3','n4','n5','n6']),
      connect('n6', 'n7'),
    ],
    policy: { approvalMode: 'ask_before_act', autoActAllowed: ['send-recap'] },
  },

  // ── 3. Đặt lịch từ email/chat ────────────────────────────────────
  {
    id: 'tpl-meeting-scheduler',
    name: 'Đặt lịch từ email',
    description: 'Nhận diện yêu cầu họp, kiểm tra lịch và gợi ý khung giờ phù hợp',
    category: 'Calendar',
    icon: 'CalendarClock',
    color: 'from-violet-500 to-violet-700',
    connectors: ['demo-gmail', 'demo-gcal'],
    useCase: 'Tự động xử lý email xin lịch họp, gợi ý 3 khung giờ và chờ bạn chọn.',
    canDemoRun: true,
    nodes: linearNodes([
      ['n1', 'new-email',        { mailbox: 'demo-gmail', watch_mode: 'all' }],
      ['n2', 'read-email',       { count: 5 }],
      ['n3', 'identify-meeting', { detect_urgency: true }],
      ['n4', 'check-conflict',   { calendar: 'demo-gcal', duration_minutes: 60 }],
      ['n5', 'suggest-meeting',  { duration_minutes: 60, days_ahead: 7, slot_count: 3 }],
      ['n6', 'ask-user',         { action_description: 'Tạo lịch Demo với BigCorp Vietnam vào:\n• Thứ 3, 09:00-10:00 ✅\n• Thứ 4, 10:30-11:30 ✅\n• Thứ 3, 14:00-15:00 ✅\n\nChọn khung giờ nào?', timeout_hours: 24 }],
      ['n7', 'create-event',     { title: 'Demo sản phẩm - {{company}}', duration_minutes: 60, attendees: '{{participants}}' }],
    ]),
    edges: linearEdges(['n1','n2','n3','n4','n5','n6','n7']),
    policy: { approvalMode: 'ask_before_act', autoActAllowed: [] },
  },

  // ── 4. Nhắc deadline thông minh ──────────────────────────────────
  {
    id: 'tpl-deadline-reminder',
    name: 'Nhắc deadline thông minh',
    description: 'Theo dõi task quá hạn và sắp tới hạn, đánh giá rủi ro và nhắc thông minh',
    category: 'Tasks',
    icon: 'AlarmClock',
    color: 'from-orange-500 to-red-600',
    connectors: ['demo-tasks'],
    useCase: 'Không bao giờ bị trễ deadline. AI đánh giá rủi ro và nhắc đúng người đúng lúc.',
    canDemoRun: true,
    nodes: linearNodes([
      ['n1', 'near-deadline',     { source: 'demo-tasks', hours_before: 24 }],
      ['n2', 'read-tasks',        { status_filter: 'overdue', assignee: 'me' }],
      ['n3', 'risk-score',        { scoring_rules: 'Chấm theo: deadline, priority, owner', threshold: 70 }],
      ['n4', 'send-reminder',     { message: '⚠️ Task quá hạn: {{task_name}}\nDeadline: {{due}}\nOwner: {{assignee}}', remind_before_hours: 2 }],
      ['n5', 'send-notification', { title: '🔴 {{count}} task cần xử lý gấp', message: '{{summary}}', type: 'warning' }],
    ]),
    edges: linearEdges(['n1','n2','n3','n4','n5']),
    policy: { approvalMode: 'notify_only', autoActAllowed: ['send-reminder', 'send-notification'] },
  },

  // ── 5. Theo dõi chờ phê duyệt ────────────────────────────────────
  {
    id: 'tpl-approval-tracker',
    name: 'Theo dõi chờ phê duyệt',
    description: 'Tự động theo dõi và nhắc các item đang chờ phê duyệt',
    category: 'Approval',
    icon: 'ShieldCheck',
    color: 'from-amber-500 to-amber-700',
    connectors: ['demo-tasks'],
    useCase: 'Không để approval request bị bỏ quên. Nhắc đúng người, đúng lúc, escalate nếu cần.',
    canDemoRun: true,
    nodes: linearNodes([
      ['n1', 'schedule',           { frequency: 'daily', run_at: '09:00' }],
      ['n2', 'read-tasks',         { status_filter: 'pending', assignee: 'team' }],
      ['n3', 'filter-unprocessed', { state_key: 'pending_approvals' }],
      ['n4', 'risk-score',         { threshold: 50 }],
      ['n5', 'ask-user',           { action_description: 'Có 2 item đang chờ duyệt:\n• Hợp đồng HĐ-2024-089 (chờ từ hôm qua)\n• PR #247 Authentication module\n\nBạn muốn xử lý ngay không?', timeout_hours: 8 }],
      ['n6', 'escalate-approval',  { escalate_to: 'manager@company.com', reason: 'Chưa được xử lý sau 24 giờ' }],
    ]),
    edges: linearEdges(['n1','n2','n3','n4','n5','n6']),
    policy: { approvalMode: 'ask_before_act', reminderCadenceHours: 4, escalationAfterHours: 24 },
  },

  // ── 6. Follow-up khách hàng / lead ──────────────────────────────
  {
    id: 'tpl-customer-followup',
    name: 'Follow-up khách hàng',
    description: 'Tự động theo dõi lead, chấm điểm và gợi ý next action tốt nhất',
    category: 'CRM',
    icon: 'TrendingUp',
    color: 'from-pink-500 to-rose-600',
    connectors: ['demo-crm', 'demo-gmail'],
    useCase: 'Không bỏ lỡ khách hàng tiềm năng. AI gợi ý thời điểm và cách follow-up phù hợp.',
    canDemoRun: true,
    nodes: linearNodes([
      ['n1', 'schedule',          { frequency: 'daily', run_at: '08:30' }],
      ['n2', 'read-crm',          { entity_type: 'lead', status: 'warm' }],
      ['n3', 'risk-score',        { scoring_rules: 'Chấm theo: thời gian im lặng, score, stage', threshold: 40 }],
      ['n4', 'suggest-followup',  { delay_days: 3, template: 'check_in' }],
      ['n5', 'draft-email',       { to: '{{contact_email}}', subject_template: 'Re: {{company}} - Cập nhật từ chúng tôi' }],
      ['n6', 'ask-user',          { action_description: 'Gửi email follow-up cho BigCorp Vietnam (Lê Văn A)\nNội dung: Offer 30 ngày dùng thử miễn phí + case study', timeout_hours: 24 }],
    ]),
    edges: linearEdges(['n1','n2','n3','n4','n5','n6']),
    policy: { approvalMode: 'ask_before_act', autoActAllowed: ['suggest-followup'] },
  },

  // ── 7. Tóm tắt đa kênh ──────────────────────────────────────────
  {
    id: 'tpl-multichannel-summary',
    name: 'Tóm tắt đa kênh hàng ngày',
    description: 'Tổng hợp email, chat và docs thành bản tóm tắt và action items buổi sáng',
    category: 'Productivity',
    icon: 'Layers',
    color: 'from-cyan-500 to-blue-600',
    connectors: ['demo-gmail', 'demo-slack', 'demo-drive'],
    useCase: 'Mỗi sáng nhận 1 bản digest đầy đủ: email quan trọng + chat cần xử lý + doc thay đổi.',
    canDemoRun: true,
    nodes: linearNodes([
      ['n1', 'schedule',           { frequency: 'daily', run_at: '07:30' }],
      ['n2', 'read-email',         { count: 20, include_thread: false }],
      ['n3', 'read-chat',          { channel: '#general', count: 50 }],
      ['n4', 'summarize',          { max_length: 200, language: 'vi', style: 'bullets' }],
      ['n5', 'extract-actions',    { detect_owner: true, detect_deadline: true }],
      ['n6', 'send-digest',        { format: 'grouped', max_items: 10 }],
    ]),
    edges: [
      connect('n1', 'n2'), connect('n1', 'n3'),
      connect('n2', 'n4'), connect('n3', 'n4'),
      connect('n4', 'n5'), connect('n5', 'n6'),
    ],
    policy: { approvalMode: 'auto_act', autoActAllowed: ['send-digest', 'summarize', 'extract-actions'] },
  },

  // ── 8. Theo dõi thay đổi tài liệu ──────────────────────────────
  {
    id: 'tpl-doc-monitor',
    name: 'Theo dõi thay đổi tài liệu',
    description: 'Phát hiện thay đổi trong Google Docs/Drive, đánh giá mức độ ảnh hưởng',
    category: 'Documents',
    icon: 'FileSearch',
    color: 'from-teal-500 to-emerald-600',
    connectors: ['demo-drive'],
    useCase: 'Không bỏ sót thay đổi tài liệu quan trọng. Nhận cảnh báo khi PRD hay tài liệu kinh doanh thay đổi.',
    canDemoRun: true,
    nodes: linearNodes([
      ['n1', 'schedule',           { frequency: 'hourly' }],
      ['n2', 'read-docs',          { source: 'demo-drive', watch_changes: true }],
      ['n3', 'filter-unprocessed', { state_key: 'processed_doc_versions' }],
      ['n4', 'summarize',          { max_length: 100, language: 'vi', style: 'bullets' }],
      ['n5', 'risk-score',         { scoring_rules: 'Chấm theo: ai sửa, khu vực bị sửa, loại thay đổi', threshold: 60 }],
      ['n6', 'send-notification',  { title: '📄 Tài liệu {{doc_name}} vừa được cập nhật', message: '{{summary}}', type: 'info' }],
      ['n7', 'mark-processed',     { state_key: 'processed_doc_versions', item_id_field: 'id' }],
    ]),
    edges: linearEdges(['n1','n2','n3','n4','n5','n6','n7']),
    policy: { approvalMode: 'notify_only', autoActAllowed: ['send-notification', 'mark-processed'] },
  },

  // ── 9. Chuẩn bị họp tự động ─────────────────────────────────────
  {
    id: 'tpl-meeting-prep',
    name: 'Chuẩn bị họp tự động',
    description: 'Trước mỗi cuộc họp, tự động tổng hợp tài liệu và gửi brief cho bạn',
    category: 'Calendar',
    icon: 'BriefcaseBusiness',
    color: 'from-indigo-500 to-purple-600',
    connectors: ['demo-gcal', 'demo-gmail'],
    useCase: 'Luôn bước vào họp với đầy đủ context. Brief được chuẩn bị tự động 30 phút trước.',
    canDemoRun: true,
    nodes: linearNodes([
      ['n1', 'near-deadline',     { source: 'demo-gcal', hours_before: 1 }],
      ['n2', 'read-calendar',     { days_ahead: 1 }],
      ['n3', 'read-email',        { count: 10 }],
      ['n4', 'summarize',         { max_length: 200, language: 'vi', style: 'bullets' }],
      ['n5', 'extract-actions',   { detect_owner: true, detect_deadline: true }],
      ['n6', 'send-notification', { title: '📋 Chuẩn bị cho: {{event_title}}', message: '{{summary}}', type: 'action' }],
    ]),
    edges: [
      connect('n1', 'n2'), connect('n1', 'n3'),
      connect('n2', 'n4'), connect('n3', 'n4'),
      connect('n4', 'n5'), connect('n5', 'n6'),
    ],
    policy: { approvalMode: 'notify_only', autoActAllowed: ['send-notification', 'summarize'] },
  },

  // ── 10. Trợ lý inbox cá nhân ────────────────────────────────────
  {
    id: 'tpl-inbox-assistant',
    name: 'Trợ lý inbox cá nhân',
    description: 'Phân loại email, soạn reply cho email thông thường, hỏi ý kiến với email quan trọng',
    category: 'Email',
    icon: 'Bot',
    color: 'from-purple-500 to-pink-600',
    connectors: ['demo-gmail'],
    useCase: 'Inbox zero mỗi ngày. AI xử lý email thông thường, bạn chỉ cần duyệt những gì quan trọng.',
    canDemoRun: true,
    nodes: linearNodes([
      ['n1', 'new-email',      { mailbox: 'demo-gmail', watch_mode: 'unread' }],
      ['n2', 'read-email',     { count: 20 }],
      ['n3', 'classify',       { categories: 'urgent\nnormal\nfyi\nspam' }],
      ['n4', 'if-then',        { field: 'category', operator: 'eq', value: 'urgent' }],
      ['n5', 'suggest-reply',  { tone: 'professional', max_options: 3 }],
      ['n6', 'ask-user',       { action_description: 'Email quan trọng cần xử lý:\n\nTừ: boss@company.com\nChủ đề: [URGENT] Cần duyệt hợp đồng Q3\n\nAI gợi ý: Xác nhận đã nhận, sẽ review và phản hồi trước 16:30h\n\nBạn có muốn gửi reply này không?', timeout_hours: 2 }],
      ['n7', 'send-digest',    { format: 'list', max_items: 5 }],
    ]),
    edges: [
      connect('n1', 'n2'), connect('n2', 'n3'), connect('n3', 'n4'),
      connect('n4', 'n5', 'yes'),
      connect('n4', 'n7', 'no'),
      connect('n5', 'n6'),
    ],
    policy: { approvalMode: 'ask_before_act', autoActAllowed: ['classify', 'suggest-reply', 'send-digest'] },
  },

  // ── 11. Tạo bài giảng Lịch Sử Việt Nam ──────────────────────────
  {
    id: 'tpl-lichsu-slide',
    name: 'Tạo slide bài giảng Lịch Sử VN',
    description: 'Pipeline AI đa mô hình: tra cứu → dàn ý → nội dung → slide → ảnh minh họa',
    category: 'Giáo dục',
    icon: 'GraduationCap',
    color: 'from-violet-500 to-pink-600',
    connectors: ['demo-ai'],
    useCase: 'Giáo viên nhập chủ đề → AI tự động tra cứu, viết nội dung, tạo slide và ảnh minh họa lịch sử',
    canDemoRun: true,
    nodes: [
      { id: 'ls1', blockId: 'manual-run',        position: { x: 60,  y: 160 }, config: { label: 'Nhập chủ đề bài giảng' } },
      { id: 'ls2', blockId: 'perplexity-sonar',  position: { x: 300, y: 80  }, config: {
          query: 'Chiến dịch Điện Biên Phủ 1954: nguyên nhân, diễn biến, kết quả và ý nghĩa lịch sử',
          focus: 'academic', language: 'vi',
        }},
      { id: 'ls3', blockId: 'gemini-flash',      position: { x: 300, y: 240 }, config: {
          prompt: 'Dựa trên thông tin tìm kiếm, tạo dàn ý chi tiết bài giảng "Chiến dịch Điện Biên Phủ 1954" cho học sinh THPT. Bao gồm: mục tiêu học, 10 ý chính, câu hỏi thảo luận.',
          output_format: 'markdown', temperature: 0.6,
        }},
      { id: 'ls4', blockId: 'gpt-4o',           position: { x: 560, y: 160 }, config: {
          prompt: 'Từ dàn ý sau, viết nội dung chi tiết cho 12 slide bài giảng. Mỗi slide: tiêu đề (≤8 từ) + 4 bullet points + ghi chú giáo viên + 3 từ khóa ảnh tiếng Anh.',
          output_format: 'markdown', temperature: 0.7,
        }},
      { id: 'ls5', blockId: 'gamma-ai',         position: { x: 820, y: 80  }, config: {
          slide_count: 12, theme: 'academic', language: 'vi', include_images: true,
        }},
      { id: 'ls6', blockId: 'midjourney',       position: { x: 820, y: 260 }, config: {
          prompt: 'Vietnamese soldiers at Dien Bien Phu, 1954, cinematic historical painting, dramatic lighting, --ar 16:9 --q 2',
          count: 4, aspect_ratio: '16:9',
        }},
      { id: 'ls7', blockId: 'send-notification', position: { x: 1080, y: 160 }, config: {
          title: 'Bài giảng Lịch Sử đã sẵn sàng!',
          body: 'Slide "Chiến dịch Điện Biên Phủ 1954" đã được tạo xong. Click để xem.',
        }},
    ],
    edges: [
      connect('ls1', 'ls2'),
      connect('ls1', 'ls3'),
      connect('ls2', 'ls4'),
      connect('ls3', 'ls4'),
      connect('ls4', 'ls5'),
      connect('ls4', 'ls6'),
      connect('ls5', 'ls7'),
      connect('ls6', 'ls7'),
    ],
    policy: {
      approvalMode: 'notify_only',
      autoActAllowed: ['perplexity-sonar', 'gemini-flash', 'gpt-4o', 'gamma-ai', 'midjourney', 'send-notification'],
      quietHoursStart: '22:00', quietHoursEnd: '07:00',
      retryCount: 2, retryDelayMinutes: 3,
      escalationAfterHours: 24, reminderCadenceHours: 4, dataScope: 'mine',
    },
  },
];

/** Get template by ID */
export function getTemplate(id: string): PipelineTemplate | undefined {
  return PIPELINE_TEMPLATES.find(t => t.id === id);
}
