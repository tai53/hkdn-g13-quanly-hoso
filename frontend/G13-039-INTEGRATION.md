
# G13-039 — Kết nối Frontend với API

## 1. Thông tin nhiệm vụ

- Dự án: G1.3 — Hệ thống quản lý vụ việc và hồ sơ nghiệp vụ.
- Sprint: SP04.
- Mã nhiệm vụ: G13-039.
- Người thực hiện: Võ Thành Đạt.
- Ngày thực hiện và kiểm thử: 27/11/2026.
- Nhánh phát triển: g13-039.
- Commit nền: 07af1cc (G13-036).

## 2. Mục tiêu

Tích hợp Frontend với Backend, đồng bộ cấu trúc dữ liệu,
xử lý kết quả API và thông báo trạng thái cho người dùng.

Phạm vi đã triển khai gồm xác thực, quản lý phiên đăng nhập,
hiển thị danh sách vụ việc và xử lý các tình huống lỗi cơ bản.

## 3. Công nghệ sử dụng

- React 18.
- TypeScript.
- Ant Design 5.
- Axios.
- Vite 5.
- Day.js.
- NestJS.
- PostgreSQL.
- JWT Authentication.
- Docker.

Không bổ sung thư viện mới hoặc thay đổi package-lock.json.

## 4. Nội dung triển khai

### 4.1. Đồng bộ cấu trúc dữ liệu

Cập nhật kiểu dữ liệu Frontend theo hợp đồng API của Backend:

- ID vụ việc sử dụng chuỗi UUID.
- Sử dụng code, title, status, location.
- Đồng bộ occurred_at và created_at.
- Xử lý các trường dữ liệu nullable.

Các trạng thái vụ việc:

- RECEIVED: Tiếp nhận.
- IN_PROGRESS: Đang xử lý.
- COMPLETED: Hoàn thành.

### 4.2. Tích hợp Authentication

- Xây dựng hàm gọi API đăng nhập và đăng xuất.
- Quản lý thông tin phiên trong bộ nhớ JavaScript.
- Sử dụng Axios Request Interceptor để gắn Bearer Token.
- Sử dụng Axios Response Interceptor để xử lý HTTP 401.
- Xóa phiên tương ứng khi Backend từ chối Token.
- Kiểm tra thời hạn phiên đăng nhập.
- Không lưu Token hoặc mật khẩu trực tiếp trong mã nguồn.

### 4.3. Kết nối giao diện

- Giao diện đăng nhập tối giản.
- Hiển thị tên người dùng và vai trò.
- Hiển thị danh sách vụ việc từ Backend.
- Nút làm mới danh sách.
- Chức năng đăng xuất.
- Trạng thái kết nối Backend và Database.

### 4.4. Xử lý trạng thái và lỗi

- Loading khi gửi yêu cầu API.
- Hiển thị lỗi đăng nhập.
- Hiển thị lỗi mất kết nối Backend.
- Hiển thị trạng thái danh sách rỗng.
- Bỏ qua phản hồi cũ không còn phù hợp.
- Giới hạn thời gian chờ API là 15 giây.
- Không tự động gửi lại yêu cầu POST.
- Xử lý ngày giờ và trạng thái không hợp lệ.

## 5. Danh sách file triển khai

| File | Nội dung |
|---|---|
| src/App.tsx | Điều phối giao diện và phiên đăng nhập |
| src/api/client.ts | Axios Client và Interceptors |
| src/api/auth.api.ts | API đăng nhập, đăng xuất |
| src/api/vuViec.api.ts | API vụ việc |
| src/auth/session.ts | Quản lý phiên |
| src/pages/LoginPage.tsx | Giao diện đăng nhập |
| src/pages/VuViecPage.tsx | Giao diện danh sách vụ việc |
| src/types/auth.ts | Kiểu dữ liệu xác thực |
| src/types/vu-viec.ts | Kiểu dữ liệu vụ việc |

