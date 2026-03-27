import type { BlockDef, BlockCategory } from '../../types/pipeline';

// ── Category metadata ─────────────────────────────────────────────

export const BLOCK_CATEGORIES: Array<{
  id: BlockCategory; label: string; icon: string; color: string; bgColor: string;
}> = [
  { id: 'ai-model',   label: 'Mô hình AI',         icon: 'Bot',         color: 'text-violet-300', bgColor: 'bg-violet-600' },
  { id: 'trigger',    label: 'Kích hoạt',          icon: 'Zap',         color: 'text-yellow-300', bgColor: 'bg-yellow-600' },
  { id: 'source',     label: 'Nguồn dữ liệu',      icon: 'Database',    color: 'text-blue-300',   bgColor: 'bg-blue-600'   },
  { id: 'filter',     label: 'Lọc & định tuyến',   icon: 'Filter',      color: 'text-indigo-300', bgColor: 'bg-indigo-600' },
  { id: 'understand', label: 'Hiểu nội dung',       icon: 'Brain',       color: 'text-purple-300', bgColor: 'bg-purple-600' },
  { id: 'condition',  label: 'Điều kiện & logic',  icon: 'GitBranch',   color: 'text-green-300',  bgColor: 'bg-green-600'  },
  { id: 'decide',     label: 'Quyết định',          icon: 'Lightbulb',   color: 'text-rose-300',   bgColor: 'bg-rose-600'   },
  { id: 'approval',   label: 'Chờ duyệt',           icon: 'ShieldCheck', color: 'text-amber-300',  bgColor: 'bg-amber-600'  },
  { id: 'action',     label: 'Hành động',           icon: 'PlayCircle',  color: 'text-emerald-300',bgColor: 'bg-emerald-600'},
  { id: 'notify',     label: 'Thông báo',           icon: 'Bell',        color: 'text-cyan-300',   bgColor: 'bg-cyan-600'   },
  { id: 'state',      label: 'Trạng thái',          icon: 'Save',        color: 'text-slate-300',  bgColor: 'bg-slate-600'  },
];

// ── Block registry ────────────────────────────────────────────────

