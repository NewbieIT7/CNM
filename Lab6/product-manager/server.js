const express = require("express");
const path = require("path");
const fs = require("fs");
const productRoutes = require("./src/routes/productRoutes");
require("dotenv").config();

const app = express();

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/products", productRoutes);
app.get("/", (req, res) => res.redirect("/products"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));