const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const {validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
//==================================================================================
exports.autenticarUsuario = async (req, res) => {
  //01.Revisar si hay errores---------------------------------------------------->
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  //02.Extraer del request el email y password--------------------------------------------------->
  const { email, password } = req.body;
  try {
    //03.Revisar/Validar que se aun usuario registrado------------------------------------------------->
    let usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ msg: "El usuario no existe" });
    }
    //04.Revisar/Validar el password------------------------------------------------------->
    const passCorrecto = await bcryptjs.compare(password, usuario.password);
    if (!passCorrecto) {
      return res.status(400).json({ msg: "Password Incorrecto" });
    }
    //05.Si todo es correcto creamos el Json Web Token------------------------------------->
    const payload = {
      usuario: {
        id: usuario.id,
      },
    };

    //06.Firmar el JWT---------------------------------------------------------------->
    jwt.sign(payload,process.env.SECRETA,
      {
        expiresIn: 3600, //1 hora validacion en segundos
      },
      (error, token) => {
        if (error) throw error;
        res.json({ token }); //=> es lo mismo que esto   res.json({token: token});
        //por que la clau y el valor son lo mismo
      }
    );
  } catch (error) {}
};
//==================================================================================
//Devuelve que Usuario esta autenticado y te lo devuelve entero con todos los datos
exports.usuarioAutenticado = async (req, res) => {
  try {
      const usuario = await Usuario.findById(req.usuario.id).select('-password');
      res.json({usuario});
  } catch (error) {
      //console.log(error);
      res.status(500).json({msg: 'Hubo un error'});
  }
}