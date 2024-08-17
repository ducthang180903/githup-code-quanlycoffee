const express = require('express');
const mysql = require('mysql');  
const cors = require('cors');
const app = express();
const multer = require('multer');
const path = require('path');
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost', // Thay đổi nếu MySQL server không chạy trên localhost
    user: 'root', // Thay bằng username MySQL của bạn
    password: '', // Thay bằng password MySQL của bạn
    database: 'qlquannetco' // Thay bằng tên cơ sở dữ liệu bạn muốn kết nối
  });
  db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Kết Nối Thành Công MySQL');
});

// Cấu hình multer để lưu trữ tệp
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Thư mục lưu trữ tệp
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Đổi tên tệp để tránh trùng lặp
  }
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const upload = multer({ storage: storage });
// API đăng ký
app.post('/register', (req, res) => {
    const { tendangnhap, matkhau, hovaten, email, sodienthoai, vaitro } = req.body;

    if (!tendangnhap || !matkhau || !hovaten || !email || !vaitro) {
        return res.status(400).send({ message: 'Thiếu thông tin cần thiết' });
    }

    const sql = 'INSERT INTO nguoidung (tendangnhap, matkhau, hovaten, email, sodienthoai, vaitro) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [tendangnhap, matkhau, hovaten, email, sodienthoai, vaitro], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).send({ message: 'Tên đăng nhập đã tồn tại' });
            }
            console.error('Error inserting user:', err);
            return res.status(500).send({ message: 'Lỗi khi thêm người dùng' });
        }
        res.status(201).send({ message: 'Đăng ký thành công', id_nguoidung: result.insertId });
    });
});
// API đăng nhập
app.post('/login', (req, res) => {
    const { tendangnhap, matkhau } = req.body;
  
    if (!tendangnhap || !matkhau) {
      return res.status(400).send({ message: 'Tên đăng nhập và mật khẩu là bắt buộc' });
    }
  
    const sql = 'SELECT * FROM nguoidung WHERE tendangnhap = ? AND matkhau = ?';
    db.query(sql, [tendangnhap, matkhau], (err, results) => {
      if (err) {
        console.error('Error logging in:', err);
        return res.status(500).send({ message: 'Lỗi khi đăng nhập' });
      }
  
      if (results.length > 0) {
        const user = results[0];
        // Giả sử vai trò được lưu trong trường `vaitro`
        res.status(200).send({
          message: 'Đăng nhập thành công',
          user: {
            id: user.id,
            tendangnhap: user.tendangnhap,
            matkhau: user.matkhau,
            hovaten: user.hovaten,
            email: user.email,
            sodienthoai: user.sodienthoai,
            vaitro: user.vaitro,
            ngaytao:user.ngaytao

          }
        });
      } else {
        res.status(401).send({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
      }
    });
  });
  
// API hiển thị tất cả vai trò
app.get('/vaitro', (req, res) => {
    const sql = 'SELECT * FROM vaitro';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching roles:', err);
            return res.status(500).send({ message: 'Lỗi khi lấy vai trò' });
        }
        res.status(200).send(results);
    });
});
// API để lấy danh sách các bàn
app.get('/api/tables', (req, res) => {
  const sql = `
    SELECT b.banID, b.banName, b.khuVucID, kv.khuVucName 
    FROM ban b
    JOIN khuVuc kv ON b.khuVucID = kv.khuVucID
  `; 

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Lỗi truy vấn:', err);
      return res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
    res.json(results);
  });
});
// Tạo endpoint để lấy danh sách khu vực
app.get('/api/khuvuc', (req, res) => {
  const sql = 'SELECT * FROM khuvuc'; // Truy vấn lấy tất cả các khu vực

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Lỗi truy vấn:', err);
      return res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
    res.json(results);
  });
});

