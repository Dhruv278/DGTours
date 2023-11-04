const fs = require('fs');
const GlobalErrorHandler = require('./controllers/errorControler');
const bookingcontroller = require('./controllers/booking');
const express = require('express');
const app = express();
const appError = require('./utils/appError');
const morgan = require('morgan')
const tourrouter = require('./routers/tours');
const userrouter = require('./routers/user');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const xss = require('xss-clean');
const reviewroute = require('./routers/review');
const bookingroute = require('./routers/booking');
const path = require('path');
const viewRouter=require('./routers/view')
const cookieParser=require('cookie-parser');
const compression=require('compression')
const cors=require('cors')
app.enable('trust proxy')
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(cors())
app.options('*',cors)
app.post('/webhook-chekout',express.raw({type:'application/json'}),bookingcontroller.webhook)
// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, '/public')));

// console.log(app.use(express.static(path.join(__dirname, 'public'))))
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser())
/// for post the json file
// data senitize from nosql query
app.use(mongoSanitize());
//  protect gata from html code
app.use(xss());

// to control parameter pollution
app.use(hpp({
    whitelist: ["difficulty", 'ratingsAverage', "duration", "maxGroupSize", "price"]
}))

app.use(compression())
/// all holder 
// app.use(morgan('dev'))

// app.use((req,res,next)=>{
//     console.log("hi i ma fro midleware");
//     next();
// })
const limit = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'you attemp so many request from this IP plaese do it agian after one hour'
})
app.use('/api', limit);



app.use('/',viewRouter);
app.use('/api/v1/tours', tourrouter);
app.use('/api/v1/user', userrouter);
app.use('/api/v1/review', reviewroute);
app.use('/api/v1/booking', bookingroute);
app.use('*', (req, res, next) => {
    next(new appError(`can't find`, 404));
    
})

// global err handler
app.use(GlobalErrorHandler)
module.exports = app;