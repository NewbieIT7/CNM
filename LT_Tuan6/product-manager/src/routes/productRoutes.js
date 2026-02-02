const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

router.get("/", productController.renderIndex);
router.get("/add", productController.renderAddForm);
router.post("/add", upload.single('img'), productController.handleCreate);
router.get("/edit/:id", productController.renderEditForm);
router.post("/edit/:id", upload.single('img'), productController.handleUpdate);
router.post("/delete/:id", productController.handleDelete);

module.exports = router;