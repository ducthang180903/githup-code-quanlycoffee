// OrderModal.js
import React, { useState, useEffect } from 'react';
import '../css/OrderModal.css'; // Đảm bảo rằng bạn có CSS cho modal
import axios from 'axios';
import { toast } from 'react-toastify';
const OrderModal = ({ isOpen, onClose}) => {
  
    
    const [loaiSanPham, setLoaiSanPham] = useState([]);
    const [selectedLoaiSanPham, setSelectedLoaiSanPham] = useState('');
    const [products, setProducts] = useState([]);
    const [orderedProducts, setOrderedProducts] = useState([]);
    const [banID, setBanID] = useState(null);
    // const [khuVucName, setKhuVucName] = useState(null);
    const [khuVucID, setKhuVucID] = useState(null);

  
 // Hàm đọc thông tin từ localStorage
  const readTableDetailsFromLocalStorage = () => {
    const storedTableDetails = localStorage.getItem('tableDetails');
    if (storedTableDetails) {
      const tableDetails = JSON.parse(storedTableDetails);
      console.log('Table Details from localStorage:', tableDetails); // Để kiểm tra thông tin được lưu
      setBanID(tableDetails.banID);

      setKhuVucID(tableDetails.khuVucID);
    } else {
      console.log('No table details found in localStorage.');
    }
  };

// Đọc thông tin bàn khi component được mount
useEffect(() => {
  // Đọc thông tin bàn khi component được mount
  readTableDetailsFromLocalStorage();

  // Lắng nghe sự kiện 'storage' để cập nhật dữ liệu khi localStorage thay đổi
  const handleStorageChange = () => {
    readTableDetailsFromLocalStorage();
  };

  window.addEventListener('storage', handleStorageChange);

  // Cleanup function để gỡ bỏ event listener khi component unmount
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
}, []); // 


    const handleLoaiSanPhamClick = (loai) => {
        setSelectedLoaiSanPham(loai);
      };
      const handleShowAllProducts = () => {
        setSelectedLoaiSanPham(''); // Đặt selectedLoaiSanPham là trống để hiển thị tất cả sản phẩm
      };
      useEffect(() => {
        // Gọi API để lấy loại sản phẩm bằng axios
        axios.get('http://localhost:3001/api/loaisanpham')
          .then(response => {
            setLoaiSanPham(response.data);
          })
          .catch(error => {
            console.error('Error fetching LoaiSanPham:', error);
          });
      }, []);

      useEffect(() => {
        // Gọi API để lấy dữ liệu sản phẩm
        axios.get('http://localhost:3001/api/sanpham')
          .then(response => {
            setProducts(response.data);
          })
          .catch(error => {
            console.error('Error fetching products:', error);
          });
      }, []);
      const filteredProducts = selectedLoaiSanPham
      ? products.filter(product => product.TenLoaiSanPham === selectedLoaiSanPham)
      : products;
  if (!isOpen) return null;
  //them oder
  const handleOrderClick = (product) => {
    setOrderedProducts(prevProducts => {
      const existingProductIndex = prevProducts.findIndex(p => p.MaSanPham === product.MaSanPham);

      if (existingProductIndex !== -1) {
        // Nếu sản phẩm đã tồn tại, cập nhật số lượng
        const updatedProducts = prevProducts.map((p, index) => {
          if (index === existingProductIndex) {
            return { ...p, quantity: p.quantity + 1 };
          }
          return p;
        });
        return updatedProducts;
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm mới với số lượng ban đầu là 1
        return [...prevProducts, { ...product, quantity: 1 }];
      }
    });
  };
  
  const handleRemoveProduct = (index) => {
    setOrderedProducts(prevProducts => {
      const productToRemove = prevProducts[index];
      if (productToRemove.quantity > 1) {
        // Giảm số lượng nếu số lượng lớn hơn 1
        const updatedProducts = prevProducts.map((p, i) => {
          if (i === index) {
            return { ...p, quantity: p.quantity - 1 };
          }
          return p;
        });
        return updatedProducts;
      } else {
        // Xóa sản phẩm nếu số lượng bằng 1
        return prevProducts.filter((_, i) => i !== index);
      }
    });
  };


  const handleConfirmOrder = async () => {
    if (banID) {
      try {
        const response = await axios.post('http://localhost:3001/api/donhang', {
          banID,
          khuVucID,
          items: orderedProducts.map(product => ({
            TenSanPham: product.TenSanPham,
            SoLuong: product.quantity,
            DonGia: product.gia
          }))
        });
  
        if (response.status === 200) {
          toast.success('Đơn hàng đã được xác nhận thành công!');
         
          const donhangoderid = {
            banID,
          };
          
          const bookedTables = JSON.parse(localStorage.getItem('bookedTables')) || [];
          
          // Kiểm tra xem bàn đã tồn tại trong bookedTables chưa
          const isTableBooked = bookedTables.some(table => table.banID === donhangoderid.banID);
          
          if (!isTableBooked) {
            bookedTables.push(donhangoderid);
            localStorage.setItem('bookedTables', JSON.stringify(bookedTables));
          }
          const donhangoder = {
            banID,
            khuVucID,
            items: orderedProducts.map(product => ({
              TenSanPham: product.TenSanPham,
              SoLuong: product.quantity,
              DonGia: product.gia
            }))
          };

          // Lưu thông tin đơn hàng vào localStorage
          const confirmedOrders = JSON.parse(localStorage.getItem('confirmedOrders')) || [];
          confirmedOrders.push(donhangoder);
          localStorage.setItem('confirmedOrders', JSON.stringify(confirmedOrders));
  
          setOrderedProducts([]); // Clear ordered products
  
          // Thực hiện refresh hoặc cập nhật giao diện nếu cần
          window.dispatchEvent(new Event('storage'));
        } else {
          alert('Có lỗi xảy ra khi xác nhận đơn hàng. Vui lòng thử lại.');
        }
      } catch (error) {
        console.error('Error confirming order:', error);
        alert('Có lỗi xảy ra khi xác nhận đơn hàng. Vui lòng thử lại.');
      }
    } else {
      alert('Thông tin bàn không hợp lệ.');
    }
  };
  

  return (
    <div className="orderModalOverlay">
      <div className="orderModalContent">
      <button onClick={onClose} className="closeButton">X</button>
        <h2 className="textoder">Order Details</h2>
        {/* Nội dung của modal */}
        <div className="oderdivtong">
       <div className="oderdiv1">
       <div className="menuoderloai">
       <button
          className={`btnoderloaimenu ${selectedLoaiSanPham === '' ? 'active' : ''}`}
          onClick={handleShowAllProducts}
        >
          Tất Cả
        </button>
        {loaiSanPham.map((loai) => (
          <button
            key={loai.TenLoaiSanPham}
            className={`btnoderloaimenu ${selectedLoaiSanPham === loai.TenLoaiSanPham ? 'active' : ''}`}
            onClick={() => handleLoaiSanPhamClick(loai.TenLoaiSanPham)}
          >
            {loai.TenLoaiSanPham}
          </button>
        ))}
    

      </div>
       </div>
       <div className="oderdiv2">
     <div className="menuTableOder">
  {filteredProducts.map(product => (
    <div key={product.MaSanPham} className="productCardOder">
      <img 
        src={product.HinhAnh} 
        alt={product.TenSanPham} 
        className="productImageOder"
      />
      <h4 className="productNameOder">{product.TenSanPham}</h4>
      <p className="productPriceOder">{product.gia} VND</p>
      <div className="chucNangBtnCardOder">
      <button 
                className="orderButton" 
                onClick={() => handleOrderClick(product)}
              >
                Order
              </button>
      </div>
    </div>
  ))}
</div>

       </div>
       <div className="oderdiv3">
       <div className="tableContainerorder">
      
        <table className="tableodertong">
          <thead className="tableHeaderorder">
            <tr>
              <th className="tableCellorder">Tên Sản Phẩm</th>
              <th className="tableCellorder">Giá</th>
              <th className="tableCellorder">Số Lượng</th>
              <th className="tableCellorder">Thành Tiền</th>
              <th className="tableCellorder">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {orderedProducts.map((product, index) => (
              <tr key={index}>
                <td className="tableCellorder">{product.TenSanPham}</td>
                <td className="tableCellorder">{product.gia} VND</td>
                <td className="tableCellorder">{product.quantity}</td>
                <td className="tableCellorder">{product.gia * product.quantity} VND</td>
                <td className="tableCellorder">
                  <button onClick={() => handleRemoveProduct(index)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    <button className="orderButtonxacnhan"onClick={handleConfirmOrder} >Xác Nhận</button>
       </div>
     
       </div>
     
      </div>
      
    </div>
  );
  
};


export default OrderModal;
