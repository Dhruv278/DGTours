const Tour=require('./../schema/TourSchema');
const Booking=require('./../schema/booking');
const catchAsync=require('./../utils/catchAsync'); 
 const appError=require('./../utils/appError');
 exports.alert=(req,res,next)=>{
      const { alert }=req.query;
      if(alert ==='booking'){
          res.locals.alert="Your Booking Will Be Successfull and if your booking doesn't show up here please check later."
      }
      next()
 }

 exports.devlopment=(req,res)=>{
     res.status(200).render('devlop')
 }
 exports.aboutus=(req,res)=>{
     res.status(200).render('aboutus')
 }


 exports.getOverview=catchAsync(async(req,res,next)=>{
    //  take all tours from database
     const tours=await Tour.find();
    res.status(200).render('overview',{
        title:'AllTours',
        tours  //pass thi tours to card and create multiple cards;
    })
})

exports.getTour=catchAsync(async(req,res,next)=>{
    // get tour
const tour=await Tour.findOne({slug:req.params.slug}).populate({
    path:'review',
    felids:'review rating user'
})

if(!tour)return next( new appError('There is no tour with that name.',404))
    res.status(200).render('tour',{
        title:`${tour.name}`,
        tour
    })
})

exports.logInPage=(req,res)=>{
    console.log('render login page')
    res.status(200).render('logIn',{
        title:'LogIn',
        method:'login'
    })
},

exports.signUpPage=(req,res)=>{
    res.status(200).render('signup',{
        title:'SignUp',
        method:'signup'

    })
}

exports.getAccount=(req,res)=>{
res.status(200).render('account',{
    title:'Your Account'
})
}
 exports.forgotpassword=(req,res)=>{
     res.status(200).render('ForgotPassword',{
         title:'Forgot Password'
     })
 }

 exports.resetpassword=(req,res)=>{
    res.status(200).render('resetpassword',{
        title:'Reset Password',
        
    })
 };
 exports.mytours=catchAsync(async(req,res,next)=>{

const userTours=await Booking.find({ user:req.user.id})

const tourId=await userTours.map(el=>el.tour)
// if(tourId.length==0)return next(new appError('You Booking list is empty ,please book first ',400))
const tours=await Tour.find({_id:{$in:tourId}});
res.status(200).render('overview',{
    title:"My Tours",
    tours
})

 })