## 6. API liên quan

| Method | Endpoint | Xác thực | Trạng thái |
|---|---|---|---|
| GET | /api/health | Không | Đã kiểm thử |
| POST | /api/auth/login | Không | Đã kiểm thử |
| POST | /api/auth/logout | Bearer Token | Đã kiểm thử |
| GET | /api/vu-viec | Bearer Token | Đã kiểm thử |
| GET | /api/vu-viec/:id | Bearer Token | Đã chuẩn bị hàm gọi |
| POST | /api/vu-viec | Bearer Token | Đã chuẩn bị hàm gọi |

Hai API xem chi tiết và tạo vụ việc chưa được kết nối
với màn hình tương ứng và chưa được kiểm thử trong nhiệm vụ này.

## 7. Môi trường kiểm thử

Môi trường Docker độc lập với dự án chính.

- Network: g13-039-net.
- Frontend: g13-039-frontend.
- Backend: g13-039-api.
- PostgreSQL: g13-039-db.
- Database: g13_039_test.
- Backend sử dụng mã nguồn nền G13-036.
- PostgreSQL sử dụng dữ liệu mẫu và tmpfs.
- Không công khai cổng PostgreSQL ra máy host.

Địa chỉ kiểm thử cục bộ:

- Frontend: http://127.0.0.1:15173
- Backend: http://127.0.0.1:60559/api
- Swagger: http://127.0.0.1:60559/api/docs

Các địa chỉ trên chỉ sử dụng khi môi trường
Docker kiểm thử tương ứng đang hoạt động.

Biến môi trường Frontend:

VITE_API_URL=http://127.0.0.1:60559/api

CORS của Backend được cấu hình cho Origin Frontend kiểm thử.

## 8. Kết quả kiểm thử

| Mã | Nội dung | Kết quả |
|---|---|---|
| TC039-01 | Hiển thị trang đăng nhập | PASS |
| TC039-02 | Đăng nhập sai mật khẩu | PASS |
| TC039-03 | Đăng nhập thành công | PASS |
| TC039-04 | Gửi Bearer Token | PASS |
| TC039-05 | Đối chiếu dữ liệu PostgreSQL | PASS |
| TC039-06 | Làm mới danh sách | PASS |
| TC039-07 | Đăng xuất | PASS |
| TC039-08 | Xử lý phiên bị thu hồi | PASS |
| TC039-09 | Mất kết nối và phục hồi | PASS |
| TC039-10 | Xử lý danh sách rỗng | PASS |

Tổng kết: 10/10 Test Case đạt yêu cầu trong phạm vi kiểm thử.

Ghi chú:

- TC039-08 sử dụng thao tác thu hồi đúng một phiên
  trong Database kiểm thử, sau đó xác minh HTTP 401
  và việc Frontend tự động trở về trang đăng nhập.

- TC039-09 sử dụng chế độ Offline của Chrome DevTools
  để mô phỏng mất kết nối từ trình duyệt.
  Không phải kiểm thử dừng Backend Container.

- TC039-10 sử dụng Chrome Local Overrides với Response [].
  Sau kiểm thử, Overrides được tắt và dữ liệu được khôi phục.
  Không xóa dữ liệu trong PostgreSQL.

## 9. Sửa lỗi và kiểm thử hồi quy

Phát hiện lỗi tên người dùng và vai trò không hiển thị
do màu chữ trắng trên nền Header trắng.

Đã loại bỏ màu chữ cố định và sử dụng màu mặc định
của Ant Design.

Kết quả kiểm thử hồi quy:

- Giao diện đăng nhập hoạt động.
- Đăng nhập thành công.
- Tên người dùng và vai trò hiển thị rõ ràng.
- Danh sách hai vụ việc hiển thị đúng.
- Làm mới danh sách thành công.
- Logout trả HTTP 200.
- PostgreSQL xác nhận các phiên logout đã bị thu hồi.

