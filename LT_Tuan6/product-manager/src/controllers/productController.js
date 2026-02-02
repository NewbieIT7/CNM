const Product = require("../models/productModel");

exports.renderIndex = async (req, res) => {
    try {
        const result = await Product.getAll();
        res.render("index", { products: result.Items || [] });
    } catch (error) {
        res.status(500).send("Lỗi: " + error.message);
    }
};

exports.renderAddForm = (req, res) => res.render("add");

exports.handleCreate = async (req, res) => {
    try {
        const data = {
            name: req.body.name,
            price: req.body.price,
            img: req.file ? `/uploads/${req.file.filename}` : ''
        };
        await Product.create(data);
        res.redirect("/products");
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.renderEditForm = async (req, res) => {
    try {
        const result = await Product.getById(req.params.id);
        res.render("edit", { product: result.Item });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.handleUpdate = async (req, res) => {
    try {
        const current = await Product.getById(req.params.id);
        const newData = {
            name: req.body.name,
            price: req.body.price,
            img: req.file ? `/uploads/${req.file.filename}` : current.Item.img
        };
        await Product.update(req.params.id, newData);
        res.redirect("/products");
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.handleDelete = async (req, res) => {
    try {
        await Product.delete(req.params.id);
        res.redirect("/products");
    } catch (error) {
        res.status(500).send(error.message);
    }
};