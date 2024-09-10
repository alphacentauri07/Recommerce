const ErrorHandler = require("../middleware/error");

module.exports = (err,req,res,next)=>{

err.statusCode = err.statusCode || 500,
err.message = err.message || "Internal Server Error"


// mongodb cast error --> when length of id is provided small it gives cast error

if(err.name ==="CastError"){
    err.statusCode = 400,
err.message = "resource not found"
}


res.status(err.statusCode).json({
    success:false,
    message:err.message,
});

};