const express = require('express');
const ViewControler = require('./../controllers/viewController');
const userhandler = require(`${__dirname}/../controllers/user`)
const user = express();
const authentication = require(`${__dirname}/../controllers/authController`)
const tour = require('./../controllers/tours');
user.use(express.json());
const path = require('path')



const router = express.Router();
router.route('/forgotPassword').post(authentication.forgotPassword)
router.route('/resetPassword/:token').patch(authentication.resetPassword)
router.route('/login').post(authentication.logIN);
router.route('/logout').get(authentication.logout);
router.route('/signup').post(userhandler.uploadPhoto,userhandler.resizePhoto, authentication.signup)



router.use(authentication.checkToken); // for check the user is login or not

router.route('/updatePassword').patch(authentication.upadatePassword)
router.route('/updateMe').patch(userhandler.uploadPhoto,userhandler.resizePhoto,userhandler.UpadateData);
router.route('/Deleteaccount').patch(userhandler.DeleteAccount);

router.use(authentication.allowToSpecialRole('admin'))

router.route('/')
  .get(userhandler.getAllUser)
  .post(userhandler.ceaterUser)

router
  .route('/:id')
  .delete(userhandler.DeleteUser)
  .patch(userhandler.UpdateUser)
  .get(userhandler.getUser);



module.exports = router;