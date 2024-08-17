import React, { useState ,useEffect } from 'react';
import '../css/phongmay.css';
import { Link, Route, Routes,Navigate } from 'react-router-dom';
import NgoaiTroi from '../pagesphongmay/NgoaitroiPage';
import TrongPhong from '../pagesphongmay/TrongphongPage';
import Cofeworking from '../pagesphongmay/CofewokingPage';
import Viparea from '../pagesphongmay/VipPage';
import OrderModal from '../pages/odermodal';
import axios from 'axios';
import { toast } from 'react-toastify';
import ModalChuyenBan from '../Modal/ModalChuyenBan';
import ModalGopBan from '../Modal/ModalGopBan';
const PhongMay = () => {

  // const [tableDetails, setTableDetails] = useState({ banName: '', khuVucName: '' });
  const [banID, setbanID] = useState('');
  const [banName, setBanName] = useState('');
  const [khuVucID, setKhuVucID] = useState('');
  // const [items, setItems] = useState('');
  const [khuVucName, setKhuVucName] = useState('');
  const [orderedProducts, setOrderedProducts] = useState([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [isModalOpenchuyenban, setModalOpenchuyenban] = useState(false);

  // const handleOpenModalchuyenban = () => setModalOpenchuyenban(true);
  const handleCloseModalchuyenban = () => {
    // Xóa dữ liệu khỏi confirmedOrderschuyenban trong localStorage
    localStorage.removeItem('confirmedOrderschuyenban');
    
    // Đóng modal
    setModalOpenchuyenban(false);
  };
  const handleOpenModalchuyenban = () => {
    if (banName && banID && khuVucName) {
      // Đọc dữ liệu từ localStorage
      const bookedTables = JSON.parse(localStorage.getItem('bookedTables')) || [];
      const confirmedOrders = JSON.parse(localStorage.getItem('confirmedOrders')) || [];
  
      console.log('Booked Tables từ localStorage:', bookedTables);
      console.log('Confirmed Orders từ localStorage:', confirmedOrders);
      console.log('Current banID:', banID);
  
      // Chuyển banID thành chuỗi
      const banIDString = String(banID);
  
      // Kiểm tra xem banID có tồn tại trong bookedTables hay không
      const isTableBooked = bookedTables.some(table => String(table.banID) === banIDString);
  
      if (isTableBooked) {
        console.log('Bàn đã có trong bookedTables, mở modal...');
  
        // Lọc tất cả các đơn hàng có banID
        const ordersWithBanID = confirmedOrders.filter(order => String(order.banID) === banIDString);
  
        if (ordersWithBanID.length > 0) {
          // Lấy tất cả các mục (items) từ các đơn hàng có banID
          const itemsForBanID = ordersWithBanID.flatMap(order => order.items);
  
          // Lưu các mục vào confirmedOrderschuyenban
          const confirmedOrderschuyenban = JSON.parse(localStorage.getItem('confirmedOrderschuyenban')) || [];
          confirmedOrderschuyenban.push({ banID,khuVucID, items: itemsForBanID });
          localStorage.setItem('confirmedOrderschuyenban', JSON.stringify(confirmedOrderschuyenban));
  
          // Mở modal
          setModalOpenchuyenban(true);
        } else {
          alert('Không tìm thấy đơn hàng tương ứng với bàn này.');
        }
      } else {
        console.log('Bàn không có trong bookedTables, không thể chuyển.');
        alert('Bàn này chưa được đặt trước, không thể chuyển.');
      }
    } else {
      alert('Vui lòng kiểm tra lại thông tin bàn và khu vực.');
    }
  };
  
  


  
  
  // const [totalAmount, setTotalAmount] = useState(0);

// Hàm đọc thông tin từ localStorage
// const readAllConfirmedOrders  = () => {
//   const storedTableDetails = localStorage.getItem('confirmedOrders');
//   if (storedTableDetails) {
//     const tableDetails = JSON.parse(storedTableDetails);
//     console.log('Table Details from localStorage:', tableDetails); // Để kiểm tra thông tin được lưu
//     setbanID(tableDetails.banID);
//     setKhuVucID(tableDetails.khuVucID);
//     setItems(tableDetails.items);

//   } else {
//     console.log('No table details found in localStorage.');
//   }
// };

  // Hàm lấy thông tin đơn hàng từ localStorage
  const readAllConfirmedOrders = (banID) => {
    try {
      const confirmedOrders = JSON.parse(localStorage.getItem('confirmedOrders')) || [];
      console.log('Tất cả đơn hàng:', confirmedOrders);
  
      const ordersForBan = confirmedOrders.filter(order => order.banID === banID);
  
      if (ordersForBan.length > 0) {
        console.log(`Đơn hàng cho banID ${banID}:`, ordersForBan);
      } else {
        console.log(`Không tìm thấy đơn hàng nào cho banID ${banID}`);
      }
  
      return ordersForBan;
    } catch (error) {
      console.error('Lỗi khi đọc dữ liệu từ localStorage:', error);
      return [];
    }
  };
  
  const openOrderModal = () => {
    // Kiểm tra xem banName và khuVucName đã có dữ liệu chưa
    if (banName || khuVucName || banID ||khuVucID ) {
      // Dữ liệu đã có, mở modal
      console.log('Dữ liệu đã có:', {banID, banName,khuVucID, khuVucName }); // Log dữ liệu ra console
      setIsOrderModalOpen(true);
    } else {
      // Dữ liệu chưa có, thông báo cho người dùng
      alert('Vui lòng chọn bàn trước khi mở đơn hàng.');
    }
  };
  
  const closeOrderModal = () => {
    setIsOrderModalOpen(false);
  };

  const updateData = () => {
    const storedTableDetails = localStorage.getItem('tableDetails');
    if (storedTableDetails) {
      const {banID, banName,khuVucID, khuVucName } = JSON.parse(storedTableDetails);
      setbanID(banID || '');
      setBanName(banName || '');
      setKhuVucID(khuVucID || '');
      setKhuVucName(khuVucName || '');
     } else {
      setbanID('');
      setBanName('');
      setKhuVucID('');
      setKhuVucName('');
    }
  };

  useEffect(() => {
    // Đọc dữ liệu từ local storage khi component mount
    updateData();
 
    // Lắng nghe sự thay đổi của local storage
    const handleStorageChange = () => {
      updateData();
    };

    window.addEventListener('storage', handleStorageChange);
   
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

 
  const updateOrderDetails = () => {
    // Đọc thông tin bàn từ localStorage
    const storedTableDetails = localStorage.getItem('tableDetails');
    if (storedTableDetails) {
      const tableDetails = JSON.parse(storedTableDetails);
      const { banID } = tableDetails;

      // Đọc thông tin đơn hàng từ localStorage
      const confirmedOrders = JSON.parse(localStorage.getItem('confirmedOrders')) || [];
      
      // Tìm tất cả các đơn hàng có banID tương ứng
      const ordersForTable = confirmedOrders.filter(order => order.banID === banID);
     

      if (ordersForTable.length > 0) {
        // Nếu có đơn hàng với cùng banID, lấy thông tin của tất cả các đơn hàng
        const allItems = ordersForTable.flatMap(order => order.items);
        setOrderDetails(allItems); // Cập nhật state với thông tin tất cả đơn hàng
      } else {
        setOrderDetails([]); // Không có đơn hàng cho bàn này
      }
    }
  };

  useEffect(() => {
    updateOrderDetails(); // Cập nhật thông tin đơn hàng khi component mount

    // Thêm sự kiện để cập nhật khi có thay đổi trong localStorage
    window.addEventListener('storage', updateOrderDetails);

    // Dọn dẹp sự kiện khi component unmount
    return () => {
      window.removeEventListener('storage', updateOrderDetails);
    };
  }, []); // Chạy khi component mount
    // Tính tổng hóa đơn
    const calculateTotalAmount = () => {
      return orderDetails.reduce((total, item) => total + (item.SoLuong * item.DonGia), 0);
    };

    const handlePayment = async () => {
      const confirmedOrders = readAllConfirmedOrders(banID);
    
      if (confirmedOrders.length === 0) {
        alert('Không có đơn hàng để thanh toán.');
        return;
      }
    
      try {
        for (const order of confirmedOrders) {
          const { banID, khuVucID, items } = order;
    
          // Kiểm tra dữ liệu
          if (banID === undefined || khuVucID === undefined || !items || !Array.isArray(items)) {
            console.error(`Dữ liệu không hợp lệ cho banID ${banID}`);
            continue; // Bỏ qua đơn hàng này nếu dữ liệu không hợp lệ
          }
    
          console.log('Dữ liệu gửi đi:', {
            banID,
            khuVucID,
            items: items.map(item => ({
              TenSanPham: item.TenSanPham,
              SoLuong: item.SoLuong,
              DonGia: item.DonGia
            }))
          });
    
          // Gửi dữ liệu đến server để thêm hóa đơn
          const response = await axios.post('http://localhost:3001/api/hoadon', {
            banID,
            KhuVucID: khuVucID,
            items: items.map(item => ({
              TenSanPham: item.TenSanPham,
              SoLuong: item.SoLuong,
              DonGia: item.DonGia
            }))
          });
    
          if (response.status === 200) {
          
    
            // Xóa đơn hàng đã thanh toán khỏi localStorage theo banID
            const allOrders = JSON.parse(localStorage.getItem('confirmedOrders')) || [];
            const updatedOrders = allOrders.filter(order => order.banID !== banID);
            localStorage.setItem('confirmedOrders', JSON.stringify(updatedOrders));
              // Xóa bàn khỏi bookedTables nếu thanh toán thành công
              const bookedTables = JSON.parse(localStorage.getItem('bookedTables')) || [];
              const updatedBookedTables = bookedTables.filter(table => table.banID !== banID);
              localStorage.setItem('bookedTables', JSON.stringify(updatedBookedTables));
            const event = new Event('storage');
            window.dispatchEvent(event);
            toast.success('Thanh toán thành công!');
          } else {
          
            alert(`Lỗi khi tạo hóa đơn cho bàn ${banID}: ${response.statusText}`);
          }
        }
      } catch (error) {
        
        alert('Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.');
      }
    };
    
    const handleSubmitchuyenban = (newTable, selectedKhuVuc) => {
      // Lấy thông tin confirmedOrderschuyenban từ localStorage
      const confirmedOrderschuyenban = JSON.parse(localStorage.getItem('confirmedOrderschuyenban')) || [];
    
      if (confirmedOrderschuyenban.length > 0) {
        // Cập nhật thông tin khu vực và bàn mới cho các đơn hàng
        const updatedOrders = confirmedOrderschuyenban.map(order => ({
          // Cập nhật thông tin đơn hàng
          banID: Number(newTable), // Cập nhật bàn mới dưới dạng số
          khuVucID: selectedKhuVuc, // Cập nhật khu vực mới
          items: order.items.map(item => ({
            TenSanPham: item.TenSanPham,
            SoLuong: item.SoLuong,
            DonGia: item.DonGia
          }))
        }));
        localStorage.setItem('updatedConfirmedOrders', JSON.stringify(updatedOrders));
    
        // Lưu updatedOrders vào localStorage mới
        localStorage.setItem('updatedConfirmedOrders', JSON.stringify(updatedOrders));
    
        // Xóa confirmedOrderschuyenban sau khi đã cập nhật
        localStorage.removeItem('confirmedOrderschuyenban');
    
        // Lấy thông tin confirmedOrders từ localStorage
        const allConfirmedOrders = JSON.parse(localStorage.getItem('confirmedOrders')) || [];
    
        // Xóa các đơn hàng đã chuyển bàn khỏi confirmedOrders
        const filteredOrders = allConfirmedOrders.filter(order =>
          !confirmedOrderschuyenban.some(chuyenban => chuyenban.banID === order.banID)
        );
    
        // Thêm updatedOrders vào confirmedOrders
        const finalConfirmedOrders = [...filteredOrders, ...updatedOrders];
        localStorage.setItem('confirmedOrders', JSON.stringify(finalConfirmedOrders));
    
        // Cập nhật bookedTables
        const bookedTables = JSON.parse(localStorage.getItem('bookedTables')) || [];
        const updatedBookedTables = bookedTables.filter(table =>
          !confirmedOrderschuyenban.some(chuyenban => chuyenban.banID === table.banID)
        );
    
        // Thêm bàn mới vào bookedTables nếu chưa có
        const donhangoderid = { banID: Number(newTable) }; // Đảm bảo banID là số
        const isTableBooked = updatedBookedTables.some(table => table.banID === donhangoderid.banID);
    
        if (!isTableBooked) {
          updatedBookedTables.push(donhangoderid);
          localStorage.setItem('bookedTables', JSON.stringify(updatedBookedTables));
        }
    
        // Cập nhật giao diện bằng cách kích hoạt sự kiện lưu trữ
        window.dispatchEvent(new Event('storage'));
    
        // Đóng modal
        setModalOpenchuyenban(false);
        localStorage.removeItem('updatedConfirmedOrders');
        // Thông báo thành công
        alert('Chuyển bàn thành công!');
      } else {
        alert('Không có đơn hàng để chuyển.');
      }
    };
    
    
   // State quản lý việc mở/đóng modal "Gộp Bàn"
   const [isModalOpengopban, setIsModalOpengopban] = useState(false);

   // Hàm mở modal "Gộp Bàn"
   const handleOpenModalgopban = () => {
    if (banName && banID && khuVucName) {
      // Đọc dữ liệu từ localStorage
      const bookedTables = JSON.parse(localStorage.getItem('bookedTables')) || [];
      const confirmedOrders = JSON.parse(localStorage.getItem('confirmedOrders')) || [];
  
      console.log('Booked Tables từ localStorage:', bookedTables);
      console.log('Confirmed Orders từ localStorage:', confirmedOrders);
      console.log('Current banID:', banID);
  
      // Chuyển banID thành chuỗi
      const banIDString = String(banID);
  
      // Kiểm tra xem banID có tồn tại trong bookedTables hay không
      const isTableBooked = bookedTables.some(table => String(table.banID) === banIDString);
  
      if (isTableBooked) {
        console.log('Bàn đã có trong bookedTables, mở modal...');
  
        // Lọc tất cả các đơn hàng có banID
        const ordersWithBanID = confirmedOrders.filter(order => String(order.banID) === banIDString);
  
        if (ordersWithBanID.length > 0) {
          // Lấy tất cả các mục (items) từ các đơn hàng có banID
          const itemsForBanID = ordersWithBanID.flatMap(order => order.items);
  
          // Lưu các mục vào confirmedOrderschuyenban
          const confirmedOrdersgopban = JSON.parse(localStorage.getItem('gopban')) || [];
          confirmedOrdersgopban.push({ banID,khuVucID, items: itemsForBanID });
          localStorage.setItem('gopban', JSON.stringify(confirmedOrdersgopban));
  
          // Mở modal
          setIsModalOpengopban(true);
         
        } else {
          alert('Không tìm thấy đơn hàng tương ứng với bàn này.');
        }
      } else {
        console.log('Bàn không có trong bookedTables, không thể gộp bàn.');
        alert('Bàn này chưa được đặt trước, không thể gộp bàn.');
      }
    } else {
      alert('Vui lòng kiểm tra lại thông tin bàn và khu vực.');
    }
   };
 
   // Hàm đóng modal "Gộp Bàn"
   const handleCloseModalgopban = () => {
     setIsModalOpengopban(false);
     localStorage.removeItem('gopban');
   };
 
   // Hàm xử lý khi submit trong modal "Gộp Bàn"
   const handleSubmitgopban = (banMoi, khuVucDuocChon) => {
    //lấy thông tin từ loca gopban
    const confirmedOrdersgopban = JSON.parse(localStorage.getItem('gopban')) || [];
    if (confirmedOrdersgopban.length > 0) {
      // Cập nhật thông tin khu vực và bàn mới cho các đơn hàng
      const updatedOrdersgopban = confirmedOrdersgopban.map(order => ({
        // Cập nhật thông tin đơn hàng
        banID: Number(banMoi), // Cập nhật bàn mới dưới dạng số
        khuVucID: khuVucDuocChon, // Cập nhật khu vực mới
        items: order.items.map(item => ({
          TenSanPham: item.TenSanPham,
          SoLuong: item.SoLuong,
          DonGia: item.DonGia
        }))
      }));
      localStorage.setItem('updatedConfirmedOrdersgopban', JSON.stringify(updatedOrdersgopban));
   // Lấy thông tin confirmedOrders từ localStorage
   const allConfirmedOrders = JSON.parse(localStorage.getItem('confirmedOrders')) || [];
    
   // Xóa các đơn hàng đã chuyển bàn khỏi confirmedOrders
   const filteredOrdersgopban = allConfirmedOrders.filter(order =>
     !confirmedOrdersgopban.some(chuyenban => chuyenban.banID === order.banID)
   );

   // Thêm updatedOrders vào confirmedOrders
   const finalConfirmedOrdersgopban = [...filteredOrdersgopban, ...updatedOrdersgopban];
   localStorage.setItem('confirmedOrders', JSON.stringify(finalConfirmedOrdersgopban));
   localStorage.removeItem('updatedConfirmedOrdersgopban')

   // Cập nhật bookedTables
   const bookedTables = JSON.parse(localStorage.getItem('bookedTables')) || [];
   const updatedBookedTablesgopban = bookedTables.filter(table =>
     !confirmedOrdersgopban.some(chuyenban => chuyenban.banID === table.banID)
   );
 // Thêm bàn mới vào bookedTables nếu chưa có
 const donhangoderidgopban = { banID: Number(banMoi) }; // Đảm bảo banID là số
 const isTableBooked = updatedBookedTablesgopban.some(table => table.banID === donhangoderidgopban.banID);

 if (!isTableBooked) {
  updatedBookedTablesgopban.push(donhangoderidgopban);
   localStorage.setItem('bookedTables', JSON.stringify(updatedBookedTablesgopban));
 }


     
  
      
  
   
      // Cập nhật giao diện bằng cách kích hoạt sự kiện lưu trữ
      window.dispatchEvent(new Event('storage'));
  
      // Đóng modal
      setModalOpenchuyenban(false);
      localStorage.removeItem('gopban');
      // Thông báo thành công
      alert('Gộp bàn thành công!');
       // Xóa bàn khỏi bookedTables nếu gopban thành công
       const bookedTablesgopban = JSON.parse(localStorage.getItem('bookedTables')) || [];
       const updatedBookedTablesgb = bookedTablesgopban.filter(table => table.banID !== banID);
       localStorage.setItem('bookedTables', JSON.stringify(updatedBookedTablesgb));
     const event = new Event('storage');
     window.dispatchEvent(event);
    } else {
      alert('Không có đơn hàng để chuyển.');
    }
    // Đóng modal sau khi submit
    setIsModalOpengopban(false);
  };
  
  
  
  
    
    
    
    
    
  return(
    <div className="phongmaytong">
      <div className="headrephongmay">
        <div className="khuvucphongmay">
          <Link to="/khuvuc/ngoaitroi">
            <button className="btntieuchuan">Ngoài Trời</button>
          </Link>
          <Link to="/khuvuc/trongphong">
            <button className="btngaming">Trong Phòng</button>
          </Link>
          <Link to="/khuvuc/cofeworking">
            <button className="btnchuyennghiep">Cofe Working </button>
          </Link>
          <Link to="/khuvuc/viparea">
            <button className="btnthidau">VIP Area</button>
          </Link>
        </div>
        <div className="khuvucphongmaytable">
        <Routes>
        <Route path="/" element={<Navigate to="/khuvuc/ngoaitroi" replace />} />
            <Route path="ngoaitroi" element={<NgoaiTroi />} />
            <Route path="trongphong" element={<TrongPhong />} />
            <Route path="cofeworking" element={<Cofeworking />} />
            <Route path="viparea" element={<Viparea />} />
          </Routes>
        </div>
      </div>
      <div className="headrephongmay1">
          <div className="logtenban">
            <h1 className="txttenbanlog">Chọn Bàn: </h1>
        </div>
        <div className="divtrangthailog">
      <div className="tenbanlog">Tên Bàn</div>
      <input
        className="tenbanlog1"
        value={`${banName} - ID ${banID}`}
        readOnly
      />
      <div className="tenbanlog2">Khu Vực</div>
      <input
        className="tenbanlog3"
        value={khuVucName}
        readOnly
      />
    </div>
        <div className="divtrangthailog">
         <button className="btnchuyenban01" onClick={handleOpenModalchuyenban}>Chuyển Bàn</button>
         <ModalChuyenBan
        isOpen={isModalOpenchuyenban}
        onClose={handleCloseModalchuyenban}
        onSubmit={handleSubmitchuyenban}
      
      />
         <button className="btngopban01" onClick={handleOpenModalgopban}>
        Gộp Bàn
      </button>

      <ModalGopBan
        isOpen={isModalOpengopban}
        onClose={handleCloseModalgopban}
        onSubmit={handleSubmitgopban}
      />

        </div>
        <div className="sanphammenu002">
        <div className="tablecontainer002">
      <table className="producttable002">
        <thead className="thead002">
          <tr className="trhead002">
            <th className="th002">STT</th>
            <th className="th002">Tên SP</th>
            <th className="th002">Số Lượng</th>
            <th className="th002">Thành Tiền</th>
          </tr>
        </thead>
        <tbody>
          {orderDetails.map((item, index) => (
            <tr key={index}>
              <td className="td002">{index + 1}</td>
              <td className="td002">{item.TenSanPham}</td>
              <td className="td002">{item.SoLuong}</td>
             
              <td className="td002">{(item.SoLuong * item.DonGia).toLocaleString()} </td>
            </tr>
          ))}
          
        </tbody>
      </table>
    </div>
  </div>
  <div className="tonghoadon">
            <div  className="hoadon001">Tổng Hóa Đơn</div>
          
            <input
  type="text"
  value={`${calculateTotalAmount().toLocaleString()} VND`}
  readOnly
  className="hoadon002"
/>

           
            </div>
        
  <div className="divtrangthailog001">
  <div className="btndatban01">
  <button className="btnoder1" onClick={openOrderModal}>Oder</button>
      {isOrderModalOpen && (
        <OrderModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          banID={banID}
          orderedProducts={orderedProducts}
          setOrderedProducts={setOrderedProducts} // Nếu cần thiết
        />
      )}
   <OrderModal isOpen={isOrderModalOpen} onClose={closeOrderModal} />

        </div>
        <button className="btnthanhtoan01" onClick={handlePayment}>
  Thanh Toán
</button>

        </div>
      
      </div>
    
    </div>
  )
};

export default PhongMay;
