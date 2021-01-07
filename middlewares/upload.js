const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req,file, cb) {
        let ext = path.extname(file.originalname)
        cb(null, Date.now() + ext)
    }
});

const imageUpload = multer ({
    storage,
    fileFilter: function (req, file, cb) {
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg'
        ) {
            cb(null, true)
        }else {
            console.log('only jpg, jpeg & png file supported');
            cb(null, false);
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 2
    }
});

function uploader(req,res,next) {
    let url = "http://" + req.headers.host + "/" + req.file.path;
    res.status(202).json({url})
};

module.exports = { imageUpload, uploader };