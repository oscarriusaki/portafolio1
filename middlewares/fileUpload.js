const multer = require('multer');
const path= require('path');
const { v4: uuidv4 } = require('uuid')

const diskStorage = multer.diskStorage({
    destination: path.join(__dirname, '../images'),
    filename: (req, file, cb) => {
        cb(null, uuidv4() + file.originalname)
    }
})

const fileUpload = multer({
    storage: diskStorage,
}).single('image');
const fileUpload2 = multer().single('email')

module.exports = {
    fileUpload,
    fileUpload2
}