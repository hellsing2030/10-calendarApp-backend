/*
    rutas de Usuarios /Auth
    host + /api/auth
*/
const express = require('express');
const { check } = require( 'express-validator');
const { crearUsuario, loginUsuarios, revalidarToken}= require('../controllers/auth');
const { fileValidator } = require('../middlewares/file-validators');
const { validedJWT } = require('../middlewares/validedJWT');

const router = express.Router();




router.post("/new",
    [//midelwares de register
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'el email es obligatorio').isEmail(),
        check('password', 'el password tiene que tener minimo 8 caracteres').isLength({ min:8 }),
        fileValidator
    ],
    crearUsuario );

router.post("/", 
    [// midelwares de login
        check('email', 'el correo es obligatorio').isEmail(),
        check('password', 'el password tiene que tener minimi 8 caracteres').isLength({ min:8 }),
        fileValidator
    ],
    loginUsuarios );

router.get("/renew", validedJWT ,revalidarToken);

module.exports = router;