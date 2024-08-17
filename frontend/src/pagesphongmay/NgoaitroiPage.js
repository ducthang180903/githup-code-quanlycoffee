import React, { useState, useEffect } from 'react';
import'../css/NgoaiTroi.css'
import image from "../img/banghe.png"
import axios from 'axios';

import AddTableModal from '../Modal/modaladdban';
const NgoaitroiPage = () => {
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
  
    // Thêm event listener để cập nhật giao diện khi localStorage thay đổi
    const handleStorageChange = () => {
      const updatedBookedTables = JSON.parse(localStorage.getItem('bookedTables')) || [];
      setBookedTables(updatedBookedTables);
    };
  
    window.addEventListener('storage', handleStorageChange);
  
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
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
         // Lưu dữ liệu vào localStorage
         localStorage.setItem('tablesData', JSON.stringify(response.data));
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
  

 // ngoaitroi.js

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

  // Lấy thông tin đơn hàng từ localStorage
  const confirmedOrders = JSON.parse(localStorage.getItem('confirmedOrders')) || [];
  const orderForTable = confirmedOrders.find(order => order.banID === table.banID);

  if (orderForTable) {
    console.log('Thông tin đơn hàng:', orderForTable);
    // Cập nhật giao diện hoặc state để hiển thị thông tin đơn hàng
    // Ví dụ: setOrderDetails(orderForTable.items);
  } else {
    console.log('Không có đơn hàng cho bàn này.');
    // Xử lý khi không có đơn hàng cho bàn này nếu cần
  }

  // Kích hoạt sự kiện 'storage' để thông báo các component khác về sự thay đổi
  const event = new Event('storage');
  window.dispatchEvent(event);
};





  const outdoorTables = tables.filter(table => table.khuVucID === 2);
  return (
    <div>
      <div className="ngoaitroipage">
      <div className="ngoaitroipage1">
      <div className="ngoaitroipage2">
     <span className="spantext">Outdoor Seating</span>
      {/* Nội dung của trang Tiêu Chuẩn */}
      </div>
      <div className="ngoaitroipage3">
        <div className="divghichucoler"></div>
        <div className="divtextghichucoler">Trống</div>
        <div className="divghichucoler1"></div>
        <div className="divtextghichucoler1">Sử Dụng</div>
        <div className="divghichucoler2"></div>
        <div className="divtextghichucoler2">Sửa Chữa</div>
        {isQuanTri && (
        <button className="btnaddban" onClick={handleShowModal}>Thêm Bàn</button>
        )}
        <AddTableModal show={showModal} handleClose={handleCloseModal} refreshTables={refreshTables} />
      </div>
      <div className="tableban">
      {outdoorTables.map(table => (
        <div
          className={`card ${bookedTables.some(bookedTable => bookedTable.banID === table.banID) ? 'booked' : ''}`}// Thay đổi class nếu bàn đã được đặt
          key={table.banID}
          onClick={() => handleTableClick(table)}
        >
          <img
            className="imgbanghe"
            src={image} // Thay thế bằng URL hình ảnh thực tế
            alt="banghe"
          />
          <p>{table.banName}</p>
        </div>
      ))}
    </div>
    </div>
    </div>
    </div>
  );
};

export default NgoaitroiPage;
