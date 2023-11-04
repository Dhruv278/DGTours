
////////////////////////////////////////////////////////////////////////////////////////////////////
const tourhandler=require(`${__dirname}/../controllers/tours.js`);
const express=require('express');
const router=express.Router();
const authentication = require(`${__dirname}/../controllers/authController`)
const reviewRouter=require('./review');
//for all tours
router.route('/plan/:year').get(tourhandler.monthlyTours);
router.route('/getTourState').get(tourhandler.getTourState);
router
.route('/')
.get(tourhandler.getAllTours)
.post(authentication.checkToken,authentication.allowToSpecialRole('admin','lead-guide'),tourhandler.postTours)
router.route('/tour-Within/:distance/center/:latlng/unit/:unit').get(tourhandler.GetTourLocation)
router.route('/distance/center/:latlng/unit/:unit').get(tourhandler.getDistanceFromYourLocation)
router.use('/:tourId/review',reviewRouter);
//for tour id
router
.route('/:id')
.get(tourhandler.getTourID)
.patch(authentication.checkToken,authentication.allowToSpecialRole('admin','lead-guide'),tourhandler.UpdateTour)
.delete(authentication.checkToken,authentication.allowToSpecialRole('admin','lead-guide'),tourhandler.deleteTour);

module.exports=router
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
