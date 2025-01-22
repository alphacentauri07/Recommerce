const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

shippingInfo:{

    address:{type:String, required:true},
    city:{type:String, required:true},
    state:{type:String, required:true},
    country:{type:String,required:true},
    pinCode:{type:Number,required:true},
    phoneNo:{type:Number,required:true},
},

orderItems:[{

    name:{type:String, required:true},
    price:{type:Number,required:true},
    quantity:{type:Number, required:true},
    image:{type:String, required:true},
    product:{
        type:mongoose.Schema.ObjectId,  // which user ordered
        ref:"Product",                  // this is taking reference from Product model which is named as "Product" while exporting
        required:true,
    },

},
],


user:{
    type:mongoose.Schema.ObjectId,   
    ref:"user",                        // this is taking reference from user model which is named as "user" while exporting
    required:true,
},


paymentInfo:{
    id:{type:String, required:true},
    status:{type:String, required:true},
    
},

paidAt:{type:Date, required:true},

itemsPrice:{type:Number, default:0, required:true},

taxPrice:{type:Number, default:0, required:true},

shippingPrice:{type:Number, default:0, required:true},

totalPrice:{type:Number, default:0, required:true},


orderStatus:{type:String,default:"Processing", required:true},

deliveredAt: Date,
createdAt:{type:Date, default:Date.now},

});

module.exports = mongoose.model("order",orderSchema);