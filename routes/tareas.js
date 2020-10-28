const express = require("express");
const router = express.Router();
const tareaController = require("../controllers/tareaController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

//POST crear una tarea--------------------------------------------->
// api/tareas
router.post("/",
  auth,
  [
    check("nombre", "El Nombre es obligatorio").not().isEmpty(),
    check("proyecto", "El Proyecto es obligatorio").not().isEmpty(),
  ],
  tareaController.crearTarea
);
//GET--------------------------------------------------------------->
// Obtener las tareas por proyecto
router.get('/',
    auth,
    tareaController.obtenerTareas
);
//PUT--------------------------------------------------------------->
// Update Actualizar Tarea
router.put('/:id', 
    auth,
    tareaController.actualizarTarea
);
//DELETE-------------------------------------------------------------->
router.delete('/:id', 
    auth,
    tareaController.eliminarTarea
);

module.exports = router;
