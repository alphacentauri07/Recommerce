const ErrorHandler = require("../middleware/error");

module.exports = (err,req,res,next)=>{

err.statusCode = err.statusCode || 500,
err.message = err.message || "Internal Server Error"


// mongodb cast error --> when length of id is provided small it gives cast error

if(err.name ==="CastError"){
const message = `Resource not found. Invalid: ${err.path}`;
err=new ErrorHandler(message,400);
}

// moongoose duplicate key error

if(err.code === 11000){
    const message = `Duplicate ${object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message,400);
}

// wrong JWT error

if(err.name === "JsonWebTokkenError"){
    const message = `Json Web Token is Expired, Try again`;
    err = new ErrorHandler(message,400);
}
 
// JWT EXPIRE error
if(err.name === "TokenExpiredError"){
    const message = `Json Web Token is Expired, Try again`;
    err = new ErrorHandler(message,400);
}



res.status(err.statusCode).json({
    success:false,
    message:err.message,
});

};