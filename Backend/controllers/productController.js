const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeature = require("../utils/apifeature");

/*exports.getAllProduct = async(req,res,next)=>{

    const products = await Product.find();             // covering every asyncfunc with  -->>  catchAsyncError(async());
    res.status(201).json({
       success:true,
       products
    });

}*/
  
exports.getAllProduct = catchAsyncError(async (req,res,next)=>{
    const resultPerPage = 5; // for pagination
    const productCount = await Product.countDocuments(); // will help in frontend to keep count of products

    const apifeature = new ApiFeature(Product.find(),req.query).search().filter().pagination(resultPerPage);        //search feature

    //const products = await Product.find();
    const products = await apifeature.query;  // we used Product.find in ApiFeature to do regex and the ApiFeature class will return query which we use here

    res.status(200).json({
       success:true,
       products,
       productCount,
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
   
    req.body.user = req.body.id; // we are storing who created product in user
    

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


