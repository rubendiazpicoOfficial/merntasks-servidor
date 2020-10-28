//Rutas para crear usuarios
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const {check} =require('express-validator');

//Crea un usuario
//su endpoint sera /api/usuarios
//en cristiano esto es un middleware
/**que recibe un request de tipo post
 * hacia la url /api/usuarios
 */
//Asi lo tenia con un arrow function 
//router.post('/',()=>{
// console.log('creando usuario')

// });
//POST-------------------------------------------------------------------------------->
//Crea un usuario
//api/usuario
router.post('/',

    [
        check('nombre','El nombre es obligatorio').not().isEmpty(),
        check('email','Agrega un email válido').isEmail(),
        check('password','El password debe ser minimo de 6 caracteres').isLength({min : 6})

    ],/**usuarioController.crearUsuario = esto quiere decir que como tenemos el import
    * const usuarioController = require('../controllers/usuarioController'); osea se va a ir al 
    * usuarioController.js y buscara la funcion .crearUsario = al de archivo usuarioController.js asi exports.crearUsuario=(req, res)=> {
    */
    usuarioController.crearUsuario
    );
//GET------------------------------------------------------------------------------------->








module.exports = router;