const fs = require('fs');
const mongoose = require('mongoose');
const Tours = require(`${__dirname}/../../schema/TourSchema`);
const User = require(`${__dirname}/../../schema/UserSchema`);
const Review = require(`${__dirname}/../../schema/reviewSchema`);

const dotenv = require('dotenv');


dotenv.config({ path: `${__dirname}/../../config.env` });


const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);


mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(con => console.log('database is connected'));


const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`))
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`))

const importData = async () => {
    try {
        await Tours.create(tours);
        await User.create(users,{validateBeforeSave:false});
        await Review.create(reviews);
        process.exit();
    } catch (err) {
        // console.log(err)
    }
};

const deleteData = async () => {
    try {
        await Tours.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        process.exit()

    } catch (err) {
        // console.log(err)
    }
}
if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
