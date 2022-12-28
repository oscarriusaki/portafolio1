const { Router } = require('express');
const { login } = require('../controller/login');
const { fileUpload, fileUpload2 } = require('../middlewares/fileUpload');
const { validarCampos } = require('../middlewares/validarCampos');

const router = Router();

router.post('/', 
    fileUpload2, 
    validarCampos, 
login)

module.exports = router;
