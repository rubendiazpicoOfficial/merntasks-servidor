const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  //01.Leer el token del header
  const token = req.header("x-auth-token");
  // console.log(token);
  
  //02.Revisar si no hay token
  if (!token) {
    return res.status(401).json({ msg: "No hay Token , permiso no válido" });
  }

  //03.Validar el token
  try {
    const cifrado = jwt.verify(token, process.env.SECRETA); 
    //04 Recuperar el Id Usuario del Token
    //OJO esta información se guarda en el request que se pasa
    //next() a la siguiente función del controler por ejemplo
    //exports.autenticarUsuario = async (req, res) => { en este
    //req. ya va dentro req.usuaario como que cifrado usuario se
    //añade a req entonces req.usuario
    req.usuario = cifrado.usuario;
    req.ritaCantora="Rita la Cantaora";

    //05.next(): pasar el siguiente middleware
    next();
  
} catch (error) {
    res.status(401).json({ msg: "Token no válido" });
  }
};
