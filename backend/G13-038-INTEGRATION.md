# G13-038 – Nhật ký đăng nhập, đăng xuất

## 1. Thông tin nhiệm vụ

- Mã nhiệm vụ: G13-038
- Người thực hiện: Võ Thành Đạt
- Phạm vi: Backend
- Nhánh phát triển: `g13-038`
- Nhánh nền tạm thời: `origin/g13-034`
- Commit nền: `08f661b`
- Trạng thái: Hoàn thành chức năng ghi nhật ký độc lập, chưa tích hợp Authentication.

## 2. Mục tiêu

Ghi nhận thông tin tài khoản, thời gian, hoạt động đăng nhập, đăng xuất và kết quả thực hiện vào bảng `audit_logs` trong PostgreSQL, phục vụ việc theo dõi truy cập hệ thống.

## 3. Cấu trúc mã nguồn

| File | Chức năng |
|---|---|
| `audit-log.types.ts` | Định nghĩa kiểu dữ liệu đầu vào |
| `audit-log.service.ts` | Thực hiện ghi nhật ký vào Database |
| `audit-log.module.ts` | Cung cấp và export AuditLogService |
| `audit-log.test.cjs` | Kiểm thử độc lập Service |
| `audit-log.integration.test.cjs` | Kiểm thử tích hợp PostgreSQL và NestJS |

Ba file TypeScript được đặt tại `backend/src/modules/audit-log/`.

## 4. Dữ liệu ghi nhận

| Trường | Ý nghĩa |
|---|---|
| id | UUID do Database tự sinh |
| user_id | ID tài khoản, có thể NULL |
| username | Tên đăng nhập, có thể NULL |
| case_id | NULL đối với nhật ký đăng nhập, đăng xuất |
| action | LOGIN hoặc LOGOUT |
| result | SUCCESS hoặc FAILED |
| ip_address | Địa chỉ IP, có thể NULL |
| created_at | Thời gian do Database tự sinh |

Không lưu mật khẩu, password hash hoặc token xác thực.

## 5. Hướng dẫn tích hợp Authentication

### 5.1. Import Module

Thêm AuditLogModule vào imports của AuthModule khi G13-036 được triển khai.

```typescript
import { AuditLogModule } from '../audit-log/audit-log.module';
```

### 5.2. Inject Service

Bổ sung AuditLogService vào constructor của AuthService hiện có, giữ nguyên các dependency khác.

```typescript
import { AuditLogService } from '../audit-log/audit-log.service';
```

Dependency cần bổ sung:

```typescript
private readonly auditLogService: AuditLogService
```

### 5.3. Đăng nhập thành công

Ví dụ gọi Service sau khi xác thực thành công:

```typescript
await this.auditLogService.record({
  userId: user.id,
  username: user.username,
  action: 'LOGIN',
  result: 'SUCCESS',
  ipAddress: ipAddress,
});
```

### 5.4. Đăng nhập thất bại

Ví dụ trường hợp tài khoản không tồn tại:

```typescript
await this.auditLogService.record({
  userId: null,
  username: username,
  action: 'LOGIN',
  result: 'FAILED',
  ipAddress: ipAddress,
});
```

Nếu xác định được tài khoản nhưng xác thực thất bại, có thể truyền ID và username của tài khoản tương ứng theo quy tắc nghiệp vụ đã thống nhất.

### 5.5. Đăng xuất thành công

```typescript
await this.auditLogService.record({
  userId: user.id,
  username: user.username,
  action: 'LOGOUT',
  result: 'SUCCESS',
  ipAddress: ipAddress,
});
```

Các đoạn code trên là ví dụ tích hợp. Tên biến và vị trí gọi Service cần điều chỉnh theo mã nguồn thực tế của G13-036.

## 6. Kết quả kiểm thử

Ngày kiểm thử: 25/11/2026.

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

Kiểm thử được thực hiện bằng Docker, Node.js 22 và PostgreSQL 16 với schema G13-034 trong môi trường Database thử nghiệm độc lập.

Không sử dụng hoặc thay đổi dữ liệu của Database chính.

## 7. Các lệnh kiểm thử

Thực hiện trong môi trường Backend đã cài đặt dependencies phù hợp:

```bash
npm run typecheck
npm run build
node --test audit-log.test.cjs
```

Integration Test:

```bash
node --test audit-log.integration.test.cjs
```

Integration Test yêu cầu PostgreSQL thử nghiệm riêng, sử dụng schema và seed của G13-034, Database `g13_038_test`, tài khoản `audit_test` và các biến môi trường Backend phù hợp.

Không chạy Integration Test trên Database chính.

## 8. Các vấn đề cần thống nhất

- Cơ chế Authentication: JWT hoặc Session.
- Vị trí ghi nhận nhật ký đăng nhập và đăng xuất.
- Xử lý khi tài khoản bị vô hiệu hóa.
- Xử lý username vượt quá 50 ký tự.
- Phạm vi ghi nhận yêu cầu đăng nhập không hợp lệ.
- Nguồn lấy địa chỉ IP.
- Chính sách xử lý khi ghi nhật ký thất bại.
- Cơ chế tránh ghi trùng nhật ký.

Hiện tại AuditLogService truyền lỗi Database cho bên gọi, chưa quyết định chính sách xử lý lỗi ở Authentication.

## 9. Công việc còn lại

- Xác nhận schema chính thức của G13-034.
- Tích hợp AuditLogService với G13-036.
- Kiểm thử đăng nhập, đăng xuất thông qua API thực tế.
- Kiểm tra tính chính xác và đầy đủ của nhật ký.
- Review và bàn giao mã nguồn.

Chưa xác nhận hoàn thành toàn bộ G13-038 cho đến khi chức năng được tích hợp và kiểm thử nghiệp vụ thực tế.