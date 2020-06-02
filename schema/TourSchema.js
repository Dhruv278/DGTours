const mongoose = require('mongoose');
const slugify = require('slugify');
const tourSchema = new mongoose.Schema({
    name: {
        require: [true, 'must have a name'],
        type: String,
        unique: [true, 'tour has uniqe name'],
        maxlength: [40, 'The lenth is max of 40'],
        minlength: [10, 'The lenth is min of 10']

    },
    slug:String,
    ratingsAverage: {
        default: 2.4,
        type: Number,
        max: [5, 'max is 5'],
        min: [1, 'min is 5'],
        set:val=>Math.round(val*10)/10
    },
    price: {
        require: true,
        type: Number
    },

    duration: {
        type: Number,
        trim: true,
        require: true
    },
    maxGroupSize: {
        type: Number,
        require: true
    },
    difficulty: {
        type: String,
        default: "medium",
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'you enter diffrent dificulty'
        }
    },
    ratingsQuantity: Number,
    summary: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        require: true
    },
    images: [String],
    startDates: [Date],
    EnterAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        // index: '2dsphere',
        description: String,
        address: String,
    },
   

    guides: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    locations: Array,

    secretTour: {
        default: false,
        type: Boolean,
        select: false

    }

},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);
tourSchema.index({ startLocation: '2dsphere' });
tourSchema.index({price:1 , ratingsAverage:-1});
tourSchema.index({slug:1});// index thi time ghate but a function je query vadhare use thay eni per j lagavavu dhyan rakhi ne
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7
}) // schema mathi kai define karva mate

tourSchema.virtual('review',{
ref:'Reviews',
foreignField:'tour',
localField:'_id'
})

tourSchema.pre(/^find/,function(next){
    this.populate({
        path:'guides',
        select:'-__v -passwordChangedAt  -password '
    });
    next();
})
// mongoose midleware

// document midleware
// a midleware  .save()  .create() mate j vapray khali bija mate na vapray a midle ware save karva pela exicute thay

tourSchema.pre('save',function(next){
    this.slug=slugify(this.name,{lower:true});
    next();

})
// query midle ware
// only see secrete toure
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    next();
});

// tourSchema.pre('aggregate', function (next) {
//     this.pipeline().unshift({
//         $match: { secretTour: { $ne: true } }
//     })
//     next()
// })
// .pre ni jem .post pan ave j apply thai jay query pachi kam kare
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;