SHA256 của App.tsx trên Windows và trong Container
được xác nhận trùng khớp.

## 10. Kết quả Typecheck và Build cuối cùng

- Node.js: 22.23.5.
- npm: 10.9.9.
- TypeScript Typecheck: PASS.
- Production Build: PASS.
- Vite: 5.4.21.
- Modules transformed: 1536.
- Thời gian Build: 4,88 giây.
- JavaScript Bundle: 1066,81 kB.
- Gzip: 341,67 kB.

Build output:

dist/assets/index-6cI1Vz6x.js

Có cảnh báo Bundle vượt 500 kB sau minification.
Cảnh báo không làm quá trình Build thất bại.

## 11. Kết quả xác minh PostgreSQL

| Hạng mục | Ban đầu | Sau kiểm thử |
|---|---:|---:|
| Tài khoản | 5 | 5 |
| Vụ việc | 2 | 2 |
| Phiên đăng nhập | 0 | 9 |
| Phiên đã thu hồi | 0 | 7 |
| Phiên còn hạn, chưa thu hồi | 0 | 2 |
| Audit logs | 3 | 3 |

Số liệu phiên đăng nhập được ghi nhận tại thời điểm
kiểm tra ngày 27/11/2026.

Hai phiên còn hạn chưa thu hồi được ghi nhận như
một giới hạn cần theo dõi, không thay đổi dữ liệu
để điều chỉnh kết quả kiểm thử.

Backend kiểm thử chưa tích hợp G13-038,
vì vậy số lượng audit_logs không thay đổi.

## 12. Minh chứng

Thư mục lưu minh chứng riêng ngoài Repository:

G13-039-Test-Evidence-20261127

Gồm 22 file tại thời điểm tổng hợp:

- 18 ảnh minh chứng kiểm thử chức năng và hồi quy.
- Final-Build-Result.txt.
- Final-Database-Verification.txt.
- TC039-08-PostgreSQL-Revocation.txt.
- TC039-09-Session-Verification.txt.

Không đưa mật khẩu, JWT Secret hoặc Token đầy đủ
vào tài liệu và minh chứng bàn giao.

## 13. Giới hạn và nội dung cần review

- Giao diện đăng nhập là bản tích hợp tối giản,
  chưa phải giao diện Figma chính thức.

- API tạo vụ việc và xem chi tiết mới có hàm gọi,
  chưa hoàn thiện màn hình và kiểm thử tương ứng.

- Token được lưu trong bộ nhớ JavaScript.
  Khi tải lại trang, Frontend mất phiên cục bộ
  nhưng phiên Backend có thể vẫn tồn tại đến khi hết hạn.

- Chưa có Refresh Token API.

- Chưa kiểm thử đầy đủ phân quyền theo từng vai trò.

- TC039-09 và TC039-10 sử dụng phương pháp mô phỏng.

- Chưa tối ưu dung lượng JavaScript Bundle.

- Worktree Windows không cài node_modules.
  VS Code có thể báo thiếu Dependencies,
  trong khi Typecheck và Build trong Docker đã PASS.

- Cần thống nhất chính sách quản lý phiên,
  tích hợp giao diện Figma và phạm vi các màn hình
  nghiệp vụ với nhóm.

## 14. Kết luận

Đã triển khai và kiểm thử kết nối Frontend với Backend
cho các chức năng đăng nhập, đăng xuất, danh sách vụ việc
và xử lý các trạng thái cơ bản.

Không thay đổi mã nguồn Backend, Database Schema,
Docker Compose hoặc Dependencies của dự án.

G13-038 được giữ nguyên tại commit faa9d1c
trong quá trình thực hiện G13-039.

Kết quả sẵn sàng để review trong phạm vi đã triển khai.
Việc nghiệm thu toàn bộ nhiệm vụ và Merge
do Leader và nhóm phát triển xác nhận.
