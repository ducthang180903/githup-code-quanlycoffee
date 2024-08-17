import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/gopban.css"
const ModalGopBan = ({ isOpen, onClose, onSubmit }) => {
  const [banMoi, setBanMoi] = useState('');
  const [khuVucDuocChon, setKhuVucDuocChon] = useState('');
  const [khuVucOptions, setKhuVucOptions] = useState([]);
  const [tables, setTables] = useState([]);
  const [filteredTables, setFilteredTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
//api
 // Fetch khu vuc options
 useEffect(() => {
    const fetchKhuVuc = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/khuvuc');
        setKhuVucOptions(response.data); // Update khu vuc options
      } catch (error) {
        console.error('Lỗi khi lấy danh sách khu vực:', error);
      }
    };

    fetchKhuVuc();
  }, []);

  // Fetch tables and use localStorage
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/tables');
        // Store data into localStorage
        localStorage.setItem('tablesData', JSON.stringify(response.data));
        setTables(response.data); // Set data to state
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

 // Filter tables based on selected khu vực
 useEffect(() => {
    if (khuVucDuocChon) {
      const filtered = tables.filter(table => table.khuVucID === parseInt(khuVucDuocChon, 10));
      console.log('Filtered Tables:', filtered);
      setFilteredTables(filtered);
    } else {
      setFilteredTables([]);
    }
  }, [khuVucDuocChon, tables]);

  const handleTableChange = (e) => {
    const value = e.target.value;
    console.log('Selected Table:', value); // Log giá trị bàn được chọn
    
    // Cập nhật giá trị mới
    setBanMoi(value);
  
    // Lưu giá trị dưới dạng đối tượng JSON với khóa "banID"
    const tableObject = { banID: parseInt(value) };
    localStorage.setItem('banID', JSON.stringify(tableObject));
  };
  
  
  const handleKhuVucChange = (e) => {
    const value = e.target.value;
    console.log('Selected Khu Vuc:', value); // Log giá trị khu vực được chọn
    setKhuVucDuocChon(value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(banMoi, khuVucDuocChon); // Gọi hàm onSubmit khi form được submit
  };

  if (!isOpen) {
    return null; // Nếu modal không mở, không hiển thị gì cả
  }
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong: {error.message}</p>;

  return (
    <div className="modalGopBan">
      <div className="modalContentGopBan">
        <h2>Gộp Bàn</h2>
        <form onSubmit={handleFormSubmit}>
        <label htmlFor="khuVuc" className="modallabelchuyenban">Chọn Khu vực muốn gộp bàn</label>
      <select
        id="khuVuc"
        value={khuVucDuocChon}
        onChange={handleKhuVucChange}
        className="modalselectchuyenban"
      >
        <option value="" disabled>Chọn khu vực muốn gộp bàn</option>
        {khuVucOptions.map((option) => (
          <option key={option.KhuVucID} value={option.KhuVucID}>
      {option.KhuvucID} -{option.KhuvucName}
          </option>
        ))}
      </select>

      <label htmlFor="ban" className="modallabelgopban">Chọn bàn muốn gộp</label>
      <select
        id="ban"
        value={banMoi}
        onChange={handleTableChange}
        className="modalselectgopban"
      >
        <option value="" disabled>Chọn bàn</option>
        {filteredTables.map((table) => (
        <option key={table.banID} value={table.banID}>
                       {table.banID}-{table.banName} 
        </option>
      ))}
      </select>
          <button className="modalbuttongopban" type="submit"  onClick={handleFormSubmit}>Gop</button>
          <button className="modalbuttongopban" onClick={onClose}>Huy</button>
        </form>
      </div>
    </div>
  );
};

export default ModalGopBan;
