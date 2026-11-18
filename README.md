# HKDN - Nhóm Nguyễn Thị Hoài Linh - Đề tài G1.3 - Hệ thống quản lý vụ việc và hồ sơ nghiệp vụ

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

## Công nghệ sử dụng
| Thành phần | Công nghệ |
|---|---|
| Frontend | React 18 + Vite, Axios |
| Backend | Node.js 22, Express, `pg` |
| Database | PostgreSQL 16 (chạy bằng Docker), pgAdmin (tùy chọn) |
| Hạ tầng | Docker, Docker Compose |

## Cấu trúc thư mục
```
hkdn-g13-quanly-hoso/
├── docker-compose.yml        # Chạy toàn bộ: db + backend + frontend (+ pgadmin)
├── .env                      # Biến môi trường dùng chung (không commit, xin file từ nhóm)
├── .gitignore
├── README.md
│
├── frontend/                 # Giao diện người dùng (React + Vite)
│   ├── Dockerfile
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx          # Điểm khởi chạy
│       ├── App.jsx
│       ├── index.css
│       ├── api/              # Gọi API (axios client, các hàm theo module)
│       ├── components/       # Component dùng chung
│       └── pages/            # Các trang
│
├── backend/                  # REST API (Node.js + Express)
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── server.js         # Khởi động server + kiểm tra kết nối DB
│       ├── app.js            # Cấu hình Express, middleware, route
│       ├── config/env.js     # Đọc & kiểm tra biến môi trường (thiếu là dừng)
│       ├── config/db.js      # Kết nối PostgreSQL (connection pool)
│       ├── routes/           # Định nghĩa route
│       ├── controllers/      # Xử lý nghiệp vụ
│       └── middlewares/      # Middleware (xử lý lỗi, xác thực...)
│
├── database/                 # Kết nối & khởi tạo PostgreSQL
│   └── init/
│       ├── 01_schema.sql     # Tạo bảng: nguoi_dung, vu_viec, ho_so
│       └── 02_seed.sql       # Dữ liệu mẫu
│
└── docs/
    └── HUONG_DAN_CAI_DAT.md  # Hướng dẫn cài đặt, chạy chi tiết
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
# BẮT BUỘC: xin file .env từ nhóm, đặt vào thư mục gốc (ngang hàng docker-compose.yml)
docker compose up -d --build
```

| Dịch vụ | Địa chỉ |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000/api |
| Kiểm tra API + DB | http://localhost:5000/api/health |
| PostgreSQL | `localhost:5432` (user/pass: `postgres`/`postgres`, db: `quanly_hoso`) |

Mã nguồn được mount vào container nên sửa code là tự reload (backend dùng nodemon, frontend dùng Vite).

Bật thêm pgAdmin (giao diện quản lý DB) tại http://localhost:5050:
```bash
docker compose --profile tools up -d
```
Trong pgAdmin, thêm server với Host = `db`, Port = `5432`, user/pass như trong `.env`.

## Cách 2 — Chỉ chạy database bằng Docker, FE/BE chạy trên máy
```bash
# 1. Khởi động PostgreSQL
docker compose up -d db

# 2. Backend (dùng DB_HOST=localhost trong file .env ở gốc)
cd backend
npm install
npm run dev                 # http://localhost:5000

# 3. Frontend (mở terminal khác)
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

## Biến môi trường
Toàn bộ cấu hình nằm trong **một file `.env` duy nhất ở thư mục gốc**. File này được đọc bởi cả docker-compose, backend (`backend/src/config/env.js`) và frontend (`frontend/vite.config.js`) — không cần tạo `.env` riêng trong `backend/` hay `frontend/`.

| Biến | Nơi dùng | Ý nghĩa |
|---|---|---|
| `DB_HOST` | backend | `localhost` khi chạy trên máy; chạy Docker thì docker-compose tự đặt `db` |
| `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | backend, docker-compose | Thông tin kết nối PostgreSQL |
| `PORT`, `NODE_ENV` | backend | Cổng API và môi trường chạy |
| `CORS_ORIGIN` | backend | Origin của frontend được phép gọi API |
| `VITE_API_URL` | frontend | Địa chỉ backend API |
| `BACKEND_PORT`, `FRONTEND_PORT` | docker-compose | Cổng mở ra máy host |
| `PGADMIN_*` | docker-compose | Tài khoản & cổng pgAdmin (profile `tools`) |

> Không commit file `.env` lên Git (đã có trong `.gitignore`). Ai cần thì xin nhóm gửi riêng.

**File `.env` là bắt buộc.** Thiếu file này, dự án sẽ dừng ngay với thông báo rõ ràng chứ không chạy bằng giá trị mặc định:

| Chạy bằng | Khi thiếu `.env` |
|---|---|
| `docker compose up` | `required variable DB_USER is missing a value: chưa có file .env ở thư mục gốc project` |
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

## API mẫu
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/health` | Trạng thái API và kết nối DB |
| GET | `/api/vu-viec` | Danh sách vụ việc |
| GET | `/api/vu-viec/:id` | Chi tiết vụ việc kèm hồ sơ |
| POST | `/api/vu-viec` | Tạo vụ việc (`ma_vu_viec`, `tieu_de`, `mo_ta`, `ngay_tiep_nhan`) |

## Lệnh Docker thường dùng
```bash
docker compose ps                  # Xem trạng thái
docker compose logs -f backend     # Xem log backend
docker compose restart backend     # Khởi động lại 1 service
docker compose down                # Dừng (giữ dữ liệu)
```
