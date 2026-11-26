
# G13-038 – Nhật ký đăng nhập, đăng xuất

## 1. Thông tin nhiệm vụ

- Mã nhiệm vụ: G13-038
- Người thực hiện: Võ Thành Đạt
- Phạm vi: Backend – Nhật ký truy cập
- Nhánh phát triển: `g13-038-integration`
- Nhánh nền: `origin/g13-036`
- Commit nền Authentication: `07af1cc`
- Commit AuditLogService đã chuyển nền: `36b22db`
- Ngày hoàn thành kiểm thử: 26/11/2026
- Trạng thái: Đã triển khai, tích hợp và kiểm thử; chờ review và nghiệm thu.

## 2. Mục tiêu

Ghi nhận thông tin tài khoản, thời gian, địa chỉ IP, hoạt động đăng nhập, đăng xuất và kết quả thực hiện vào bảng `audit_logs` trong PostgreSQL, phục vụ theo dõi truy cập hệ thống.

## 3. Cấu trúc mã nguồn

### 3.1. Module nhật ký

Các file tại `backend/src/modules/audit-log/`:

| File | Chức năng |
|---|---|
| audit-log.types.ts | Định nghĩa kiểu dữ liệu đầu vào |
| audit-log.service.ts | Ghi nhật ký vào PostgreSQL |
| audit-log.module.ts | Cung cấp và export AuditLogService |

### 3.2. Tích hợp Authentication

Các file tại `backend/src/modules/auth/`:

| File | Nội dung thay đổi |
|---|---|
| auth.module.ts | Import AuditLogModule |
| auth.controller.ts | Lấy IP từ Request và truyền vào AuthService |
| auth.service.ts | Ghi nhật ký đăng nhập, đăng xuất và xử lý lỗi ghi nhật ký |

### 3.3. Kiểm thử

| File | Chức năng |
|---|---|
| audit-log.test.cjs | Unit Test của AuditLogService |
| audit-log.integration.test.cjs | Integration Test với PostgreSQL và NestJS |

## 4. Cấu trúc dữ liệu nhật ký

| Trường | Ý nghĩa |
|---|---|
| id | UUID do Database tự sinh |
| user_id | ID tài khoản, có thể NULL |
| username | Tên đăng nhập |
| case_id | NULL đối với nhật ký đăng nhập, đăng xuất |
| action | LOGIN hoặc LOGOUT |
| result | SUCCESS hoặc FAILED |
| ip_address | Địa chỉ IP Backend nhận được, có thể NULL |
| created_at | Thời gian do Database tự sinh |

Không lưu mật khẩu, password hash, JWT Token hoặc JWT Secret vào bảng nhật ký.

## 5. Cơ chế tích hợp Authentication

Authentication sử dụng JWT Bearer Token kết hợp quản lý phiên trong bảng `auth_sessions`.

### 5.1. Đăng nhập thành công

- Kiểm tra thông tin tài khoản và mật khẩu.
- Kiểm tra trạng thái hoạt động.
- Tạo JWT và lưu phiên đăng nhập.
- Ghi nhật ký LOGIN / SUCCESS.
- Trả kết quả xác thực cho Client.

### 5.2. Đăng nhập thất bại

Ghi LOGIN / FAILED trong các trường hợp:

- Sai mật khẩu.
- Tài khoản không tồn tại.
- Tài khoản bị vô hiệu hóa.

Nếu tài khoản không tồn tại, user_id được lưu NULL và username là tên đăng nhập được gửi đến.

### 5.3. Đăng xuất thành công

- JwtAuthGuard xác thực Token và phiên.
- Cập nhật revoked_at trong auth_sessions.
- Sử dụng RETURNING id để xác nhận phiên thực sự được cập nhật.
- Ghi LOGOUT / SUCCESS khi có phiên được thu hồi.

Cơ chế này hạn chế ghi trùng nhật ký đăng xuất khi nhiều Request đồng thời thu hồi cùng một phiên.

