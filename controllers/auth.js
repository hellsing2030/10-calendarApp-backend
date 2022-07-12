const {response} = require('express');
const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const { generateJWT }= require('../helpers/jwt');

const crearUsuario = async(req,res = response)=>{

    const { email, password }= req.body;

    
    try {
     let user = await User.findOne({email});
     
     if( user ){
        res.status(400).json({
            ok: false, 
            msg: ' el usuario ya existe con ese correo'
        })
    }

    // manejo de error  de datos
    user = new User( req.body );

    //encriptar la contraseña
    const salt = bcrypt.genSaltSync(12);
    user.password = bcrypt.hashSync(password, salt); 

    // guardado de usuario en base de datos
    await user.save();

    // generarn el json web token

    const token = await generateJWT( user.id, user.name );   

    res.status(201).json({
        ok:true,
        uid: user.id,
        name: user.name,
        token,   
    });

    } catch (error) {
        console.log( error );
        res.status(500).json({
            ok:false,
            error:'Por favor hablar con soporte tecnico u administrador'
        });


    }
};

const loginUsuarios = async(req,res = response)=>{
    const {email , password} = req.body;

    try {
        
        let user = await User.findOne({email});
        if( !user ){
            res.status(400).json({
             
                ok: false, 
                msg: 'el usuario no existe con este correo'
            })
        }
        // confirmar las contraseñas
        
        const validPassword = bcrypt.compareSync(password, user.password );

        if( !validPassword ){

            return res.status(400).json({
                ok: false,
                msg:' password incorrecto',
            })
        }
        //generar nuestro web token
        
        const token = await generateJWT(user.id, user.name);

        res.json({ 
            ok: true,
            uid: user.id,
            name: user.name,
            token: token,
        });
        
    } catch (error) {
        console.log( error );
        res.status(500).json({
            ok:false,
            error:'Por favor hablar con soporte tecnico u administrador'
        });
    }

}


const revalidarToken = async(req,res = response)=>{

    const { uid, name } = req;
    const token = await generateJWT(uid, name);

    res.status(201).json({
        ok:true,
        token
    });

}

module.exports = {
    crearUsuario,
    loginUsuarios,
    revalidarToken,
}