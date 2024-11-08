// this fn is made to authenticate the routes i.e getAllProducts can only be access when someone login 

const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel")


exports.isAutheticatedUser = catchAsyncError(async(req,res,next)=>{

const {token} = req.cookies; //login ke time cookie me store kr liya tha token, but to use this we need "cookie parser" in app.js
                               
if(!token){
    return next(new ErrorHandler("Please Login to access the resource",401));
}
// if we find token
const decodedData = jwt.verify(token,process.env.JWT_SECRET);  // we are verifying token from cookie with jwt_secret if it verify we can give access or allow requests
 //this verifies the token against your secret key. If the token is valid, it decodes the payload, which usually includes user-specific information (like the user ID).

 req.user =  await User.findById(decodedData.id);

next();

});

exports.autorizeRoles = (...roles)=>{  // triple dot becoz we can perform array methods i.e includes

    return (req,res,next) =>{
     if(!roles.includes(req.user.role)){  // req.user.role will get role from database and it will check in roles(which is array) if it contains like admin 

       return next( new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource `,403));//if not admin it is set from product routes 
     }
     
     next();  // if admin

    };
};



