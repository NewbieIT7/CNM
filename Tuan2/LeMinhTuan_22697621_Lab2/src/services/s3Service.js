const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = new S3Client({ region: process.env.AWS_REGION });

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME,
        acl: 'public-read',
        metadata: (req, file, cb) => { cb(null, { fieldName: file.fieldname }); },
        key: (req, file, cb) => { cb(null, Date.now().toString() + "-" + file.originalname); }
    })
});

// Hàm xóa ảnh trên S3
const deleteS3Object = async (imageUrl) => {
    if (!imageUrl) return;
    try {
        // Trích xuất Key từ URL (lấy phần tên file sau dấu / cuối cùng)
        const key = imageUrl.split('/').pop();
        const command = new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key
        });
        await s3.send(command);
    } catch (error) {
        console.error("Lỗi xóa file S3:", error);
    }
};

module.exports = { upload, deleteS3Object };