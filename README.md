<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# BAIEdu — Nền tảng Giáo dục AI

**BAIEdu** (Basic AI Education) là nền tảng học AI bằng tiếng Việt, với tính năng nổi bật là **Phòng Lab** — một trình xây dựng pipeline kéo thả trực quan cho phép tạo workflow AI tự động (tương tự n8n/Zapier nhưng tập trung vào giáo dục AI).

> Xem tài liệu đầy đủ trong thư mục [`docs/`](./docs/)

---

## Yêu cầu hệ thống

- **Node.js** v18+ (khuyến nghị v20 LTS)
- **npm** v9+
- **Gemini API key** (miễn phí tại https://aistudio.google.com/app/apikey)

---

## Cài đặt và chạy

### 1. Cài dependencies

```bash
npm install
```

### 2. Thiết lập API key

Tạo file `.env.local` ở thư mục gốc của project:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

> Lấy API key miễn phí tại: https://aistudio.google.com/app/apikey

### 3. Chạy môi trường development

```bash
npm run dev
```

Mở trình duyệt và truy cập: **http://localhost:3000**

---

## Build và xem bản production

### Build

```bash
npm run build
```

Kết quả được xuất ra thư mục `/dist`.

### Xem bản build cục bộ

```bash
npm run preview
```

Truy cập: **http://localhost:4173**

---

## Các lệnh có sẵn

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Chạy dev server tại localhost:3000 (hot reload) |
| `npm run build` | Build production → xuất ra `/dist` |
| `npm run preview` | Xem bản production build cục bộ tại localhost:4173 |
| `npm run lint` | Kiểm tra TypeScript (không xuất file) |
| `npm run clean` | Xóa thư mục `/dist` |

---

## Tính năng chính

- **Phòng Lab** — Visual pipeline builder với 40+ block types (trigger, AI model, action, ...)
- **11 pipeline templates** sẵn có (Gmail monitor, tạo slide lịch sử, nghiên cứu, ...)
- **AI Keys** — Quản lý API keys và xem trạng thái live của Gemini
- **Khóa học** — Lộ trình học AI
- **Thư viện Prompt** — Kho prompt cộng đồng
- **Cộng đồng** — Thảo luận và peer review

---

## Tài liệu

| File | Nội dung |
|------|---------|
| [`docs/overview.md`](./docs/overview.md) | Tổng quan dự án, mục tiêu, tech stack |
| [`docs/architecture.md`](./docs/architecture.md) | Cấu trúc thư mục, routing, state management |
| [`docs/pipeline-system.md`](./docs/pipeline-system.md) | Hệ thống pipeline, block registry, execution engine |
| [`docs/ai-integration.md`](./docs/ai-integration.md) | Tích hợp AI, Gemini API, prompt library |
| [`docs/components.md`](./docs/components.md) | Tham chiếu component, props, hooks |
| [`docs/data-model.md`](./docs/data-model.md) | TypeScript types, data structures, localStorage schema |
| [`docs/development.md`](./docs/development.md) | Hướng dẫn setup chi tiết, common issues |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 5.8 |
| Build | Vite 6.2 |
| Styling | Tailwind CSS v4 |
| Routing | React Router 7.13 |
| Canvas | @xyflow/react 12.10 |
| Icons | Lucide React |
| Animation | Motion 12 |
| AI SDK | @google/genai (Gemini) |

---

## Reset dữ liệu

Mọi dữ liệu pipeline được lưu trong `localStorage`. Để reset về trạng thái ban đầu, mở DevTools console và chạy:

```javascript
Object.keys(localStorage).filter(k => k.startsWith('baiedu_')).forEach(k => localStorage.removeItem(k));
location.reload();
```

---

## Tài khoản demo

- **Email:** `admin@baiedu.vn`
- **Password:** `admin123`
