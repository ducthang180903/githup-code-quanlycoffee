import React, { useState, useEffect } from 'react';
import "../css/doanhthu.css"
import axios from 'axios';
const DoanhThu = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
 

  useEffect(() => {
    // Gọi API để lấy dữ liệu hóa đơn
    axios.get('http://localhost:3001/api/hoadon')
      .then(response => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

   // Hàm gọi API tìm kiếm theo khoảng thời gian
   const fetchOrdersByDateRange = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/hoadon/tim-kiem-theo-khoang-thoi-gian', {
        params: { startDate, endDate }
      });
      setOrders(response.data);
      calculateTotalAmount(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
    // Xử lý khi nhấn nút tìm kiếm
    const handleSearch = () => {
        if (startDate && endDate) {
          fetchOrdersByDateRange();
        } else {
          alert('Ngày bắt đầu và ngày kết thúc đều cần phải được cung cấp');
        }
      };
   // Hàm tính tổng tiền
   const calculateTotalAmount = (orders) => {
    let total = 0;
    orders.forEach(order => {
      order.items.forEach(item => {
        total += item.SoLuong * item.DonGia;
      });
    });
    setTotalAmount(total);
  };
  return (
    <div className="containerDoanhthu">
    <div className="dateRangeDoanhthu">
    <label className="dateLabelDoanhthu">
          TuNgay:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="dateInputDoanhthu"
          />
        </label>
        <button className="calculateButtonDoanhthu" onClick={handleSearch}>Doanh Thu</button>
        <label className="dateLabelDoanhthu">
          DenNgay:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="dateInputDoanhthu"
          />
        </label>
    </div>
    <div className="tableWrapperDoanhthu">
      <table className="productsTableDoanhthu">
        <thead className="tableHeadDoanhthu">
          <tr className="tableRowDoanhthu">
            <th className="tableHeaderDoanhthu">Thời Gian</th>
            <th className="tableHeaderDoanhthu">Tên sản phẩm</th>
            <th className="tableHeaderDoanhthu">Số lượng</th>
            <th className="tableHeaderDoanhthu">Đơn giá</th>
          </tr>
        </thead>
        <tbody className="tableBodyDoanhthu">
        {orders.map(order => (
              order.items.map(item => (
                <tr key={`${order.MaHoaDon}-${item.TenSanPham}`} className="tableRowDoanhthu">
                  <td className="tableCellDoanhthu">{new Date(order.NgayHoaDon).toLocaleDateString()}</td>
                  <td className="tableCellDoanhthu">{item.TenSanPham}</td>
                  <td className="tableCellDoanhthu">{item.SoLuong}</td>
                  <td className="tableCellDoanhthu">{item.DonGia.toLocaleString()} VND</td>
                </tr>
              ))
            ))}
        </tbody>
      </table>
    </div>
    <div className="totalAmountContainerDoanhthu">
    {/* <button className="calculateButtonDoanhthu" onClick={fetchOrdersByDateRange}>TinhTongTien</button> */}
        <label className="totalLabelDoanhthu">
          Tổng Thu Nhập
          <input
            type="text"
            value={totalAmount.toLocaleString()}
            readOnly
            className="totalInputDoanhthu"
          />
        </label>
    </div>
  </div>
  
  );
};

export default DoanhThu;
