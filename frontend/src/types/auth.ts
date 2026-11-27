
/** Dữ liệu gửi đến API đăng nhập. */
export interface LoginInput {
  username: string;
  password: string;
}

/** Vai trò của tài khoản. */
export interface AuthRole {
  code: string;
  name: string;
}

/** Thông tin người dùng do Backend trả về. */
export interface AuthUser {
  id: string;
  username: string;
  full_name: string;
  role: AuthRole;
}

/** Kết quả đăng nhập thành công. */
export interface LoginResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  user: AuthUser;
}

/** Kết quả đăng xuất thành công. */
export interface LogoutResponse {
  message: string;
}

/** Phiên đăng nhập được quản lý ở Frontend. */
export interface AuthSession {
  accessToken: string;
  expiresAt: number;
  user: AuthUser;
}
