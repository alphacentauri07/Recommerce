const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

//register user----------------->

exports.registerUser = catchAsyncError( async(req,res,next)=>{

const {name,email,password}=req.body;

const user = await User.create({
      name,email,password,
      avatar:{
         public_id:"this is sample",
         url:"url"
      }
});

/*const token = user.getJWTToken();  // creating token   this is replace by common jwtTOken fn

res.status(201).json({
    sucess:true,
    //user, (we will send token not user)
    token,
}); 
*/

sendToken(user,201,res);

});

//login user------------------->


exports.loginUser = catchAsyncError( async(req,res,next)=>{

    const {email,password} = req.body;

    //checking if user has given password and email both

    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email & Password",400))
    }

    const user = await User.findOne({email}).select("+password");
 
    if(!user){
        return next(new ErrorHandler("Invalid Email or Password",401));
    }

    const isPasswordMatched = user.comparePassword(password); // this compare password function is made in models

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password",401));
    }

 /* const token = user.getJWTToken();  // this is replace by common jwtTOken fn

  res.status(200).json({ //if matches
    sucess:true,
    token,
}); */

sendToken(user,200,res);

});
              


// logout user

exports.logout = catchAsyncError(async(req,res,next)=>{

res.cookie("token",null,{            // we are making token = null in cookie
    expires: new Date(Date.now()),    
    httpOnly:true,
});


res.status(200).json({
    success:true,
    message:"Logged Out",
});
});


exports.forgotPassword = catchAsyncError(async(req,res,next)=>{

const user = await User.findOne({email:req.body.email});

if(!user){
    return next(new ErrorHandler("User not found" ,401));
}

// get reset password token

const resetToken = user.getResetPasswordToken();
 
await user.save({ validateBeforeSave:false});  // we are saving the token value as created in db becoz the user is already created earlier and when resetPasswordToken is generated it is not saved 

//const resetPAsswordUrl = `http://localhost/api/v1/password/reset/${resetToken}` // becoz using on local host

const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

const message = `Your password reset Token is: \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it`;

try{

    await sendEmail({
      email:user.email,
      subject:`Recommerce password recovery`,
      message,
    });

   res.status(200).json({
    success:true,
    message:`Email sent to ${user.email} succesfully`,
   })


}catch(error){  // we we dont find that email in database
    user.resetPasswordToken = undefined; // becoz we have saved the resetPasstoken, we need to undo it
    user.resetPasswordExpire = undefined;
     
    await user.save({validateBeforeSave: false});

    return next(new ErrorHandler(error.message,500));
}
});

// reseting password 


exports.resetPassword = catchAsyncError(async(req,res,next)=>{
// now in resetlink url their is token we need to access it and find user in db

const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
// now we had hash the token and we need to find the token in db

const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire:{$gt: Date.now()}, // this is condn that token expiry should be greater than today
});

if(!user){   
    return next(new ErrorHandler("Reset Password Token is Invalid or has been expired",400)); 
}

if(req.body.password!==req.body.confirmPassword){  // if enter password and confirm enter password does not match
    return next(new ErrorHandler("Password Does not match",400));
}

user.password=req.body.password;  // if they match update password in db

user.resetPasswordToken = undefined; //as password is updated we undifine this parameters
user.resetPasswordExpire = undefined;

await user.save();

sendToken(user,200,res);  // it will do login
});