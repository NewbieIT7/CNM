const Product = require("../models/productModel");
const fs = require("fs");
const path = require("path");

// Hiển thị danh sách sản phẩm và thông báo
exports.renderIndex = async (req, res) => {
    try {
        const result = await Product.getAll();
        const { message, type } = req.query;
        res.render("index", { 
            products: result.Items || [], 
            message: message, 
            type: type || 'info' 
        });
    } catch (error) {
        res.status(500).send("Lỗi hệ thống: " + error.message);
    }
};

exports.renderAddForm = (req, res) => {
    res.render("add", { message: req.query.message });
};

// Xử lý thêm mới có kiểm tra dữ liệu
exports.handleCreate = async (req, res) => {
    const { name, price, unit_in_stock } = req.body;
    
    if (!name || !price || !unit_in_stock || !req.file) {
        return res.redirect("/products/add?message=Vui lòng nhập đầy đủ thông line và chọn ảnh!");
    }

    try {
        const data = {
            name,
            price: parseFloat(price),
            unit_in_stock: parseInt(unit_in_stock),
            url_image: `/uploads/${req.file.filename}`
        };
        await Product.create(data);
        res.redirect("/products?message=Thêm sản phẩm thành công!&type=success");
    } catch (error) {
        res.redirect(`/products?message=Lỗi: ${error.message}&type=danger`);
    }
};

exports.renderEditForm = async (req, res) => {
    try {
        const result = await Product.getById(req.params.id);
        res.render("edit", { product: result.Item, message: req.query.message });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Cập nhật sản phẩm và thay thế ảnh cũ
exports.handleUpdate = async (req, res) => {
    const { name, price, unit_in_stock } = req.body;

    if (!name || !price || !unit_in_stock) {
        return res.redirect(`/products/edit/${req.params.id}?message=Thông tin không được để trống!`);
    }

    try {
        const current = await Product.getById(req.params.id);
        const oldImagePath = current.Item.url_image;
        
        const newData = {
            name,
            price: parseFloat(price),
            unit_in_stock: parseInt(unit_in_stock),
            url_image: oldImagePath
        };

        if (req.file) {
            newData.url_image = `/uploads/${req.file.filename}`;
            // Xóa file ảnh cũ để dọn dẹp bộ nhớ
            if (oldImagePath) {
                const fullOldPath = path.join(__dirname, "../../", oldImagePath);
                if (fs.existsSync(fullOldPath)) fs.unlinkSync(fullOldPath);
            }
        }

        await Product.update(req.params.id, newData);
        res.redirect("/products?message=Cập nhật thành công!&type=success");
    } catch (error) {
        res.redirect(`/products?message=Lỗi: ${error.message}&type=danger`);
    }
};

// Xóa sản phẩm và xóa ảnh tương ứng
exports.handleDelete = async (req, res) => {
    try {
        const result = await Product.getById(req.params.id);
        const imagePath = result.Item ? result.Item.url_image : null;

        await Product.delete(req.params.id);

        if (imagePath) {
            const fullPath = path.join(__dirname, "../../", imagePath);
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        }
        res.redirect("/products?message=Đã xóa sản phẩm và ảnh!&type=warning");
    } catch (error) {
        res.redirect(`/products?message=Lỗi khi xóa: ${error.message}&type=danger`);
    }
};

exports.renderDetail = async (req, res) => {
    try {
        const result = await Product.getById(req.params.id);
        if (!result.Item) {
            return res.redirect("/products?message=Sản phẩm không tồn tại!&type=danger");
        }
        res.render("detail", { product: result.Item });
    } catch (error) {
        res.status(500).send("Lỗi hệ thống: " + error.message);
    }
};