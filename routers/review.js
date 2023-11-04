const reviewHandler = require('./../controllers/reviewController');
const express = require('express');
const router = express.Router({ mergeParams: true });
const authentication = require('./../controllers/authController');

router.use(authentication.checkToken)
router.route('/')
    .get( reviewHandler.getAllReviews)
    .post( authentication.allowToSpecialRole('user'),reviewHandler.setTourAndUserId, reviewHandler.createReview);

router.route('/:id').get(reviewHandler.getReview)
    .patch(authentication.checkToken, authentication.allowToSpecialRole('user','admin'), reviewHandler.Updatereviews)
    .delete(authentication.checkToken, authentication.allowToSpecialRole('user','admin'), reviewHandler.deleteeview)

module.exports = router;