const express=require('express');
const router=express.Router();
const ViewControler=require('./../controllers/viewController');
const bookingController=require('./../controllers/booking');

const authentication=require('./../controllers/authController');
router.use(ViewControler.alert)
router.get('/me',authentication.checkToken,ViewControler.getAccount)

router.get('/',authentication.isLOGIN,ViewControler.getOverview)
router.get('/devlopment',authentication.isLOGIN,ViewControler.devlopment)
router.get('/about-us',authentication.isLOGIN,ViewControler.aboutus)

router.get('/tour/:slug',authentication.isLOGIN,ViewControler.getTour);

router.get('/signup',authentication.isLOGIN,ViewControler.signUpPage)
router.get('/login',authentication.isLOGIN,ViewControler.logInPage)
router.get('/fogotpassword',ViewControler.forgotpassword)
router.get('/resetPassword/:token',ViewControler.resetpassword)
router.get('/my-tours',authentication.checkToken,ViewControler.mytours)
module.exports = router;