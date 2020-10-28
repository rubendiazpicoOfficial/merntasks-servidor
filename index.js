const express = require("express");
//importamos la configuaracion de db.justify
const connectarDB = require('./config/db');
const cors = require ('cors');

//crear el servidor
const app = express();

//y despues de que se inicie express "const app = express();"
//conectamos con la base de datos y como es una arrow function
//const connectarDB = async () => { en db.js lo llamamos 
//conectamos a la Base de datos
connectarDB();

//habilitar cors
app.use(cors());

//Habilitar express.json
/**Dice que antes del express.json se utilizaba var bodyParser = require('body-parser')
 * a ver con esto que habilitamos que puedas utilizar aplication/json como en el ejemplo del postman
Le estamos diciendo al Express que cuando le hagan una consulta se lo van a dar / y lo tienes que 
transformar en un Json*/
app.use(express.json({ extend:true}));//FE CIEGA


//puerto de la app
const port = process.env.PORT || 4000;
//process.env.PORT || 4000;
/*a ver ha dicho que el puerto 4000 puede ser el numero
que queramos MENOS 3000 por que el cliente ser puerto
3000
process.env.PORT esto ese un variable de entorno que cuando
vayamos hacer el deploy en Heroku buscara esta variable de entorno
*/

// //Definir la pagina principal
// app.get('/',(req,res)=>{
//     res.send('Hola Mundo')
// });

//Importamos todas las rutas//Dice cada uno de estos app.use en middleware 
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));


// arrancar la app
app.listen(port, '0.0.0.0', () => {
  console.log(`El servidor esta funcionando en el puerto ${PORT}`);
});
