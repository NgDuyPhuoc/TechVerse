/* ============================================================
   PRODUCTS DATA
   Nguồn dữ liệu trung tâm cho trang Sản phẩm.
   Ảnh dùng placeholder picsum.photos (seed cố định theo từng
   sản phẩm để ảnh không đổi giữa các lần tải lại trang).
   Mỗi sản phẩm: id, name, brand, category, price, oldPrice,
   rating, reviews, image, badge, desc, specs.
   ============================================================ */

const PRODUCTS = [
    {
        id: 1, name: "iPhone 17 Pro Max", brand: "Apple", category: "phone",
        price: 34990000, oldPrice: 38990000, rating: 5, reviews: 42,
        image: "/images/id1.webp", badge: "new",
        desc: "Chip A19 Bionic, camera 200MP, màn hình ProMotion 120Hz.",
        specs: { "Màn hình": "6.9\" Super Retina XDR, 120Hz", "Chip": "A19 Bionic", "RAM": "8GB", "Camera": "200MP + 48MP + 12MP", "Pin": "4.685 mAh", "Bảo hành": "12 tháng chính hãng" }
    },
    {
        id: 2, name: "MacBook Pro 16\" M4", brand: "Apple", category: "laptop",
        price: 67990000, oldPrice: 79990000, rating: 5, reviews: 31,
        image: "/images/id2.webp", badge: "sale",
        desc: "Chip M4 Pro, 36GB RAM, màn hình Liquid Retina XDR.",
        specs: { "Màn hình": "16.2\" Liquid Retina XDR", "Chip": "Apple M4 Pro", "RAM": "36GB", "SSD": "1TB", "Pin": "Lên đến 22 giờ", "Bảo hành": "12 tháng chính hãng" }
    },
    {
        id: 3, name: "Sony WH-1000XM6", brand: "Sony", category: "audio",
        price: 8490000, oldPrice: 9990000, rating: 5, reviews: 58,
        image: "/images/id3.png", badge: "",
        desc: "Chống ồn chủ động hàng đầu, pin 40 giờ, aptX Lossless.",
        specs: { "Loại": "Over-ear không dây", "Chống ồn": "Chủ động (ANC) thế hệ mới", "Pin": "40 giờ", "Kết nối": "Bluetooth 5.4, aptX Lossless", "Bảo hành": "12 tháng" }
    },
    {
        id: 4, name: "Apple Watch Ultra 3", brand: "Apple", category: "watch",
        price: 22990000, oldPrice: 25990000, rating: 4, reviews: 19,
        image: "/images/id4.jpg", badge: "hot",
        desc: "Titan aerospace, GPS chính xác cao, pin 72 giờ.",
        specs: { "Vật liệu": "Titan aerospace-grade", "Màn hình": "LTPO OLED Always-On", "GPS": "Đa băng tần độ chính xác cao", "Pin": "72 giờ (chế độ Low Power)", "Chống nước": "100m" }
    },
    {
        id: 5, name: "Samsung Galaxy S26 Ultra", brand: "Samsung", category: "phone",
        price: 31990000, oldPrice: 35990000, rating: 5, reviews: 47,
        image: "/images/id5.webp", badge: "new",
        desc: "Snapdragon 8 Elite, camera 200MP, S Pen tích hợp AI.",
        specs: { "Màn hình": "6.9\" Dynamic AMOLED 2X", "Chip": "Snapdragon 8 Elite", "RAM": "12GB", "Camera": "200MP + 50MP + 10MP + 12MP", "Pin": "5.500 mAh" }
    },
    {
        id: 6, name: "Lenovo Legion Pro 9i", brand: "Lenovo", category: "laptop",
        price: 89990000, oldPrice: 99990000, rating: 5, reviews: 25,
        image: "/images/id6.webp", badge: "",
        desc: "Intel Core Ultra 9, RTX 5090, màn hình Mini LED 240Hz.",
        specs: { "CPU": "Intel Core Ultra 9 275HX", "GPU": "RTX 5090 Laptop 24GB", "RAM": "32GB DDR5", "Màn hình": "16\" Mini LED 240Hz", "SSD": "2TB NVMe" }
    },
    {
        id: 7, name: "JBL Charge 6", brand: "JBL", category: "audio",
        price: 3190000, oldPrice: 3990000, rating: 4, reviews: 76,
        image: "/images/id7.webp", badge: "sale",
        desc: "Chống nước IP67, pin 20 giờ, âm thanh stereo 360°.",
        specs: { "Loại": "Loa di động", "Công suất": "50W RMS", "Pin": "20 giờ", "Chống nước/bụi": "IP67", "Kết nối": "Bluetooth 5.3" }
    },
    {
        id: 8, name: "Samsung Galaxy Watch 8 Pro", brand: "Samsung", category: "watch",
        price: 12990000, oldPrice: 14990000, rating: 5, reviews: 28,
        image: "/images/id8.jpg", badge: "",
        desc: "Theo dõi sức khỏe AI, màn hình sapphire, pin 4 ngày.",
        specs: { "Màn hình": "Sapphire Crystal AMOLED", "Cảm biến": "Nhịp tim, SpO2, BIA", "Pin": "4 ngày sử dụng", "Chống nước": "5ATM + IP68", "Hệ điều hành": "Wear OS 6" }
    },
    {
        id: 9, name: "MacBook Air 15\" M4", brand: "Apple", category: "laptop",
        price: 39990000, oldPrice: 44990000, rating: 5, reviews: 69,
        image: "/images/id9.webp", badge: "new",
        desc: "Mỏng nhẹ nhất dòng Mac, pin 22 giờ, chip M4 tiết kiệm điện.",
        specs: { "Màn hình": "15.3\" Liquid Retina", "Chip": "Apple M4", "RAM": "16GB", "SSD": "512GB", "Pin": "Lên đến 22 giờ" }
    },
    {
        id: 10, name: "AirPods Pro 3", brand: "Apple", category: "audio",
        price: 7290000, oldPrice: 7990000, rating: 5, reviews: 95,
        image: "/images/id10.webp", badge: "",
        desc: "Chống ồn H2, âm thanh không gian cá nhân hóa, pin 36 giờ.",
        specs: { "Loại": "True Wireless In-ear", "Chip": "Apple H2", "Chống ồn": "Active Noise Cancellation", "Pin": "36 giờ (kèm hộp sạc)", "Chống nước": "IP54" }
    },
    {
        id: 11, name: "Xiaomi 16 Ultra", brand: "Xiaomi", category: "phone",
        price: 19990000, oldPrice: 22990000, rating: 4, reviews: 41,
        image: "/images/id11.jpg", badge: "hot",
        desc: "Leica camera 1\" sensor, Snapdragon 8 Gen 4, sạc 120W.",
        specs: { "Màn hình": "6.73\" AMOLED 120Hz", "Chip": "Snapdragon 8 Gen 4", "Camera": "Leica 50MP 1\" sensor", "Sạc": "120W có dây / 80W không dây", "Pin": "5.300 mAh" }
    },
    {
        id: 12, name: "Anker 747 Charging Station", brand: "Anker", category: "accessory",
        price: 1990000, oldPrice: 2490000, rating: 5, reviews: 54,
        image: "/images/id12.jpg", badge: "sale",
        desc: "Sạc nhanh 140W, 4 cổng USB-C + 3 USB-A, GaN III.",
        specs: { "Công suất": "140W tổng", "Cổng": "4x USB-C, 3x USB-A", "Công nghệ": "GaN III", "Bảo hành": "18 tháng" }
    },
    {
        id: 13, name: "ASUS ROG Zephyrus G16", brand: "Asus", category: "laptop",
        price: 62990000, oldPrice: 69990000, rating: 5, reviews: 22,
        image: "/images/id13.jpg", badge: "sale",
        desc: "AMD Ryzen AI 9, RTX 4080, màn hình OLED 240Hz.",
        specs: { "CPU": "AMD Ryzen AI 9 HX", "GPU": "RTX 4080 12GB", "RAM": "32GB DDR5", "Màn hình": "16\" OLED 240Hz", "SSD": "1TB NVMe" }
    },
    {
        id: 14, name: "Sonos Era 300", brand: "Sonos", category: "audio",
        price: 11990000, oldPrice: 13990000, rating: 5, reviews: 30,
        image: "/images/id14.jpg", badge: "",
        desc: "Dolby Atmos, 6 driver, âm thanh không gian vượt trội.",
        specs: { "Loại": "Loa thông minh", "Driver": "6 driver định hướng", "Âm thanh": "Dolby Atmos, Spatial Audio", "Kết nối": "Wi-Fi, Bluetooth, AirPlay 2" }
    },
    {
        id: 15, name: "Google Pixel 10 Pro", brand: "Google", category: "phone",
        price: 24990000, oldPrice: 27990000, rating: 4, reviews: 25,
        image: "/images/id15.png", badge: "new",
        desc: "Tensor G5, camera AI thế hệ mới, màn hình LTPO 120Hz.",
        specs: { "Màn hình": "6.7\" LTPO OLED 120Hz", "Chip": "Google Tensor G5", "RAM": "16GB", "Camera": "50MP + 48MP + 48MP", "Pin": "5.000 mAh" }
    },
    {
        id: 16, name: "Garmin Fenix 8 Sapphire", brand: "Garmin", category: "watch",
        price: 29990000, oldPrice: 32990000, rating: 5, reviews: 46,
        image: "/images/id16.jpg", badge: "",
        desc: "GPS đa băng tần, theo dõi sức khỏe chuyên sâu, pin 29 ngày.",
        specs: { "Mặt kính": "Sapphire chống xước", "GPS": "Đa băng tần (multi-band)", "Pin": "29 ngày (smartwatch mode)", "Chống nước": "10ATM", "Cảm biến": "Nhịp tim, SpO2, độ cao" }
    },
    {
        id: 17, name: "Dell XPS 14", brand: "Dell", category: "laptop",
        price: 48990000, oldPrice: 53990000, rating: 4, reviews: 14,
        image: "/images/id17.webp", badge: "sale",
        desc: "Intel Core Ultra 7, màn hình OLED 3.2K cảm ứng, thiết kế cao cấp.",
        specs: { "CPU": "Intel Core Ultra 7 256V", "RAM": "32GB LPDDR5x", "Màn hình": "14.5\" OLED 3.2K cảm ứng", "SSD": "1TB NVMe", "Trọng lượng": "1.55kg" }
    },
    {
        id: 18, name: "HP Spectre x360 14", brand: "HP", category: "laptop",
        price: 41990000, oldPrice: 46990000, rating: 4, reviews: 11,
        image: "/images/id18.jpg", badge: "",
        desc: "Laptop 2-trong-1 xoay gập, màn hình OLED, vỏ nhôm cao cấp.",
        specs: { "CPU": "Intel Core Ultra 7", "RAM": "16GB", "Màn hình": "14\" OLED 2.8K cảm ứng xoay gập", "SSD": "1TB NVMe", "Bút cảm ứng": "Đi kèm HP Tilt Pen" }
    },
    {
        id: 19, name: "Acer Predator Helios Neo 18", brand: "Acer", category: "laptop",
        price: 54990000, oldPrice: 59990000, rating: 4, reviews: 9,
        image: "/images/id19.jpg", badge: "sale",
        desc: "Màn hình 18\" Mini LED, RTX 4070, tản nhiệt 5th Gen AeroBlade.",
        specs: { "CPU": "Intel Core i9-14900HX", "GPU": "RTX 4070 8GB", "RAM": "32GB DDR5", "Màn hình": "18\" Mini LED 165Hz", "SSD": "1TB NVMe" }
    },
    {
        id: 20, name: "MSI Titan 18 HX", brand: "MSI", category: "laptop",
        price: 109990000, oldPrice: 119990000, rating: 5, reviews: 6,
        image: "/images/id20.jpg", badge: "hot",
        desc: "Laptop gaming flagship, RTX 5090, màn hình Mini LED 4K 165Hz.",
        specs: { "CPU": "Intel Core i9-15900HX", "GPU": "RTX 5090 Laptop 24GB", "RAM": "64GB DDR5", "Màn hình": "18\" Mini LED 4K 165Hz", "SSD": "4TB NVMe RAID0" }
    },
    {
        id: 21, name: "Samsung Galaxy Z Fold 7", brand: "Samsung", category: "phone",
        price: 42990000, oldPrice: 45990000, rating: 5, reviews: 20,
        image: "/images/id21.jpg", badge: "sale",
        desc: "Màn hình gập 8\", bản lề siêu mỏng, đa nhiệm mạnh mẽ.",
        specs: { "Màn hình chính": "8\" Dynamic AMOLED 2X gập", "Màn hình phụ": "6.5\"", "Chip": "Snapdragon 8 Elite for Galaxy", "RAM": "12GB/16GB", "Pin": "4.400 mAh" }
    },
    {
        id: 22, name: "Xiaomi Redmi Note 14 Pro", brand: "Xiaomi", category: "phone",
        price: 7990000, oldPrice: 8990000, rating: 4, reviews: 63,
        image: "/images/id22.jpg", badge: "",
        desc: "Camera 200MP, sạc nhanh 67W, giá tốt trong phân khúc.",
        specs: { "Màn hình": "6.67\" AMOLED 120Hz", "Chip": "Snapdragon 7s Gen 3", "Camera": "200MP chính", "Sạc": "67W có dây", "Pin": "5.000 mAh" }
    },
    {
        id: 23, name: "Sony Xperia 1 VII", brand: "Sony", category: "phone",
        price: 26990000, oldPrice: 29990000, rating: 4, reviews: 8,
        image: "/images/id23.jpg", badge: "new",
        desc: "Camera Zeiss chuyên nghiệp, màn hình 4K HDR, âm thanh Hi-Res.",
        specs: { "Màn hình": "6.5\" 4K HDR OLED", "Chip": "Snapdragon 8 Elite", "Camera": "Ống kính Zeiss, zoom quang 5x", "Âm thanh": "Hi-Res Audio, jack 3.5mm", "Pin": "5.000 mAh" }
    },
    {
        id: 24, name: "JBL Flip 7", brand: "JBL", category: "audio",
        price: 2390000, oldPrice: 2790000, rating: 4, reviews: 52,
        image: "/images/id24.jpg", badge: "",
        desc: "Loa di động nhỏ gọn, chống nước IP68, pin 16 giờ.",
        specs: { "Loại": "Loa di động", "Công suất": "30W", "Pin": "16 giờ", "Chống nước/bụi": "IP68" }
    },
    {
        id: 25, name: "Bose QuietComfort Ultra 2", brand: "Bose", category: "audio",
        price: 9290000, oldPrice: 10990000, rating: 5, reviews: 43,
        image: "/images/id25.jpg", badge: "hot",
        desc: "Chống ồn hàng đầu thị trường, âm thanh không gian immersive.",
        specs: { "Loại": "Over-ear không dây", "Chống ồn": "ANC thế hệ mới + chế độ Aware", "Pin": "24 giờ", "Kết nối": "Bluetooth 5.3, multipoint" }
    },
    {
        id: 26, name: "Marshall Emberton III", brand: "Marshall", category: "audio",
        price: 3490000, oldPrice: 3990000, rating: 4, reviews: 57,
        image: "/images/id26.jpg", badge: "sale",
        desc: "Thiết kế cổ điển, âm bass mạnh, chống nước IP67.",
        specs: { "Loại": "Loa di động", "Pin": "27 giờ", "Chống nước/bụi": "IP67", "Kết nối": "Bluetooth 5.3" }
    },
    {
        id: 27, name: "Apple Watch SE 3", brand: "Apple", category: "watch",
        price: 8990000, oldPrice: 9990000, rating: 4, reviews: 29,
        image: "/images/id27.jpg", badge: "",
        desc: "Lựa chọn tiết kiệm, đầy đủ tính năng theo dõi sức khỏe cơ bản.",
        specs: { "Màn hình": "Retina LTPO", "Chip": "S9 SiP", "Pin": "18 giờ", "Cảm biến": "Nhịp tim, phát hiện va chạm", "Chống nước": "50m" }
    },
    {
        id: 28, name: "Xiaomi Watch S4", brand: "Xiaomi", category: "watch",
        price: 3990000, oldPrice: 4490000, rating: 4, reviews: 48,
        image: "/images/id28.jpg", badge: "",
        desc: "Thiết kế sang trọng, pin 15 ngày, hơn 150 chế độ thể thao.",
        specs: { "Màn hình": "AMOLED HD", "Pin": "Lên đến 15 ngày", "Chế độ thể thao": "150+", "Chống nước": "5ATM" }
    },
    {
        id: 29, name: "Garmin Venu 4", brand: "Garmin", category: "watch",
        price: 14990000, oldPrice: 16990000, rating: 5, reviews: 17,
        image: "/images/id29.jpg", badge: "new",
        desc: "Theo dõi sức khỏe toàn diện, AMOLED sáng rõ, pin 10 ngày.",
        specs: { "Màn hình": "AMOLED cảm ứng", "Pin": "10 ngày (smartwatch mode)", "Cảm biến": "Nhịp tim, SpO2, ngủ, stress", "Chống nước": "5ATM" }
    },
    {
        id: 30, name: "Anker MagGo Power Bank 10000", brand: "Anker", category: "accessory",
        price: 1290000, oldPrice: 1590000, rating: 5, reviews: 22,
        image: "/images/id30.jpg", badge: "sale",
        desc: "Sạc dự phòng từ tính MagSafe, 10.000mAh, sạc nhanh 20W.",
        specs: { "Dung lượng": "10.000mAh", "Công suất": "20W", "Tính năng": "Sạc từ tính tương thích MagSafe", "Cổng": "USB-C" }
    },
    {
        id: 31, name: "Logitech MX Master 3S", brand: "Logitech", category: "accessory",
        price: 2190000, oldPrice: 2490000, rating: 5, reviews: 64,
        image: "/images/id31.jpg", badge: "",
        desc: "Chuột không dây cao cấp, cảm biến 8K DPI, click êm ái.",
        specs: { "Cảm biến": "Darkfield 8.000 DPI", "Pin": "Lên đến 70 ngày", "Kết nối": "Bluetooth / USB receiver", "Tương thích": "Windows, macOS, Linux" }
    },
    {
        id: 32, name: "Apple Pencil Pro", brand: "Apple", category: "accessory",
        price: 2990000, oldPrice: 3490000, rating: 5, reviews: 52,
        image: "/images/id32.png", badge: "new",
        desc: "Cảm ứng lực và xoay, độ trễ siêu thấp, sạc qua nam châm.",
        specs: { "Tương thích": "iPad có chip M-series/A-series mới", "Tính năng": "Squeeze, xoay (Barrel roll)", "Sạc": "Nam châm không dây", "Độ trễ": "Siêu thấp" }
    },
    {
        id: 33, name: "Samsung T9 Portable SSD 2TB", brand: "Samsung", category: "accessory",
        price: 3290000, oldPrice: 3790000, rating: 5, reviews: 37,
        image: "/images/id33.jpg", badge: "sale",
        desc: "Tốc độ đọc lên đến 2.000MB/s, vỏ nhôm chống va đập.",
        specs: { "Dung lượng": "2TB", "Tốc độ đọc": "2.000 MB/s", "Kết nối": "USB-C 3.2 Gen2", "Chống va đập": "Đạt chuẩn quân sự" }
    },
    {
        id: 34, name: "Lenovo ThinkPad X1 Carbon Gen 13", brand: "Lenovo", category: "laptop",
        price: 45990000, oldPrice: 49990000, rating: 4, reviews: 17,
        image: "/images/id34.jpg", badge: "sale",
        desc: "Siêu nhẹ, bền chuẩn quân đội, dành cho doanh nhân.",
        specs: { "CPU": "Intel Core Ultra 7", "RAM": "32GB LPDDR5x", "Màn hình": "14\" 2.8K OLED", "Trọng lượng": "1.12kg", "Bảo mật": "vPro, TPM 2.0" }
    },
    {
        id: 35, name: "Sony WF-1000XM6", brand: "Sony", category: "audio",
        price: 5990000, oldPrice: 6990000, rating: 5, reviews: 46,
        image: "/images/id35.jpg", badge: "sale",
        desc: "Tai nghe true wireless chống ồn hàng đầu, âm thanh Hi-Res LDAC.",
        specs: { "Loại": "True Wireless In-ear", "Chống ồn": "ANC kép tích hợp AI", "Pin": "8 giờ (24 giờ kèm hộp)", "Kết nối": "Bluetooth 5.4, LDAC" }
    }
];

/* Danh sách thương hiệu duy nhất, dùng để build bộ lọc động */
const ALL_BRANDS = [...new Set(PRODUCTS.map(p => p.brand))].sort();
