const dotenv=require('dotenv'); 
const mongoose=require('mongoose');
dotenv.config({path: './config.env'});

// console.log(process.env.NODE_ENV)

const app=require(`${__dirname}/app`);


process.on('unhandledRejection',function(err){
console.log(err)
 
  process.exit(1);
})
process.on('uncaughtException',function(err){
  console.log(err.name,err.message);
  process.exit(1);
  
})
console.log("working")

mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology: true
}).then(con => console.log('database is connected'));


const port=process.env.PORT ||3000;
console.log(port)
const server=app.listen(port,()=>{
    console.log(`server is listing on port ${port}`);
})
process.on('SIGTERM',()=>{
  console.log('SIGTERM is working')
  server.close(()=>{
    console.log('process terminated')
  })
})