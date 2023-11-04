const booking = require('./../controllers/booking');
const express = require('express');
const router = express.Router({ mergeParams: true });
const authentication = require('./../controllers/authController');




router.use(authentication.checkToken)
router.get('/checkout-session/:tourId',booking.checkoutSession)
module.exports=router