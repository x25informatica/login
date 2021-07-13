//Mongodb
require( './config/db' )


const app = require( 'express' )()
const port = process.env.PORT || 3000

const UserRouter = require( './api/User' )

//Para aceptar post
const bodyParser = require( 'express' ).json
app.use( bodyParser() )
app.use( '/user', UserRouter )


app.listen( port, () => {
  console.log( `Servidor corriendo en el puerto ${ port }` )
} )