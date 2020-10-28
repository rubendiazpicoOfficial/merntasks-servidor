const express = require("express");
const router = express.Router();
const proyectoController = require("../controllers/proyectoController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

//Crea un proyecto
//api/proyectos---------------------------------------------------------------->
router.post("/",
auth,
[
    check('nombre','El nombre es obligatorio').not().isEmpty(),

],
proyectoController.crearProyecto
);

//GET-------------------------------------------------------------------------->
//Obtener todos los proyectos
router.get("/",
auth,
proyectoController.obtenerProyectos
);
//PUT-------------------------------------------------------------------------->
//Update/Actualizar todos los proyectos OJO :id lo utiliza express como comodin ":id" por si le
//envia 1 id como si le envia 20
router.put("/:id",
auth,
[
    check('nombre','El nombre es obligatorio').not().isEmpty(),
],
proyectoController.actualizarProyecto
);
//DELETE-------------------------------------------------------------------------->
// Eliminar un Proyecto
router.delete('/:id', 
    auth,
    proyectoController.eliminarProyecto
);

module.exports = router;