### 5.4. Chính sách xử lý lỗi ghi nhật ký

AuditLogService truyền lỗi Database cho bên gọi.

AuthService hiện sử dụng fail-open tạm thời: bắt lỗi ghi nhật ký, ghi thông báo lỗi vào Backend Logger và giữ nguyên hành vi Authentication.

Chính sách này cần được nhóm xác nhận trước khi nghiệm thu chính thức.

## 6. API liên quan

| Method | Endpoint | Authentication |
|---|---|---|
| GET | /api/health | Không yêu cầu |
| POST | /api/auth/login | Không yêu cầu |
| POST | /api/auth/logout | Bearer Token |
| GET | /api/vu-viec | Bearer Token |

Không bổ sung API ghi nhật ký công khai.

### 6.1. Swagger UI

Swagger UI được sử dụng để tra cứu tài liệu API và
thực hiện HTTP Request trực tiếp trên trình duyệt.

- Đường dẫn Swagger: `/api/docs`
- Môi trường mặc định: `http://localhost:5000/api/docs`
- Môi trường kiểm thử ngày 26/11/2026:
  `http://127.0.0.1:60559/api/docs`

Cổng 60559 là cổng tạm do Docker cấp trong môi trường
kiểm thử riêng, không phải cổng triển khai cố định.

Kết quả kiểm tra Swagger:

- Hiển thị đầy đủ 6 Endpoint của Backend hiện tại.
- Hiển thị cơ chế Bearer Token Authentication.
- Kiểm thử GET /api/health trực tiếp trên Swagger: PASS.
- Kiểm thử nghiệp vụ Authentication: Postman 8/8 PASS
  và đối chiếu PostgreSQL thành công.

Chưa thực hiện lại toàn bộ Test Case Authentication
trên Swagger UI.


## 7. Môi trường kiểm thử

- Docker Desktop / Docker Engine 29.5.3
- Node.js 22.23.5
- npm 10.9.9
- PostgreSQL 16
- NestJS
- Postman
- Database kiểm thử: g13_038_test
- Database User: audit_test

Môi trường kiểm thử sử dụng Docker Network riêng và PostgreSQL tạm thời trên tmpfs.

Dependencies được cài bằng npm ci theo package-lock.json.

Mật khẩu tài khoản mẫu được thiết lập riêng trong Database kiểm thử, không thay đổi Database chính, Schema hoặc file Seed.

## 8. Kết quả kiểm thử tự động

| Nội dung | Kết quả |
|---|---|
| TypeScript Typecheck | PASS |
| NestJS Build | PASS |
| Unit Test | 5/5 PASS |
| PostgreSQL Integration Test | 1/1 PASS |
| Ghi và xác minh 4 bản ghi nhật ký | PASS |
| UUID và Timestamp | PASS |
| Foreign Key Constraint | PASS |
| Result CHECK Constraint | PASS |
| NestJS Dependency Injection | PASS |

## 9. Kết quả kiểm thử Postman

Ngày kiểm thử: 26/11/2026.

| Test Case | Nội dung | HTTP kỳ vọng | HTTP thực tế | Kết quả |
|---|---|---|---|---|
| TC00 | Health Check | 200 | 200 | PASS |
| TC01 | Đăng nhập thành công | 200 | 200 | PASS |
| TC02 | Sai mật khẩu | 401 | 401 | PASS |
| TC03 | Tài khoản không tồn tại | 401 | 401 | PASS |
| TC04 | Tài khoản bị vô hiệu hóa | 401 | 401 | PASS |
| TC05A | Truy cập trước đăng xuất | 200 | 200 | PASS |
| TC05 | Đăng xuất thành công | 200 | 200 | PASS |
| TC06 | Truy cập sau đăng xuất | 401 | 401 | PASS |

TC06 được kiểm thử lại sau khi thực hiện đúng Request đăng xuất.

