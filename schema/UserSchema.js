const mongoose = require('mongoose');
const crypto = require('crypto');
const validate = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, 'UserName must Require'],
        minlength: [2, 'minimum length of name is 2 '],
      

    },
    email: {
        type: String,
        require: [true, 'email is must require'],
        lowercase: true,
        unique: true,
        validate: [validate.isEmail, 'please enter the valid email'],
        validate:{
            validator: function(el) {
                return el.match(/^[\w.+\-]+@gmail\.com$/)
              },
              message: 'plaese use gmail or yahoo or hotmail'
        }

        },
   
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        require: [true],
        minlength: [8, 'please enter the password of charecter 8'],

    },
    confirm_password: {
        require: true,
        type: String,
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function(el) {
              return el === this.password 
            },
            message: 'Passwords are not the same!'
          }
        },
        active:{
            type:Boolean,
            default:true
        },
    passwordChangedAt: Date,
    passwordResetToken: {
        type: String
    },
    resetPasswordTokenExpireAT: Date,
    photo:String

});
UserSchema.pre(/^find/,async function(next){
  this.find({active:{$ne:false}});
  next()
})
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password'))
        return next();
    this.password = await bcrypt.hash(this.password,12);
    this.confirm_password = undefined;
    next()
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password') || this.isNew) return next();
       
    this.passwordChangedAt = Date.now() - 1000
    // bcz token sathe kam karta var l;age to pela token bane pachi date set  thay jethi token invalid ganay
    next();
})

UserSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

 
        return JWTTimestamp < changedTimestamp;
    }
    // False means NOT changed
    return false;
}
;

UserSchema.methods.CheckedPassword = async(enterpassword,userpassword)=>{
    
    return await bcrypt.compare(enterpassword,userpassword)

}
;
//  /////////////////////////////////////////////////////////////////

UserSchema.methods.sendTokenForForgottenPsaaword = async function() {
    // create token
    const resetToken = crypto.randomBytes(32).toString('hex');
// convert into crypto from to save safely in database
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
 

    this.resetPasswordTokenExpireAT = Date.now() + 10 * 60 * 1000;
    await this.save({validateBeforeSave:false})
    return resetToken;
}
const User = mongoose.model('User', UserSchema);
module.exports = User;
