const { Router } = require('express');
const { check } = require('express-validator');
const { getUsers, getUser, postUser, putUser, deleteUser } = require('../controller/user');
const { fileUpload, fileUpload2 } = require('../middlewares/fileUpload');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validarJWT');

const router = Router();

router.get('/', getUsers);
router.get('/:id', [
    check('id', 'the id must be a number').isNumeric(),
    validarCampos
], getUser);
router.post('/',[
    // check('first_name','the name is required').not().isEmpty(),
    // check('email','the email is invalid').isEmail(),
    // check('pas','the password is invalid and must be a more than 5 characters').isLength({min: 5}),
    fileUpload2,
    validarCampos
], postUser);
router.put('/',[
    validarJWT,
    check('first_name','the name is required').not().isEmpty(),
    check('email','the email is invalid').isEmail(),
    check('pas','the password is invalid and must be a more than 5 characters').isLength({min: 5}),
    validarCampos
], putUser);
router.delete('/',[
    validarJWT,
    validarCampos
], deleteUser);

module.exports = router;
