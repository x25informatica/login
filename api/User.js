const express = require( 'express' )
const router = express.Router()
const User = require( './../models/User' )
const bcrypt = require( 'bcrypt' )

//Signup
router.post( '/signup', ( req, res ) => {
  let { name, email, password, dateOfBirth } = req.body
  name = name.trim()
  email = email.trim()
  password = password.trim()
  dateOfBirth = dateOfBirth.trim()

  if ( name == '' || email == '' || password == '' || dateOfBirth == '' )
  {
    res.json( {
      status: "FAILED",
      message: "Hay campos vacios!"
    } )
  } else if ( !/^[a-zA-Z ]*$/.test( name ) )
  {
    res.json( {
      status: "FAILED",
      message: "Nombre invalido"
    } )
  } else if ( !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test( email ) )
  {
    res.json( {
      status: "FAILED",
      message: "Email invalido"
    } )
  } else if ( !new Date( dateOfBirth ).getTime() )
  {
    res.json( {
      status: "FAILED",
      message: "Fecha de nacimiento invalida"
    } )
  } else if ( password.length < 8 )
  {
    res.json( {
      status: "FAILED",
      message: "La longitud del password debe ser mayor a 7"
    } )
  } else
  {
    //chequear si existe el usuario
    User
      .find( { email } )
      .then( result => {
        if ( result.length )
        {
          res.json( {
            status: "FAILED",
            message: "El email ya existe!"
          } )
        } else
        {
          //Crear un nuevo usuario


          //Encryptar el password
          const saltRounds = 10
          bcrypt
            .hash( password, saltRounds )
            .then( hashedPassword => {
              const newUser = new User( {
                name,
                email,
                password: hashedPassword,
                dateOfBirth
              } )

              newUser
                .save()
                .then( result => {
                  res.json( {
                    status: "SUCCESS",
                    message: "Usuario registrado satisfactoriamente!",
                    data: result,
                  } )
                } )
                .catch( err => {
                  console.log( err )
                  res.json( {
                    status: "FAILED",
                    message: "Ocurrio un error al crear usuario!"
                  } )
                } )
            } )
            .catch( err => {
              console.log( err )
              res.json( {
                status: "FAILED",
                message: "Ocurrio un error mientras se encryptaba el password!"
              } )
            } )
        }
      } )
      .catch( err => {
        console.log( err )
        res.json( {
          status: "FAILED",
          message: "Error mientras se chequeaba si exite el usuario!"
        } )
      } )

  }
} )

//Signin
router.post( '/signin', ( req, res ) => {
  let { email, password } = req.body
  email = email.trim()
  password = password.trim()

  if ( email == '' || password == '' )
  {
    res.json( {
      status: "FAILED",
      message: "Ingresa las credenciales!"
    } )
  } else
  {
    //Verificar si el usuario existe
    User
      .find( { email } )
      .then( data => {
        if ( data.length )
        {                       //el usuario existe
          const hashedPassword = data[ 0 ].password
          bcrypt
            .compare( password, hashedPassword )
            .then( result => {
              if ( result )
              {                 //password coincide               
                res.json( {
                  status: "SUCCESS",
                  messagge: "Logueo exitoso!",
                  data: data
                } )
              } else
              {
                res.json( {
                  status: "FAILED",
                  message: "Password invalido!"
                } )
              }
            } )
            .catch( err => {
              res.json( {
                status: "FAILED",
                message: "Ocurrio un error al comparar passwords!"
              } )
            } )
        } else
        {
          res.json( {
            status: "FAILED",
            message: "Credenciales ingresadas invalidas!"
          } )
        }
      } )
      .catch( err => {
        res.json( {
          status: "FAILED",
          message: "Ocurrio un error mientras se verificaba si el usuario existe!"
        } )
      } )
  }

} )

module.exports = router