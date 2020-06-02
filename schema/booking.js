const mongoose=require('mongoose');


const bookingschema=mongoose.Schema({
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        require:[true,'tour name is must require ']

    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        require:[true,'user name is must require ']
    },
    price:{
        type:Number,
        require:[true,'price is must require']
    },

    paid:{
        type:Boolean,
        default:true
    },
    createAt:{
        type:Date,
        default:Date.now()
    }

})

bookingschema.pre(/^find/,function(next){
    this.populate('user').populate({
        path:'tour',
        select:'name'
    })
    next()
})

const bookings=mongoose.model('bookings',bookingschema);
module.exports=bookings