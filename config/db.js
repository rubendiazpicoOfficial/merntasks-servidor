
//copa//ORM de conexion
const mongoose = require('mongoose');

//dotenv para que pueda interpretar las variables de entorno
// .config e es path de donde puede encontrarlas
//si variables.env esta en otra carpeta tendras que poner
//toda la ruta
require('dotenv').config({ path: 'variables.env' });

//
console.log(process.env.DB_MONGO);
const conectarDB = async () => {
    try {
         //requerimos uno de los metodo de mongoose que es 
        //connect est e conect toma como 1 parametro la url 
        //donde se va a conectar= process.env.DB_MONGO// 2 parametro objeto de configuracion la 
        //=useNewUrlParser:true,   useUnifiedTopology: true,useFindAndModify:false
        //await mongoose.connect(process.env.DB_MONGO,{
        
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('DB Conectada');
    } catch (error) {
        console.log('hubo un error')
        console.log(error);
        process.exit(1); // Detener la app
    }
}
//module.export es como un import export default de react

module.exports = conectarDB;