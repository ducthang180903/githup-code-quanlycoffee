import React, { useState, useEffect } from 'react';
import { useNavigate  } from 'react-router-dom';
import '../css/Sidebar.css';
import userImage from '../img/iconavt.png';
import iconmay from '../img/iconbantron.png';
import iconmenu from '../img/iconmenu.png';
import icondoanhthu from '../img/icondoanhthu.png';
import icconnhanvien from '../img/iconnhanvien.png';
import iconavt from '../img/avata.png';
import Modal from 'react-modal';
import RegisterForm from '../pages/RegisterForm'; 
Modal.setAppElement('#root');
const Sidebar = () => {
  
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [selectedButton, setSelectedButton] = useState('');
  // const navigateTo = (path) => {
  //   navigate(path);
  // };

  const handleButtonClick = (path) => {
    setSelectedButton(path); // Cập nhật nút đang được chọn
    navigate(path); // Điều hướng đến đường dẫn
  };
  const handleLogout = () => {
    
      // Clear all data
      localStorage.clear();
      sessionStorage.clear();
      // Redirect to login page
      navigate('/login');
    
  };
  // open và clos modal logout
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
    // open và clos modal dangky
    const openModal1 = () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.vaitro === 'quantri') {
        setIsModalOpen1(true);
      } else {
        alert('Bạn không có quyền truy cập để đăng ký tài khoản mới.');
      }
    };
  
    
  
    const closeModal1 = () => {
      setIsModalOpen1(false);
    };

    const [user, setUser] = useState(null);

    useEffect(() => {
        // Lấy thông tin người dùng từ localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    if (!user) {
        return <div>Đang tải thông tin...</div>;
    }
  return (
    <div className="sidebar">
      <div className="brand">
      <img   className="brandLogo"  src={userImage} alt="dinningtable" />
      <span className="textgameroom">COFFEE</span>
      </div>
      <div className="btndangkytk">
        <button className="btndk" onClick={openModal1}>+ Create new</button>
      </div>
      <hr></hr>
      <ul className="menu">
      <li>
        <button
          className={`btnphongmay ${selectedButton === '/khuvuc' ? 'active' : ''}`}
          onClick={() => handleButtonClick('/khuvuc')}
        >
          <img className="iconmay" src={iconmay} alt="dinningtable" />
          <h1 className="textphongmay">Khu Vực</h1>
        </button>
      </li>
      <li>
        <button
          className={`btnphongmay ${selectedButton === '/thuc-don' ? 'active' : ''}`}
          onClick={() => handleButtonClick('/thuc-don')}
        >
          <img className="iconmenu" src={iconmenu} alt="menu" />
          <h1 className="textmenu">Thực Đơn</h1>
        </button>
      </li>
      <li>
        <button
          className={`btnphongmay ${selectedButton === '/doanhthu' ? 'active' : ''}`}
          onClick={() => handleButtonClick('/doanhthu')}
        >
          <img className="iconmenu" src={icondoanhthu} alt="doanhthu" />
          <h1 className="textmenu">Doanh Thu</h1>
        </button>
      </li>
      <li>
        <button
          className={`btnphongmay ${selectedButton === '/nhanvien' ? 'active' : ''}`}
          onClick={() => handleButtonClick('/nhanvien')}
        >
          <img className="iconmenu" src={icconnhanvien} alt="nhanvien" />
          <h1 className="textmenu">Nhân Viên</h1>
        </button>
      </li>
      <li>
        {/* <button
          className={`btnphongmay ${selectedButton === '/banhang' ? 'active' : ''}`}
          onClick={() => handleButtonClick('/thuc-don')}
        >
          <img className="iconmenu" src={iconmenu} alt="menu" />
          <h1 className="textmenu">Thực Đơn</h1>
        </button> */}
      </li>
      </ul>
      <hr></hr>
      <div className="btndangkytk">
        <button className="btnout" onClick={openModal}>- LogOut</button>
      </div>
      <div className="usuario">
            <img className="iconavt" src={iconavt} alt="Avatar" />
            <div className="infousuario">
                <div className="nombreemail">
                    <span className="nombre">{user.hovaten}</span>
                </div>
                <span className="email">Chức vụ: {user.vaitro}</span>
            </div>
        </div>
    <Modal 
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Confirm Logout"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Bạn có chắc chắn muốn thoát?</h2>
        <button onClick={handleLogout}>Có</button>
        <button onClick={closeModal}>Không</button>
      </Modal>

      {/* Modal đăng ký */}
      <Modal
        isOpen={isModalOpen1}
        onRequestClose={closeModal1}
        contentLabel="Register"
        className="modal"
        overlayClassName="overlay"
      >
          <button className="btnmodal1dong" onClick={closeModal1}>X</button>
        <h2>Đăng Ký</h2>
        <RegisterForm />
      
      </Modal>
    </div>
  );
};

export default Sidebar;
