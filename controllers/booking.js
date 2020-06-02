const Tours = require('../schema/TourSchema');
const booking = require('../schema/booking');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const catchAsync = require('../utils/catchAsync')
// const APIFeature=require(`${__dirname}/../utils/apiFeatures`);
const factory = require('./factoryControler');
const appError = require('../utils/appError');

exports.checkoutSession = catchAsync(async (req, res, next) => {
   
    const tour = await Tours.findById(req.params.tourId)
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                name: `${tour.name} Tour`,
                description: tour.summary,
                images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
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

exports.saveBookin=catchAsync(async(req,res,next)=>{

    const { tour,user,price }=req.query
    if(!tour && !user && !price) return next()

    await booking.create({ tour,user,price })
 
res.redirect(req.originalUrl.split('?')[0])

})