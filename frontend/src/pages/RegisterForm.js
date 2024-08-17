// src/components/RegisterForm.js
import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import '../css/ReginPage.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    tendangnhap: '',
    matkhau: '',
    hovaten: '',
    email: '',
    sodienthoai: '',
    vaitro: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/register", formData);

      setSuccess(response.data.message);
      
      setError('');
      setFormData({
        tendangnhap: '',
        matkhau: '',
        hovaten: '',
        email: '',
        sodienthoai: '',
        vaitro: ''
    });
    } catch (err) {
      console.error('Error during registration:', err);
      setError(err.response?.data?.message || 'Đã xảy ra lỗi khi gửi yêu cầu.');
      setSuccess('');
    }
  };
  const [roles, setRoles] = useState([]);

  useEffect(() => {
      // Lấy danh sách vai trò từ API khi component được mount
      axios.get('http://localhost:3001/vaitro')
          .then(response => {
              setRoles(response.data);
          })
          .catch(error => {
              console.error('Error fetching roles:', error);
          });
  }, []);


  return (
    <form onSubmit={handleSubmit} className="registerForm">
    <div className="formRow">
      <div className="formColumn">
        <label className="formLabel">
          Tên Đăng Nhập:
          <input
            type="text"
            name="tendangnhap"
            value={formData.tendangnhap}
            onChange={handleChange}
            required
            className="formInput"
          />
        </label>
        <label className="formLabel">
          Mật Khẩu:
          <input
            type="password"
            name="matkhau"
            value={formData.matkhau}
            onChange={handleChange}
            required
            className="formInput"
          />
        </label>
        <label className="formLabel">
          Họ và Tên:
          <input
            type="text"
            name="hovaten"
            value={formData.hovaten}
            onChange={handleChange}
            required
            className="formInput"
          />
        </label>
      </div>
      <div className="formColumn">
        <label className="formLabel">
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="formInput"
          />
        </label>
        <label className="formLabel">
          Số Điện Thoại:
          <input
            type="text"
            name="sodienthoai"
            value={formData.sodienthoai}
            onChange={handleChange}
            className="formInput"
          />
        </label>
        <label className="formLabel">
                Vai Trò:
                <select
                    name="vaitro"
                    value={formData.vaitro}
                    onChange={handleChange}
                    required
                    className="formSelect"
                >
                    <option value="">Chọn vai trò</option>
                    {roles.map(role => (
                        <option key={role.id_vaitro} value={role.id_vaitro}>
                            {role.ten_vaitro}
                        </option>
                    ))}
                </select>
            </label>
      </div>
    </div>
    <button type="submit" className="formButton">Đăng Ký</button>
  
    {success && <p className="successMessage">{success}</p>}
    {error && <p className="errorMessage">{error}</p>}
  </form>
  
  
  
  
  );
};

export default RegisterForm;
