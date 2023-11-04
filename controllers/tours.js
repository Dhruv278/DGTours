const fs = require('fs');
const Tours = require('./../schema/TourSchema');
const catchAsync = require('./../utils/catchAsync')
// const APIFeature=require(`${__dirname}/../utils/apiFeatures`);
let tourdata = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
const factory = require('./factoryControler');
const appError = require('./../utils/appError');


// /tour-Within/:distance/center/:latlng/unit/:unit

exports.GetTourLocation = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    const redius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1
    if (!lat || !lng) return next(new appError('please enter longitude and latitude'));

    const tours = await Tours.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], redius] } }
    })
    res.status(200).json({
        status: "sucsecc",
        result: tours.length,
        data: {
            tours
        }
    })
});



exports.getDistanceFromYourLocation = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    if (!lat || !lng) return next(new appError('please enter longitude and latitude'));
    const multiplier = unit === 'mi' ? 0.000621371 : 0.001
    const distances = await Tours.aggregate([
        {
            $geoNear: {
                near: {
                  type: 'Point',
                  coordinates: [lng * 1, lat * 1]
                },
                distanceField: 'distance'
            }   
        }
       

    ])


    res.status(200).json({
        status: 'sucsess',
        data: {
            distances
        }
    })

})


////////////////////////////////////////////////////////////////////////////////////
exports.getAllTours = factory.getAllDoc(Tours);

exports.postTours = factory.CreateDoc(Tours);
exports.getTourID = factory.getOneDoc(Tours, { path: 'review' });
exports.UpdateTour = factory.UpdateDoc(Tours);
exports.deleteTour = factory.deleteDoc(Tours);

exports.getTourState = catchAsync(async (req, res, next) => {

    // console.log('inside try');
    const state = await Tours.aggregate([
        {

            $match: { ratingsAverage: { $gte: 4 } }

        },
        {
            $group: {
                _id: '$difficulty',
                numOfTours: { $sum: 1 },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                avgPrice: { $avg: '$price' }


            }
        }
    ]);
    res.status(200).json({
        status: "sucsecc",
        message: state
    })
});

exports.monthlyTours = catchAsync(async (req, res, next) => {

    // console.log('in the try block');

    const year = req.params.year * 1;
    // console.log(year);
    const plan = await Tours.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numberOfTours: { $sum: 1 },
                tourNames: { $push: '$name' }
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $sort: { month: -1 }
        },
        {
            $project: { _id: 0 }
        }
    ])
    // console.log('end');

    res.status(200).json({
        status: "sucsecc",
        message: plan
    })

})

