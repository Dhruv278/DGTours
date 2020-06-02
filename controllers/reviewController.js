const Review=require('./../schema/reviewSchema');
const catchAsync=require('./../utils/catchAsync');
const factory=require('./factoryControler');


exports.setTourAndUserId=(req,res,next)=>{
    if(!req.body.tour)req.body.tour=req.params.tourId;
    if(!req.body.user)req.body.user=req.user.id;
    next();
}

exports.getAllReviews=factory.getAllDoc(Review)
exports.createReview=factory.CreateDoc(Review);
exports.getReview=factory.getOneDoc(Review);
exports.deleteeview=factory.deleteDoc(Review);
exports.Updatereviews=factory.UpdateDoc(Review);