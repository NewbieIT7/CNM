const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const dir = 'uploads/';
        // Đọc danh sách file để tìm số thứ tự tiếp theo
        fs.readdir(dir, (err, files) => {
            let nextNumber = 1;
            if (files && files.length > 0) {
                // Lọc ra các tên file là số và tìm số lớn nhất
                const numbers = files
                    .map(f => parseInt(path.parse(f).name))
                    .filter(n => !isNaN(n));
                
                if (numbers.length > 0) {
                    nextNumber = Math.max(...numbers) + 1;
                }
            }
            // Tên file mới = Số tiếp theo + phần mở rộng (.jpg, .png...)
            cb(null, nextNumber + path.extname(file.originalname));
        });
    }
});

const upload = multer({ storage: storage });

// Cấu hình các route
router.get("/", productController.renderIndex);
router.get("/add", productController.renderAddForm);
router.post("/add", upload.single('img'), productController.handleCreate);
router.get("/edit/:id", productController.renderEditForm);
router.post("/edit/:id", upload.single('img'), productController.handleUpdate);
router.post("/delete/:id", productController.handleDelete);
router.get("/detail/:id", productController.renderDetail);

module.exports = router;