const Tarea = require("../models/Tarea");
const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

//===========================================================================================
//Crear Tarea
exports.crearTarea = async (req, res) => {
  // 01.Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    //01.Extraer el proyecto para utilizarlo en Proyecto.findById(proyecto);
    const { proyecto } = req.body;

    //02.Comprueba si el proyecto existe con el ID
    const existeProyecto = await Proyecto.findById(proyecto);
    if (!existeProyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //03.Revisa el ID Usuario , si el proyecto pertenece a este ID usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }

    //04. Creamos la tarea
    const tarea = new Tarea(req.body);
    await tarea.save();
    res.json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};
//===========================================================================================
// Obtiene las tareas por proyecto
exports.obtenerTareas = async (req, res) => {
  try {
    //01.Extraer el proyecto para utilizarlo en Proyecto.findById(proyecto);
    //const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });
    const { proyecto } = req.query;

    //02.Comprueba si el proyecto existe con el ID
    const existeProyecto = await Proyecto.findById(proyecto);
    console.log(existeProyecto);
    if (!existeProyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //03.Revisa el ID Usuario , si el proyecto pertenece a este ID usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }

    //04.GET Obtener las tareas por proyecto
    const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });
    res.json({ tareas });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//===========================================================================================
// Update/ Actualizar tarea
exports.actualizarTarea = async (req, res) => {
  try {
    //01.Extraer del request body de los parametros que se pasan con PUT
    const { proyecto, nombre, estado } = req.body;
    //02.Comprueba si existe la tarea con el Id que se pasa por el Headaer req.params.id
    let tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      return res.status(404).json({ msg: "No existe esa tarea" });
    }
    //03.Comprueba si el proyecto exista que lo saca de aqui const { proyecto, nombre, estado } = req.body;
    const existeProyecto = await Proyecto.findById(proyecto);
    console.log(existeProyecto);
    //04.Revisa el ID Usuario , si el proyecto pertenece a este ID usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }
    //05.Crear un objeto con la nueva información
    const nuevaTarea = {};
    nuevaTarea.nombre = nombre;
    nuevaTarea.estado = estado;
    //06.Guardar la tarea
    tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, {
      new: true,
    });

    res.json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};
//===========================================================================================
// Delete/ Eliiminar tarea
exports.eliminarTarea = async (req, res) => {
  try {
        //01.Extraer del request body de los parametros que se pasan con DELETE
        const { proyecto } = req.query;
        //02.Comprueba si existe la tarea con el Id que se pasa por el Headaer req.params.id
        let tarea = await Tarea.findById(req.params.id);

        if (!tarea) {
          return res.status(404).json({ msg: "No existe esa tarea" });
        }
        //03.Comprueba si el proyecto exista que lo saca de aqui const { proyecto, nombre, estado } = req.body;
        const existeProyecto = await Proyecto.findById(proyecto);
        console.log(existeProyecto);
        //04.Revisa el ID Usuario , si el proyecto pertenece a este ID usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
          return res.status(401).json({ msg: "No Autorizado" });
        }
        //05.Eliminar
        await Tarea.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'Tarea Eliminada'})

  } catch (error) {
      console.log(error);
      res.status(500).send('Hubo un error');
  }
}