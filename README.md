# HKDN - Nhóm Nguyễn Thị Hoài Linh - Đề tài G1.3 - Hệ thống quản lý vụ việc và hồ sơ nghiệp vụ

> **Ngôn ngữ lập trình đang sử dụng: TypeScript** (cả Frontend và Backend)

| Phần | Ngôn ngữ | Framework | Đuôi file |
|---|---|---|---|
| Frontend | TypeScript + TSX | React 18, Vite, Ant Design 5 | `.ts`, `.tsx` |
| Backend | TypeScript | NestJS 11 (Node.js 22) | `.ts` |
| Database | SQL (PostgreSQL 16) | | `.sql` |

Khi viết code mới chỉ dùng `.ts` / `.tsx`, không thêm file `.js` / `.jsx`. Chạy `npm run typecheck` trong `backend/` hoặc `frontend/` trước khi tạo Pull Request để chắc chắn không có lỗi kiểu.

## Thành viên
| Họ tên | GitHub | Vai trò |
|---|---|---|
| Nguyễn Thị Hoài Linh | @Nguyenthlinh | Nhóm trưởng |
| Nguyễn Thành Nam | @NgNam101 | Thành viên |
| Trần Tấn Tài | @tai53 | Thành viên |
| Nguyễn Công Trường | @TheBlueStars | Thành viên |
| Võ Thành Đạt | @datwebdev23 | Thành viên |

## Quy ước làm việc
- Nhánh chính: `main`, không commit trực tiếp.
- Mỗi việc làm trên một nhánh riêng: `feature/ten-chuc-nang`, `fix/ten-loi`.
- Mọi thay đổi vào `main` phải qua Pull Request.
- Người review: @TheBlueStars. Người merge: @TheBlueStars.
- Commit message ngắn gọn, nói rõ thay đổi gì.
- Commit rõ chi tiết những gì đã làm trên branch trước khi gửi merge request.

## Công nghệ sử dụng
| Thành phần | Công nghệ |
|---|---|
| Frontend | React 18 + TypeScript, Vite, Ant Design 5, Axios, Day.js |
| Backend | NestJS 11 + TypeScript (Node.js 22), `pg`, class-validator, Swagger |
| Database | PostgreSQL 16 (chạy bằng Docker), pgAdmin (tùy chọn) |
| Hạ tầng | Docker, Docker Compose |

## Cấu trúc thư mục
```
hkdn-g13-quanly-hoso/
├── docker-compose.yml        # Chạy toàn bộ: db + backend + frontend (+ pgadmin)
├── .env.example              # File mẫu: liệt kê đủ biến môi trường (CÓ commit)
├── .env                      # Cấu hình thật trên máy bạn, tạo từ .env.example (KHÔNG commit)
├── .gitignore
├── README.md
│
├── frontend/                 # Giao diện người dùng (React + TypeScript + Vite + Ant Design)
│   ├── Dockerfile
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig*.json        # Cấu hình TypeScript
│   ├── package.json
│   └── src/
│       ├── main.tsx          # Điểm khởi chạy, cấu hình Ant Design (tiếng Việt, theme)
│       ├── App.tsx           # Layout chính
│       ├── index.css
│       ├── api/              # Gọi API (axios client, các hàm theo module)
│       ├── types/            # Kiểu dữ liệu API trả về (khớp với backend)
│       ├── components/       # Component dùng chung
│       └── pages/            # Các trang
│
├── backend/                  # REST API (NestJS + TypeScript)
│   ├── Dockerfile
│   ├── nest-cli.json
│   ├── tsconfig.json
│   ├── package.json
│   └── src/
│       ├── main.ts           # Khởi động server: tiền tố /api, CORS, validate, Swagger, kiểm tra DB
│       ├── app.module.ts     # Module gốc, khai báo các module nghiệp vụ
│       ├── config/env.ts     # Đọc & kiểm tra biến môi trường (thiếu là dừng)
│       ├── database/         # DatabaseService: kết nối PostgreSQL (connection pool)
│       ├── common/filters/   # Xử lý lỗi chung, trả về dạng { message }
│       └── modules/          # Mỗi nghiệp vụ một thư mục
│           ├── health/       # GET /api/health
│           ├── auth/         # Đăng nhập, đăng xuất, bearer token
│           └── vu-viec/      # Module mẫu: controller, service, dto, types
│
├── database/                 # Kết nối & khởi tạo PostgreSQL
│   └── init/
│       ├── 01_schema.sql     # Tạo bảng: nguoi_dung, vu_viec, ho_so
│       └── 02_seed.sql       # Dữ liệu mẫu
│
└── docs/
    ├── HUONG_DAN_CAI_DAT.md  # Hướng dẫn cài đặt, chạy chi tiết
    └── images/               # Ảnh mẫu kết quả kiểm tra (DB, backend, frontend)
```

