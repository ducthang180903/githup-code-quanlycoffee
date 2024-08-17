import React, { useState, useEffect } from 'react';
import '../css/thucdon.css'
// import image from "../img/banghe.png"
import axios from 'axios';
const ThucDon = () => {
  const [loaiSanPham, setLoaiSanPham] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModaladd, setShowModaladd] = useState(false);
  const [tenloaisanpham, setTenLoaiSanPham] = useState('');
  const [products, setProducts] = useState([]);
  const [isQuanTri, setIsQuanTri] = useState(false);
  const [tenSanPham, setTenSanPham] = useState('');
  const [giaSanPham, setGiaSanPham] = useState('');
  const [selectedLoaiSanPham, setSelectedLoaiSanPham] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [editingProduct, setEditingProduct] = useState(null);


  // const [loaiSanPhamOptions, setLoaiSanPhamOptions] = useState([]);
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
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
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.vaitro === 'quantri') {
      setIsQuanTri(true);
    }
  }, []);
//them loại sản phẩm modal
    const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTenLoaiSanPham(''); // Reset input
  };
  //them  sản phẩm modal
  const handleOpenModaladdsp = () => {
    setShowModaladd(true);
  };

  const handleCloseModaladdsp = () => {
    setShowModaladd(false);
    // Reset input
  };
  const handleAddLoaiSanPham = () => {
    if (!tenloaisanpham) {
      alert('Tên loại sản phẩm không được bỏ trống');
      return;
    }

    axios.post('http://localhost:3001/api/loaisanpham', { tenloaisanpham })
      .then(response => {
        console.log('Success:', response.data);
        handleCloseModal();
        window.location.reload(); // Reload lại trang sau khi thêm thành công
      })
      .catch(error => {
        console.error('Error adding LoaiSanPham:', error);
      });
  };

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
// Thêm Sản phẩm
const handleAddProduct = () => {
  // Kiểm tra nếu bất kỳ trường nào bị thiếu
  if (!tenSanPham) {
    alert('Vui lòng nhập tên sản phẩm');
    return;
  }
  if (!giaSanPham) {
    alert('Vui lòng nhập giá sản phẩm');
    return;
  }
  if (!selectedLoaiSanPham) {
    alert('Vui lòng chọn loại sản phẩm');
    return;
  }
  if (!image) {
    alert('Vui lòng chọn hình ảnh sản phẩm');
    return;
  }

  const formData = new FormData();
  formData.append('tenSanPham', tenSanPham);
  formData.append('giaSanPham', giaSanPham);
  formData.append('loaiSanPham', selectedLoaiSanPham);
  formData.append('image', image);

  axios.post('http://localhost:3001/api/sanpham', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  .then(response => {
    console.log('Success:', response.data);
    alert('Thêm sản phẩm thành công');
    handleCloseModal();
    // Reset dữ liệu input và load lại trang
    setTenSanPham('');
    setGiaSanPham('');
    setSelectedLoaiSanPham('');
    setImage(null);
    // Reload lại trang
    window.location.reload();
  })
  .catch(error => {
    console.error('Error adding product:', error);
    alert('Có lỗi xảy ra khi thêm sản phẩm');
  });
};
const handleDeleteProduct = (maSanPham) => {
  if (!maSanPham) {
    console.error('Mã sản phẩm không hợp lệ:', maSanPham);
    return;
  }

  // Hiển thị hộp xác nhận
  const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?');
  
  if (confirmDelete) {
    axios.delete(`http://localhost:3001/api/sanpham/${maSanPham}`)
      .then(response => {
        console.log('Success:', response.data);
        fetchProducts(); // Gọi hàm để làm mới danh sách sản phẩm
      })
      .catch(error => {
        console.error('Error deleting product:', error);
      });
  }
};
const fetchProducts = () => {
  axios.get('http://localhost:3001/api/sanpham')
    .then(response => {
      setProducts(response.data); // Giả sử bạn đã khai báo state `products` để lưu danh sách sản phẩm
    })
    .catch(error => {
      console.error('Error fetching products:', error);
    });
};
// mở modal edit
const handleOpenEditModal = (product) => {
  setEditingProduct(product);
  setIsEditModalOpen(true);
};

const handleCloseEditModal = () => {
  setIsEditModalOpen(false);
  setEditingProduct(null);
};
//update san pham
const handleUpdateProduct = () => {
  const maSanPham = editingProduct.MaSanPham;

  if (!maSanPham) {
    console.error('Mã sản phẩm không hợp lệ:', maSanPham);
    return;
  }

  const formData = new FormData();
  formData.append('tenSanPham', editingProduct.TenSanPham);
  formData.append('giaSanPham', editingProduct.gia);
  formData.append('loaiSanPham', editingProduct.TenLoaiSanPham);
  if (image) {
    formData.append('image', image);
  }

  axios.put(`http://localhost:3001/api/sanpham/${maSanPham}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  .then(response => {
    console.log('Success:', response.data);
    fetchProducts();
    handleCloseEditModal();
  })
  .catch(error => {
    console.error('Error updating product:', error);
  });
};
// loc loai sản phẩm
useEffect(() => {
  fetchProducts();
  fetchLoaiSanPham();

}, []);
  const fetchLoaiSanPham = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/loaisanpham');
      setLoaiSanPham(response.data);
    } catch (error) {
      console.error('Error fetching loai san pham:', error);
    }
  };
  const handleLoaiSanPhamClick = (loai) => {
    setSelectedLoaiSanPham(loai);
  };
  const handleShowAllProducts = () => {
    setSelectedLoaiSanPham(''); // Đặt selectedLoaiSanPham là trống để hiển thị tất cả sản phẩm
  };
  const filteredProducts = selectedLoaiSanPham
    ? products.filter(product => product.TenLoaiSanPham === selectedLoaiSanPham)
    : products;

  return(
    <div className="menu">
      <div className="txtthucdon">Menu</div>
      <div className="formmenu">
       <div className="menuloai">
       <div className="menuloai1">
       <button
          className={`btnloaimenu ${selectedLoaiSanPham === '' ? 'active' : ''}`}
          onClick={handleShowAllProducts}
        >
          Tất Cả
        </button>
        {loaiSanPham.map((loai) => (
          <button
            key={loai.TenLoaiSanPham}
            className={`btnloaimenu ${selectedLoaiSanPham === loai.TenLoaiSanPham ? 'active' : ''}`}
            onClick={() => handleLoaiSanPhamClick(loai.TenLoaiSanPham)}
          >
            {loai.TenLoaiSanPham}
          </button>
        ))}
    

      </div>
      {isQuanTri && (
        <button className="btnthemloaimenu" onClick={handleOpenModal}>Thêm Loại</button>
      )}
       {isQuanTri && (
      <button className="btnthemloaimenu"  onClick={handleOpenModaladdsp}>Thêm Sản Phẩm </button>
    )}
      </div>
      <div className="menutable">
      <div className="menutable1">
      <div className="menutable2">
      {filteredProducts.map(product => (
        <div key={product.MaSanPham} className="productCard">
          <img 
            src={product.HinhAnh} 
            alt={product.TenSanPham} 
            className="productImage"
          />
          <h4 className="productName">{product.TenSanPham}</h4>
          <p className="productPrice">{product.gia} VND</p>
          <div className="chucnangbtncard">
          {isQuanTri && (
    <button 
    className="btnxoasp" 
    onClick={() => {
      const maSanPham = product.MaSanPham; // Đảm bảo biến này có giá trị
handleDeleteProduct(maSanPham);
    }}
  >
    Xóa
  </button>
          )}
            {isQuanTri && (
    <button className="btnxuasp"onClick={() => handleOpenEditModal(product)}>Sửa</button>
            )}
    </div>
        </div>
      ))}
    </div>
      </div>
      </div>
    </div>
   
    {showModal && (
        <div className="modalBackground002">
          <div className="modalContent002">
            <h2>Thêm Loại Sản Phẩm</h2>
            <input
              type="text"
              placeholder="Nhập tên loại sản phẩm"
              value={tenloaisanpham}
              onChange={(e) => setTenLoaiSanPham(e.target.value)}
              className="formControl002"
            />
            <button onClick={handleAddLoaiSanPham} className="btnSave002">Thêm</button>
            <button onClick={handleCloseModal} className="btnClose002">Đóng</button>
          </div>
        </div>
      )}
  {showModaladd && (
  <div className="modalBackground123">
    <div className="modalContent123">
      <h2>Thêm Sản Phẩm</h2>
      <input
        type="text"
        placeholder="Nhập tên sản phẩm"
        value={tenSanPham}
        onChange={(e) => setTenSanPham(e.target.value)}
        className="formControl123"
      />
      <input
        type="number"
        placeholder="Nhập giá sản phẩm"
        value={giaSanPham}
        onChange={(e) => setGiaSanPham(e.target.value)}
        className="formControl123"
      />
    <div className="formGroup123  ">
  <label className="formLabel123 ">Loại Sản Phẩm</label>
  <select
    value={selectedLoaiSanPham}
    onChange={(e) => setSelectedLoaiSanPham(e.target.value)}
    className="formControl123"
  >
    <option value="" disabled>Chọn loại sản phẩm</option>
    {loaiSanPham.map((loai) => (
      <option key={loai.TenLoaiSanPham} value={loai.TenLoaiSanPham}>
        {loai.TenLoaiSanPham}
      </option>
    ))}
  </select>
</div>

      <input
        type="file"
        onChange={handleImageChange}
        className="formControl123"
      />
      <button onClick={handleAddProduct} className="btnSave123">Thêm</button>
      <button onClick={handleCloseModaladdsp} className="btnClose123">Đóng</button>
    </div>
  </div>
)}
{isEditModalOpen && (
  <div className="modalBackgroundeditsp">
    <div className="modalContenteditsp">
      <h2>Chỉnh sửa Sản Phẩm</h2>
      <label className="formLabeleditsp">Sửa Tên Sản Phẩm</label>
      <input
        type="text"
        placeholder="Nhập tên sản phẩm"
        value={editingProduct.TenSanPham}
        onChange={(e) => setEditingProduct({ ...editingProduct, TenSanPham: e.target.value })}
        className="formControleeditsp"
      />
        <label className="formLabeleditsp">Sửa Giá Sản Phẩm</label>
      <input
        type="number"
        placeholder="Nhập giá sản phẩm"
        value={editingProduct.gia}
        onChange={(e) => setEditingProduct({ ...editingProduct, gia: e.target.value })}
        className="formControleeditsp"
      />
<div className="formGroupeditsp">
  <label className="formLabeleditsp">Sửa Loại Sản Phẩm</label>
  <select
    value={selectedLoaiSanPham}
    onChange={(e) => setSelectedLoaiSanPham(e.target.value)}
    className="formControleeditsp"
  >
    <option value="" disabled>Chọn loại sản phẩm</option>
    {loaiSanPham.map((loai) => (
      <option key={loai.TenLoaiSanPham} value={loai.TenLoaiSanPham}>
        {loai.TenLoaiSanPham}
      </option>
    ))}
  </select>
</div>
<label className="formLabeleditsp">Sửa Hình Ảnh Sản Phẩm</label>
      <input
        type="file"
        onChange={handleImageChange} // cập nhật hàm handleImageChange để xử lý ảnh mới
        className="formControleeditsp"
      />
      <button onClick={handleUpdateProduct} className="btnSaveeditsp">Cập nhật</button>
      <button onClick={handleCloseEditModal} className="btnCloseeditsp">Đóng</button>
    </div>
  </div>
)}


    </div>
  )
};

export default ThucDon;
