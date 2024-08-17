import React from 'react';
import {  Route, Routes, Navigate,useLocation  } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Phong from './pages/PhongMay';
import ThucDon from './pages/ThucDon';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DoanhThuPage from './pages/Doanhthu';
import NhanVienPage from './pages/nhanvienpage';

import './App.css'; // Thêm file CSS cho App nếu cần

const App = () => {
  const location = useLocation();

  const isLoginPage = location.pathname === '/login';
  return (
   
    <div className="app">
    {!isLoginPage && <Sidebar />}
    <div className={`content ${isLoginPage ? 'full-width' : ''}`}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/khuvuc/*" element={<Phong />} />
    
        <Route path="/thuc-don" element={<ThucDon />} />
        <Route path="/doanhthu" element={<DoanhThuPage />} />
        <Route path="/nhanvien" element={<NhanVienPage />} />
      </Routes>
    </div>
  </div>
   
  );
};

export default App;
