const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    name:{
    type:String,
    required:[true,"please enter product name"]
     }, 

    description:{
        type:String,
        required:[true,"Enter the Product description"]
    },

   price:{
     type:Number,
     required:[true,"Please enter Product Price"],
     maxLength:[8,"Price cannot Exceed Limit"]
   },

    rating:{
      type: Number,
      default:0
    },

    //using cloudnary
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            } 
        }    
    ],

    category:{
     
        type:String,
        required:[true,"please enter product category"]
    },

    stock:{
      type:Number,
      maxLength:[4,"stock cannot exceed 4 characters"],
      default:1,
    },

    numOfReviews:{
        type:Number,
        default:0
    },

    reviews:[
        {
          user:{       // this will tell which admin has created the product
            type: mongoose.Schema.ObjectId,
            ref:"User",
            required:true
          },

      name:{      
       type:String,
    required:[true,"please enter name"]
      },
      
      rating:{
        type:Number,
        required:true
      },
      
      comment:{
        type:String,
        required:true
      }

        }
    ],
    
    user:{       // this will tell which admin has created the product
      type: mongoose.Schema.ObjectId,
      ref:"User",
      required:true
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports = mongoose.model("Product",productSchema); //Product will be used in controllers to create product


