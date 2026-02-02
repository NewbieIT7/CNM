const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { upload, deleteS3Object } = require('../services/s3Service');
const { getAllProducts, saveProduct, deleteProduct, getProductById } = require('../services/dbService');

// Danh sách sản phẩm
router.get('/', async (req, res) => {
    try {
        const products = await getAllProducts();
        res.render('index', { products });
    } catch (error) {
        res.status(500).send("Lỗi: " + error.message);
    }
});

router.get('/add', (req, res) => res.render('add'));

router.post('/add', upload.single('image'), async (req, res) => {
    const { name, price, quantity } = req.body;
    const newProduct = {
        id: uuidv4(),
        name,
        price: Number(price),
        quantity: Number(quantity),
        url_image: req.file ? req.file.location : ""
    };
    await saveProduct(newProduct);
    res.redirect('/');
});

// Xử lý XÓA: Xóa trên S3 trước, sau đó xóa trong DB
router.post('/delete', async (req, res) => {
    try {
        const product = await getProductById(req.body.id);
        if (product && product.url_image) {
            await deleteS3Object(product.url_image);
        }
        await deleteProduct(req.body.id);
        res.redirect('/');
    } catch (error) {
        res.status(500).send("Lỗi khi xóa: " + error.message);
    }
});

router.get('/edit/:id', async (req, res) => {
    const product = await getProductById(req.params.id);
    res.render('edit', { product });
});

// Xử lý SỬA: Nếu có ảnh mới, xóa ảnh cũ trên S3
router.post('/edit', upload.single('image'), async (req, res) => {
    const { id, name, price, quantity, old_image_url } = req.body;
    let newImageUrl = old_image_url;

    if (req.file) {
        // Có upload ảnh mới -> xóa ảnh cũ trên S3 để dọn rác
        await deleteS3Object(old_image_url);
        newImageUrl = req.file.location;
    }

    const updatedProduct = {
        id: id,
        name,
        price: Number(price),
        quantity: Number(quantity),
        url_image: newImageUrl
    };
    await saveProduct(updatedProduct);
    res.redirect('/');
});

module.exports = router;