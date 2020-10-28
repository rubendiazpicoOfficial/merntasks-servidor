const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

// exports.crearUsuario=(req, res)=> {
//     console.log(req.body);
// }

exports.crearUsuario = async (req, res) => {

  //01.Revisar si hay errores------------------------------------------------------------------>
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  //02.Extraer del request el email y password--------------------------------------------------->
  //¿Para que? email= validar usuario & password= Hashear el password ...mas abajo
  const { email, password } = req.body;
  
  try {
    
  
          //03. ¿Existe usuario?:Revisar que el usuario registrado sea unico------------------------------>
          let usuario = await Usuario.findOne({ email });
          if (usuario) {
            return res.status(400).json({ msg: "El usuario ya existe" });
          }

          //04.Crea el nuevo usuario----------------------------------------------->
          usuario = new Usuario(req.body);
          //05.Hash password------------------------------------------------------->
          const salt = await bcryptjs.genSalt(10);
          usuario.password = await bcryptjs.hash(password, salt);

          //06.Guardar/Crear usuario-------------------------------------------------------->
          await usuario.save();

          //07.Crear y firmar el JWT-------------------------------------------------->
          const payload = {
            usuario: {
              id: usuario.id,
            },
          };

          //08.Firmar el JWT//crea el JWT con el id/payload de referencia a ese usuario---->
          jwt.sign(payload,process.env.SECRETA,
            {
              expiresIn: 3600,//1 hora validacion en segundos
            },
            (error, token) => {
              if (error) throw error;
              res.json({token });
              //=> es lo mismo que esto   res.json({token: token});
              //por que la clau y el valor son lo mismo
            }
          );
          //09.Mensaje de confirmación--------------------------------------------------->
          // res.send('Usuario creado correctamente');
  } catch (error) {
          console.log(error);
          res.status(400).send("Hubo un error");
  }
};