// Tạo endpoint để thêm bàn
app.post('/api/tables', (req, res) => {
  const { banName, khuvucID } = req.body;
  
  // Kiểm tra nếu dữ liệu đầu vào thiếu
  if (!banName || !khuvucID) {
    return res.status(400).json({ error: 'Thiếu thông tin' });
  }

  // Thực hiện INSERT vào bảng ban
  const sql = 'INSERT INTO ban (banName, khuvucID) VALUES (?, ?)';
  db.query(sql, [banName, khuvucID], (err, result) => {
    if (err) {
      console.error('Error adding ban:', err);
      res.status(500).send('Error adding ban');
    } else {
      console.log('Ban added:', { banName, khuvucID });
      res.status(201).json({ message: 'Bàn đã được thêm thành công', id: result.insertId });
    }
  });
});

// API để lấy danh sách loại sản phẩm
app.get('/api/loaisanpham', (req, res) => {
  const sql = 'SELECT * FROM LoaiSanPham'; // Thay đổi tên bảng nếu cần

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching LoaiSanPham:', err);
      return res.status(500).json({ error: 'An error occurred' });
    }
    res.json(results);
  });
});
// API để thêm loại sản phẩm
app.post('/api/loaisanpham', (req, res) => {
  const { tenloaisanpham } = req.body;

  if (!tenloaisanpham) {
    return res.status(400).json({ error: 'Tên loại sản phẩm không được để trống' });
  }

  const query = 'INSERT INTO loaisanpham (tenloaisanpham) VALUES (?)';
  db.query(query, [tenloaisanpham], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Tên loại sản phẩm đã tồn tại' });
      }
      console.error('Error adding loaisanpham:', err);
      return res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm loại sản phẩm' });
    }
    res.json({ tenloaisanpham });
  });
});
// API hiển thị sản phẩm
// API hiển thị sản phẩm
app.get('/api/sanpham', (req, res) => {
  const sql = `
    SELECT  sanpham.MaSanPham, sanpham.TenSanPham, sanpham.gia, sanpham.HinhAnh, loaisanpham.TenLoaiSanPham
    FROM sanpham
    JOIN loaisanpham ON sanpham.TenLoaiSanPham = loaisanpham.TenLoaiSanPham
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching sanpham:', err);
      res.status(500).json({ error: 'Error fetching sanpham' });
    } else {
      // Chuyển đổi đường dẫn hình ảnh để phù hợp với đường dẫn tĩnh
      results.forEach(product => {
        if (product.HinhAnh) {
          product.HinhAnh = `http://localhost:3001/uploads/${product.HinhAnh}`;
        }
      });
      res.json(results);
    }
  });
});

