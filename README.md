# Relaix Monorepo

Monorepo fullstack với NestJS backend, Next.js frontend, và shared libraries. Quản lý bằng Turborepo và Bun package manager.

## 📁 Cấu trúc dự án

```
relaix/
├── apps/
│   ├── backend/          # NestJS API server
│   ├── frontend/         # Next.js web application
├── packages/
│   └── shared/           # Shared types & utilities
├── turbo.json            # Turborepo configuration
└── package.json          # Root workspace configuration
```

## 🚀 Bắt đầu nhanh

### 1. Cài đặt dependencies

```bash
bun install
```

### 2. Tạo file environment

```bash
cp .env.example .env.local
```

### 3. Chạy ở development mode

```bash
bun run dev
```

Điều này sẽ khởi động:
- Backend: http://localhost:3001
- Frontend: http://localhost:3000

## 📝 Available Scripts

### Root commands (Turborepo)

```bash
bun run dev           # Chạy dev mode tất cả apps
bun run build         # Build tất cả apps
bun run lint          # Lint tất cả apps
bun run format        # Format code
bun run test          # Chạy tests
bun run type-check    # Type checking
bun run clean         # Xóa node_modules và build artifacts
```

### Backend commands

```bash
cd apps/backend
bun run dev           # Chạy NestJS development server
bun run build         # Build NestJS
bun run start         # Chạy production server
bun run lint          # Lint backend code
bun run test          # Chạy unit tests
```

### Frontend commands

```bash
cd apps/frontend
bun run dev           # Chạy Next.js development server
bun run build         # Build Next.js
bun run start         # Chạy production server
bun run lint          # Lint frontend code
```

### Shared library commands

```bash
cd packages/shared
bun run build         # Build shared library
bun run type-check    # Type checking
```

## 🏗️ Project Structure

### Backend (NestJS)

- Sử dụng Express + NestJS framework
- API handlers tại `/apps/backend/src`
- CORS enabled cho frontend (configurable)

### Frontend (Next.js)

- App Router (Next.js 15+)
- Tailwind CSS for styling
- Lấy dữ liệu từ backend

### Shared Library

- Shared types (`types.ts`)
- Utility functions (`utils.ts`)
- Được import ở backend & frontend

## 🔗 Dependencies

### Backend
- `@nestjs/core`, `@nestjs/common`
- `reflect-metadata`, `rxjs`

### Frontend
- `next`, `react`, `react-dom`
- `tailwindcss`, `autoprefixer`, `postcss`

### Shared
- `typescript` (dev only)

## 📚 Tài liệu

- [NestJS Documentation](https://docs.nestjs.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Bun Documentation](https://bun.sh/docs)

## 💡 Tips

- Backend và Frontend hoàn toàn độc lập, có thể deploy riêng
- Shared library được import ở cả hai bằng `@relaix/shared`
- Turborepo tự động cache builds để tăng tốc độ

## 🤝 Contributing

Khi thêm tính năng mới:
1. Thêm types vào `packages/shared`
2. Implement logic tại backend hoặc frontend
3. Chạy `bun run format` để format code
4. Chạy `bun run type-check` để check types

---

Happy coding! 🚀
