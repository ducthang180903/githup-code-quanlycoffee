import React, { useState, useEffect } from 'react';
import axios from 'axios';
import'../css/nhanvien.css'
const EmployeeManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isQuanTri, setIsQuanTri] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        ten: '',
        email: '',
        gioiTinh: 'Nam',
        vaitro: '',
        ngayVaoLam: '',
      });
      const [file, setFile] = useState(null);

      useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.vaitro === 'quantri') {
          setIsQuanTri(true);
        }
      }, []);

    useEffect(() => {
      const fetchEmployees = async () => {
        try {
          const response = await axios.get('http://localhost:3001/api/nhanvien');
          setEmployees(response.data);
        } catch (error) {
          console.error('Error fetching employees:', error);
        }
      };
  
      fetchEmployees();
    }, []);
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
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
      const handleFileChange = (e) => {
        setFile(e.target.files[0]);
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = new FormData();
        data.append('ten', formData.ten);
        data.append('email', formData.email);
        data.append('gioiTinh', formData.gioiTinh);
        data.append('vaitro', formData.vaitro);
        data.append('ngayVaoLam', formData.ngayVaoLam);
        if (file) {
            data.append('anh', file);
        }
    
        try {
            // Thêm nhân viên
            await axios.post('http://localhost:3001/api/nhanvien', data);
    
            // Làm sạch formData
            setFormData({
                ten: '',
                email: '',
                gioiTinh: 'Nam', // Hoặc giá trị mặc định bạn muốn
                vaitro: '',
                ngayVaoLam: '',
                anh: null,
            });
    
            // Làm sạch tệp
            setFile(null);
    
            // Đóng modal sau khi thêm nhân viên thành công
            closeModal();
    
            // Tải lại danh sách nhân viên
            const response = await axios.get('http://localhost:3001/api/nhanvien');
            setEmployees(response.data);
        } catch (error) {
            console.error('Error adding employee:', error);
        }
    };
    
    
      const deleteEmployee = async (id) => {
        try {
          const response = await axios.delete(`http://localhost:3001/api/nhanvien/${id}`);
          console.log(response.data.message); // Log message from server
          setEmployees(employees.filter(emp => emp.id !== id));
        } catch (error) {
          console.error('Error deleting employee:', error);
        }
      };
      const openEditModal = (employee) => {
        setSelectedEmployee(employee);
        setFormData({
            ten: employee.ten,
            email: employee.email,
            gioiTinh: employee.gioiTinh,
            vaitro: employee.vaitro,
            ngayVaoLam: employee.ngayVaoLam,
            anh: employee.anh,
          });
        setIsEditModalOpen(true);
      };
    
      const closeModals = () => {
        setIsModalOpen(false);
        setIsEditModalOpen(false);
        setSelectedEmployee(null);
      };
      const handleFileChangeedit = (e) => {
        setFormData({ ...formData, anh: e.target.files[0] });
      };
    
      const handleChangeedit = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      //xủa nv
      const handleSubmitedit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        
        for (const key in formData) {
          data.append(key, formData[key]);
        }
        
        try {
          if (selectedEmployee) {
            // Update employee
            await axios.put(`http://localhost:3001/api/nhanvien/${selectedEmployee.id}`, data);
          }
          
          // Reload employee data after updating
          const response = await axios.get('http://localhost:3001/api/nhanvien');
          setEmployees(response.data);
          closeModals();
        } catch (error) {
          console.error('Error submitting form:', error);
        }
      };
      //tìm kiếm
      const handleSearch = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/api/nhanvien/search?name=${searchTerm}`);
          setEmployees(response.data);
        } catch (error) {
          console.error('Error searching employees:', error);
        }
      };
    
  return (
    <div className="employeeManagementContainer">
      <h2 className="employeeTitle">Danh Sách Nhân Viên</h2>
    <div className="chucnangnhanvien">
    {isQuanTri && (
        <button className="btnaddnhanvien" onClick={openModal}>Thêm nhân viên</button>
    )}
        <div className="timkiemnv">
        <input
       type="text"
       placeholder="Tìm kiếm theo tên..."
       value={searchTerm}
       onChange={(e) => setSearchTerm(e.target.value)}

      className="nhapnvtim"
     
       
      />
      <button className="btntimkiemnv" onClick={handleSearch}>Tìm kiếm</button>
        </div>
        </div>  
        <div className="employeeCards001">
      <div className="employeeCards">
  {employees.map(employee => (
    <div className="employeeCard" key={employee.id}>
      <img className="employeeImage" src={employee.anh} alt={employee.ten} />
      <div className="employeeDetails">
        <h3>{employee.ten}</h3>
        <p><strong></strong> {employee.email}</p>
        <p><strong>Giới Tính:</strong> {employee.gioiTinh}</p>
        <p><strong>Chức Vụ:</strong> {employee.vaitro}</p>
        <p><strong>Ngày Vào Làm:</strong> {employee.ngayVaoLam}</p>
      </div>
      {isQuanTri && (
      <button className="btnxoanhanvien" onClick={() => deleteEmployee(employee.id)}>Xóa</button>
    )}
      {isQuanTri && (
      <button className="btnsuanhanvien"onClick={() => openEditModal(employee)}>sửa</button>
      )}
    </div>
  ))}
</div>
</div>
{isModalOpen && (
  <div className="modalOverlayaddnv" onClick={closeModal}>
    <div className="modalContentaddnv" onClick={(e) => e.stopPropagation()}>
      <button className="modalCloseaddnv" onClick={closeModal}>×</button>
      <h2>Thêm Nhân Viên</h2>
      <form onSubmit={handleSubmit}>
          <label>
            Tên:
            <input type="text" name="ten" className="modalInputaddnv" value={formData.ten} onChange={handleChange} required />
          </label>
          <label>
            Email:
            <input type="email" name="email" className="modalInputaddnv" value={formData.email} onChange={handleChange} required />
          </label>
          <label>
            Giới Tính:
            <select name="gioiTinh" className="modalSelectaddnv" value={formData.gioiTinh} onChange={handleChange} required>
              <option value="Nam">Nam</option>
              <option value="Nu">Nữ</option>
              <option value="Khac">Khác</option>
            </select>
          </label>
          <label>
            Chức Vụ:
            <select name="vaitro" className="modalSelectaddnv" value={formData.vaitro} onChange={handleChange} required>
              <option value="">Chọn chức vụ</option>
              {roles.map(role => (
                <option key={role.id_vaitro} value={role.id_vaitro}>
                  {role.ten_vaitro}
                </option>
              ))}
            </select>
          </label>
          <label>
            Ngày Vào Làm:
            <input type="date" name="ngayVaoLam" className="modalInputaddnv" value={formData.ngayVaoLam} onChange={handleChange} required />
          </label>
          <label>
            Ảnh:
            <input type="file" name="anh" className="modalFileaddnv" onChange={handleFileChange} accept="image/*" />
          </label>
          <button type="submit" className="modalSubmitaddnv">Thêm</button>
        </form>
    </div>
  </div>
)}
 {isEditModalOpen && (
        <div className="modalOverlayEdit" onClick={closeModals}>
          <div className="modalContentEdit" onClick={(e) => e.stopPropagation()}>
            <button className="modalCloseEdit" onClick={closeModals}>×</button>
            <h2>Chỉnh Sửa Nhân Viên</h2>
            <form onSubmit={handleSubmitedit}>
              <label>
                Tên:
                <input type="text" name="ten" className="modalInputEdit" value={formData.ten} onChange={handleChangeedit} required />
              </label>
              <label>
                Email:
                <input type="email" name="email" className="modalInputEdit" value={formData.email} onChange={handleChangeedit} required />
              </label>
              <label>
                Giới Tính:
                <select name="gioiTinh" className="modalSelectEdit" value={formData.gioiTinh} onChange={handleChangeedit} required>
                  <option value="Nam">Nam</option>
                  <option value="Nu">Nữ</option>
                  <option value="Khac">Khác</option>
                </select>
              </label>
              <label>
                Chức Vụ:
                <select name="vaitro" className="modalSelectEdit" value={formData.vaitro} onChange={handleChangeedit} required>
                  <option value="">Chọn chức vụ</option>
                  {roles.map(role => (
                    <option key={role.id_vaitro} value={role.id_vaitro}>
                      {role.ten_vaitro}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Ngày Vào Làm:
                <input type="date" name="ngayVaoLam" className="modalInputEdit" value={formData.ngayVaoLam} onChange={handleChangeedit} required />
              </label>
              <label>
                Ảnh:
                <input type="file" name="anh" className="modalFileEdit" onChange={handleFileChangeedit} accept="image/*" />
              </label>
              <button type="submit" className="modalSubmitEdit">Cập Nhật</button>
            </form>
          </div>
        </div>
      )}

    </div>
    
  );
};

export default EmployeeManagement;