app.post('/api/sanpham', upload.single('image'), (req, res) => {
  const { tenSanPham, giaSanPham, loaiSanPham } = req.body;
  const image = req.file ? req.file.filename : null; // Lấy tên tệp hình ảnh từ multer

  // Kiểm tra nếu bất kỳ trường nào bị thiếu
  if (!tenSanPham || !giaSanPham || !loaiSanPham || !image) {
    return res.status(400).json({ error: 'Vui lòng nhập tất cả các trường bắt buộc và chọn hình ảnh.' });
  }

  // SQL query để thêm sản phẩm vào cơ sở dữ liệu
  const sql = `
    INSERT INTO sanpham (TenSanPham, gia, HinhAnh, TenLoaiSanPham)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [tenSanPham, giaSanPham, image, loaiSanPham], (err, result) => {
    if (err) {
      console.error('Error adding sanpham:', err);
      res.status(500).json({ error: 'Error adding sanpham' });
    } else {
      res.status(201).json({ message: 'SanPham added successfully' });
    }
  });
});

app.delete('/api/sanpham/:maSanPham', (req, res) => {
  const { maSanPham } = req.params;

  if (!maSanPham) {
    return res.status(400).json({ error: 'Mã sản phẩm không được cung cấp' });
  }

  const sql = 'DELETE FROM sanpham WHERE MaSanPham = ?';

  db.query(sql, [maSanPham], (err, result) => {
    if (err) {
      console.error('Error deleting sanpham:', err);
      return res.status(500).json({ error: 'Error deleting sanpham' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Sản phẩm không tìm thấy' });
    }
    res.status(200).json({ message: 'SanPham deleted successfully' });
  });
});
//api update sanpham
app.put('/api/sanpham/:maSanPham', upload.single('image'), (req, res) => {
  const { maSanPham } = req.params;
  const { tenSanPham, giaSanPham, loaiSanPham } = req.body;
  const image = req.file ? req.file.filename : null; // Lấy tên tệp hình ảnh từ multer

  let sql = 'UPDATE sanpham SET TenSanPham = ?, gia = ?, TenLoaiSanPham = ?';
  const params = [tenSanPham, giaSanPham, loaiSanPham];

  if (image) {
    sql += ', HinhAnh = ?';
    params.push(image);
  }

  sql += ' WHERE MaSanPham = ?';
  params.push(maSanPham);

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error updating sanpham:', err);
      res.status(500).json({ error: 'Error updating sanpham' });
    } else {
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Sản phẩm không tìm thấy' });
      } else {
        res.json({ message: 'SanPham updated successfully' });
      }
    }
  });
});
app.post('/api/donhang', (req, res) => {
  const { banID, items } = req.body;

  if (!banID || !items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  // Insert into DonHang table
  const insertOrderQuery = 'INSERT INTO DonHang (banID) VALUES (?)';
  
  db.query(insertOrderQuery, [banID], (error, results) => {
    if (error) {
      console.error('Error inserting order:', error);
      return res.status(500).json({ error: 'Failed to insert order' });
    }

    const MaDonHang = results.insertId; // Get the inserted order ID

    // Insert items into MatHangDonHang table
    const insertItemsQuery = 'INSERT INTO MatHangDonHang (MaDonHang, TenSanPham, SoLuong, DonGia) VALUES ?';
    
    const itemsValues = items.map(item => [
      MaDonHang,
      item.TenSanPham,
      item.SoLuong,
      item.DonGia
    ]);

    db.query(insertItemsQuery, [itemsValues], (error) => {
      if (error) {
        console.error('Error inserting items:', error);
        return res.status(500).json({ error: 'Failed to insert items' });
      }

      res.status(200).json({ message: 'Order created successfully' });
    });
  });
});
// API Thêm Hóa Đơn
app.post('/api/hoadon', (req, res) => {
  const { banID, KhuVucID, items } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!banID || !KhuVucID || !items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  // Bước 1: Thêm hóa đơn mới vào bảng HoaDon
  const insertOrderQuery = 'INSERT INTO HoaDon (banID, KhuVucID) VALUES (?, ?)';
  db.query(insertOrderQuery, [banID, KhuVucID], (error, results) => {
    if (error) {
      console.error('Error inserting order:', error);
      return res.status(500).json({ error: 'Failed to insert order' });
    }

    const MaHoaDon = results.insertId; // Lấy ID của hóa đơn vừa thêm

    // Bước 2: Thêm các mục vào bảng ChiTietHoaDon
    const insertItemsQuery = 'INSERT INTO ChiTietHoaDon (MaHoaDon, TenSanPham, SoLuong, DonGia) VALUES ?';
    const itemsValues = items.map(item => [
      MaHoaDon,
      item.TenSanPham,
      item.SoLuong,
      item.DonGia
    ]);

    db.query(insertItemsQuery, [itemsValues], (error) => {
      if (error) {
        console.error('Error inserting items:', error);
        return res.status(500).json({ error: 'Failed to insert items' });
      }

      // Bước 3: Cập nhật tổng tiền của hóa đơn
      const updateTotalQuery = `
        UPDATE HoaDon
        SET TongTien = (
          SELECT SUM(SoLuong * DonGia)
          FROM ChiTietHoaDon
          WHERE ChiTietHoaDon.MaHoaDon = HoaDon.MaHoaDon
        )
        WHERE MaHoaDon = ?
      `;

      db.query(updateTotalQuery, [MaHoaDon], (error) => {
        if (error) {
          console.error('Error updating order total:', error);
          return res.status(500).json({ error: 'Failed to update order total' });
        }

        res.status(200).json({ message: 'Order created successfully' });
      });
    });
  });
});
// API Hiển Thị Tất Cả Hóa Đơn
app.get('/api/hoadon', (req, res) => {
  // Bước 1: Truy vấn tất cả hóa đơn, bao gồm cả NgayHoaDon
  const getOrdersQuery = `
    SELECT HoaDon.MaHoaDon, HoaDon.banID, HoaDon.KhuVucID, HoaDon.TongTien, HoaDon.NgayHoaDon
    FROM HoaDon
  `;

  db.query(getOrdersQuery, (error, orders) => {
    if (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    // Bước 2: Truy vấn các mục chi tiết cho từng hóa đơn
    const orderIds = orders.map(order => order.MaHoaDon);
    const getItemsQuery = `
      SELECT MaHoaDon, TenSanPham, SoLuong, DonGia
      FROM ChiTietHoaDon
      WHERE MaHoaDon IN (?)
    `;

    db.query(getItemsQuery, [orderIds], (error, items) => {
      if (error) {
        console.error('Error fetching order items:', error);
        return res.status(500).json({ error: 'Failed to fetch order items' });
      }

      // Bước 3: Kết hợp thông tin hóa đơn và các mục chi tiết
      const ordersWithItems = orders.map(order => ({
        ...order,
        items: items.filter(item => item.MaHoaDon === order.MaHoaDon)
      }));

      res.status(200).json(ordersWithItems);
    });
  });
});
app.get('/api/hoadon/tim-kiem-theo-khoang-thoi-gian', (req, res) => {
  const { startDate, endDate } = req.query; // Lấy tham số ngày bắt đầu và kết thúc từ query string

  // Kiểm tra xem ngày bắt đầu và kết thúc có được cung cấp không
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'Ngày bắt đầu và ngày kết thúc đều cần phải được cung cấp' });
  }

  // Xây dựng câu truy vấn để tìm kiếm theo khoảng thời gian
  const getOrdersQuery = `
    SELECT HoaDon.MaHoaDon, HoaDon.banID, HoaDon.KhuVucID, HoaDon.TongTien, HoaDon.NgayHoaDon
    FROM HoaDon
    WHERE DATE(HoaDon.NgayHoaDon) BETWEEN ? AND ?
  `;

  db.query(getOrdersQuery, [startDate, endDate], (error, orders) => {
    if (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for the specified date range' });
    }

    // Bước 2: Truy vấn các mục chi tiết cho từng hóa đơn
    const orderIds = orders.map(order => order.MaHoaDon);
    const getItemsQuery = `
      SELECT MaHoaDon, TenSanPham, SoLuong, DonGia
      FROM ChiTietHoaDon
      WHERE MaHoaDon IN (?)
    `;

    db.query(getItemsQuery, [orderIds], (error, items) => {
      if (error) {
        console.error('Error fetching order items:', error);
        return res.status(500).json({ error: 'Failed to fetch order items' });
      }

      // Bước 3: Kết hợp thông tin hóa đơn và các mục chi tiết
      const ordersWithItems = orders.map(order => ({
        ...order,
        items: items.filter(item => item.MaHoaDon === order.MaHoaDon)
      }));

      res.status(200).json(ordersWithItems);
    });
  });
});

// API Hiển Thị Tất Cả Nhân Viên
// API Hiển Thị Nhân Viên
app.get('/api/nhanvien', (req, res) => {
  const sql = `
    SELECT 
      NhanVien.id, 
      NhanVien.ten, 
      NhanVien.email, 
      NhanVien.gioiTinh, 
      vaitro.ten_vaitro AS vaitro, 
      DATE_FORMAT(NhanVien.ngayVaoLam, '%d-%m-%Y') AS ngayVaoLam, 
      NhanVien.anh
    FROM NhanVien
    JOIN vaitro ON NhanVien.vaitro = vaitro.id_vaitro
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching nhanvien:', err);
      res.status(500).json({ error: 'Error fetching nhanvien' });
    } else {
      // Chuyển đổi đường dẫn hình ảnh để phù hợp với đường dẫn tĩnh
      results.forEach(employee => {
        if (employee.anh) {
          employee.anh = `http://localhost:${PORT}/uploads/${employee.anh}`;
        }
      });
      res.json(results);
    }
  });
});

