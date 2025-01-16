
const app = require("./app");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary")
const connectDatabase = require("./config/database")

dotenv.config({path:"Backend/config/config.env"});



// this type of error like we type anything in between like console.log it will give error ,
//so that is why we are writing it at top so anything does not miss 
process.on("uncaughtException",(err)=>{
    console.log(err.message);
    console,log(`server is shutting down due to uncaught exception error`);
    process.exit(1); 
});



connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});  

const server = app.listen(process.env.PORT || 3000,()=>{

console.log(`server is running at http://localhost:${process.env.PORT}`)
});



//unhandled promise rejections --> mongodb url wrong so server closes automatically

process.on("unhandledRejection",(err)=>{                  // remove catch from database because it should be unhandled error if their is catch means 
                                                         // it can be handled 
   console.log(err.message);
   console.log(`server is shutting down due to unhandled promise Rejection`);

   server.close(()=>{
    process.exit(1);
   });
});