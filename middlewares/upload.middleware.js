const multer = require('multer');

const CustomError = require('../utils/error');

module.exports = multer({
    limits: {
        fileSize: 50 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new CustomError(400, "Only .png, .jpg and .jpeg format allowed!"));
        }
    }
})