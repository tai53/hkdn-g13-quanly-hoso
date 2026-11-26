-- ============================================================================
-- ĐỀ TÀI G1.3: HỆ THỐNG QUẢN LÝ VỤ VIỆC VÀ HỒ SƠ NGHIỆP VỤ
-- File: database/init/02_seed.sql (Chuẩn hóa theo G13-034)
-- ============================================================================

-- 1. VAI TRÒ (roles)
INSERT INTO roles (id, code, name, description) VALUES
    ('11111111-1111-1111-1111-111111111101', 'INTAKE_OFFICER', 'Cán bộ tiếp nhận', 'Tiếp nhận tin báo ban đầu, khởi tạo và tra cứu hồ sơ vụ việc'),
    ('11111111-1111-1111-1111-111111111102', 'CASE_OFFICER',   'Cán bộ xử lý',     'Xử lý nghiệp vụ, cập nhật diễn biến, đính kèm tệp, liên kết đối tượng/phương tiện'),
    ('11111111-1111-1111-1111-111111111103', 'CASE_MANAGER',   'Người quản lý nghiệp vụ', 'Theo dõi tình hình, phân công và giám sát tiến độ xử lý hồ sơ'),
    ('11111111-1111-1111-1111-111111111104', 'SYSTEM_ADMIN',   'Quản trị hệ thống', 'Quản lý tài khoản, phân quyền và theo dõi nhật ký truy cập');

-- 2. QUYỀN HẠN (permissions)
INSERT INTO permissions (id, code, name, module) VALUES
    ('22222222-2222-2222-2222-222222222201', 'CASE_CREATE',       'Tạo hồ sơ vụ việc',              'CASES'),
    ('22222222-2222-2222-2222-222222222202', 'CASE_VIEW',         'Xem và tra cứu hồ sơ vụ việc',   'CASES'),
    ('22222222-2222-2222-2222-222222222203', 'CASE_UPDATE',       'Cập nhật thông tin hồ sơ',       'CASES'),
    ('22222222-2222-2222-2222-222222222204', 'CASE_ASSIGN',       'Phân công cán bộ xử lý',         'CASES'),
    ('22222222-2222-2222-2222-222222222205', 'ACTIVITY_CREATE',   'Ghi nhận diễn biến xử lý',       'CASE_ACTIVITIES'),
    ('22222222-2222-2222-2222-222222222206', 'ATTACHMENT_MANAGE', 'Tải lên và gỡ tệp đính kèm',     'ATTACHMENTS'),
    ('22222222-2222-2222-2222-222222222207', 'SUBJECT_MANAGE',    'Quản lý đối tượng liên quan',    'SUBJECTS'),
    ('22222222-2222-2222-2222-222222222208', 'VEHICLE_MANAGE',    'Quản lý phương tiện liên quan',  'VEHICLES'),
    ('22222222-2222-2222-2222-222222222209', 'USER_ROLE_MANAGE',  'Quản lý tài khoản và phân quyền','USERS'),
    ('22222222-2222-2222-2222-222222222210', 'AUDIT_LOG_VIEW',    'Xem nhật ký truy cập hệ thống',  'AUDIT_LOGS');

-- 3. GÁN QUYỀN CHO VAI TRÒ (role_permissions)
INSERT INTO role_permissions (role_id, permission_id) VALUES
    -- INTAKE_OFFICER
    ('11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222201'),
    ('11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222202'),
    -- CASE_OFFICER
    ('11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222202'),
    ('11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222203'),
    ('11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222205'),
    ('11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222206'),
    ('11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222207'),
    ('11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222208'),
    -- CASE_MANAGER
    ('11111111-1111-1111-1111-111111111103', '22222222-2222-2222-2222-222222222202'),
    ('11111111-1111-1111-1111-111111111103', '22222222-2222-2222-2222-222222222204'),
    -- SYSTEM_ADMIN
    ('11111111-1111-1111-1111-111111111104', '22222222-2222-2222-2222-222222222209'),
    ('11111111-1111-1111-1111-111111111104', '22222222-2222-2222-2222-222222222210');

