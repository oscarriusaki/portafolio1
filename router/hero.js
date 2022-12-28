const { Router } = require('express');
const { getHeros, getHero, postHero, putHero, deleteHero, getImageULR } = require('../controller/hero');
const { fileUpload } = require('../middlewares/fileUpload');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validarJWT');

const router = Router();
router.get('/',[
    validarJWT,
    validarCampos
], getHeros);
router.get('/:id', [
    validarJWT,
    validarCampos
], getHero );
router.get('/image/:id', getImageULR)
router.post('/',[
    validarJWT,
    fileUpload,
    validarCampos
], postHero);
router.put('/',[
    validarJWT,
    validarCampos
], putHero);
router.delete('/:id',[
    validarCampos,
    validarJWT
], deleteHero);

module.exports = router;
