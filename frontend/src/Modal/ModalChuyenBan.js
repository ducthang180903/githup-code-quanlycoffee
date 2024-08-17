// ModalChuyenBan.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/chuyenbanmodal.css'

const ModalChuyenBan = ({ isOpen, onClose, onSubmit }) => {
    const [newTable, setNewTable] = React.useState('');
    const [selectedKhuVuc, setSelectedKhuVuc] = React.useState('');
    const [khuVucOptions, setKhuVucOptions] = useState([]);
    const [tables, setTables] = useState([]);
    const [filteredTables, setFilteredTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
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
      if (selectedKhuVuc) {
        const filtered = tables.filter(table => table.khuVucID === parseInt(selectedKhuVuc, 10));
        console.log('Filtered Tables:', filtered);
        setFilteredTables(filtered);
      } else {
        setFilteredTables([]);
      }
    }, [selectedKhuVuc, tables]);
    
    const handleTableChange = (e) => {
        const value = e.target.value;
        console.log('Selected Table:', value); // Log giá trị bàn được chọn
        
        // Cập nhật giá trị mới
        setNewTable(value);
      
        // Lưu giá trị dưới dạng đối tượng JSON với khóa "banID"
        const tableObject = { banID: parseInt(value) };
        localStorage.setItem('banID', JSON.stringify(tableObject));
      };
      
      
      const handleKhuVucChange = (e) => {
        const value = e.target.value;
        console.log('Selected Khu Vuc:', value); // Log giá trị khu vực được chọn
        setSelectedKhuVuc(value);
      };
      
      const handleSubmit = () => {
        // Log giá trị trước khi gọi onSubmit
        console.log('Submitting with Table:', newTable); 
        console.log('Submitting with Khu Vuc:', selectedKhuVuc);
      
        // Gọi hàm onSubmit với các giá trị
        onSubmit(newTable, selectedKhuVuc);
        window.dispatchEvent(new Event('storage'));
      };
      

    if (!isOpen) return null;
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong: {error.message}</p>;

  return (
    <div className="modaloverlaychuyenban">
      <div className="modalcontentchuyenban">
        <h2 className="modalheadingchuyenban">Chuyển Bàn</h2>
        <label htmlFor="khuVuc" className="modallabelchuyenban">Chọn Khu vực</label>
      <select
        id="khuVuc"
        value={selectedKhuVuc}
        onChange={handleKhuVucChange}
        className="modalselectchuyenban"
      >
        <option value="" disabled>Chọn khu vực</option>
        {khuVucOptions.map((option) => (
          <option key={option.KhuVucID} value={option.KhuVucID}>
      {option.KhuvucID} -{option.KhuvucName}
          </option>
        ))}
      </select>

      <label htmlFor="ban" className="modallabelchuyenban">Chọn Bàn</label>
      <select
        id="ban"
        value={newTable}
        onChange={handleTableChange}
        className="modalselectchuyenban"
      >
        <option value="" disabled>Chọn bàn</option>
        {filteredTables.map((table) => (
        <option key={table.banID} value={table.banID}>
                       {table.banID}-{table.banName} 
        </option>
      ))}
      </select>
        <button onClick={handleSubmit} className="modalbuttonchuyenban">Xác nhận</button>
        <button onClick={onClose} className="modalbuttonchuyenban">Đóng</button>
      </div>
    </div>
  );
};

export default ModalChuyenBan;
