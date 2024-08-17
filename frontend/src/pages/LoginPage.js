import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../css/LoginPage.css'; // Import CSS file

const LoginPage = () => {
  const [formData, setFormData] = useState({
    tendangnhap: '',
    matkhau: ''
});
const navigate = useNavigate();
const [, setUser] = useState(null); // State để lưu thông tin người dùng
const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
      const response = await axios.post("http://localhost:3001/login", formData);
      
      // Lưu thông tin người dùng vào state và localStorage
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      toast.success('Đăng nhập thành công');
      
      // Điều hướng tới trang home sau 2 giây
      setTimeout(() => {
          navigate('/khuvuc');
      }, 2000);
  } catch (error) {
      console.error('Error response:', error.response);
      toast.error(`Có lỗi xảy ra: ${error.response ? error.response.data.message : error.message}`);
  }
};

return (
  
  <div className="loginContainer">

  <h1>LOGIN</h1>
  <form onSubmit={handleSubmit} className="loginForm">
    <div className="inputContainer">
      <input
        type="text"
        name="tendangnhap"
        placeholder="Tên đăng nhập"
        value={formData.tendangnhap}
        onChange={handleChange}
        required
      />
      <label className={formData.tendangnhap ? "filled" : ""}>Tên đăng nhập</label>
    </div>
    <div className="inputContainer">
      <input
        type="password"
        name="matkhau"
        placeholder="Mật khẩu"
        value={formData.matkhau}
        onChange={handleChange}
        required
      />
      <label className={formData.matkhau ? "filled" : ""}>Mật khẩu</label>
    </div>
    <div>
      <p className="textchaomung">Chào mừng đến với Ứng dụng của chúng tôi!
  
        Ứng dụng được phát triển bởi FB: Đức Thắng</p>
   
    </div>
    <button type="submit">Đăng nhập</button>
  </form>
</div>
);
};

export default LoginPage;
