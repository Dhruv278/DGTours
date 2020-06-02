const mongoose=require('mongoose');
const dotenv=require('dotenv'); 
dotenv.config({path: './config.env'});

console.log(process.env.NODE_ENV)
const db=process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD) ;

const app=require(`${__dirname}/app`);


process.on('unhandledRejection',function(err){

 
  process.exit(1);
})
// process.on('uncaughtException',function(err){
//   console.log(err.name,err.message);
//   process.exit(1);
  
// })
mongoose.connect(db,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology: true
}).then(con => console.log('database is connected'));


const port=3000;
app.listen(port,()=>{
    console.log(`server is listing on port ${port}`);
})