// API để thêm nhân viên với ảnh
app.post('/api/nhanvien', upload.single('anh'), (req, res) => {
  const { ten, email, gioiTinh, vaitro, ngayVaoLam } = req.body;
  const anh = req.file ? req.file.filename : null; // Đường dẫn tới tệp ảnh

  // Câu lệnh SQL để chèn nhân viên mới vào cơ sở dữ liệu
  const sql = `
    INSERT INTO NhanVien (ten, email, gioiTinh, vaitro, ngayVaoLam, anh)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  // Thực hiện câu lệnh SQL
  db.query(sql, [ten, email, gioiTinh, vaitro, ngayVaoLam, anh], (err, result) => {
    if (err) {
      console.error('Error inserting employee:', err);
      return res.status(500).json({ error: 'Failed to add employee' });
    }
    res.status(201).json({ message: 'Employee added successfully', id: result.insertId });
  });
});

// API xóa nhân viên
app.delete('/api/nhanvien/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM NhanVien WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error deleting employee:', err);
      res.status(500).json({ error: 'Error deleting employee' });
    } else {
      if (results.affectedRows > 0) {
        res.json({ message: 'Employee deleted successfully' });
      } else {
        res.status(404).json({ message: 'Employee not found' });
      }
    }
  });
});

// API cập nhật nhân viên
app.put('/api/nhanvien/:id', upload.single('anh'), (req, res) => {
  const { id } = req.params;
  const { ten, email, gioiTinh, vaitro, ngayVaoLam } = req.body;
  const anh = req.file ? req.file.filename : null;

  const sql = `
    UPDATE NhanVien
    SET ten = ?, email = ?, gioiTinh = ?, vaitro = ?, ngayVaoLam = ?, anh = COALESCE(?, anh)
    WHERE id = ?
  `;

  db.query(sql, [ten, email, gioiTinh, vaitro, ngayVaoLam, anh, id], (err, results) => {
    if (err) {
      console.error('Error updating employee:', err);
      res.status(500).json({ error: 'Error updating employee' });
    } else {
      if (results.affectedRows > 0) {
        res.json({ message: 'Employee updated successfully' });
      } else {
        res.status(404).json({ message: 'Employee not found' });
      }
    }
  });
});
// API tìm kiếm nhân viên theo tên
app.get('/api/nhanvien/search', (req, res) => {
  const { name } = req.query; // Nhận tên từ query parameter

  if (!name) {
    return res.status(400).json({ error: 'Name query parameter is required' });
  }

  // SQL query tìm kiếm theo tên
  const sql = `
    SELECT id, ten, email, gioiTinh, vaitro, ngayVaoLam, anh
    FROM NhanVien
    WHERE ten LIKE ?
  `;

  db.query(sql, [`%${name}%`], (err, results) => {
    if (err) {
      console.error('Error searching employees:', err);
      return res.status(500).json({ error: 'Error searching employees' });
    }
    
    // Chuyển đổi đường dẫn hình ảnh để phù hợp với đường dẫn tĩnh
    results.forEach(employee => {
      if (employee.anh) {
        employee.anh = `http://localhost:${PORT}/uploads/${employee.anh}`;
      }
    });

    res.json(results);
  });
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
