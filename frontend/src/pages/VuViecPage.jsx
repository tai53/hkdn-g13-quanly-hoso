import { useEffect, useState } from 'react';
import { getVuViecList } from '../api/vuViec.api';

export default function VuViecPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getVuViecList()
      .then(setItems)
      .catch((e) => setError(e.response?.data?.message || e.message));
  }, []);

  return (
    <section>
      <h2>Danh sách vụ việc</h2>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Mã</th>
            <th>Tiêu đề</th>
            <th>Trạng thái</th>
            <th>Ngày tiếp nhận</th>
          </tr>
        </thead>
        <tbody>
          {items.map((v) => (
            <tr key={v.id}>
              <td>{v.ma_vu_viec}</td>
              <td>{v.tieu_de}</td>
              <td>{v.trang_thai}</td>
              <td>{new Date(v.ngay_tiep_nhan).toLocaleDateString('vi-VN')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
