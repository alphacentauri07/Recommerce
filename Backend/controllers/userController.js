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

    const isPasswordMatched = await user.comparePassword(password); // this compare password function is made in models

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
              


// logout user------------------------------------------------------->

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

// get reset password token via mail -------------------->

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

// reseting password------------------>


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


// get users(admin) detail---------------------->>

exports.getUserDetails = catchAsyncError(async(req,res,next)=>{

    const user = await User.findById(req.user.id);

    // if(!user) their will always be user  

    res.status(200).json({
        success:true,
       user
    });

});

// update user password---------------------------->

exports.updatePassword = catchAsyncError(async(req,res,next)=>{

    const user = await User.findById(req.user.id).select("+password"); // becoz we are also selecting user with password

   const isPasswordMatched = await user.comparePassword(req.body.oldPassword);         // we will verify the oldpassword entered with old password store in db

   if(!isPasswordMatched){
    return next(new ErrorHandler("Old password is incorrect",400));
   }

  if(req.body.newPassword !== req.body.confirmPassword){         // if new and confirm new does not match
    return next(new ErrorHandler("Password does not match",400));
  }


  user.password = req.body.newPassword;   // new password updated
  await user.save();                         //saved
  sendToken(user,200,res);                 // login


});

// update user detail------------------------------------------------------>>>>

exports.updateProfile = catchAsyncError(async(req,res,next)=>{

const newUserData = {   // we created object so that we can access what need to change
    name:req.body.name,
    email:req.body.email,
}
 // we will add cloudanary later

 const user = await User.findByIdAndUpdate(req.user.id,newUserData,{

  new: true,
  runValidators:true,
  useFindAndModify: false,

 });

res.status(200).json({
    success:true,
    user
});

});

//get all users(admin)---------------------------------->
exports.getAllUsers = catchAsyncError(async(req,res,next)=>{

const users = await User.find();

res.status(200).json({
    success:true,
     users
});

});

// get single user (admin can get detail of any single user)------------------>>
exports.getSingleUser = catchAsyncError(async(req,res,next)=>{

    const user = await User.findById(req.params.id);
    
    if(!user){
        return next(new ErrorHandler(`User does not exsist with id: ${req.params.id} `));
    }

    res.status(200).json({
        success:true,
         user,
    });
    
    });

   // update user role by (admin) ---------------------->
   exports.updateRole = catchAsyncError(async(req,res,next)=>{

   const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role:  req.body.role,
   };
   
   const user = await User.findByIdAndUpdate(req.user.id, newUserData,{
    new: true,
    runValidators:true,
    useFindAndModify:false,
   });

   res.status(200).json({
    success:true,
   });

   });


   // delete user (admin)---------------------------------->

   exports.deleteUser = catchAsyncError(async(req,res,next)=>{
    
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exist with Id:${req.params.id}`,404))
    };

       await user.deleteOne();

    res.status(200).json({
        success:true,
        message:"User Deleted",
    });
   });