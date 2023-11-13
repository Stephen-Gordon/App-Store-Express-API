const multer = require('multer');
const path = require('path');

const fileFilter = (req, file, cb) => {
    if(!file){
        req.imageError = "Image not uploaded";
        return cb(null, false);
    }
    else if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        req.imageError = "Image must be jpg|jpeg|png|gif";
        return cb(null, false);
    }
    else {
        return cb(null, true);
    }
};

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

module.exports = multer({ fileFilter, storage });