export const BLOCK_REGISTRY: Record<string, BlockDef> = {

  // ── TRIGGER ─────────────────────────────────────────────────────

  'new-email': {
    id: 'new-email', label: 'Có mail mới', category: 'trigger',
    description: 'Kích hoạt khi có email mới đến mailbox',
    icon: 'Mail', color: 'bg-yellow-600',
    runtimeMapping: 'watch',
    basicFields: [
      { key: 'mailbox', label: 'Mailbox', type: 'select', options: [
          { label: 'Gmail (Demo)', value: 'demo-gmail' },
          { label: 'Outlook (Demo)', value: 'demo-outlook' },
        ], default: 'demo-gmail', required: true },
      { key: 'watch_mode', label: 'Theo dõi', type: 'select', options: [
          { label: 'Tất cả email', value: 'all' },
          { label: 'Chỉ email quan trọng', value: 'important' },
          { label: 'Chưa đọc', value: 'unread' },
        ], default: 'all' },
      { key: 'check_interval', label: 'Kiểm tra mỗi (phút)', type: 'number', default: 5, helper: 'Demo: 30 giây' },
    ],
    advancedFields: [
      { key: 'sender_filter', label: 'Lọc người gửi (email cách nhau bởi dấu phẩy)', type: 'text', placeholder: 'boss@company.com, hr@...' },
      { key: 'subject_filter', label: 'Từ khóa tiêu đề', type: 'text', placeholder: 'urgent, FYI, action required' },
      { key: 'labels', label: 'Labels/Folders', type: 'text', placeholder: 'INBOX, Important' },
      { key: 'working_hours_only', label: 'Chỉ trong giờ làm việc', type: 'toggle', default: false },
    ],
    inputPorts: [],
    outputPorts: [{ id: 'email', label: 'Email', type: 'data' }],
    defaultConfig: { mailbox: 'demo-gmail', watch_mode: 'all', check_interval: 5 },
  },

  'new-message': {
    id: 'new-message', label: 'Có tin nhắn mới', category: 'trigger',
    description: 'Kích hoạt khi nhận tin nhắn mới trên chat',
    icon: 'MessageSquare', color: 'bg-yellow-600',
    runtimeMapping: 'watch',
    basicFields: [
      { key: 'channel', label: 'Kênh', type: 'select', options: [
          { label: 'Slack (Demo)', value: 'demo-slack' },
          { label: 'Teams (Demo)', value: 'demo-teams' },
          { label: 'Zalo (Demo)', value: 'demo-zalo' },
        ], default: 'demo-slack', required: true },
      { key: 'rooms', label: 'Phòng/Kênh theo dõi', type: 'text', placeholder: '#general, #alerts', default: '#general' },
    ],
    advancedFields: [
      { key: 'sender_filter', label: 'Chỉ từ người dùng', type: 'text', placeholder: '@manager, @bot' },
      { key: 'ignore_bots', label: 'Bỏ qua bot', type: 'toggle', default: true },
      { key: 'keywords', label: 'Từ khóa kích hoạt', type: 'text', placeholder: 'urgent, help, approve' },
    ],
    inputPorts: [],
    outputPorts: [{ id: 'message', label: 'Tin nhắn', type: 'data' }],
    defaultConfig: { channel: 'demo-slack', rooms: '#general' },
  },

  'new-meeting-invite': {
    id: 'new-meeting-invite', label: 'Có lời mời họp mới', category: 'trigger',
    description: 'Kích hoạt khi nhận lời mời tham gia cuộc họp',
    icon: 'CalendarPlus', color: 'bg-yellow-600',
    runtimeMapping: 'watch',
    basicFields: [
      { key: 'calendar', label: 'Lịch', type: 'select', options: [
          { label: 'Google Calendar (Demo)', value: 'demo-gcal' },
        ], default: 'demo-gcal' },
      { key: 'auto_accept', label: 'Tự chấp nhận nếu', type: 'select', options: [
          { label: 'Không tự chấp nhận', value: 'never' },
          { label: 'Lịch trống', value: 'free' },
          { label: 'Từ danh sách tin tưởng', value: 'trusted' },
        ], default: 'never' },
    ],
    advancedFields: [
      { key: 'organizer_filter', label: 'Lọc theo người tổ chức', type: 'text' },
      { key: 'min_attendees', label: 'Số người tham gia tối thiểu', type: 'number', default: 1 },
    ],
    inputPorts: [],
    outputPorts: [{ id: 'invite', label: 'Lời mời', type: 'data' }],
    defaultConfig: { calendar: 'demo-gcal', auto_accept: 'never' },
  },

  'schedule': {
    id: 'schedule', label: 'Đến giờ định kỳ', category: 'trigger',
    description: 'Chạy pipeline theo lịch định sẵn',
    icon: 'Clock', color: 'bg-yellow-600',
    runtimeMapping: 'watch',
    basicFields: [
      { key: 'frequency', label: 'Tần suất', type: 'select', options: [
          { label: 'Mỗi giờ', value: 'hourly' },
          { label: 'Mỗi ngày', value: 'daily' },
          { label: 'Mỗi tuần', value: 'weekly' },
          { label: 'Tùy chỉnh', value: 'custom' },
        ], default: 'daily', required: true },
      { key: 'run_at', label: 'Chạy lúc', type: 'time', default: '08:00' },
    ],
    advancedFields: [
      { key: 'timezone', label: 'Múi giờ', type: 'select', options: [
          { label: 'Asia/Ho_Chi_Minh (GMT+7)', value: 'Asia/Ho_Chi_Minh' },
          { label: 'UTC', value: 'UTC' },
        ], default: 'Asia/Ho_Chi_Minh' },
      { key: 'skip_weekends', label: 'Bỏ qua cuối tuần', type: 'toggle', default: false },
      { key: 'cron', label: 'Cron expression (nâng cao)', type: 'text', placeholder: '0 8 * * 1-5' },
    ],
    inputPorts: [],
    outputPorts: [{ id: 'tick', label: 'Trigger', type: 'control' }],
    defaultConfig: { frequency: 'daily', run_at: '08:00', timezone: 'Asia/Ho_Chi_Minh' },
  },

  'near-deadline': {
    id: 'near-deadline', label: 'Gần deadline', category: 'trigger',
    description: 'Kích hoạt khi task/event sắp đến hạn',
    icon: 'AlarmClock', color: 'bg-yellow-600',
    runtimeMapping: 'watch',
    basicFields: [
      { key: 'source', label: 'Nguồn', type: 'select', options: [
          { label: 'Google Calendar (Demo)', value: 'demo-gcal' },
          { label: 'Task List (Demo)', value: 'demo-tasks' },
        ], default: 'demo-tasks' },
      { key: 'hours_before', label: 'Nhắc trước (giờ)', type: 'number', default: 24 },
    ],
    advancedFields: [
      { key: 'priority_filter', label: 'Chỉ task ưu tiên cao', type: 'toggle', default: false },
      { key: 'recurring_check', label: 'Kiểm tra định kỳ', type: 'toggle', default: true },
    ],
    inputPorts: [],
    outputPorts: [{ id: 'item', label: 'Item', type: 'data' }],
    defaultConfig: { source: 'demo-tasks', hours_before: 24 },
  },

  'manual-run': {
    id: 'manual-run', label: 'Chạy tay', category: 'trigger',
    description: 'Người dùng tự kích hoạt pipeline',
    icon: 'Play', color: 'bg-yellow-600',
    runtimeMapping: 'watch',
    basicFields: [
      { key: 'description', label: 'Mô tả', type: 'text', placeholder: 'Pipeline tổng hợp cuối tuần', default: 'Manual trigger' },
    ],
    advancedFields: [
      { key: 'require_input', label: 'Yêu cầu input từ user', type: 'toggle', default: false },
      { key: 'input_prompt', label: 'Câu hỏi nhập liệu', type: 'text', placeholder: 'Nhập ngày cần phân tích...' },
    ],
    inputPorts: [],
    outputPorts: [{ id: 'trigger', label: 'Trigger', type: 'control' }],
    defaultConfig: { description: 'Manual trigger' },
  },

  'new-lead': {
    id: 'new-lead', label: 'Có lead mới', category: 'trigger',
    description: 'Kích hoạt khi có khách hàng tiềm năng mới',
    icon: 'UserPlus', color: 'bg-yellow-600',
    runtimeMapping: 'watch',
    basicFields: [
      { key: 'source', label: 'Nguồn lead', type: 'select', options: [
          { label: 'CRM (Demo)', value: 'demo-crm' },
          { label: 'Form (Demo)', value: 'demo-form' },
        ], default: 'demo-crm' },
      { key: 'score_threshold', label: 'Score tối thiểu', type: 'number', default: 50, helper: '0-100' },
    ],
    advancedFields: [
      { key: 'region_filter', label: 'Lọc theo khu vực', type: 'text', placeholder: 'Hà Nội, HCM' },
      { key: 'industry_filter', label: 'Lọc theo ngành', type: 'text' },
    ],
    inputPorts: [],
    outputPorts: [{ id: 'lead', label: 'Lead', type: 'data' }],
    defaultConfig: { source: 'demo-crm', score_threshold: 50 },
  },

  // ── SOURCE ───────────────────────────────────────────────────────

  'read-email': {
    id: 'read-email', label: 'Đọc email', category: 'source',
    description: 'Lấy nội dung đầy đủ của email',
    icon: 'Inbox', color: 'bg-blue-600',
    runtimeMapping: 'source',
    basicFields: [
      { key: 'count', label: 'Số email tối đa', type: 'number', default: 10 },
      { key: 'include_thread', label: 'Bao gồm thread', type: 'toggle', default: true },
    ],
    advancedFields: [
      { key: 'include_attachments', label: 'Bao gồm file đính kèm', type: 'toggle', default: false },
      { key: 'format', label: 'Định dạng', type: 'select', options: [
          { label: 'Plain text', value: 'text' },
          { label: 'HTML', value: 'html' },
        ], default: 'text' },
      { key: 'max_size_kb', label: 'Kích thước tối đa (KB)', type: 'number', default: 500 },
    ],
    inputPorts: [{ id: 'email_ref', label: 'Email ref', type: 'data' }],
    outputPorts: [{ id: 'emails', label: 'Danh sách email', type: 'data' }],
    defaultConfig: { count: 10, include_thread: true },
  },

  'read-chat': {
    id: 'read-chat', label: 'Đọc chat', category: 'source',
    description: 'Lấy tin nhắn từ kênh chat',
    icon: 'MessageCircle', color: 'bg-blue-600',
    runtimeMapping: 'source',
    basicFields: [
      { key: 'channel', label: 'Kênh', type: 'text', default: '#general', placeholder: '#channel-name' },
      { key: 'count', label: 'Số tin nhắn', type: 'number', default: 20 },
    ],
    advancedFields: [
      { key: 'include_reactions', label: 'Bao gồm reaction', type: 'toggle', default: false },
      { key: 'thread_mode', label: 'Chế độ thread', type: 'select', options: [
          { label: 'Tin chính', value: 'main' },
          { label: 'Tất cả', value: 'all' },
        ], default: 'main' },
    ],
    inputPorts: [{ id: 'message_ref', label: 'Message ref', type: 'data' }],
    outputPorts: [{ id: 'messages', label: 'Tin nhắn', type: 'data' }],
    defaultConfig: { channel: '#general', count: 20 },
  },

  'read-calendar': {
    id: 'read-calendar', label: 'Đọc lịch', category: 'source',
    description: 'Lấy sự kiện từ lịch',
    icon: 'Calendar', color: 'bg-blue-600',
    runtimeMapping: 'source',
    basicFields: [
      { key: 'days_ahead', label: 'Số ngày tới', type: 'number', default: 7 },
      { key: 'include_past', label: 'Bao gồm quá khứ', type: 'toggle', default: false },
    ],
    advancedFields: [
      { key: 'calendar_filter', label: 'Chỉ lịch', type: 'text', placeholder: 'Work, Personal' },
      { key: 'include_declined', label: 'Bao gồm sự kiện đã từ chối', type: 'toggle', default: false },
    ],
    inputPorts: [{ id: 'event_ref', label: 'Event ref', type: 'data' }],
    outputPorts: [{ id: 'events', label: 'Sự kiện', type: 'data' }],
    defaultConfig: { days_ahead: 7, include_past: false },
  },

  'read-tasks': {
    id: 'read-tasks', label: 'Đọc task', category: 'source',
    description: 'Lấy danh sách task từ task manager',
    icon: 'CheckSquare', color: 'bg-blue-600',
    runtimeMapping: 'source',
    basicFields: [
      { key: 'status_filter', label: 'Trạng thái', type: 'select', options: [
          { label: 'Tất cả', value: 'all' },
          { label: 'Chưa xong', value: 'pending' },
          { label: 'Quá hạn', value: 'overdue' },
        ], default: 'pending' },
      { key: 'assignee', label: 'Người được giao', type: 'select', options: [
          { label: 'Tôi', value: 'me' },
          { label: 'Team', value: 'team' },
          { label: 'Tất cả', value: 'all' },
        ], default: 'me' },
    ],
    advancedFields: [
      { key: 'project_filter', label: 'Project', type: 'text', placeholder: 'Project name' },
      { key: 'include_subtasks', label: 'Bao gồm subtask', type: 'toggle', default: false },
    ],
    inputPorts: [{ id: 'trigger', label: 'Trigger', type: 'control' }],
    outputPorts: [{ id: 'tasks', label: 'Tasks', type: 'data' }],
    defaultConfig: { status_filter: 'pending', assignee: 'me' },
  },

  'read-crm': {
    id: 'read-crm', label: 'Đọc CRM', category: 'source',
    description: 'Lấy thông tin khách hàng/lead từ CRM',
    icon: 'Users', color: 'bg-blue-600',
    runtimeMapping: 'source',
    basicFields: [
      { key: 'entity_type', label: 'Loại', type: 'select', options: [
          { label: 'Lead', value: 'lead' },
          { label: 'Contact', value: 'contact' },
          { label: 'Deal', value: 'deal' },
        ], default: 'lead' },
      { key: 'status', label: 'Trạng thái', type: 'select', options: [
          { label: 'Mới', value: 'new' },
          { label: 'Đang theo dõi', value: 'in_progress' },
          { label: 'Im lặng', value: 'cold' },
        ], default: 'new' },
    ],
    advancedFields: [
      { key: 'owner_filter', label: 'Owner', type: 'text', placeholder: 'Email của owner' },
      { key: 'date_range', label: 'Khoảng thời gian (ngày)', type: 'number', default: 30 },
    ],
    inputPorts: [{ id: 'trigger', label: 'Trigger', type: 'control' }],
    outputPorts: [{ id: 'records', label: 'CRM Records', type: 'data' }],
    defaultConfig: { entity_type: 'lead', status: 'new' },
  },

  'read-docs': {
    id: 'read-docs', label: 'Đọc tài liệu', category: 'source',
    description: 'Đọc nội dung từ file hoặc Google Docs',
    icon: 'FileText', color: 'bg-blue-600',
    runtimeMapping: 'source',
    basicFields: [
      { key: 'source', label: 'Nguồn', type: 'select', options: [
          { label: 'Google Drive (Demo)', value: 'demo-drive' },
          { label: 'Notion (Demo)', value: 'demo-notion' },
        ], default: 'demo-drive' },
      { key: 'file_types', label: 'Loại file', type: 'multiselect', options: [
          { label: 'Google Docs', value: 'gdoc' },
          { label: 'PDF', value: 'pdf' },
          { label: 'Word', value: 'docx' },
        ], default: ['gdoc'] },
    ],
    advancedFields: [
      { key: 'watch_changes', label: 'Chỉ file có thay đổi', type: 'toggle', default: true },
      { key: 'max_size_mb', label: 'Kích thước tối đa (MB)', type: 'number', default: 10 },
    ],
    inputPorts: [{ id: 'trigger', label: 'Trigger', type: 'control' }],
    outputPorts: [{ id: 'documents', label: 'Tài liệu', type: 'data' }],
    defaultConfig: { source: 'demo-drive', file_types: ['gdoc'] },
  },

  // ── FILTER ───────────────────────────────────────────────────────

  'filter-sender': {
    id: 'filter-sender', label: 'Lọc theo người gửi', category: 'filter',
    description: 'Chỉ xử lý email/tin nhắn từ người gửi cụ thể',
    icon: 'UserCheck', color: 'bg-indigo-600',
    runtimeMapping: 'filter',
    basicFields: [
      { key: 'sender_list', label: 'Danh sách email', type: 'textarea', placeholder: 'boss@company.com\nhr@company.com', required: true },
      { key: 'match_mode', label: 'Chế độ', type: 'select', options: [
          { label: 'Chỉ giữ lại', value: 'include' },
          { label: 'Loại bỏ', value: 'exclude' },
        ], default: 'include' },
    ],
    advancedFields: [
      { key: 'domain_only', label: 'So sánh theo domain', type: 'toggle', default: false },
      { key: 'regex_mode', label: 'Dùng Regex', type: 'toggle', default: false },
    ],
    inputPorts: [{ id: 'items', label: 'Items vào', type: 'data' }],
    outputPorts: [{ id: 'filtered', label: 'Items đã lọc', type: 'data' }],
    defaultConfig: { sender_list: '', match_mode: 'include' },
  },

  'filter-keyword': {
    id: 'filter-keyword', label: 'Lọc theo từ khóa', category: 'filter',
    description: 'Lọc item theo từ khóa trong nội dung',
    icon: 'Search', color: 'bg-indigo-600',
    runtimeMapping: 'filter',
    basicFields: [
      { key: 'keywords', label: 'Từ khóa (cách bởi dấu phẩy)', type: 'text', placeholder: 'urgent, action required, FYI', required: true },
      { key: 'match_mode', label: 'Điều kiện', type: 'select', options: [
          { label: 'Có bất kỳ từ nào', value: 'any' },
          { label: 'Có tất cả từ', value: 'all' },
        ], default: 'any' },
    ],
    advancedFields: [
      { key: 'case_sensitive', label: 'Phân biệt hoa thường', type: 'toggle', default: false },
      { key: 'search_fields', label: 'Tìm trong', type: 'multiselect', options: [
          { label: 'Subject/Tiêu đề', value: 'subject' },
          { label: 'Body/Nội dung', value: 'body' },
          { label: 'Sender', value: 'sender' },
        ], default: ['subject', 'body'] },
    ],
    inputPorts: [{ id: 'items', label: 'Items', type: 'data' }],
    outputPorts: [{ id: 'matched', label: 'Matched', type: 'data' }],
    defaultConfig: { keywords: '', match_mode: 'any' },
  },

  'filter-priority': {
    id: 'filter-priority', label: 'Lọc theo độ ưu tiên', category: 'filter',
    description: 'Chỉ lấy item từ mức ưu tiên nhất định trở lên',
    icon: 'Flag', color: 'bg-indigo-600',
    runtimeMapping: 'filter',
    basicFields: [
      { key: 'min_priority', label: 'Ưu tiên tối thiểu', type: 'select', options: [
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
          { label: 'Critical', value: 'critical' },
        ], default: 'high' },
    ],
    advancedFields: [
      { key: 'priority_field', label: 'Field ưu tiên', type: 'text', default: 'priority', helper: 'Tên field trong data' },
      { key: 'use_ai_score', label: 'Dùng AI để chấm điểm', type: 'toggle', default: false },
    ],
    inputPorts: [{ id: 'items', label: 'Items', type: 'data' }],
    outputPorts: [{ id: 'filtered', label: 'High priority', type: 'data' }],
    defaultConfig: { min_priority: 'high' },
  },

  'filter-unprocessed': {
    id: 'filter-unprocessed', label: 'Chỉ lấy chưa xử lý', category: 'filter',
    description: 'Bỏ qua các item đã được pipeline xử lý trước đó',
    icon: 'FilterX', color: 'bg-indigo-600',
    runtimeMapping: 'filter',
    basicFields: [
      { key: 'state_key', label: 'Key trạng thái', type: 'text', default: 'processed_ids', required: true },
    ],
    advancedFields: [
      { key: 'max_age_hours', label: 'Chỉ nhớ trong (giờ)', type: 'number', default: 72 },
    ],
    inputPorts: [{ id: 'items', label: 'Items', type: 'data' }],
    outputPorts: [{ id: 'new_items', label: 'Items mới', type: 'data' }],
    defaultConfig: { state_key: 'processed_ids' },
  },

  'route-topic': {
    id: 'route-topic', label: 'Route theo chủ đề', category: 'filter',
    description: 'Phân loại và định tuyến item theo chủ đề AI nhận diện',
    icon: 'GitFork', color: 'bg-indigo-600',
    runtimeMapping: 'filter',
    basicFields: [
      { key: 'topics', label: 'Chủ đề (cách bởi dấu phẩy)', type: 'text', placeholder: 'billing, support, sales, general', required: true },
    ],
    advancedFields: [
      { key: 'default_topic', label: 'Chủ đề mặc định nếu không xác định được', type: 'text', default: 'general' },
      { key: 'confidence_threshold', label: 'Ngưỡng tự tin (%)', type: 'number', default: 70 },
    ],
    inputPorts: [{ id: 'items', label: 'Items', type: 'data' }],
    outputPorts: [{ id: 'routed', label: 'Items đã phân loại', type: 'data' }],
    defaultConfig: { topics: 'billing, support, general' },
  },

  // ── UNDERSTAND ───────────────────────────────────────────────────

  'summarize': {
    id: 'summarize', label: 'Tóm tắt nội dung', category: 'understand',
    description: 'AI tóm tắt nội dung thành điểm chính',
    icon: 'FileOutput', color: 'bg-purple-600',
    runtimeMapping: 'understand',
    basicFields: [
      { key: 'max_length', label: 'Độ dài tối đa (từ)', type: 'number', default: 150 },
      { key: 'language', label: 'Ngôn ngữ', type: 'select', options: [
          { label: 'Tiếng Việt', value: 'vi' },
          { label: 'English', value: 'en' },
        ], default: 'vi' },
    ],
    advancedFields: [
      { key: 'style', label: 'Phong cách', type: 'select', options: [
          { label: 'Ngắn gọn', value: 'concise' },
          { label: 'Chi tiết', value: 'detailed' },
          { label: 'Bullet points', value: 'bullets' },
        ], default: 'bullets' },
      { key: 'include_quotes', label: 'Bao gồm trích dẫn', type: 'toggle', default: false },
    ],
    inputPorts: [{ id: 'content', label: 'Nội dung', type: 'data' }],
    outputPorts: [{ id: 'summary', label: 'Tóm tắt', type: 'data' }],
    defaultConfig: { max_length: 150, language: 'vi' },
  },

  'extract-actions': {
    id: 'extract-actions', label: 'Trích action items', category: 'understand',
    description: 'Trích xuất các hành động cần làm từ nội dung',
    icon: 'ListChecks', color: 'bg-purple-600',
    runtimeMapping: 'understand',
    basicFields: [
      { key: 'detect_owner', label: 'Nhận diện người thực hiện', type: 'toggle', default: true },
      { key: 'detect_deadline', label: 'Nhận diện deadline', type: 'toggle', default: true },
    ],
    advancedFields: [
      { key: 'detect_priority', label: 'Nhận diện mức ưu tiên', type: 'toggle', default: true },
      { key: 'output_format', label: 'Định dạng output', type: 'select', options: [
          { label: 'List', value: 'list' },
          { label: 'JSON', value: 'json' },
        ], default: 'list' },
    ],
    inputPorts: [{ id: 'content', label: 'Nội dung', type: 'data' }],
    outputPorts: [{ id: 'actions', label: 'Action items', type: 'data' }],
    defaultConfig: { detect_owner: true, detect_deadline: true },
  },

  'identify-intent': {
    id: 'identify-intent', label: 'Nhận diện intent', category: 'understand',
    description: 'Xác định ý định của người gửi',
    icon: 'Target', color: 'bg-purple-600',
    runtimeMapping: 'understand',
    basicFields: [
      { key: 'intent_types', label: 'Các intent cần nhận diện', type: 'textarea', placeholder: 'meeting_request\napproval_needed\ninfo_request\ncomplaint' },
    ],
    advancedFields: [
      { key: 'confidence_threshold', label: 'Ngưỡng tự tin (%)', type: 'number', default: 70 },
    ],
    inputPorts: [{ id: 'content', label: 'Nội dung', type: 'data' }],
    outputPorts: [{ id: 'intent', label: 'Intent', type: 'data' }],
    defaultConfig: { intent_types: 'meeting_request\napproval_needed\ninfo_request' },
  },

  'identify-meeting': {
    id: 'identify-meeting', label: 'Nhận diện yêu cầu họp', category: 'understand',
    description: 'Trích xuất thông tin cuộc họp từ email/tin nhắn',
    icon: 'CalendarSearch', color: 'bg-purple-600',
    runtimeMapping: 'understand',
    basicFields: [
      { key: 'detect_urgency', label: 'Nhận diện mức khẩn', type: 'toggle', default: true },
    ],
    advancedFields: [
      { key: 'detect_participants', label: 'Nhận diện người tham gia', type: 'toggle', default: true },
      { key: 'detect_duration', label: 'Nhận diện thời lượng', type: 'toggle', default: true },
      { key: 'detect_location', label: 'Nhận diện địa điểm', type: 'toggle', default: false },
    ],
    inputPorts: [{ id: 'content', label: 'Nội dung', type: 'data' }],
    outputPorts: [{ id: 'meeting_info', label: 'Thông tin họp', type: 'data' }],
    defaultConfig: { detect_urgency: true },
  },

  'classify': {
    id: 'classify', label: 'Phân loại', category: 'understand',
    description: 'Phân loại item vào các nhóm định sẵn',
    icon: 'Tag', color: 'bg-purple-600',
    runtimeMapping: 'understand',
    basicFields: [
      { key: 'categories', label: 'Danh mục (mỗi dòng một mục)', type: 'textarea', placeholder: 'urgent\nnormal\nfyi\nspam', required: true, default: 'urgent\nnormal\nfyi' },
    ],
    advancedFields: [
      { key: 'multi_label', label: 'Cho phép nhiều nhãn', type: 'toggle', default: false },
      { key: 'confidence_threshold', label: 'Ngưỡng tự tin (%)', type: 'number', default: 60 },
    ],
    inputPorts: [{ id: 'content', label: 'Nội dung', type: 'data' }],
    outputPorts: [{ id: 'classified', label: 'Đã phân loại', type: 'data' }],
    defaultConfig: { categories: 'urgent\nnormal\nfyi' },
  },

  // ── CONDITION ────────────────────────────────────────────────────

  'if-then': {
    id: 'if-then', label: 'Nếu / Thì', category: 'condition',
    description: 'Rẽ nhánh dựa trên điều kiện đơn giản',
    icon: 'GitBranch', color: 'bg-green-600',
    runtimeMapping: 'condition',
    basicFields: [
      { key: 'field', label: 'Field kiểm tra', type: 'text', placeholder: 'priority', required: true },
      { key: 'operator', label: 'Điều kiện', type: 'select', options: [
          { label: 'bằng', value: 'eq' },
          { label: 'không bằng', value: 'neq' },
          { label: 'lớn hơn', value: 'gt' },
          { label: 'chứa', value: 'contains' },
          { label: 'tồn tại', value: 'exists' },
        ], default: 'eq' },
      { key: 'value', label: 'Giá trị', type: 'text', placeholder: 'high' },
    ],
    advancedFields: [
      { key: 'case_sensitive', label: 'Phân biệt hoa thường', type: 'toggle', default: false },
    ],
    inputPorts: [{ id: 'data', label: 'Data', type: 'data' }],
    outputPorts: [
      { id: 'yes', label: 'Đúng (Yes)', type: 'control' },
      { id: 'no',  label: 'Sai (No)',   type: 'control' },
    ],
    defaultConfig: { field: 'priority', operator: 'eq', value: 'high' },
  },

  'compare-value': {
    id: 'compare-value', label: 'So sánh giá trị', category: 'condition',
    description: 'So sánh hai giá trị hoặc field',
    icon: 'ArrowLeftRight', color: 'bg-green-600',
    runtimeMapping: 'condition',
    basicFields: [
      { key: 'field_a', label: 'Field A', type: 'text', placeholder: 'score', required: true },
      { key: 'operator', label: 'So sánh', type: 'select', options: [
          { label: '> lớn hơn', value: 'gt' },
          { label: '>= lớn hơn hoặc bằng', value: 'gte' },
          { label: '< nhỏ hơn', value: 'lt' },
          { label: '<= nhỏ hơn hoặc bằng', value: 'lte' },
          { label: '= bằng', value: 'eq' },
        ], default: 'gt' },
      { key: 'value_b', label: 'Giá trị B', type: 'number', default: 0 },
    ],
    advancedFields: [
      { key: 'tolerance', label: 'Dung sai (số)', type: 'number', default: 0 },
    ],
    inputPorts: [{ id: 'data', label: 'Data', type: 'data' }],
    outputPorts: [
      { id: 'true',  label: 'True',  type: 'control' },
      { id: 'false', label: 'False', type: 'control' },
    ],
    defaultConfig: { field_a: 'score', operator: 'gt', value_b: 50 },
  },

  'check-conflict': {
    id: 'check-conflict', label: 'Kiểm tra xung đột lịch', category: 'condition',
    description: 'Kiểm tra xem khung giờ có bị xung đột không',
    icon: 'CalendarX', color: 'bg-green-600',
    runtimeMapping: 'condition',
    basicFields: [
      { key: 'calendar', label: 'Lịch', type: 'select', options: [
          { label: 'Google Calendar (Demo)', value: 'demo-gcal' },
        ], default: 'demo-gcal' },
      { key: 'duration_minutes', label: 'Thời lượng (phút)', type: 'number', default: 60 },
    ],
    advancedFields: [
      { key: 'buffer_minutes', label: 'Buffer trước/sau (phút)', type: 'number', default: 15 },
      { key: 'include_tentative', label: 'Tính cả sự kiện "tentative"', type: 'toggle', default: false },
    ],
    inputPorts: [{ id: 'time_slot', label: 'Khung giờ', type: 'data' }],
    outputPorts: [
      { id: 'free',     label: 'Trống',     type: 'control' },
      { id: 'conflict', label: 'Xung đột',  type: 'control' },
    ],
    defaultConfig: { calendar: 'demo-gcal', duration_minutes: 60 },
  },

  'risk-score': {
    id: 'risk-score', label: 'Chấm rủi ro / ưu tiên', category: 'condition',
    description: 'AI đánh giá mức độ rủi ro hoặc ưu tiên của item',
    icon: 'BarChart', color: 'bg-green-600',
    runtimeMapping: 'condition',
    basicFields: [
      { key: 'scoring_rules', label: 'Tiêu chí chấm điểm', type: 'textarea', placeholder: 'Chấm theo: độ khẩn, người gửi, thời hạn', default: 'Chấm theo: độ khẩn, người gửi, thời hạn' },
      { key: 'threshold', label: 'Ngưỡng "rủi ro cao"', type: 'number', default: 70, helper: '0-100' },
    ],
    advancedFields: [
      { key: 'high_risk_weight', label: 'Trọng số rủi ro cao', type: 'number', default: 3 },
      { key: 'output_field', label: 'Tên field output', type: 'text', default: 'risk_score' },
    ],
    inputPorts: [{ id: 'item', label: 'Item', type: 'data' }],
    outputPorts: [
      { id: 'high',   label: 'Rủi ro cao',    type: 'control' },
      { id: 'normal', label: 'Rủi ro bình thường', type: 'control' },
    ],
    defaultConfig: { scoring_rules: 'Chấm theo: độ khẩn, người gửi, thời hạn', threshold: 70 },
  },

  // ── DECIDE ───────────────────────────────────────────────────────

  'decide-action': {
    id: 'decide-action', label: 'Quyết định hành động', category: 'decide',
    description: 'AI quyết định outcome tốt nhất từ 6 lựa chọn chuẩn',
    icon: 'BrainCircuit', color: 'bg-rose-600',
    runtimeMapping: 'decide',
    basicFields: [
      { key: 'default_outcome', label: 'Outcome mặc định', type: 'select', options: [
          { label: 'NOTIFY — Thông báo', value: 'NOTIFY' },
          { label: 'SUGGEST — Gợi ý', value: 'SUGGEST' },
          { label: 'WAIT_APPROVAL — Chờ duyệt', value: 'WAIT_APPROVAL' },
          { label: 'AUTO_ACT — Tự động làm', value: 'AUTO_ACT' },
          { label: 'IGNORE — Bỏ qua', value: 'IGNORE' },
          { label: 'REMIND_LATER — Nhắc sau', value: 'REMIND_LATER' },
        ], default: 'NOTIFY', required: true },
      { key: 'reasoning', label: 'Hướng dẫn quyết định', type: 'textarea', placeholder: 'Nếu sender là sếp và subject có "urgent" thì AUTO_ACT...' },
    ],
    advancedFields: [
      { key: 'confidence_threshold', label: 'Ngưỡng tự tin tối thiểu (%)', type: 'number', default: 60 },
      { key: 'fallback', label: 'Outcome dự phòng', type: 'select', options: [
          { label: 'NOTIFY', value: 'NOTIFY' },
          { label: 'WAIT_APPROVAL', value: 'WAIT_APPROVAL' },
        ], default: 'NOTIFY' },
    ],
    inputPorts: [{ id: 'context', label: 'Context', type: 'data' }],
    outputPorts: [
      { id: 'outcome', label: 'Outcome', type: 'data' },
      { id: 'ignore',   label: 'IGNORE',         type: 'control' },
      { id: 'notify',   label: 'NOTIFY',         type: 'control' },
      { id: 'suggest',  label: 'SUGGEST',        type: 'control' },
      { id: 'approval', label: 'WAIT_APPROVAL',  type: 'control' },
      { id: 'auto_act', label: 'AUTO_ACT',       type: 'control' },
      { id: 'remind',   label: 'REMIND_LATER',   type: 'control' },
    ],
    defaultConfig: { default_outcome: 'NOTIFY', reasoning: '' },
  },

  'suggest-reply': {
    id: 'suggest-reply', label: 'Gợi ý phản hồi', category: 'decide',
    description: 'AI soạn sẵn các phương án trả lời',
    icon: 'MessageCirclePlus', color: 'bg-rose-600',
    runtimeMapping: 'decide',
    basicFields: [
      { key: 'tone', label: 'Giọng điệu', type: 'select', options: [
          { label: 'Chuyên nghiệp', value: 'professional' },
          { label: 'Thân thiện', value: 'friendly' },
          { label: 'Ngắn gọn', value: 'brief' },
        ], default: 'professional' },
      { key: 'max_options', label: 'Số phương án', type: 'number', default: 3 },
    ],
    advancedFields: [
      { key: 'language', label: 'Ngôn ngữ', type: 'select', options: [
          { label: 'Tiếng Việt', value: 'vi' },
          { label: 'English', value: 'en' },
        ], default: 'vi' },
      { key: 'include_greeting', label: 'Thêm lời chào', type: 'toggle', default: true },
    ],
    inputPorts: [{ id: 'email', label: 'Email gốc', type: 'data' }],
    outputPorts: [{ id: 'suggestions', label: 'Phương án trả lời', type: 'data' }],
    defaultConfig: { tone: 'professional', max_options: 3, language: 'vi' },
  },

  'suggest-meeting': {
    id: 'suggest-meeting', label: 'Gợi ý khung giờ họp', category: 'decide',
    description: 'Tìm và gợi ý khung giờ phù hợp cho cuộc họp',
    icon: 'CalendarClock', color: 'bg-rose-600',
    runtimeMapping: 'decide',
    basicFields: [
      { key: 'duration_minutes', label: 'Thời lượng (phút)', type: 'number', default: 60 },
      { key: 'days_ahead', label: 'Tìm trong (ngày tới)', type: 'number', default: 7 },
      { key: 'slot_count', label: 'Số khung giờ gợi ý', type: 'number', default: 3 },
    ],
    advancedFields: [
      { key: 'preferred_hours', label: 'Giờ ưu tiên', type: 'text', placeholder: '9:00-17:00' },
      { key: 'timezone', label: 'Múi giờ', type: 'text', default: 'Asia/Ho_Chi_Minh' },
      { key: 'meeting_type', label: 'Loại cuộc họp', type: 'select', options: [
          { label: 'Online', value: 'online' },
          { label: 'Tại văn phòng', value: 'office' },
        ], default: 'online' },
    ],
    inputPorts: [{ id: 'meeting_info', label: 'Thông tin họp', type: 'data' }],
    outputPorts: [{ id: 'slots', label: 'Khung giờ gợi ý', type: 'data' }],
    defaultConfig: { duration_minutes: 60, days_ahead: 7, slot_count: 3 },
  },

  'suggest-followup': {
    id: 'suggest-followup', label: 'Gợi ý follow-up', category: 'decide',
    description: 'Gợi ý hành động tiếp theo với khách hàng/lead',
    icon: 'TrendingUp', color: 'bg-rose-600',
    runtimeMapping: 'decide',
    basicFields: [
      { key: 'delay_days', label: 'Follow-up sau (ngày)', type: 'number', default: 3 },
      { key: 'template', label: 'Template', type: 'select', options: [
          { label: 'Nhắc nhở nhẹ', value: 'soft_reminder' },
          { label: 'Hỏi thăm', value: 'check_in' },
          { label: 'Offer help', value: 'offer_help' },
        ], default: 'check_in' },
    ],
    advancedFields: [
      { key: 'max_attempts', label: 'Số lần follow-up tối đa', type: 'number', default: 3 },
    ],
    inputPorts: [{ id: 'lead', label: 'Lead info', type: 'data' }],
    outputPorts: [{ id: 'followup_plan', label: 'Kế hoạch follow-up', type: 'data' }],
    defaultConfig: { delay_days: 3, template: 'check_in', max_attempts: 3 },
  },

  // ── APPROVAL ─────────────────────────────────────────────────────

  'ask-user': {
    id: 'ask-user', label: 'Xin user duyệt', category: 'approval',
    description: 'Tạm dừng pipeline và chờ người dùng xác nhận',
    icon: 'UserCheck', color: 'bg-amber-600',
    runtimeMapping: 'wait',
    basicFields: [
      { key: 'action_description', label: 'Mô tả hành động cần duyệt', type: 'textarea', required: true, placeholder: 'Gửi email xác nhận họp cho khách hàng' },
      { key: 'timeout_hours', label: 'Hết hạn sau (giờ)', type: 'number', default: 24 },
    ],
    advancedFields: [
      { key: 'auto_approve_condition', label: 'Tự duyệt nếu', type: 'text', placeholder: 'sender_is_trusted = true' },
      { key: 'escalate_to', label: 'Escalate đến (nếu timeout)', type: 'text', placeholder: 'manager@company.com' },
      { key: 'reminder_hours', label: 'Nhắc lại sau (giờ)', type: 'number', default: 4 },
    ],
    inputPorts: [{ id: 'proposed_action', label: 'Hành động đề xuất', type: 'data' }],
    outputPorts: [
      { id: 'approved',  label: 'Đã duyệt',  type: 'control' },
      { id: 'rejected',  label: 'Từ chối',   type: 'control' },
      { id: 'timeout',   label: 'Hết hạn',   type: 'control' },
    ],
    defaultConfig: { action_description: '', timeout_hours: 24 },
  },

  'ask-manager': {
    id: 'ask-manager', label: 'Xin manager duyệt', category: 'approval',
    description: 'Gửi yêu cầu phê duyệt đến quản lý',
    icon: 'ShieldCheck', color: 'bg-amber-600',
    runtimeMapping: 'wait',
    basicFields: [
      { key: 'manager', label: 'Manager', type: 'text', placeholder: 'manager@company.com', required: true },
      { key: 'action_description', label: 'Mô tả hành động', type: 'textarea', required: true },
      { key: 'timeout_hours', label: 'Hết hạn sau (giờ)', type: 'number', default: 48 },
    ],
    advancedFields: [
      { key: 'escalate_to', label: 'Escalate đến', type: 'text', placeholder: 'director@company.com' },
      { key: 'reminder_hours', label: 'Nhắc lại sau (giờ)', type: 'number', default: 8 },
    ],
    inputPorts: [{ id: 'request', label: 'Yêu cầu', type: 'data' }],
    outputPorts: [
      { id: 'approved', label: 'Đã duyệt', type: 'control' },
      { id: 'rejected', label: 'Từ chối',  type: 'control' },
    ],
    defaultConfig: { manager: '', action_description: '', timeout_hours: 48 },
  },

  'wait-timeout': {
    id: 'wait-timeout', label: 'Chờ & Timeout', category: 'approval',
    description: 'Chờ một khoảng thời gian rồi tiếp tục hoặc hủy',
    icon: 'Timer', color: 'bg-amber-600',
    runtimeMapping: 'wait',
    basicFields: [
      { key: 'hours', label: 'Chờ (giờ)', type: 'number', default: 2 },
      { key: 'action_if_timeout', label: 'Nếu hết giờ', type: 'select', options: [
          { label: 'Tiếp tục', value: 'continue' },
          { label: 'Hủy pipeline', value: 'cancel' },
          { label: 'Escalate', value: 'escalate' },
        ], default: 'continue' },
    ],
    advancedFields: [
      { key: 'grace_period_minutes', label: 'Thời gian ân hạn (phút)', type: 'number', default: 10 },
    ],
    inputPorts: [{ id: 'trigger', label: 'Trigger', type: 'control' }],
    outputPorts: [
      { id: 'continue',  label: 'Tiếp tục', type: 'control' },
      { id: 'timeout',   label: 'Timeout',  type: 'control' },
    ],
    defaultConfig: { hours: 2, action_if_timeout: 'continue' },
  },

  'escalate-approval': {
    id: 'escalate-approval', label: 'Escalate', category: 'approval',
    description: 'Chuyển lên cấp cao hơn nếu chưa được xử lý',
    icon: 'ArrowUpCircle', color: 'bg-amber-600',
    runtimeMapping: 'wait',
    basicFields: [
      { key: 'escalate_to', label: 'Escalate đến', type: 'text', required: true, placeholder: 'director@company.com' },
      { key: 'reason', label: 'Lý do escalate', type: 'text', placeholder: 'Chưa được xử lý sau 48 giờ' },
    ],
    advancedFields: [
      { key: 'notify_all', label: 'Thông báo tất cả stakeholder', type: 'toggle', default: false },
    ],
    inputPorts: [{ id: 'pending_item', label: 'Item đang chờ', type: 'data' }],
    outputPorts: [{ id: 'escalated', label: 'Đã escalate', type: 'control' }],
    defaultConfig: { escalate_to: '', reason: '' },
  },

  // ── ACTION ───────────────────────────────────────────────────────

  'draft-email': {
    id: 'draft-email', label: 'Tạo draft email', category: 'action',
    description: 'Soạn email nháp và lưu vào mailbox',
    icon: 'FilePen', color: 'bg-emerald-600',
    runtimeMapping: 'act',
    basicFields: [
      { key: 'to', label: 'Gửi đến', type: 'text', placeholder: '{{sender}} hoặc email cụ thể', required: true },
      { key: 'subject_template', label: 'Tiêu đề', type: 'text', placeholder: 'Re: {{subject}}' },
      { key: 'body_template', label: 'Nội dung', type: 'textarea', placeholder: 'Sử dụng {{summary}}, {{name}}, ... để chèn data' },
    ],
    advancedFields: [
      { key: 'cc', label: 'CC', type: 'text', placeholder: 'email, email' },
      { key: 'reply_mode', label: 'Chế độ', type: 'select', options: [
          { label: 'Reply', value: 'reply' },
          { label: 'New email', value: 'new' },
        ], default: 'reply' },
    ],
    inputPorts: [{ id: 'context', label: 'Context', type: 'data' }],
    outputPorts: [{ id: 'draft', label: 'Email draft', type: 'data' }],
    defaultConfig: { to: '{{sender}}', subject_template: 'Re: {{subject}}' },
  },

  'send-email': {
    id: 'send-email', label: 'Gửi email', category: 'action',
    description: 'Gửi email ngay lập tức',
    icon: 'Send', color: 'bg-emerald-600',
    runtimeMapping: 'act',
    basicFields: [
      { key: 'to', label: 'Gửi đến', type: 'text', required: true, placeholder: '{{sender}} hoặc email cụ thể' },
      { key: 'subject', label: 'Tiêu đề', type: 'text', required: true },
      { key: 'body', label: 'Nội dung', type: 'textarea', required: true },
    ],
    advancedFields: [
      { key: 'cc', label: 'CC', type: 'text' },
      { key: 'schedule_send', label: 'Hẹn giờ gửi', type: 'time' },
      { key: 'track_open', label: 'Theo dõi đọc', type: 'toggle', default: false },
    ],
    inputPorts: [{ id: 'draft', label: 'Email draft', type: 'data' }],
    outputPorts: [{ id: 'sent', label: 'Đã gửi', type: 'data' }],
    defaultConfig: { to: '{{sender}}', subject: '', body: '' },
  },

  'create-event': {
    id: 'create-event', label: 'Tạo lịch họp', category: 'action',
    description: 'Tạo sự kiện trong Google Calendar',
    icon: 'CalendarPlus2', color: 'bg-emerald-600',
    runtimeMapping: 'act',
    basicFields: [
      { key: 'title', label: 'Tiêu đề', type: 'text', required: true, placeholder: '{{meeting_title}} hoặc nhập thẳng' },
      { key: 'duration_minutes', label: 'Thời lượng (phút)', type: 'number', default: 60 },
      { key: 'attendees', label: 'Người tham gia', type: 'text', placeholder: '{{participants}} hoặc email' },
    ],
    advancedFields: [
      { key: 'location', label: 'Địa điểm', type: 'text', placeholder: 'Phòng họp A / Google Meet' },
      { key: 'description', label: 'Mô tả', type: 'textarea' },
      { key: 'video_link', label: 'Tự động tạo video call', type: 'toggle', default: true },
    ],
    inputPorts: [{ id: 'meeting_info', label: 'Thông tin họp', type: 'data' }],
    outputPorts: [{ id: 'event', label: 'Event đã tạo', type: 'data' }],
    defaultConfig: { title: '{{meeting_title}}', duration_minutes: 60, attendees: '{{participants}}' },
  },

  'create-task': {
    id: 'create-task', label: 'Tạo task', category: 'action',
    description: 'Tạo task mới trong task manager',
    icon: 'PlusSquare', color: 'bg-emerald-600',
    runtimeMapping: 'act',
    basicFields: [
      { key: 'title', label: 'Tên task', type: 'text', required: true, placeholder: '{{action_item}} hoặc nhập thẳng' },
      { key: 'assignee', label: 'Giao cho', type: 'text', placeholder: '{{owner}} hoặc email' },
      { key: 'due_date', label: 'Deadline', type: 'text', placeholder: '{{deadline}} hoặc YYYY-MM-DD' },
    ],
    advancedFields: [
      { key: 'priority', label: 'Ưu tiên', type: 'select', options: [
          { label: 'Low', value: 'low' }, { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' }, { label: 'Critical', value: 'critical' },
        ], default: 'medium' },
      { key: 'project', label: 'Project', type: 'text' },
      { key: 'labels', label: 'Labels', type: 'text', placeholder: 'urgent, review' },
    ],
    inputPorts: [{ id: 'action_items', label: 'Action items', type: 'data' }],
    outputPorts: [{ id: 'task', label: 'Task đã tạo', type: 'data' }],
    defaultConfig: { title: '{{action_item}}', assignee: '{{owner}}', priority: 'medium' },
  },

  'send-message': {
    id: 'send-message', label: 'Gửi tin nhắn', category: 'action',
    description: 'Gửi tin nhắn đến kênh chat',
    icon: 'MessageSquarePlus', color: 'bg-emerald-600',
    runtimeMapping: 'act',
    basicFields: [
      { key: 'channel', label: 'Kênh', type: 'text', required: true, placeholder: '#channel hoặc @user' },
      { key: 'message', label: 'Tin nhắn', type: 'textarea', required: true, placeholder: 'Sử dụng {{summary}}, {{name}}, ...' },
    ],
    advancedFields: [
      { key: 'thread_reply', label: 'Reply vào thread', type: 'toggle', default: false },
      { key: 'mention', label: 'Mention (@user)', type: 'text' },
    ],
    inputPorts: [{ id: 'context', label: 'Context', type: 'data' }],
    outputPorts: [{ id: 'sent', label: 'Đã gửi', type: 'data' }],
    defaultConfig: { channel: '#general', message: '' },
  },

  'update-crm': {
    id: 'update-crm', label: 'Cập nhật CRM', category: 'action',
    description: 'Cập nhật thông tin lead/contact trong CRM',
    icon: 'DatabaseZap', color: 'bg-emerald-600',
    runtimeMapping: 'act',
    basicFields: [
      { key: 'entity_type', label: 'Loại', type: 'select', options: [
          { label: 'Lead', value: 'lead' }, { label: 'Contact', value: 'contact' }, { label: 'Deal', value: 'deal' },
        ], default: 'lead' },
      { key: 'field', label: 'Field cập nhật', type: 'text', required: true, placeholder: 'status, score, last_contacted' },
      { key: 'value', label: 'Giá trị mới', type: 'text', required: true, placeholder: '{{score}} hoặc giá trị cụ thể' },
    ],
    advancedFields: [
      { key: 'note', label: 'Ghi chú hoạt động', type: 'text', placeholder: 'Đã gửi follow-up email ngày {{date}}' },
    ],
    inputPorts: [{ id: 'lead', label: 'Lead info', type: 'data' }],
    outputPorts: [{ id: 'updated', label: 'Đã cập nhật', type: 'data' }],
    defaultConfig: { entity_type: 'lead', field: 'status', value: '' },
  },

  // ── NOTIFY ───────────────────────────────────────────────────────

  'send-notification': {
    id: 'send-notification', label: 'Gửi thông báo', category: 'notify',
    description: 'Gửi thông báo in-app đến người dùng',
    icon: 'Bell', color: 'bg-cyan-600',
    runtimeMapping: 'notify',
    basicFields: [
      { key: 'title', label: 'Tiêu đề thông báo', type: 'text', required: true, placeholder: 'Có email quan trọng từ {{sender}}' },
      { key: 'message', label: 'Nội dung', type: 'textarea', required: true, placeholder: 'Dùng {{summary}}, {{count}}, ...' },
      { key: 'type', label: 'Loại', type: 'select', options: [
          { label: 'Thông tin', value: 'info' },
          { label: 'Cảnh báo', value: 'warning' },
          { label: 'Hành động cần làm', value: 'action' },
        ], default: 'info' },
    ],
    advancedFields: [
      { key: 'priority', label: 'Độ ưu tiên', type: 'select', options: [
          { label: 'Bình thường', value: 'normal' }, { label: 'Cao', value: 'high' },
        ], default: 'normal' },
    ],
    inputPorts: [{ id: 'context', label: 'Context', type: 'data' }],
    outputPorts: [{ id: 'sent', label: 'Đã gửi', type: 'data' }],
    defaultConfig: { title: '', message: '', type: 'info' },
  },

  'send-digest': {
    id: 'send-digest', label: 'Gửi digest', category: 'notify',
    description: 'Tổng hợp và gửi báo cáo tóm tắt',
    icon: 'Newspaper', color: 'bg-cyan-600',
    runtimeMapping: 'notify',
    basicFields: [
      { key: 'format', label: 'Định dạng', type: 'select', options: [
          { label: 'Danh sách đơn giản', value: 'list' },
          { label: 'Bảng có cột', value: 'table' },
          { label: 'Tóm tắt theo nhóm', value: 'grouped' },
        ], default: 'list' },
      { key: 'max_items', label: 'Số item tối đa', type: 'number', default: 10 },
    ],
    advancedFields: [
      { key: 'schedule', label: 'Gửi vào giờ', type: 'time', default: '09:00' },
      { key: 'recipients', label: 'Người nhận thêm', type: 'text', placeholder: 'email, email' },
    ],
    inputPorts: [{ id: 'items', label: 'Items', type: 'data' }],
    outputPorts: [{ id: 'sent', label: 'Đã gửi', type: 'data' }],
    defaultConfig: { format: 'list', max_items: 10 },
  },

  'send-reminder': {
    id: 'send-reminder', label: 'Gửi nhắc nhở', category: 'notify',
    description: 'Gửi nhắc nhở đến người liên quan',
    icon: 'BellRing', color: 'bg-cyan-600',
    runtimeMapping: 'notify',
    basicFields: [
      { key: 'message', label: 'Tin nhắc nhở', type: 'textarea', required: true, placeholder: 'Nhắc: {{task_name}} đến hạn {{deadline}}' },
      { key: 'remind_before_hours', label: 'Nhắc trước (giờ)', type: 'number', default: 2 },
    ],
    advancedFields: [
      { key: 'repeat_if_no_action', label: 'Nhắc lại nếu chưa xử lý', type: 'toggle', default: true },
      { key: 'max_repeats', label: 'Số lần nhắc tối đa', type: 'number', default: 3 },
    ],
    inputPorts: [{ id: 'item', label: 'Item cần nhắc', type: 'data' }],
    outputPorts: [{ id: 'sent', label: 'Đã gửi', type: 'data' }],
    defaultConfig: { message: 'Nhắc: {{task_name}} đến hạn {{deadline}}', remind_before_hours: 2 },
  },

  'send-recap': {
    id: 'send-recap', label: 'Gửi recap', category: 'notify',
    description: 'Gửi tóm tắt kết quả sau khi pipeline hoàn tất',
    icon: 'ScrollText', color: 'bg-cyan-600',
    runtimeMapping: 'notify',
    basicFields: [
      { key: 'include_items', label: 'Bao gồm', type: 'multiselect', options: [
          { label: 'Actions đã tạo', value: 'actions' },
          { label: 'Thống kê', value: 'stats' },
          { label: 'Tóm tắt AI', value: 'summary' },
        ], default: ['actions', 'summary'] },
    ],
    advancedFields: [
      { key: 'max_items', label: 'Số dòng tối đa', type: 'number', default: 5 },
    ],
    inputPorts: [{ id: 'context', label: 'Kết quả pipeline', type: 'data' }],
    outputPorts: [{ id: 'sent', label: 'Đã gửi', type: 'data' }],
    defaultConfig: { include_items: ['actions', 'summary'] },
  },

  // ── STATE ────────────────────────────────────────────────────────

  'mark-processed': {
    id: 'mark-processed', label: 'Đánh dấu đã xử lý', category: 'state',
    description: 'Lưu ID của item đã xử lý để không chạy lại',
    icon: 'CheckCircle', color: 'bg-slate-600',
    runtimeMapping: 'state',
    basicFields: [
      { key: 'state_key', label: 'Key lưu trữ', type: 'text', default: 'processed_ids', required: true },
      { key: 'item_id_field', label: 'Field ID của item', type: 'text', default: 'id', helper: 'Tên field chứa ID' },
    ],
    advancedFields: [
      { key: 'ttl_hours', label: 'Nhớ trong (giờ)', type: 'number', default: 72 },
    ],
    inputPorts: [{ id: 'item', label: 'Item đã xử lý', type: 'data' }],
    outputPorts: [{ id: 'done', label: 'Đã lưu', type: 'control' }],
    defaultConfig: { state_key: 'processed_ids', item_id_field: 'id' },
  },

  'save-state': {
    id: 'save-state', label: 'Lưu trạng thái', category: 'state',
    description: 'Lưu giá trị để pipeline tiếp theo đọc được',
    icon: 'HardDriveUpload', color: 'bg-slate-600',
    runtimeMapping: 'state',
    basicFields: [
      { key: 'state_key', label: 'Key lưu', type: 'text', required: true, placeholder: 'last_digest_sent_at' },
      { key: 'value_field', label: 'Field value từ context', type: 'text', required: true, placeholder: 'timestamp' },
    ],
    advancedFields: [
      { key: 'merge_mode', label: 'Chế độ lưu', type: 'select', options: [
          { label: 'Ghi đè', value: 'overwrite' },
          { label: 'Gộp (nếu object)', value: 'merge' },
          { label: 'Append (nếu array)', value: 'append' },
        ], default: 'overwrite' },
    ],
    inputPorts: [{ id: 'context', label: 'Context', type: 'data' }],
    outputPorts: [{ id: 'saved', label: 'Đã lưu', type: 'control' }],
    defaultConfig: { state_key: '', value_field: '' },
  },

  'read-state': {
    id: 'read-state', label: 'Đọc trạng thái', category: 'state',
    description: 'Đọc giá trị trạng thái đã lưu từ lần chạy trước',
    icon: 'HardDriveDownload', color: 'bg-slate-600',
    runtimeMapping: 'state',
    basicFields: [
      { key: 'state_key', label: 'Key cần đọc', type: 'text', required: true },
    ],
    advancedFields: [
      { key: 'default_value', label: 'Giá trị mặc định', type: 'text', placeholder: 'null hoặc giá trị khởi tạo' },
    ],
    inputPorts: [{ id: 'trigger', label: 'Trigger', type: 'control' }],
    outputPorts: [{ id: 'value', label: 'Giá trị', type: 'data' }],
    defaultConfig: { state_key: '' },
  },

  'count-reminders': {
    id: 'count-reminders', label: 'Đếm số lần nhắc', category: 'state',
    description: 'Theo dõi và giới hạn số lần nhắc cho một item',
    icon: 'Hash', color: 'bg-slate-600',
    runtimeMapping: 'state',
    basicFields: [
      { key: 'counter_key', label: 'Key đếm', type: 'text', required: true, placeholder: 'remind_count_{{item_id}}' },
      { key: 'max_count', label: 'Số lần tối đa', type: 'number', default: 3 },
    ],
    advancedFields: [
      { key: 'reset_after_hours', label: 'Reset sau (giờ)', type: 'number', default: 168, helper: '168 = 1 tuần' },
    ],
    inputPorts: [{ id: 'item', label: 'Item', type: 'data' }],
    outputPorts: [
      { id: 'under_limit', label: 'Chưa đủ', type: 'control' },
      { id: 'limit_reached', label: 'Đã đủ số lần', type: 'control' },
    ],
    defaultConfig: { counter_key: 'remind_count', max_count: 3 },
  },

  // ── AI MODEL BLOCKS ─────────────────────────────────────────────

  'gemini-flash': {
    id: 'gemini-flash', label: 'Gemini 1.5 Flash', category: 'ai-model',
    description: 'Google Gemini nhanh & rẻ — tóm tắt, dàn ý, phân loại',
    icon: 'Sparkles', color: 'bg-violet-600',
    runtimeMapping: 'understand',
    basicFields: [
      { key: 'prompt', label: 'Prompt / Hướng dẫn', type: 'textarea', placeholder: 'Mô tả nhiệm vụ cho Gemini...', required: true },
      { key: 'input_field', label: 'Trường đầu vào', type: 'text', placeholder: 'content', default: 'content', helper: 'Tên field từ bước trước' },
      { key: 'output_format', label: 'Định dạng đầu ra', type: 'select', options: [
          { label: 'Plain text', value: 'text' },
          { label: 'Bullet points', value: 'bullets' },
          { label: 'JSON', value: 'json' },
          { label: 'Markdown', value: 'markdown' },
        ], default: 'text' },
    ],
    advancedFields: [
      { key: 'temperature', label: 'Temperature', type: 'number', default: 0.7, helper: '0 = chính xác, 1 = sáng tạo' },
      { key: 'max_tokens', label: 'Max output tokens', type: 'number', default: 1024 },
      { key: 'system_prompt', label: 'System prompt', type: 'textarea', placeholder: 'Bạn là giáo viên lịch sử...' },
    ],
    inputPorts: [{ id: 'data', label: 'Dữ liệu', type: 'data' }],
    outputPorts: [{ id: 'result', label: 'Kết quả', type: 'data' }],
    defaultConfig: { prompt: '', input_field: 'content', output_format: 'text', temperature: 0.7, max_tokens: 1024 },
  },

  'gemini-pro': {
    id: 'gemini-pro', label: 'Gemini 2.0 Flash', category: 'ai-model',
    description: 'Google Gemini mạnh nhất — phân tích sâu, viết nội dung dài',
    icon: 'Wand2', color: 'bg-violet-700',
    runtimeMapping: 'understand',
    basicFields: [
      { key: 'prompt', label: 'Prompt / Hướng dẫn', type: 'textarea', placeholder: 'Mô tả nhiệm vụ...', required: true },
      { key: 'input_field', label: 'Trường đầu vào', type: 'text', default: 'content' },
      { key: 'output_format', label: 'Định dạng đầu ra', type: 'select', options: [
          { label: 'Plain text', value: 'text' },
          { label: 'Markdown', value: 'markdown' },
          { label: 'JSON', value: 'json' },
        ], default: 'markdown' },
    ],
    advancedFields: [
      { key: 'temperature', label: 'Temperature', type: 'number', default: 0.5 },
      { key: 'max_tokens', label: 'Max tokens', type: 'number', default: 4096 },
      { key: 'system_prompt', label: 'System prompt', type: 'textarea' },
      { key: 'grounding', label: 'Google Search grounding', type: 'toggle', default: false, helper: 'Kết nối tìm kiếm thực' },
    ],
    inputPorts: [{ id: 'data', label: 'Dữ liệu', type: 'data' }],
    outputPorts: [{ id: 'result', label: 'Kết quả', type: 'data' }],
    defaultConfig: { prompt: '', input_field: 'content', output_format: 'markdown', temperature: 0.5, max_tokens: 4096 },
  },

  'gpt-4o': {
    id: 'gpt-4o', label: 'ChatGPT GPT-4o', category: 'ai-model',
    description: 'OpenAI GPT-4o — chất lượng cao nhất, structured output',
    icon: 'MessageSquare', color: 'bg-emerald-700',
    runtimeMapping: 'understand',
    basicFields: [
      { key: 'prompt', label: 'Prompt', type: 'textarea', required: true },
      { key: 'input_field', label: 'Trường đầu vào', type: 'text', default: 'content' },
      { key: 'output_format', label: 'Định dạng', type: 'select', options: [
          { label: 'Text', value: 'text' },
          { label: 'JSON', value: 'json' },
          { label: 'Markdown', value: 'markdown' },
        ], default: 'text' },
    ],
    advancedFields: [
      { key: 'temperature', label: 'Temperature', type: 'number', default: 0.7 },
      { key: 'max_tokens', label: 'Max tokens', type: 'number', default: 2048 },
      { key: 'system_prompt', label: 'System prompt', type: 'textarea' },
    ],
    inputPorts: [{ id: 'data', label: 'Dữ liệu', type: 'data' }],
    outputPorts: [{ id: 'result', label: 'Kết quả', type: 'data' }],
    defaultConfig: { prompt: '', input_field: 'content', output_format: 'text', temperature: 0.7, max_tokens: 2048 },
  },

  'gpt-4o-mini': {
    id: 'gpt-4o-mini', label: 'ChatGPT 4o Mini', category: 'ai-model',
    description: 'OpenAI GPT-4o Mini — nhanh, rẻ, tóm tắt và phân loại',
    icon: 'MessageCircle', color: 'bg-emerald-600',
    runtimeMapping: 'understand',
    basicFields: [
      { key: 'prompt', label: 'Prompt', type: 'textarea', required: true },
      { key: 'input_field', label: 'Trường đầu vào', type: 'text', default: 'content' },
    ],
    advancedFields: [
      { key: 'temperature', label: 'Temperature', type: 'number', default: 0.5 },
      { key: 'max_tokens', label: 'Max tokens', type: 'number', default: 512 },
    ],
    inputPorts: [{ id: 'data', label: 'Dữ liệu', type: 'data' }],
    outputPorts: [{ id: 'result', label: 'Kết quả', type: 'data' }],
    defaultConfig: { prompt: '', input_field: 'content', temperature: 0.5, max_tokens: 512 },
  },

  'claude-sonnet': {
    id: 'claude-sonnet', label: 'Claude Sonnet 4', category: 'ai-model',
    description: 'Anthropic Claude — xuất sắc về viết văn bản dài và học thuật',
    icon: 'PenTool', color: 'bg-orange-700',
    runtimeMapping: 'understand',
    basicFields: [
      { key: 'prompt', label: 'Prompt', type: 'textarea', required: true },
      { key: 'input_field', label: 'Trường đầu vào', type: 'text', default: 'content' },
      { key: 'style', label: 'Phong cách viết', type: 'select', options: [
          { label: 'Học thuật', value: 'academic' },
          { label: 'Thân thiện', value: 'friendly' },
          { label: 'Ngắn gọn', value: 'concise' },
          { label: 'Chi tiết', value: 'detailed' },
        ], default: 'academic' },
    ],
    advancedFields: [
      { key: 'temperature', label: 'Temperature', type: 'number', default: 0.8 },
      { key: 'max_tokens', label: 'Max tokens', type: 'number', default: 4096 },
      { key: 'system_prompt', label: 'System prompt', type: 'textarea' },
    ],
    inputPorts: [{ id: 'data', label: 'Dữ liệu', type: 'data' }],
    outputPorts: [{ id: 'result', label: 'Kết quả', type: 'data' }],
    defaultConfig: { prompt: '', input_field: 'content', style: 'academic', temperature: 0.8, max_tokens: 4096 },
  },

  'perplexity-sonar': {
    id: 'perplexity-sonar', label: 'Perplexity Sonar', category: 'ai-model',
    description: 'Tìm kiếm web thời gian thực có trích dẫn nguồn',
    icon: 'Globe', color: 'bg-teal-700',
    runtimeMapping: 'source',
    basicFields: [
      { key: 'query', label: 'Câu truy vấn tìm kiếm', type: 'textarea', placeholder: 'Tìm kiếm về...', required: true },
      { key: 'focus', label: 'Lĩnh vực', type: 'select', options: [
          { label: 'Tất cả web', value: 'web' },
          { label: 'Học thuật', value: 'academic' },
          { label: 'Tin tức', value: 'news' },
          { label: 'YouTube', value: 'youtube' },
        ], default: 'web' },
      { key: 'language', label: 'Ngôn ngữ kết quả', type: 'select', options: [
          { label: 'Tiếng Việt', value: 'vi' },
          { label: 'Tiếng Anh', value: 'en' },
        ], default: 'vi' },
    ],
    advancedFields: [
      { key: 'max_results', label: 'Số kết quả tối đa', type: 'number', default: 5 },
      { key: 'date_range', label: 'Phạm vi thời gian', type: 'select', options: [
          { label: 'Bất kỳ', value: 'any' },
          { label: '1 tháng qua', value: '1m' },
          { label: '1 năm qua', value: '1y' },
        ], default: 'any' },
    ],
    inputPorts: [],
    outputPorts: [{ id: 'results', label: 'Kết quả tìm kiếm', type: 'data' }],
    defaultConfig: { query: '', focus: 'web', language: 'vi', max_results: 5 },
  },

  'gamma-ai': {
    id: 'gamma-ai', label: 'Gamma AI Slides', category: 'ai-model',
    description: 'Tự động tạo slide bài giảng đẹp từ nội dung văn bản',
    icon: 'Presentation', color: 'bg-pink-700',
    runtimeMapping: 'act',
    basicFields: [
      { key: 'content', label: 'Nội dung/Dàn ý', type: 'textarea', placeholder: 'Dán nội dung hoặc nối từ bước trước...', required: true },
      { key: 'slide_count', label: 'Số lượng slide', type: 'number', default: 10 },
      { key: 'theme', label: 'Chủ đề thiết kế', type: 'select', options: [
          { label: 'Academic (Học thuật)', value: 'academic' },
          { label: 'Modern (Hiện đại)', value: 'modern' },
          { label: 'Minimal (Tối giản)', value: 'minimal' },
          { label: 'Colorful (Màu sắc)', value: 'colorful' },
        ], default: 'academic' },
    ],
    advancedFields: [
      { key: 'language', label: 'Ngôn ngữ', type: 'select', options: [{ label: 'Tiếng Việt', value: 'vi' }, { label: 'English', value: 'en' }], default: 'vi' },
      { key: 'include_images', label: 'Thêm ảnh AI', type: 'toggle', default: true },
      { key: 'export_format', label: 'Xuất file', type: 'select', options: [{ label: 'Link Gamma', value: 'link' }, { label: 'PDF', value: 'pdf' }, { label: 'PPTX', value: 'pptx' }], default: 'link' },
    ],
    inputPorts: [{ id: 'content', label: 'Nội dung', type: 'data' }],
    outputPorts: [{ id: 'slides', label: 'Link Slides', type: 'data' }],
    defaultConfig: { slide_count: 10, theme: 'academic', language: 'vi', include_images: true, export_format: 'link' },
  },

  'midjourney': {
    id: 'midjourney', label: 'Midjourney v6', category: 'ai-model',
    description: 'Tạo ảnh minh họa lịch sử chất lượng cao nghệ thuật',
    icon: 'Image', color: 'bg-indigo-700',
    runtimeMapping: 'act',
    basicFields: [
      { key: 'prompt', label: 'Image prompt', type: 'textarea', placeholder: 'Vietnamese soldiers, 1954, photorealistic, --ar 16:9', required: true },
      { key: 'count', label: 'Số ảnh', type: 'number', default: 4 },
      { key: 'aspect_ratio', label: 'Tỉ lệ', type: 'select', options: [
          { label: '16:9 (Slide)', value: '16:9' },
          { label: '4:3', value: '4:3' },
          { label: '1:1 (Vuông)', value: '1:1' },
          { label: '9:16 (Dọc)', value: '9:16' },
        ], default: '16:9' },
    ],
    advancedFields: [
      { key: 'style', label: 'Style code', type: 'text', placeholder: '--style raw', helper: 'Thêm tham số MJ như --v 6 --q 2' },
      { key: 'negative', label: 'Negative (tránh)', type: 'text', placeholder: 'blurry, modern, text' },
    ],
    inputPorts: [{ id: 'prompt_data', label: 'Prompt từ AI', type: 'data' }],
    outputPorts: [{ id: 'images', label: 'Ảnh kết quả', type: 'data' }],
    defaultConfig: { count: 4, aspect_ratio: '16:9' },
  },

  'canva-magic': {
    id: 'canva-magic', label: 'Canva Magic Studio', category: 'ai-model',
    description: 'Tạo infographic, poster và design học thuật',
    icon: 'Palette', color: 'bg-cyan-700',
    runtimeMapping: 'act',
    basicFields: [
      { key: 'design_type', label: 'Loại thiết kế', type: 'select', options: [
          { label: 'Infographic', value: 'infographic' },
          { label: 'Presentation', value: 'presentation' },
          { label: 'Poster', value: 'poster' },
          { label: 'Timeline', value: 'timeline' },
        ], default: 'infographic' },
      { key: 'content', label: 'Nội dung chính', type: 'textarea', placeholder: 'Nội dung cần đưa vào thiết kế...' },
      { key: 'style', label: 'Phong cách', type: 'select', options: [
          { label: 'Educational', value: 'educational' },
          { label: 'Historical', value: 'historical' },
          { label: 'Modern', value: 'modern' },
        ], default: 'educational' },
    ],
    advancedFields: [
      { key: 'color_scheme', label: 'Bảng màu', type: 'select', options: [{ label: 'Auto', value: 'auto' }, { label: 'Tối (Dark)', value: 'dark' }, { label: 'Sáng (Light)', value: 'light' }], default: 'auto' },
    ],
    inputPorts: [{ id: 'content', label: 'Nội dung', type: 'data' }],
    outputPorts: [{ id: 'design', label: 'Link thiết kế', type: 'data' }],
    defaultConfig: { design_type: 'infographic', style: 'educational', color_scheme: 'auto' },
  },

  'elevenlabs': {
    id: 'elevenlabs', label: 'ElevenLabs TTS', category: 'ai-model',
    description: 'Chuyển văn bản bài giảng thành audio narration tự nhiên',
    icon: 'Volume2', color: 'bg-yellow-700',
    runtimeMapping: 'act',
    basicFields: [
      { key: 'input_field', label: 'Trường văn bản', type: 'text', default: 'content', helper: 'Field từ bước trước' },
      { key: 'voice', label: 'Giọng đọc', type: 'select', options: [
          { label: 'Ngọc Hân (VI Female)', value: 'vi-female-1' },
          { label: 'Minh Tuấn (VI Male)', value: 'vi-male-1' },
          { label: 'Rachel (EN Female)', value: 'en-rachel' },
        ], default: 'vi-female-1' },
      { key: 'speed', label: 'Tốc độ', type: 'number', default: 1.0, helper: '0.8 = chậm, 1.0 = bình thường, 1.2 = nhanh' },
    ],
    advancedFields: [
      { key: 'stability', label: 'Stability', type: 'number', default: 0.5 },
      { key: 'similarity_boost', label: 'Similarity boost', type: 'number', default: 0.75 },
    ],
    inputPorts: [{ id: 'text', label: 'Văn bản', type: 'data' }],
    outputPorts: [{ id: 'audio', label: 'File audio', type: 'data' }],
    defaultConfig: { input_field: 'content', voice: 'vi-female-1', speed: 1.0, stability: 0.5, similarity_boost: 0.75 },
  },

  'whisper': {
    id: 'whisper', label: 'OpenAI Whisper', category: 'ai-model',
    description: 'Chuyển âm thanh/video thành văn bản (hỗ trợ tiếng Việt)',
    icon: 'Mic', color: 'bg-slate-600',
    runtimeMapping: 'source',
    basicFields: [
      { key: 'audio_source', label: 'Nguồn âm thanh', type: 'select', options: [
          { label: 'Upload file', value: 'upload' },
          { label: 'URL', value: 'url' },
          { label: 'YouTube', value: 'youtube' },
        ], default: 'upload' },
      { key: 'language', label: 'Ngôn ngữ', type: 'select', options: [
          { label: 'Tự nhận diện', value: 'auto' },
          { label: 'Tiếng Việt', value: 'vi' },
          { label: 'Tiếng Anh', value: 'en' },
        ], default: 'auto' },
      { key: 'timestamps', label: 'Bao gồm timestamps', type: 'toggle', default: false },
    ],
    advancedFields: [
      { key: 'model_size', label: 'Model size', type: 'select', options: [{ label: 'Turbo (nhanh)', value: 'turbo' }, { label: 'Large-v3 (chính xác)', value: 'large-v3' }], default: 'turbo' },
    ],
    inputPorts: [],
    outputPorts: [{ id: 'transcript', label: 'Văn bản', type: 'data' }],
    defaultConfig: { audio_source: 'upload', language: 'auto', timestamps: false, model_size: 'turbo' },
  },
};

// Helper to get blocks by category
export function getBlocksByCategory(category: BlockCategory): BlockDef[] {
  return Object.values(BLOCK_REGISTRY).filter(b => b.category === category);
}

// All block IDs
export const ALL_BLOCK_IDS = Object.keys(BLOCK_REGISTRY);
