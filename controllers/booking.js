const Tours = require('../schema/TourSchema');
const booking = require('../schema/booking');
const User = require('../schema/UserSchema');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const catchAsync = require('../utils/catchAsync')
// const APIFeature=require(`${__dirname}/../utils/apiFeatures`);
const factory = require('./factoryControler');
const appError = require('../utils/appError');

exports.checkoutSession = catchAsync(async (req, res, next) => {
   
    const tour = await Tours.findById(req.params.tourId)
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                name: `${tour.name} Tour`,
                description: tour.summary,
                images: [`https://dgtours.herokuapp.com/img/tours/${tour.imageCover}`],
                amount: tour.price * 75*100,
                currency: 'inr',
                quantity: 1
            }
        ]
    });



   
    res.status(200).json({
        data: {
            session
        }
    })
})

const createBookingCheckout=async(session)=>{
    const tour=session.client_reference_id;
    const user=(await User.findOne({ email:session.customer_email})).id
    const price=session.display_items[0].amount
     await booking.create({ tour ,user,price });
} 

exports.webhook=(req,res,next)=>{
    const signature=req.headers['stripe-signature'];
    let event;
    try{
     event=stripe.webhooks.constructEvent(req.body,signature,process.env.STRIPE_SECRET)
}catch(err){
   return res.status(400).send(`EBHOOK error:${err.message}`)  
}

if(event.type ==='checkout.session.completed')
createBookingCheckout(event.data.object); 

res.status(200).json({received:true});
}