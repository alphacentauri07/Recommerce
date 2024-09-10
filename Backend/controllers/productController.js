const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");

/*exports.getAllProduct = async(req,res,next)=>{

    const products = await Product.find();             // covering every asyncfunc with  -->>  catchAsyncError(async());
    res.status(201).json({
       success:true,
       products
    });

}*/

exports.getAllProduct = catchAsyncError(async (req,res,next)=>{

    const products = await Product.find();
    res.status(201).json({
       success:true,
       products,
    });

});

exports.getProductDetail = catchAsyncError(async(req,res,next)=>{
    
const product = await Product.findById(req.params.id);

/*if(!product){
    return res.status(500).json({
        success:false,
        message:"product not found"
    })
}*/


if(!product){
    return next(new ErrorHandler("product not found",404));    // this is replaced by above by creating custom error handler
}

res.status(200).json({
    success:true,
    product
});

});

                  // admin only
exports.createProduct = catchAsyncError(async(req,res,next)=>{
   
    const product = await Product.create(req.body);
    res.status(201).json({
        success:true,
        product,
    });

});

exports.updateProduct = catchAsyncError(async(req,res,next)=>{

    let product = await Product.findById(req.params.id);
   
    if(!product){
        return next(new ErrorHandler("product not found",404));
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body);

    res.status(200).json({
        success:true,
        message:"product has been updated"
    })

});

exports.deleteProduct = catchAsyncError(async(req,res,next)=>{

const product = await Product.findById(req.params.id);

if(!product){
    return next(new ErrorHandler("product not found",404));
}

   await product.deleteOne();
    
   res.status(200).json({
    success:true,
    message:"product has successfully removed"
   })
});


