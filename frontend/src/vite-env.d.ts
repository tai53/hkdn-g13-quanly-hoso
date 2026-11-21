/// <reference types="vite/client" />

// Khai báo kiểu cho biến môi trường VITE_* để dùng import.meta.env có gợi ý và kiểm tra kiểu.
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
