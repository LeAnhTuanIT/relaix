# RELAIX - AI Powered Content Platform

RELAIX là một nền tảng tạo nội dung thông minh tích hợp AI (flyers, reports, presentations, v.v.), được xây dựng với kiến trúc Monorepo hiện đại sử dụng **NestJS** cho Backend và **Next.js 15** cho Frontend.

---

## 📁 Cấu trúc dự án

```
relaix/
├── apps/
│   ├── backend/          # NestJS API (Port 3001)
│   ├── frontend/         # Next.js Web App (Port 3000)
├── packages/
│   └── shared/           # Thư viện dùng chung (Types & Utils)
├── docker-compose.yml    # Cấu hình Docker (MongoDB, Redis, App)
├── Dockerfile            # Cấu hình build Docker đa tầng (Multi-stage)
├── turbo.json            # Cấu hình Turborepo
└── package.json          # Root workspace configuration
```

---

## 🛠️ Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt:
- **Bun**: >= 1.1.x ([Cài đặt Bun](https://bun.sh))
- **Docker & Docker Compose**: Để chạy cơ sở dữ liệu và môi trường production.
- **Google Cloud Console Account**: Nếu bạn muốn sử dụng tính năng đăng nhập bằng Google.

---

## 🚀 Hướng dẫn chạy dự án

### 1. Thiết lập biến môi trường (Environment Variables)

Bạn cần tạo file `.env` tại thư mục gốc của dự án. Copy từ file mẫu:

```bash
cp .env.example .env
```

**Các tham số quan trọng cần điền:**
- `MONGODB_URI`: Đường dẫn kết nối MongoDB.
- `REDIS_URL`: Đường dẫn kết nối Redis.
- `JWT_SECRET`: Chuỗi bảo mật để ký token (ví dụ: `your_super_secret_key`).
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Lấy từ Google Cloud Console.
- `ANTHROPIC_API_KEY` & `GOOGLE_GENERATIVE_AI_API_KEY`: API Key để sử dụng các mô hình AI.

---

### 2. Cách 1: Chạy bằng Docker (Khuyên dùng cho môi trường ổn định)

Đây là cách nhanh nhất để chạy toàn bộ hệ thống bao gồm Database (MongoDB, Redis) và Application.

```bash
# 1. Build các Docker images
docker-compose build

# 2. Khởi chạy các containers ở chế độ background
docker-compose up -d

# 3. Kiểm tra trạng thái các service
docker-compose ps
```

Sau khi khởi chạy thành công:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001](http://localhost:3001)
- **MongoDB**: `localhost:27017`
- **Redis**: `localhost:6380` (đã map từ 6379 trong container)

---

### 3. Cách 2: Chạy Local Development (Dành cho lập trình viên)

Nếu bạn muốn phát triển code và thấy thay đổi ngay lập tức (Hot Reload):

**Bước A: Chạy Database bằng Docker**
Bạn chỉ cần chạy MongoDB và Redis:
```bash
docker-compose up -d mongodb redis
```

**Bước B: Cài đặt dependencies và chạy App**
```bash
# Tại thư mục gốc
bun install

# Chạy tất cả các ứng dụng cùng lúc (Backend + Frontend + Shared)
bun run dev
```

Hoặc chạy riêng lẻ:
- Backend: `cd apps/backend && bun run dev`
- Frontend: `cd apps/frontend && bun run dev`

---

## 🔑 Cấu hình Google OAuth (Tùy chọn)

Để tính năng "Login with Google" hoạt động:
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/).
2. Tạo một dự án mới.
3. Tại mục **APIs & Services > Credentials**, tạo một **OAuth 2.0 Client ID**.
4. Thêm **Authorized redirect URIs**: `http://localhost:3001/auth/google/callback`.
5. Copy Client ID và Client Secret vào file `.env`.

---

## 📝 Các lệnh hữu ích (Available Scripts)

### Root commands (Turborepo)
- `bun run build`: Build toàn bộ dự án để chuẩn bị deploy.
- `bun run lint`: Kiểm tra lỗi code style.
- `bun run format`: Tự động sửa định dạng code (Prettier).
- `bun run type-check`: Kiểm tra tính toàn vẹn của Typescript.
- `bun run clean`: Dọn dẹp các thư mục build và node_modules.

---

## 💡 Lưu ý khi phát triển
- Dự án sử dụng `bcryptjs` thay vì `bcrypt` để đảm bảo tương thích tốt nhất trên các hệ điều hành và môi trường Docker Alpine.
- Thư viện `@relaix/shared` chứa các Interface dùng chung. Khi bạn sửa đổi types tại đây, hãy chạy `bun run build` trong thư mục `packages/shared` hoặc chạy `bun run build` ở gốc để cập nhật cho các app.

---

Happy coding! 🚀
