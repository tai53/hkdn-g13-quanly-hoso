# Hướng dẫn cài đặt và chạy dự án

Tài liệu này hướng dẫn từng bước, từ lúc chưa có gì trên máy cho đến khi chạy được hệ thống, và cách cập nhật code mới mỗi ngày.

**Mục lục**
1. [Cài phần mềm cần thiết](#1-cài-phần-mềm-cần-thiết)
2. [Clone source code về máy](#2-clone-source-code-về-máy)
3. [Chuẩn bị file cấu hình môi trường (.env)](#3-chuẩn-bị-file-cấu-hình-môi-trường-env): sao chép `.env.example` thành `.env`
4. [Chạy dự án — Cách A: toàn bộ bằng Docker (khuyến nghị)](#4-cách-a--chạy-toàn-bộ-bằng-docker-khuyến-nghị)
5. [Chạy dự án — Cách B: DB bằng Docker, FE/BE chạy trên máy](#5-cách-b--db-bằng-docker-febe-chạy-trên-máy)
6. [Kiểm tra hệ thống đã chạy đúng](#6-kiểm-tra-hệ-thống-đã-chạy-đúng)
7. [Pull code mới và chạy lại](#7-pull-code-mới-và-chạy-lại)
8. [Quy trình làm việc hằng ngày với Git](#8-quy-trình-làm-việc-hằng-ngày-với-git)
9. [Dừng, khởi động lại, xóa dữ liệu](#9-dừng-khởi-động-lại-xóa-dữ-liệu)
10. [Xử lý lỗi thường gặp](#10-xử-lý-lỗi-thường-gặp)

---

## 1. Cài phần mềm cần thiết

| Phần mềm | Phiên bản | Bắt buộc? | Tải về |
|---|---|---|---|
| Git | mới nhất | Bắt buộc | https://git-scm.com/downloads |
| Docker Desktop | mới nhất | Bắt buộc | https://www.docker.com/products/docker-desktop/ |
| Node.js | 22 LTS | Chỉ cần cho Cách B | https://nodejs.org/ |
| VS Code | mới nhất | Khuyến nghị | https://code.visualstudio.com/ |

### 1.1. Cài Docker Desktop trên Windows
1. Tải và chạy file cài đặt Docker Desktop, giữ tùy chọn **Use WSL 2 instead of Hyper-V**.
2. Khởi động lại máy nếu được yêu cầu.
3. Nếu Docker báo thiếu WSL, mở **PowerShell (Run as Administrator)** và chạy:
   ```powershell
   wsl --install
   ```
   rồi khởi động lại máy.
4. Mở **Docker Desktop** và đợi đến khi góc dưới trái báo **Engine running** (biểu tượng màu xanh).

> Mỗi lần muốn chạy dự án bằng Docker, **phải mở Docker Desktop trước**.

### 1.2. Kiểm tra đã cài đúng
Mở terminal (PowerShell, Git Bash hoặc terminal trong VS Code) và chạy:
```bash
git --version
docker --version
docker compose version
node -v      # chỉ cần nếu dùng Cách B, phải ra v22.x
npm -v
```
Lệnh nào báo `not found` / `không được nhận dạng` nghĩa là phần mềm đó chưa cài hoặc cần mở lại terminal.

### 1.3. Cấu hình Git lần đầu (chỉ làm một lần)
```bash
git config --global user.name "Tên của bạn"
git config --global user.email "email-github-cua-ban@example.com"
```

---

## 2. Clone source code về máy

### 2.1. Chọn thư mục chứa dự án
Ví dụ để ở ổ `E:`:
```bash
cd E:/
```
> Tránh để dự án trong thư mục có dấu tiếng Việt hoặc khoảng trắng (ví dụ `Tài liệu/Đồ án`), dễ gây lỗi Docker và Node.

### 2.2. Clone repository
Dùng **HTTPS** (đơn giản nhất, Git sẽ mở trình duyệt để đăng nhập GitHub khi push):
```bash
git clone https://github.com/tai53/hkdn-g13-quanly-hoso.git
```
Hoặc dùng **SSH** nếu đã cấu hình SSH key với GitHub:
```bash
git clone git@github.com:tai53/hkdn-g13-quanly-hoso.git
```

### 2.3. Vào thư mục dự án
```bash
cd hkdn-g13-quanly-hoso
```

### 2.4. Chuyển sang nhánh cần làm việc
Mặc định sau khi clone bạn đang ở nhánh `main`. Xem danh sách nhánh trên GitHub:
```bash
git fetch origin
git branch -a
```
Nếu cần chạy code của một nhánh chưa được merge vào `main`:
```bash
git checkout ten-nhanh
```

### 2.5. Mở dự án bằng VS Code (tùy chọn)
```bash
code .
```

---

## 3. Chuẩn bị file cấu hình môi trường (.env)

Toàn bộ cấu hình nằm trong **một file `.env` duy nhất ở thư mục gốc** (ngang hàng `docker-compose.yml`). Không cần tạo `.env` trong `backend/` hay `frontend/`.

| File | Có trên Git? | Vai trò |
|---|---|---|
| `.env.example` | **Có** | File mẫu, liệt kê đầy đủ các biến cần thiết. Không chứa mật khẩu thật |
| `.env` | **Không** (bị `.gitignore` chặn) | File cấu hình thật trên máy bạn, chứa mật khẩu của bạn |

### 3.1. Tạo file `.env` từ file mẫu
Đứng ở thư mục gốc project:

**Git Bash / macOS / Linux:**
```bash
cp .env.example .env
```
**PowerShell:**
```powershell
Copy-Item .env.example .env
```

### 3.2. Điền thông tin của bạn
Mở file `.env` bằng VS Code và sửa:

| Biến | Có cần sửa? | Điền gì |
|---|---|---|
| `DB_PASSWORD` | **Nên sửa** | Mật khẩu tự đặt cho PostgreSQL trên máy bạn |
| `PGADMIN_PASSWORD` | **Nên sửa** | Mật khẩu tự đặt để đăng nhập pgAdmin |
| `DB_PORT` | Chỉ khi trùng cổng | Đổi thành `5433` nếu máy đã cài sẵn PostgreSQL |
| `BACKEND_PORT`, `FRONTEND_PORT` | Chỉ khi trùng cổng | Cổng mở ra máy khi chạy bằng Docker |
| Các biến còn lại | Không | Giữ nguyên giá trị mẫu |

> - **Không commit `.env`** và không gửi file này lên nhóm chat. Mỗi người tự tạo `.env` của riêng mình từ `.env.example`.
> - Mật khẩu là của database **trên máy bạn**, không cần giống người khác trong nhóm.
> - **Đặt mật khẩu trước lần chạy đầu tiên.** PostgreSQL chỉ áp dụng `DB_USER`, `DB_PASSWORD`, `DB_NAME` lúc tạo database lần đầu. Đổi sau đó phải tạo lại DB ([mục 9.3](#93-tạo-lại-database-từ-đầu-xóa-toàn-bộ-dữ-liệu)).
> - Khi pull code mới mà `.env.example` có thêm biến, hãy chép biến đó sang `.env` của bạn ([mục 7.2](#72-kiểm-tra-cần-làm-gì-sau-khi-pull)).

### 3.3. Ý nghĩa các biến và biến nào dùng cho cách chạy nào

| Biến | Giá trị mẫu | Cách A (Docker) | Cách B (trên máy) | Ý nghĩa |
|---|---|---|---|---|
| `DB_USER` | `postgres` | ✔ | ✔ | Tài khoản PostgreSQL |
| `DB_PASSWORD` | `doi_mat_khau_nay` | ✔ | ✔ | Mật khẩu PostgreSQL (bạn tự đặt) |
| `DB_NAME` | `quanly_hoso` | ✔ | ✔ | Tên database |
| `DB_PORT` | `5432` | ✔ | ✔ | Cổng PostgreSQL mở ra máy host |
| `DB_HOST` | `localhost` | Bỏ qua (compose tự đặt `db`) | ✔ | Địa chỉ database mà backend kết nối |
| `NODE_ENV` | `development` | ✔ | ✔ | Môi trường chạy backend |
| `PORT` | `5000` | Bỏ qua | ✔ | Cổng backend khi chạy trên máy |
| `CORS_ORIGIN` | `http://localhost:5173` | Bỏ qua (tự đặt theo `FRONTEND_PORT`) | ✔ | Frontend nào được phép gọi API |
| `VITE_API_URL` | `http://localhost:5000/api` | Bỏ qua (tự đặt theo `BACKEND_PORT`) | ✔ | Địa chỉ API mà giao diện gọi tới, cổng phải trùng `PORT` |
| `BACKEND_PORT` | `5000` | ✔ | Bỏ qua | Cổng backend mở ra máy host |
| `FRONTEND_PORT` | `5173` | ✔ | Bỏ qua (luôn là `5173`) | Cổng giao diện web mở ra máy host |
| `PGADMIN_EMAIL` / `PGADMIN_PASSWORD` | `admin@example.com` / `doi_mat_khau_nay` | ✔ | ✔ | Tài khoản đăng nhập pgAdmin (profile `tools`) |
| `PGADMIN_PORT` | `5050` | ✔ | ✔ | Cổng pgAdmin |

### 3.4. Dùng thông tin trong `.env` ở đâu
Trong tài liệu này, `<DB_USER>` nghĩa là "giá trị `DB_USER` trong file `.env` của bạn", tương tự với các biến khác.

| Khi cần... | Dùng giá trị |
|---|---|
| Mở giao diện web (Cách A) | `http://localhost:<FRONTEND_PORT>` |
| Gọi API (Cách A) | `http://localhost:<BACKEND_PORT>/api` |
| Gọi API (Cách B) | `http://localhost:<PORT>/api` |
| Đăng nhập pgAdmin tại `http://localhost:<PGADMIN_PORT>` | Email `<PGADMIN_EMAIL>`, mật khẩu `<PGADMIN_PASSWORD>` |
| Kết nối DB từ pgAdmin (chạy trong Docker) | Host `db`, Port `5432`, Username `<DB_USER>`, Password `<DB_PASSWORD>`, Database `<DB_NAME>` |
| Kết nối DB từ DBeaver / TablePlus (trên máy) | Host `localhost`, Port `<DB_PORT>`, Username `<DB_USER>`, Password `<DB_PASSWORD>`, Database `<DB_NAME>` |
| Vào `psql` | `docker exec -it qlhs_db psql -U <DB_USER> -d <DB_NAME>` |

Với giá trị mẫu, các địa chỉ là http://localhost:5173 (web), http://localhost:5000/api (API) và http://localhost:5050 (pgAdmin). Các ví dụ phía dưới dùng giá trị mẫu. Nếu bạn đổi cổng thì thay tương ứng.

### 3.5. Khi thiếu hoặc sai file `.env`
**File `.env` là bắt buộc.** Dự án không có giá trị mặc định ẩn. Thiếu file hoặc thiếu biến, cả 3 thành phần đều dừng ngay kèm thông báo chỉ rõ cách sửa:

| Lệnh | Thông báo khi thiếu `.env` |
|---|---|
| `docker compose up -d` | `required variable <TÊN_BIẾN> is missing a value: chưa có file .env - hãy chạy lệnh cp .env.example .env` |
| `npm run dev` trong `backend/` | `[CẤU HÌNH] Không thể khởi động backend: thiếu biến môi trường.` kèm danh sách biến thiếu, rồi `exit 1` |
| `npm run dev` trong `frontend/` | `[CẤU HÌNH] Thiếu biến VITE_API_URL.`, Vite không khởi động |

Kiểm tra nhanh file `.env` đã đủ biến chưa (không chạy container nào):
```bash
docker compose config --quiet && echo "File .env hop le"
```

---

## 4. Cách A — Chạy toàn bộ bằng Docker (khuyến nghị)

Không cần cài Node.js. Docker sẽ tự dựng PostgreSQL, Backend và Frontend.

### 4.1. Build và chạy (lần đầu)
Đảm bảo Docker Desktop đang chạy, đứng ở thư mục gốc dự án:
```bash
docker compose up -d --build
```
- `--build`: build image cho backend và frontend.
- `-d`: chạy nền, trả lại terminal cho bạn.

Phải tạo file `.env` trước ([mục 3](#3-chuẩn-bị-file-cấu-hình-môi-trường-env)). Lần đầu sẽ mất vài phút để tải image `postgres`, `node` và cài thư viện.

Khi PostgreSQL khởi tạo lần đầu, nó tự chạy các file trong `database/init/` để **tạo bảng và thêm dữ liệu mẫu**.

### 4.2. Xem trạng thái các container
```bash
docker compose ps
```
Kết quả đúng sẽ có 3 container ở trạng thái `running` (`qlhs_db` có thêm `healthy`):
```
NAME             STATUS
qlhs_db          Up (healthy)
qlhs_backend     Up
qlhs_frontend    Up
```

### 4.3. Xem log
```bash
docker compose logs -f backend
```
Thấy hai dòng sau là backend đã kết nối được database:
```
[API] Đang chạy tại http://localhost:5000
[DB] Kết nối PostgreSQL thành công (...)
```
Nhấn `Ctrl + C` để thoát xem log (container vẫn chạy).

### 4.4. Truy cập
| Dịch vụ | Địa chỉ |
|---|---|
| Giao diện web | http://localhost:5173 (cổng `FRONTEND_PORT`) |
| Backend API | http://localhost:5000/api (cổng `BACKEND_PORT`) |
| Kiểm tra API + DB | http://localhost:5000/api/health |

### 4.5. Sửa code khi chạy bằng Docker
Thư mục `frontend/` và `backend/` được gắn trực tiếp vào container, nên **sửa code và lưu là tự cập nhật**:
- Frontend: trình duyệt tự reload (Vite).
- Backend: server tự khởi động lại (nodemon).

Không cần chạy lại `docker compose` sau mỗi lần sửa code.

### 4.6. Dùng pgAdmin để xem database (tùy chọn)
```bash
docker compose --profile tools up -d
```
1. Mở http://localhost:5050 (cổng `PGADMIN_PORT`), đăng nhập bằng `PGADMIN_EMAIL` / `PGADMIN_PASSWORD` trong file `.env` của bạn.
2. Chuột phải **Servers → Register → Server**.
3. Tab **General**: Name = `quanly_hoso`.
4. Tab **Connection**: Host = `db`, Port = `5432` (cổng bên trong Docker, luôn là 5432), Username = `<DB_USER>`, Password = `<DB_PASSWORD>` lấy từ `.env`.
5. Bấm **Save**, mở **Databases → quanly_hoso → Schemas → public → Tables** để xem các bảng.

Có thể dùng DBeaver hoặc TablePlus thay cho pgAdmin. Khi đó Host = `localhost`, Port = `<DB_PORT>`, Username/Password/Database lấy từ `.env`.

---

## 5. Cách B — DB bằng Docker, FE/BE chạy trên máy

Dùng khi muốn debug bằng VS Code hoặc máy chạy Docker chậm. Cần cài Node.js 22.

Backend và frontend tự đọc file `.env` ở thư mục gốc, không cần tạo thêm `.env` trong `backend/` hay `frontend/`. Cách này dùng `DB_HOST`, `PORT`, `CORS_ORIGIN`, `VITE_API_URL` (xem [mục 3.3](#33-ý-nghĩa-các-biến-và-biến-nào-dùng-cho-cách-chạy-nào)).

### 5.1. Chạy riêng PostgreSQL
```bash
docker compose up -d db
```

### 5.2. Chạy Backend (terminal thứ nhất)
```bash
cd backend
npm install
npm run dev
```
Thấy `[DB] Kết nối PostgreSQL thành công` là được. API chạy tại http://localhost:5000 (cổng `PORT`).

### 5.3. Chạy Frontend (mở terminal thứ hai)
```bash
cd frontend
npm install
npm run dev
```
Mở http://localhost:5173.

> Không chạy song song Cách A và Cách B: hai cách dùng chung cổng 5000 và 5173 nên sẽ bị trùng. Nếu đang chạy Cách A, dừng backend và frontend trước:
> ```bash
> docker compose stop backend frontend
> ```

---

## 6. Kiểm tra hệ thống đã chạy đúng

1. Mở http://localhost:5000/api/health. Kết quả đúng:
   ```json
   { "status": "ok", "database": "connected", "dbTime": "..." }
   ```
2. Mở http://localhost:5000/api/vu-viec. Phải thấy 2 vụ việc mẫu `VV-2026-001` và `VV-2026-002`.
3. Mở http://localhost:5173. Dòng trạng thái báo `API: ok · DB: connected` và bảng **Danh sách vụ việc** có 2 dòng.
4. (Tùy chọn) Thử tạo vụ việc mới bằng API:
   ```bash
   curl -X POST http://localhost:5000/api/vu-viec -H "Content-Type: application/json" -d "{\"ma_vu_viec\":\"VV-TEST-01\",\"tieu_de\":\"Vụ việc thử\"}"
   ```
5. (Tùy chọn) Truy cập database bằng dòng lệnh:
   ```bash
   docker exec -it qlhs_db psql -U postgres -d quanly_hoso
   ```
   Thay `postgres` và `quanly_hoso` bằng `DB_USER` và `DB_NAME` trong `.env` nếu bạn đã đổi.
   Trong `psql`: gõ `\dt` để xem bảng, `SELECT * FROM vu_viec;` để xem dữ liệu, `\q` để thoát.

---

## 7. Pull code mới và chạy lại

Khi các thành viên khác đã merge code mới vào `main`:

### 7.1. Lấy code mới nhất
```bash
git checkout main
git pull origin main
```
Nếu Git báo có thay đổi chưa commit, hãy commit hoặc tạm cất trước:
```bash
git stash          # cất tạm thay đổi
git pull origin main
git stash pop      # lấy lại thay đổi
```

### 7.2. Kiểm tra cần làm gì sau khi pull

| Nếu trong code mới có thay đổi ở... | Cần làm (Cách A — Docker) | Cần làm (Cách B — trên máy) |
|---|---|---|
| Chỉ code trong `src/` | Không cần làm gì, tự reload | Không cần làm gì, tự reload |
| `package.json` (thêm/bớt thư viện) | `docker compose up -d --build -V` | `npm install` trong `backend/` hoặc `frontend/` |
| `Dockerfile` hoặc `docker-compose.yml` | `docker compose up -d --build` | `docker compose up -d db` |
| `.env.example` (có biến mới) | Chép biến mới từ `.env.example` sang `.env` của bạn | Giống Cách A |
| `database/init/*.sql` (schema mới) | Tạo lại DB, xem [mục 9.3](#93-tạo-lại-database-từ-đầu-xóa-toàn-bộ-dữ-liệu) | Tạo lại DB, xem mục 9.3 |

> **Vì sao cần `-V`?** Thư viện (`node_modules`) trong container nằm trên một volume riêng. Cờ `-V` tạo lại volume này để cài đúng thư viện mới. Thiếu cờ này sẽ gặp lỗi `Cannot find module ...`.

Xem nhanh những file đã thay đổi sau khi pull:
```bash
git diff --stat "HEAD@{1}" HEAD
```

### 7.3. Cách an toàn nhất nếu không chắc
```bash
docker compose down
docker compose up -d --build -V
```
Lệnh này **giữ nguyên dữ liệu** trong database, chỉ build lại backend và frontend.

---

## 8. Quy trình làm việc hằng ngày với Git

Theo quy ước của nhóm: không commit trực tiếp vào `main`, mọi thay đổi đi qua Pull Request.

```bash
# 1. Cập nhật main mới nhất
git checkout main
git pull origin main

# 2. Tạo nhánh mới cho công việc
git checkout -b feature/ten-chuc-nang

# 3. Chạy dự án và code
docker compose up -d

# 4. Commit thay đổi
git add .
git commit -m "Thêm chức năng ..."

# 5. Đẩy nhánh lên GitHub
git push -u origin feature/ten-chuc-nang
```
6. Lên GitHub, tạo **Pull Request** từ nhánh của bạn vào `main` và nhờ người review.

Nếu trong lúc bạn làm, `main` đã có code mới, hãy cập nhật vào nhánh của bạn:
```bash
git fetch origin
git merge origin/main
```
Nếu có xung đột (conflict), sửa các file bị đánh dấu rồi `git add` và `git commit`.

---

## 9. Dừng, khởi động lại, xóa dữ liệu

### 9.1. Dừng và chạy lại
```bash
docker compose stop        # dừng, giữ container
docker compose start       # chạy lại
docker compose restart backend   # khởi động lại 1 service
```

### 9.2. Tắt hẳn (giữ dữ liệu)
```bash
docker compose down
```
Dữ liệu database vẫn nằm trong volume `pgdata`. Lần sau `docker compose up -d` là có lại.

### 9.3. Tạo lại database từ đầu (xóa toàn bộ dữ liệu)
Các file `database/init/*.sql` **chỉ chạy một lần** khi database còn trống. Khi schema thay đổi, cần xóa volume để chạy lại:
```bash
docker compose down -v
docker compose up -d --build
```
> **Cảnh báo:** `-v` xóa toàn bộ dữ liệu bạn đã nhập vào database trên máy mình.

---

## 10. Xử lý lỗi thường gặp

| Lỗi | Nguyên nhân | Cách xử lý |
|---|---|---|
| `Cannot connect to the Docker daemon` / `error during connect` | Docker Desktop chưa mở | Mở Docker Desktop, đợi **Engine running** rồi chạy lại |
| `port is already allocated` / `address already in use` | Cổng 5432, 5000 hoặc 5173 đang bị chương trình khác dùng (thường là PostgreSQL cài sẵn trên máy) | Đổi cổng trong `.env` (`DB_PORT=5433`, `BACKEND_PORT`, `FRONTEND_PORT`), rồi chạy lại `docker compose up -d` |
| `required variable ... is missing a value` | Chưa có file `.env` hoặc thiếu biến | `cp .env.example .env`, hoặc chép biến còn thiếu từ `.env.example` |
| `/api/health` trả `ECONNREFUSED` | Database chưa chạy hoặc sai host/cổng | `docker compose ps` để xem `qlhs_db`. Với Cách B kiểm tra `DB_HOST=localhost` và `DB_PORT` trong `.env` |
| `password authentication failed` | Đổi `DB_USER` / `DB_PASSWORD` sau khi DB đã khởi tạo | Mật khẩu chỉ áp dụng lúc tạo DB lần đầu. Đổi lại như cũ hoặc tạo lại DB (mục 9.3) |
| `relation "vu_viec" does not exist` | DB được tạo trước khi có file schema | Tạo lại DB (mục 9.3) |
| `Cannot find module '...'` trong container | Có thư viện mới sau khi pull | `docker compose up -d --build -V` |
| Giao diện báo `Không kết nối được API` | Backend chưa chạy, hoặc (Cách B) cổng trong `VITE_API_URL` khác `PORT` | Kiểm tra http://localhost:5000/api/health, xem log `docker compose logs backend` |
| Sửa code nhưng không tự reload | File watcher trên Windows | Đã bật `usePolling` cho Vite. Nếu vẫn không được, chạy `docker compose restart frontend` (hoặc `backend`) |
| `npm` báo lỗi quyền hoặc `EPERM` trên Windows | File bị khóa bởi VS Code hoặc antivirus | Đóng các terminal đang chạy `npm run dev`, xóa thư mục `node_modules` rồi `npm install` lại |

Xem log chi tiết từng service khi gặp lỗi khác:
```bash
docker compose logs db
docker compose logs backend
docker compose logs frontend
```
