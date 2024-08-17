import React, { useEffect, useState } from 'react';
import image from "../img/banghe.png"
import'../css/Trongphong.css'
import axios from 'axios';
import AddTableModal from '../Modal/modaladdban';
const TrongphongPage = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isQuanTri, setIsQuanTri] = useState(false);
  const [bookedTables, setBookedTables] = useState([]);
  useEffect(() => {
    // Lấy thông tin bàn đã đặt từ localStorage
    const storedBookedTables = JSON.parse(localStorage.getItem('bookedTables')) || [];
    setBookedTables(storedBookedTables);

    // Lấy thông tin bàn từ API hoặc nguồn dữ liệu khác
    // setOutdoorTables(fetchTablesFromAPI());

    // Thêm event listener để cập nhật giao diện khi localStorage thay đổi
    const handleStorageChange = () => {
      const updatedBookedTables = JSON.parse(localStorage.getItem('bookedTables')) || [];
      setBookedTables(updatedBookedTables);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Chạy khi component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.vaitro === 'quantri') {
      setIsQuanTri(true);
    }
  }, []);
  const handleClearTableDetails = () => {
    localStorage.removeItem('tableDetails');

    // Kích hoạt sự kiện 'storage' để thông báo các component khác về sự thay đổi
    const event = new Event('storage');
    window.dispatchEvent(event);
  };


  useEffect(() => {
    // Thực hiện xóa dữ liệu khi component unmount
    return () => {
      handleClearTableDetails();
    };
  }, []);
  useEffect(() => {
    const handleOrderConfirmed = (event) => {
      const { banID } = event.detail;
      console.log('Sự kiện nhận với banID:', banID); // Kiểm tra banID nhận được
      setTables(prevTables =>
        prevTables.map(table =>
          table.banID === banID
            ? { ...table, isOrdered: true } // Cập nhật trạng thái của bàn
            : table
        )
      );
    };
  
    window.addEventListener('orderConfirmed', handleOrderConfirmed);
  
    return () => {
      window.removeEventListener('orderConfirmed', handleOrderConfirmed);
    };
  }, []);
//lấy dữ liệu bàn lên
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/tables");
        setTables(response.data);  // Lưu dữ liệu vào state
        setLoading(false);
        console.log(response.data)
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchTables();
  }, []);
  if (error) return <div>Đã xảy ra lỗi: {error.message}</div>;
  if (loading) return <div>Đang tải dữ liệu...</div>;

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const refreshTables = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/tables");
      setTables(response.data); // Cập nhật state với dữ liệu mới
    } catch (error) {
      setError(error);
    }
  };
  const handleTableClick = (table) => {
    // Xóa thông tin bàn cũ trước khi lưu thông tin mới
    handleClearTableDetails();
  
    // Lưu thông tin bàn mới vào localStorage
    const tableDetails = {
      banID: table.banID,
      banName: table.banName,
      khuVucID: table.khuVucID,
      khuVucName: table.khuVucName || ''
    };
    localStorage.setItem('tableDetails', JSON.stringify(tableDetails));
  
    // Kích hoạt sự kiện 'storage' để thông báo các component khác về sự thay đổi
    const event = new Event('storage');
    window.dispatchEvent(event);
  };
  const outdoorTables = tables.filter(table => table.khuVucID === 1);
  return (
    <div>
    <div className="trongphongpage">
    <div className="trongphongpage1">
    <div className="trongphongpage2">
   <span className="spantext">Room Seating</span>
    {/* Nội dung của trang Tiêu Chuẩn */}
    </div>
    <div className="trongphongpage3">
      <div className="divghichutrongphongcoler"></div>
      <div className="divtextghichutrongphongcoler">Trống</div>
      <div className="divghichutrongphongcoler1"></div>
      <div className="divtextghichutrongphongcoler1">Sử Dụng</div>
      <div className="divghichutrongphongcoler2"></div>
      <div className="divtextghichutrongphongcoler2">Sửa Chữa</div>
      {isQuanTri && (
      <button className="btnaddbantrongphong" onClick={handleShowModal}>Thêm Bàn</button>
      )}
      <AddTableModal show={showModal} handleClose={handleCloseModal} refreshTables={refreshTables} />
    </div>
    <div className="tablebantrongphong">
    {outdoorTables.map(table => (
        <div className={`card ${bookedTables.some(bookedTable => bookedTable.banID === table.banID) ? 'booked' : ''}`}
         key={table.banID}  onClick={() => handleTableClick(table)}>
          <img
            className="imgbanghe"
            src={image} // Thay thế bằng URL hình ảnh thực tế
            alt="banghe"
          />
          <p>{table.banName}</p> {/* Hiển thị tên bàn */}
        </div>
      ))}
   
     
  </div>
  </div>
  </div>
  </div>
  );
};

export default TrongphongPage;