-- 4. TÀI KHOẢN NGƯỜI DÙNG (users - mật khẩu mẫu đã băm bcrypt)
INSERT INTO users (id, username, password_hash, full_name, role_id, is_active) VALUES
    ('33333333-3333-3333-3333-333333333301', 'tiepnhan01', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Nguyễn Văn An',   '11111111-1111-1111-1111-111111111101', TRUE),
    ('33333333-3333-3333-3333-333333333302', 'xuly01',     '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Trần Minh Tâm',   '11111111-1111-1111-1111-111111111102', TRUE),
    ('33333333-3333-3333-3333-333333333303', 'quanly01',   '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Lê Hoàng Phúc',   '11111111-1111-1111-1111-111111111103', TRUE),
    ('33333333-3333-3333-3333-333333333304', 'admin',      '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Quản Trị Viên',   '11111111-1111-1111-1111-111111111104', TRUE),
    ('33333333-3333-3333-3333-333333333305', 'xuly_cu',    '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Phạm Quốc Bảo',   '11111111-1111-1111-1111-111111111102', FALSE);

-- 5. HỒ SƠ VỤ VIỆC (cases)
INSERT INTO cases (id, code, title, occurred_at, location, summary, status, assignee_id) VALUES
    (
        '44444444-4444-4444-4444-444444444401',
        'HS-2026-0001',
        'Mất trộm xe mô tô tại bãi giữ xe Khu A',
        '2026-11-20 08:30:00+07',
        'Bãi giữ xe Khu A, Quận Bình Thạnh, TP.HCM',
        'Người dân trình báo bị mất 01 xe mô tô Honda Vision màu đen tại khu vực cổng B.',
        'IN_PROGRESS',
        '33333333-3333-3333-3333-333333333302'
    ),
    (
        '44444444-4444-4444-4444-444444444402',
        'HS-2026-0002',
        'Trình báo va chạm giao thông bỏ chạy tại giao lộ Điện Biên Phủ',
        '2026-11-22 17:45:00+07',
        'Ngã tư Hàng Xanh, Quận Bình Thạnh, TP.HCM',
        'Tiếp nhận tin báo ban đầu từ người đi đường, đang chờ phân công cán bộ thụ lý.',
        'RECEIVED',
        NULL
    );

-- Đồng bộ sequence để hồ sơ tạo mới tiếp theo có mã HS-2026-0003
SELECT setval('seq_case_code', 2, true);

-- 6. DIỄN BIẾN XỬ LÝ (case_activities)
INSERT INTO case_activities (id, case_id, actor_id, content, old_status, new_status) VALUES
    (
        '55555555-5555-5555-5555-555555555501',
        '44444444-4444-4444-4444-444444444401',
        '33333333-3333-3333-3333-333333333301',
        'Tiếp nhận tin báo và lập hồ sơ ban đầu.',
        NULL,
        'RECEIVED'
    ),
    (
        '55555555-5555-5555-5555-555555555502',
        '44444444-4444-4444-4444-444444444401',
        '33333333-3333-3333-3333-333333333302',
        'Tiếp nhận phân công, tiến hành trích xuất dữ liệu camera cổng B.',
        'RECEIVED',
        'IN_PROGRESS'
    ),
    (
        '55555555-5555-5555-5555-555555555503',
        '44444444-4444-4444-4444-444444444401',
        '33333333-3333-3333-3333-333333333302',
        'Đã lấy lời khai nhân chứng bảo vệ ca trực sáng.',
        NULL,
        NULL
    );

-- 7. TỆP ĐÍNH KÈM (attachments - quản lý riêng theo từng hồ sơ)
INSERT INTO attachments (id, case_id, file_name, file_type, mime_type, size, storage_key, description, uploaded_by, is_removed, removed_by, removed_at) VALUES
    (
        '66666666-6666-6666-6666-666666666601',
        '44444444-4444-4444-4444-444444444401',
        'bien_ban_tiep_nhan_0001.pdf',
        'DOCUMENT',
        'application/pdf',
        245760,
        'cases/44444444-4444-4444-4444-444444444401/bien_ban_tiep_nhan_0001.pdf',
        'Biên bản tiếp nhận trình báo có chữ ký người báo tin',
        '33333333-3333-3333-3333-333333333301',
        FALSE,
        NULL,
        NULL
    ),
    (
        '66666666-6666-6666-6666-666666666602',
        '44444444-4444-4444-4444-444444444401',
        'anh_camera_cong_b.jpg',
        'IMAGE',
        'image/jpeg',
        1048576,
        'cases/44444444-4444-4444-4444-444444444401/anh_camera_cong_b.jpg',
        'Ảnh chụp trích xuất từ camera cổng B lúc 08:25',
        '33333333-3333-3333-3333-333333333302',
        FALSE,
        NULL,
        NULL
    ),
    (
        '66666666-6666-6666-6666-666666666603',
        '44444444-4444-4444-4444-444444444401',
        'video_nham_ngay.mp4',
        'VIDEO',
        'video/mp4',
        5242880,
        'cases/44444444-4444-4444-4444-444444444401/video_nham_ngay.mp4',
        'Tệp tải nhầm ngày, đã đánh dấu gỡ khỏi hồ sơ',
        '33333333-3333-3333-3333-333333333302',
        TRUE,
        '33333333-3333-3333-3333-333333333302',
        '2026-11-20 10:15:00+07'
    );

-- 8. ĐỐI TƯỢNG LIÊN QUAN & BẢNG LIÊN KẾT (subjects, case_subjects)
INSERT INTO subjects (id, full_name, identification_info, extra_info, is_active) VALUES
    (
        '77777777-7777-7777-7777-777777777701',
        'Lê Thị Mai',
        'CCCD: 079198001234',
        'SĐT: 0909123456; Cư trú tại Phường 25, Bình Thạnh',
        TRUE
    ),
    (
        '77777777-7777-7777-7777-777777777702',
        'Nguyễn Văn Hùng',
        'CCCD: 079095009876',
        'Nam, cao khoảng 1m70, mặc áo khoác đen',
        TRUE
    );

INSERT INTO case_subjects (case_id, subject_id, role_in_case, note) VALUES
    ('44444444-4444-4444-4444-444444444401', '77777777-7777-7777-7777-777777777701', 'Người báo tin',     'Chủ sở hữu phương tiện bị mất'),
    ('44444444-4444-4444-4444-444444444401', '77777777-7777-7777-7777-777777777702', 'Đối tượng nghi vấn','Xuất hiện gần khu vực xe trước thời điểm mất'),
    ('44444444-4444-4444-4444-444444444402', '77777777-7777-7777-7777-777777777702', 'Đối tượng liên quan','Dữ liệu dùng chung giữa 2 hồ sơ');

-- 9. PHƯƠNG TIỆN LIÊN QUAN & BẢNG LIÊN KẾT (vehicles, case_vehicles)
INSERT INTO vehicles (id, plate_number, vehicle_type, identification_features, extra_info, is_active) VALUES
    (
        '88888888-8888-8888-8888-888888888801',
        '59B1-678.90',
        'Xe mô tô hai bánh',
        'Honda Vision màu đen nhám, có trầy xước nhẹ ở yếm trái',
        'Số khung: RLHJF5809JY123456',
        TRUE
    ),
    (
        '88888888-8888-8888-8888-888888888802',
        '51H-456.78',
        'Ô tô con',
        'Toyota Vios màu trắng, móp nhẹ cản trước bên phải',
        'Ghi nhận qua camera giao thông',
        TRUE
    );

INSERT INTO case_vehicles (case_id, vehicle_id, note) VALUES
    ('44444444-4444-4444-4444-444444444401', '88888888-8888-8888-8888-888888888801', 'Phương tiện bị mất trộm trong vụ việc'),
    ('44444444-4444-4444-4444-444444444402', '88888888-8888-8888-8888-888888888802', 'Phương tiện liên quan va chạm');

-- 10. NHẬT KÝ TRUY CẬP HỆ THỐNG (audit_logs)
INSERT INTO audit_logs (id, user_id, username, case_id, action, result, ip_address) VALUES
    (
        '99999999-9999-9999-9999-999999999901',
        '33333333-3333-3333-3333-333333333301',
        'tiepnhan01',
        NULL,
        'LOGIN',
        'SUCCESS',
        '192.168.1.10'
    ),
    (
        '99999999-9999-9999-9999-999999999902',
        NULL,
        'taikhoan_khong_ton_tai',
        NULL,
        'LOGIN',
        'FAILED',
        '192.168.1.99'
    ),
    (
        '99999999-9999-9999-9999-999999999903',
        '33333333-3333-3333-3333-333333333301',
        'tiepnhan01',
        '44444444-4444-4444-4444-444444444401',
        'CREATE',
        'SUCCESS',
        '192.168.1.10'
    );