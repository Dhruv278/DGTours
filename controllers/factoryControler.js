const catchAsync = require('./../utils/catchAsync');
const appError = require("./../utils/appError");
const APIFeature=require(`${__dirname}/../utils/apiFeatures`);



exports.deleteDoc = model => catchAsync(async (req, res, next) => {

    const doc = await model.findByIdAndDelete(req.params.id)

    if (!doc) return next(new appError(`the document does not contain valid id so we can't delete document`, 400))
    res.status(204).json({
        status: 'sucsecc'
    })

});


exports.UpdateDoc = model => catchAsync(async (req, res, next) => {

    const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!doc) return next(new appError("the document does not contain valid id so we can't Update document", 400))
    res.status(201).json({
        status: 'sucsecc',
        data: {
            doc
        }
    })

});

exports.CreateDoc = model => catchAsync(async (req, res, next) => {

    const doc = await model.create(req.body);
    if (!doc) return next(new appError("the document does not contain valid id so we can't create document", 400))

    res.status(201).json({
        status: 'sucsecc',
        data: {
            doc
        }
    })
});



exports.getOneDoc = (model, populateOption) => 
    catchAsync(async (req, res, next) => {

        let query = model.findById(req.params.id);
        if (populateOption) query = await model.findById(req.params.id).populate(populateOption);
        const doc = await query;
        if (!doc) {
            return next(new appError('there is invalid id', 404))
        }
        res.status(200).json({
            status: 'sucsecc',
            tour: doc,

        })
    })


exports.getAllDoc=(model)=>catchAsync( async (req, res,next) => {
    // filter is only for review bcz jyare specific tour id nakhe tyare khali tena j --
    //-- review dekhya and filter niche na api ficture che j api mathi query alag karva vapray.
    const filter={};
    if(req.params.tourId)filter={tour:req.params.tourId}
    const feature = new APIFeature(model.find(filter), req.query)
        .filter()
        .sort()
        .feild()
        .limit();
    const doc = await feature.query;

    if (!doc) {
        return next(new appError('there is invalid input api', 404))
    }
    // console.log(tours);
    res.status(200).json({
        status: 'sucsess',
        result:doc.length,
        data: {
           data:doc
        }
    });

    
});
