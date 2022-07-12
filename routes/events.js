const express = require('express');
const { getEvents, createEvent, deleteEvent,updateEvent}= require('../controllers/events');
const { validedJWT } = require('../middlewares/validedJWT');
const { check } = require('express-validator');
const { fileValidator } = require('../middlewares/file-validators'); 
const isDate = require('../helpers/isDate');

const router = express.Router();

// todas las rutas tienen que pasar por validaciones del JWT
router.use( validedJWT );
// obtener eventos
router.get('/' ,getEvents);

// Crear un nuevo evento 
router.post(
    '/',
    [
        check('title', 'el titulo es obligatorio').not().isEmpty(),
        check('start','la fecha de inicio es obligatoria').custom( isDate),
        check('end','la fecha de finalizacion es obligatoria').custom( isDate),
        fileValidator
    ] 
    ,createEvent);

//actualizar evento 
router.post('/:id',
    [
        check('title', 'el titulo es obligatorio').not().isEmpty(),
        check('start','la fecha de inicio es obligatoria').custom( isDate),
        check('end','la fecha de finalizacion es obligatoria').custom( isDate),
        fileValidator   
    ] 
, updateEvent);

// eliminar evento 
router.delete('/:id', deleteEvent);

module.exports = router

