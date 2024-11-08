const mongoose = require("mongoose")
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({


name: {
    type:String,
    required:[true,"Please Enter Your Name"],
    maxlength:[10,"Name cannot exceeds 10 characters"],
    minlenghth:[4,"Name should have more than 4 characters"]
},

email:{
    type:String,
    required:[true,"Please Enter Your Email"],
    unique:true,
    validate:[validator.isEmail,"Please Enter a valid Email"]
},

password:{
    type:String,
    required:[true,"Please Enter Password"],
    minlength:[8,"Password should be grater than 8 characters"],
    select:false,//whenever we use get find() method we should not get password
},

avatar:
    {
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        } 
    },

   role:{
    type:String,
    default:"user",
   },

   resetPasswordToken:String,
   resetPasswordExpire: Date,
});

// password hashing
userSchema.pre("save", async function(next){

if(this.isModified("password")){    //if user name or email is updated we dont want to hash the alreaady hashed password, so we use if else condn 
this.password = await bcrypt.hash(this.password,10); // hasing password with power 10 more the value more strong
} 

next();
});

// JWT TOKEN :  we generate token and store in cookie so it will verify that this is user and can acces website & token can also be stored in local storage , session storage

userSchema.methods.getJWTToken = function(){

    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    });
};

//compare Password

userSchema.methods.comparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);  // entered password will get from body we use bcrypt to compare enteredpassword and the hashed password in db
};

// generating password reset token

userSchema.methods.getResetPasswordToken= function(){
     
    //generating token 
    const resetToken = crypto.randomBytes(20).toString("hex");
    
    //hasing and adding resetPasswordToken to user schema(user schema has reset password fn)

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  
    
    this.resetPasswordExpire = Date.now() +15 * 60 * 1000;

    return resetToken;
};

//now we will use nodemailer ro send resetToken so someone can click on link and reset password


module.exports = mongoose.model("user",userSchema);