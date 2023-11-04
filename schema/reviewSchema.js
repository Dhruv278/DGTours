const mongoose = require('mongoose');
const Tour = require('./TourSchema');

const reviewSchema = mongoose.Schema({
    rating: {
        type: Number,
        require: [true, 'reviwe is most require'],
        min: [1, 'rating is must is grater than 1'],
        max: [5, 'max rsting is 5']
    },
    review: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        defualt: Date.now()
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        require: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require: true
    }

},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);


reviewSchema.index({tour:1,user:1},{unique:true});
reviewSchema.pre(/^find/, function (next) {
    // console.log('in populate');
    this.populate({
        path: 'user',
        select: 'name photo'
    })
    next()
})
//  to calculate ratingavg
reviewSchema.statics.calcRatings = async (tourId) => {
    // console.log('inside static method')
    const stats = await Reviews.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                NumOfRating: { $sum: 1 },
                ratingAvg: { $avg: '$rating' },
            }
        }
    ])
    // console.log(stats);
    if (stats.length > 0) {
        Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: stats[0].ratingAvg,
            ratingsQuantity: stats[0].NumOfRating
        })
    } else {
        Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: 0,
            ratingsQuantity: 2.5
        })
    }
};


reviewSchema.post('save', function () {
    this.constructor.calcRatings(this.tour);

});
//  for update review /////////////////////////////

reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    next();
});
reviewSchema.post(/^findOneAnd/, async function () {
    await this.r.constructor.calcRatings(this.r.tour);
})
//  ////////////////////////////////////////

const Reviews = mongoose.model('Reviews', reviewSchema);
module.exports = Reviews;