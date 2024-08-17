import React, { useState, useEffect } from 'react';
import '../css/modaladdban.css'; // Tạo file CSS riêng cho modal
import axios from 'axios';
const AddTableModal = ({ show, handleClose, refreshTables }) => {
  const [tableName, setTableName] = useState('');
  const [khuVucID, setKhuVucID] = useState('');
//   const [areaID, setAreaID] = useState('');
  const [khuVucOptions, setKhuVucOptions] = useState([]);

  //add ban
  const handleAddTable = async () => {
    // Kiểm tra dữ liệu đầu vào
    if (!tableName || !khuVucID) {
      alert('Vui lòng nhập đầy đủ thông tin: Tên bàn và khu vực.');
      return; // Ngừng thực hiện nếu dữ liệu không hợp lệ
    }
  
    try {
      const newTable = { banName: tableName, khuvucID: parseInt(khuVucID, 10) };
      await axios.post('http://localhost:3001/api/tables', newTable);
      refreshTables();  // Gọi lại hàm để làm mới danh sách bàn
      handleClose();
    } catch (error) {
      console.error('Lỗi khi thêm bàn:', error);
    }
  };

  useEffect(() => {
    // Hàm để lấy danh sách khu vực từ API
    const fetchKhuVuc = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/khuvuc');
        setKhuVucOptions(response.data); // Cập nhật danh sách khu vực
      } catch (error) {
        console.error('Lỗi khi lấy danh sách khu vực:', error);
      }
    };

    fetchKhuVuc();
  }, []);

  if (!show) {
    return null;
  }

  return (
    <div className="modalBackdrop001">
      <div className="modalContainer001">
        <div className="modalHeader001">
          <h2 className="modalTitle001">Thêm Bàn Mới</h2>
          <button onClick={handleClose} className="closeButton001">&times;</button>
        </div>
        <div className="modalBody001">
          <form className="form001">
            <div className="formGroup001">
              <label className="formLabel001">Tên Bàn</label>
              <input 
                type="text" 
                placeholder="Nhập tên bàn" 
                value={tableName} 
                onChange={(e) => setTableName(e.target.value)} 
                className="formControl001"
              />
            </div>
            <div className="formGroup001">
        <label className="formLabel001">Khu Vực</label>
        <select
          value={khuVucID}
          onChange={(e) => setKhuVucID(e.target.value)}
          className="formControl001809"
        >
          <option value="" disabled>Chọn khu vực</option>
          {khuVucOptions.map((option) => (
            <option key={option.KhuVucID}
             value={option.KhuVucID}>
              {option.KhuvucID} - {option.KhuvucName}
            </option>
          ))}
        </select>
      </div>

          </form>
        </div>
        <div className="modalFooter001">
          <button onClick={handleClose} className="button001">Đóng</button>
          <button onClick={handleAddTable} className="button001">Thêm Bàn</button>
        </div>
      </div>
    </div>
  );
};

export default AddTableModal;
