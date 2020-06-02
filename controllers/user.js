const User = require('./../schema/UserSchema');
const catchAsync = require('./../utils/catchAsync')
const appError = require('./../utils/appError');
const factory=require('./factoryControler');
const sharp=require('sharp')


var multer = require('multer')

// let storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/img/users/")

//   },
//   filename: function (req, file, cb) {
//     // + '-' + Math.round(Math.random() * 1E9)
//     cb(null, Date.now() + '-' + user)
//   }
// })

let multerStorage=multer.memoryStorage()
  const fileFilter=(req,file,cb)=>{
    
      if(file.mimetype.startsWith('image/')){
          cb(null,true)
      }else{
          cb(new appError('please upload only image not other file',400),false)
      }
  }

let upload = multer({
  storage: multerStorage, 
 fileFilter:fileFilter 
}).single('file')

exports.uploadPhoto=upload
const filter=(obj,...allowedFeilds)=>{
    let newObj={};
    Object.keys(obj).forEach(el=>{
        if(allowedFeilds.includes(el))newObj[el]=obj[el];
    })
    return newObj;
}
exports.resizePhoto=(req,res,next)=>{
    if(!req.file) return next()
  req.file.filename= `${Date.now()}-user.jpeg`
    sharp(req.file.buffer).resize(500,500).toFormat('jpeg').jpeg({quality:90}).toFile(`public/img/users/${req.file.filename}`)
    next()
}



exports.UpadateData = catchAsync(async (req, res, next) => {
    // creata error when user try to update password

    if (req.body.password || req.body.confirm_password) return next(new appError('you can not change the password ,please use Update Password Function', 400))
//  2) fitlering obj bcz we don't want to upadate or other fields 
const filteredObj=filter(req.body,'name','email');
if(req.file)filteredObj.photo=req.file.filename


    const UpdatedUser=await User.findByIdAndUpdate(req.user.id,filteredObj,{
        new:true,
        runValidators:true
    });
 

    res.status(200).json({
        status:'success',
        user:{
           user:UpdatedUser
        }
    })
});


exports.DeleteAccount=catchAsync(async(req,res,next)=>{
    await User.findOneAndUpdate(req.user.id,{active:false},{
         new:true,
         runValidators:true,
     });
     res.status(204).json({
         status:"sucsess"
     })
})

exports.SetMe=(req,res,next)=>{
    req.params.id=req.user.id;
    next()
}
//   /////// ///////////// ////////////// /////////////// //////////////////// //////////////
exports.getAllUser =factory.getAllDoc(User);

// do not update password  
exports.getUser=factory.getOneDoc(User);
exports.UpdateUser=factory.UpdateDoc(User);
exports.DeleteUser =factory.deleteDoc(User);
exports.ceaterUser=factory.CreateDoc(User);