> 📖 **Hướng dẫn chi tiết từng bước** (cài phần mềm, clone, cấu hình `.env`, chạy, pull code mới, xử lý lỗi): xem [docs/HUONG_DAN_CAI_DAT.md](docs/HUONG_DAN_CAI_DAT.md). Phần dưới đây là tóm tắt nhanh.

## Yêu cầu cài đặt
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (đã gồm Docker Compose)
- [Node.js 22 LTS](https://nodejs.org/) (chỉ cần nếu chạy FE/BE trực tiếp trên máy)
- Git

## Cách 1 — Chạy toàn bộ bằng Docker (khuyến nghị)
```bash
git clone https://github.com/tai53/hkdn-g13-quanly-hoso.git
cd hkdn-g13-quanly-hoso
cp .env.example .env       # PowerShell: Copy-Item .env.example .env
# Mở .env, đặt DB_PASSWORD, PGADMIN_PASSWORD và tạo JWT_SECRET ngẫu nhiên dài ít nhất 32 ký tự
docker compose up -d --build
```

| Dịch vụ | Địa chỉ |
|---|---|
| Frontend | http://localhost:5173 (cổng `FRONTEND_PORT`) |
| Backend API | http://localhost:5000/api (cổng `BACKEND_PORT`) |
| Kiểm tra API + DB | http://localhost:5000/api/health |
| Tài liệu API (Swagger) | http://localhost:5000/api/docs |
| PostgreSQL | `localhost:<DB_PORT>`, user `<DB_USER>`, mật khẩu `<DB_PASSWORD>`, database `<DB_NAME>` |

Địa chỉ trên dùng giá trị mẫu trong `.env.example`. `<DB_USER>` nghĩa là giá trị `DB_USER` trong file `.env` của bạn.

Mã nguồn được mount vào container nên sửa code là tự reload (backend dùng `nest start --watch`, frontend dùng Vite).

Bật thêm pgAdmin (giao diện quản lý DB) tại http://localhost:5050 (cổng `PGADMIN_PORT`), đăng nhập bằng `PGADMIN_EMAIL` / `PGADMIN_PASSWORD`:
```bash
docker compose --profile tools up -d
```
Trong pgAdmin, thêm server với Host = `db`, Port = `5432`, Username = `<DB_USER>`, Password = `<DB_PASSWORD>`.

## Cách 2 — Chỉ chạy database bằng Docker, FE/BE chạy trên máy
```bash
# 1. Khởi động PostgreSQL
docker compose up -d db

# 2. Backend (tự đọc .env ở gốc, dùng DB_HOST=localhost và PORT)
cd backend
npm install
npm run dev                 # http://localhost:<PORT>

# 3. Frontend (mở terminal khác)
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

## Biến môi trường
Toàn bộ cấu hình nằm trong **một file `.env` duy nhất ở thư mục gốc**, tạo bằng cách sao chép file mẫu `.env.example` (`cp .env.example .env`) rồi điền mật khẩu của bạn. File này được đọc bởi cả docker-compose, backend (`backend/src/config/env.ts`) và frontend (`frontend/vite.config.ts`) — không cần tạo `.env` riêng trong `backend/` hay `frontend/`.

| Biến | Nơi dùng | Ý nghĩa |
|---|---|---|
| `DB_HOST` | backend (Cách 2) | `localhost` khi chạy trên máy; chạy Docker thì docker-compose tự đặt `db` |
| `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | backend, docker-compose | Thông tin kết nối PostgreSQL |
| `PORT`, `NODE_ENV` | backend | Cổng API khi chạy trên máy (Cách 2) và môi trường chạy |
| `CORS_ORIGIN` | backend (Cách 2) | Origin của frontend được phép gọi API. Cách 1 tự đặt theo `FRONTEND_PORT` |
| `JWT_SECRET` | backend, docker-compose | Khóa bí mật ký token; cần chuỗi ngẫu nhiên dài ít nhất 32 ký tự |
| `VITE_API_URL` | frontend (Cách 2) | Địa chỉ backend API, cổng phải trùng `PORT`. Cách 1 tự đặt theo `BACKEND_PORT` |
| `BACKEND_PORT`, `FRONTEND_PORT` | docker-compose (Cách 1) | Cổng mở ra máy host |
| `PGADMIN_*` | docker-compose | Tài khoản & cổng pgAdmin (profile `tools`) |

> Chỉ commit `.env.example`. File `.env` và mọi biến thể `.env.*` đã bị chặn trong `.gitignore`. Mỗi thành viên tự tạo `.env` của mình, không gửi file này cho nhau. Khi `.env.example` có biến mới, chép biến đó sang `.env` của bạn.
>
> Bảng đầy đủ (giá trị mẫu, biến nào dùng cho cách chạy nào, dùng thông tin `.env` ở đâu): xem [mục 3 trong hướng dẫn chi tiết](docs/HUONG_DAN_CAI_DAT.md#3-chuẩn-bị-file-cấu-hình-môi-trường-env).

**File `.env` là bắt buộc.** Thiếu file này, dự án sẽ dừng ngay với thông báo rõ ràng chứ không chạy bằng giá trị mặc định:

| Chạy bằng | Khi thiếu `.env` |
|---|---|
| `docker compose up` | `required variable <TÊN_BIẾN> is missing a value: chưa có file .env - hãy chạy lệnh cp .env.example .env` |
| `npm run dev` (backend) | `[CẤU HÌNH] Không thể khởi động backend: thiếu biến môi trường.` rồi `exit 1` |
| `npm run dev` (frontend) | `[CẤU HÌNH] Thiếu biến VITE_API_URL.` — Vite không khởi động |

## Cơ sở dữ liệu
- Các file trong `database/init/` **chỉ tự chạy lần đầu** khi volume dữ liệu còn trống.
- Sau khi sửa schema, muốn tạo lại DB từ đầu (**sẽ xóa toàn bộ dữ liệu**):
  ```bash
  docker compose down -v
  docker compose up -d
  ```
- Truy cập psql trong container:
  ```bash
  docker exec -it qlhs_db psql -U postgres -d quanly_hoso
  ```
  (thay `postgres` / `quanly_hoso` bằng `DB_USER` / `DB_NAME` trong `.env` nếu đã đổi)

## API mẫu
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/health` | Trạng thái API và kết nối DB |
| POST | `/api/auth/login` | Đăng nhập bằng `username` và `password`, nhận bearer token |
| POST | `/api/auth/logout` | Thu hồi phiên hiện tại (yêu cầu bearer token) |
| GET | `/api/vu-viec` | Danh sách vụ việc (yêu cầu bearer token) |
| GET | `/api/vu-viec/:id` | Chi tiết vụ việc kèm hồ sơ (yêu cầu bearer token) |
| POST | `/api/vu-viec` | Tạo vụ việc (yêu cầu bearer token) |

Xem và gọi thử toàn bộ API tại http://localhost:5000/api/docs (Swagger, tự sinh từ code).

## Thêm một module nghiệp vụ mới (Backend)
Làm theo mẫu `backend/src/modules/vu-viec/`:

| File | Vai trò |
|---|---|
| `xxx.module.ts` | Khai báo controller và service của module |
| `xxx.controller.ts` | Định nghĩa route, nhận dữ liệu, gọi service |
| `xxx.service.ts` | Nghiệp vụ và truy vấn database qua `DatabaseService` |
| `dto/*.dto.ts` | Dữ liệu client gửi lên, kiểm tra bằng decorator của `class-validator` |
| `xxx.types.ts` | Kiểu dữ liệu khớp với bảng trong database |

Có thể tạo nhanh khung module bằng Nest CLI (đứng trong `backend/`):
```bash
npx nest g module modules/ho-so
npx nest g controller modules/ho-so --no-spec
npx nest g service modules/ho-so --no-spec
```
Lệnh `nest g module` tự thêm module mới vào `app.module.ts`. Bên Frontend, thêm kiểu tương ứng vào `frontend/src/types/` và hàm gọi API vào `frontend/src/api/`.

## Lệnh Docker thường dùng
```bash
docker compose ps                  # Xem trạng thái
docker compose logs -f backend     # Xem log backend
docker compose restart backend     # Khởi động lại 1 service
docker compose down                # Dừng (giữ dữ liệu)
```
