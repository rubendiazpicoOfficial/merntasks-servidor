//Siempre importamos/inicializamos el modelo
const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");
//===========================================================================================
//Crear proyecto
exports.crearProyecto = async (req, res) => {
  try {
    //01.Revisar si hay errores------------------------------------------------------------------>
    //const errores es una array
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    //02.Crear un nuevo proyecto------------------------------------------------------------->
    const proyecto = new Proyecto(req.body);

    //03.Añadir via JWT el campo creador del proyecto= Id del Usuario----------------------->
    proyecto.creador = req.usuario.id;

    //04.Guardar/Crear el proyecto
    proyecto.save();
    res.json(proyecto);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};
//===========================================================================================
//Obtener todos los proyectos del usuario autenticado------------------------------------->
exports.obtenerProyectos = async (req, res) => {
  try {
    // console.log(req.usuario);
    const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({
      creado: -1,
    });
    res.json({ proyectos });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};
//===========================================================================================
//Actualiza un proyecto
exports.actualizarProyecto = async (req, res) => {
  //01.Revisar si hay errores------------------------------------------------------------------>
  //const errores es una array
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  //02.extraer la información dell proyect
  const { nombre } = req.body;
  const nuevoProyecto = {};

  if (nombre) {
    nuevoProyecto.nombre = nombre;
  }
  try {
    //03.Revisar el ID que se pasa por el Headaer req.params.id
    //console.log(req.params.id)
    let proyecto = await Proyecto.findById(req.params.id);

    //04.Si el proyecto existeok  si no existe se para en el return
    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //05.Verifica si el proyecto.creador es el mismo que esta autenticado
    //si no es return el error(si no cualquiera podria editar los proyecto de los demas)
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }

    //06.Actualizar / Update GUARDAR MODIFICADO
    proyecto = await Proyecto.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: nuevoProyecto },
      { new: true }
    );

    res.json({ proyecto });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
};
//===========================================================================================
//Eliminar un proyecto
exports.eliminarProyecto = async (req, res) => {
  try {
    //01.Revisar el ID  que se pasa por el Headaer req.params.id
    //console.log(req.params.id)
    let proyecto = await Proyecto.findById(req.params.id);

    //02.Si el proyecto existeok  si no existe se para en el return
    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //03.Verifica si el proyecto.creador es el mismo que esta autenticado
    //si no es return el error(si no cualquiera podria editar los proyecto de los demas)
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }

    //04. Eliminar el Proyecto
    await Proyecto.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Proyecto eliminado " });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
};