## 10. Đối chiếu dữ liệu PostgreSQL

| Action | Result | Ban đầu | Sau Postman | Tăng |
|---|---|---:|---:|---:|
| CREATE | SUCCESS | 1 | 1 | 0 |
| LOGIN | SUCCESS | 2 | 3 | 1 |
| LOGIN | FAILED | 3 | 6 | 3 |
| LOGOUT | SUCCESS | 1 | 2 | 1 |
| Tổng | | 7 | 12 | 5 |

Kết quả xác nhận:

- Ghi đủ 5 bản ghi nhật ký mới theo các sự kiện Authentication.
- Tài khoản không tồn tại có user_id bằng NULL.
- Tài khoản đã xác định có user_id tương ứng.
- Ghi nhận địa chỉ IP và thời gian thực hiện.
- Không phát hiện bản ghi thừa hoặc thiếu trong các lượt kiểm thử.

### Kiểm tra phiên đăng nhập

Tài khoản admin:

- Thời gian đăng nhập: 23:04:46 ngày 26/11/2026.
- Thời gian đăng xuất: 23:12:13 ngày 26/11/2026.
- revoked_at đã được cập nhật.
- Token hoạt động trước đăng xuất.
- Token bị từ chối sau đăng xuất.

Thời gian trên được biểu diễn theo UTC+7.

## 11. Lệnh kiểm thử

Thực hiện trong môi trường Backend đã cài đặt dependencies phù hợp:

```bash
npm run typecheck
npm run build
node --test audit-log.test.cjs
```

Kiểm thử tích hợp:

```bash
node --test audit-log.integration.test.cjs
```

Integration Test yêu cầu Database kiểm thử riêng, schema và seed tương thích, cùng các biến môi trường Backend và JWT_SECRET phù hợp.

Không chạy Integration Test trên Database chính.

## 12. Minh chứng kiểm thử

Minh chứng được lưu riêng tại thư mục:

G13-038-Test-Evidence-20261126

Bao gồm:

- PostgreSQL-Test-Result.txt
- TC00-Health-Check.png
- TC01-Login-Success.png
- TC02-Wrong-Password.png
- TC03-Unknown-Account.png
- TC04-Disabled-Account.png
- TC05A-Access-Before-Logout.png
- TC05-Logout-Success.png
- TC06-Access-After-Logout.png
- Swagger-Health-Check.png

Cần loại bỏ mật khẩu và Token khỏi minh chứng trước khi chia sẻ.

## 13. Giới hạn và vấn đề cần thống nhất

- Chính sách fail-open chưa được nhóm xác nhận.
- Ghi phiên và ghi nhật ký chưa sử dụng chung Transaction.
- Request không hợp lệ bị DTO từ chối trước AuthService chưa được ghi nhật ký.
- Logout bị JwtAuthGuard từ chối chưa được ghi LOGOUT FAILED.
- Chưa kiểm thử riêng trường hợp username vượt quá giới hạn hoặc Request đồng thời.
- IP ghi nhận là IP Backend nhận được; cần đánh giá cấu hình Proxy khi triển khai.
- npm ci báo 3 lỗ hổng dependencies mức Moderate; chưa tự ý thay đổi phiên bản thư viện.
- Chưa triển khai API đọc nhật ký hoặc giao diện Dashboard vì chưa xác nhận thuộc phạm vi G13-038.
- Chưa thống nhất nhánh đích Pull Request.

## 14. Kết luận

Đã hoàn thành triển khai AuditLogService, tích hợp Authentication và kiểm thử nghiệp vụ đăng nhập, đăng xuất trong môi trường độc lập.

Kết quả: Unit Test 5/5 PASS, Integration Test 1/1 PASS và Postman 8/8 PASS.

Mã nguồn sẵn sàng để gửi nhóm review. Nghiệm thu chính thức và merge thực hiện theo quy trình của nhóm.
