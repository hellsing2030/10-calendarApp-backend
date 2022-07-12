const { response } = require('express');
const Event = require('../models/Event')

 const getEvents = async( req, res = response )=>{

    const events = await Event.find()
                              .populate('user', 'name')

        res.status(200).json({
            ok:true,
            events
        });
};

 const createEvent = async( req, res = response)=>{

    const event = new Event( req.body );
    try {
        
        event.user = req.uid; 

        const eventSaveDB = await event.save();

        res.status(201).json({
            ok:true, 
            event: eventSaveDB
        })

    } catch (error) {
        
        console.log( error );
        res.status(500).json({
            ok:false,
            error:'Por favor hablar con soporte tecnico u administrador'
        });

    }
 };


const updateEvent = async(req, res= response )=>{
    
    const eventId = req.params.id;
    const uid  = req.uid; 

    
    try {

        const event = await Event.findById( eventId );
        

        if( !event ){
            res.status(404).json({
                ok:false,
                msg:"no existe ese evento con ese id para editar"
            });
        }
        if( event.user.toString() !== uid){
            return res.status(401).json({
                ok:false,
                msg:"no tiene permiso de editar este elemento"
            });     
        }
        const newEvent ={
            ...req.body,
            user: uid
        }
        const eventUpdate = await Event.findByIdAndUpdate( eventId, newEvent,{ new: true});

        res.status(200).json({
            ok:true,
            event:eventUpdate,
        });
        
    } catch (error) {
        console.log( error );
        res.status(500).json({
            ok:false,
            error:'Por favor hablar con soporte tecnico u administrador'
        });
    }
};

const deleteEvent = async ( req , res = response)=>{

    const eventId = req.params.id;
    const uid  = req.uid; 

    
    try {

        const event = await Event.findById( eventId );
        

        if( !event ){
            return res.status(404).json({
                ok:false,
                msg:"no existe evento con ese id para eliminar"
            });
        }

        if( event.user.toString() !== uid){
            return res.status(401).json({
                ok:false,
                msg:"no tiene permiso para eliminar este evento"
            });     
        }

        const eventDelete = await Event.findByIdAndDelete( eventId,{ new: true});

        res.status(200).json({
            ok:true,
            event:eventDelete,
        });
        
    } catch (error) {
        console.log( error );
        res.status(500).json({
            ok:false,
            error:'Por favor hablar con soporte tecnico u administrador'
        });
    }
};


module.exports={
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
}