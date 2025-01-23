const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeature = require("../utils/apifeature");
const cloudinary = require("cloudinary");

/*exports.getAllProduct = async(req,res,next)=>{

    const products = await Product.find();             // covering every asyncfunc with  -->>  catchAsyncError(async());
    res.status(201).json({
       success:true,
       products
    });

}*/
  
// get all product--------------------->>>>

exports.getAllProduct = catchAsyncError(async (req,res,next)=>{

    const resultPerPage = 6; // for pagination
    const productsCount = await Product.countDocuments(); // will help in frontend to keep count of products

    const apifeature = new ApiFeature(Product.find(),req.query).search().filter().pagination(resultPerPage);        //search feature

    //const products = await Product.find();
    const products = await apifeature.query;  // we used Product.find in ApiFeature to do regex and the ApiFeature class will return query which we use here
     
   // products = await apifeature.query;

    res.status(200).json({
       success:true,
       products,
       productsCount,
       resultPerPage,
    });

});

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
    const products = await Product.find();
  
    res.status(200).json({
      success: true,
      products,
    });
  });

//get product detail ---------------------->>>>

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

// create product----------------------------------->>>>              
// admin only
exports.createProduct = catchAsyncError(async(req,res,next)=>{
    
    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);//single img
    } else {
      images = req.body.images;//multiple imgs
    }

    const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
    req.body.user = req.user.id; // we are storing who created product in user
    

    const product = await Product.create(req.body);
    res.status(201).json({
        success:true,
        product,
    });

});

// update product details -------------------------->>>
//admin

exports.updateProduct = catchAsyncError(async(req,res,next)=>{

    let product = await Product.findById(req.params.id);
   
    if(!product){
        return next(new ErrorHandler("product not found",404));
    }
    
    // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    req.body.images = imagesLinks;
  }
  
    product = await Product.findByIdAndUpdate(req.params.id,req.body);

    res.status(200).json({
        success:true,
        message:"product has been updated"
    })

});

// delete product------------------------------------------------->>>
//admin

exports.deleteProduct = catchAsyncError(async(req,res,next)=>{

const product = await Product.findById(req.params.id);

if(!product){
    return next(new ErrorHandler("product not found",404));
}

 // Deleting Images From Cloudinary
 for (let i = 0; i < product.images.length; i++) {
  await cloudinary.v2.uploader.destroy(product.images[i].public_id);
}

   await product.deleteOne();
    
   res.status(200).json({
    success:true,
    message:"product has successfully removed"
   })
});

// create New review or Update the review------------------------------>>>

exports.createProductReview = catchAsyncError(async(req,res,next)=>{

const {rating,comment,productId} = req.body;  // taking input

const review = {                // making an object
    user:req.user._id,
    name:req.user.name,
    rating:Number(rating), 
    comment,
};

const product = await Product.findById(productId);

const isReviewed = product.reviews.find(rev=>rev.user.toString()===req.user._id.toString()) // rev is just a variable & we will get user id here
                                                                //it will check the id in reviews array and id which i provided input
if(isReviewed){
    product.reviews.forEach((rev) =>{
      if(rev=>rev.user.toString()===req.user._id.toString())
        rev.rating=rating,   // updating rating and reviews when we found it
        rev.comment=comment
    });
}

else{       // if id is not found push in array
product.reviews.push(review);  //reviews is array created in model
product.numOfReviews = product.reviews.length;  // number of reviwes created in model
}
   // this is overall review present in model which is avg of all ratings
  let avg=0;
  product.rating = product.reviews.forEach(rev=>{
    avg=avg+rev.rating;
  })

  product.rating=avg/product.reviews.length; // saving the rating 

  await product.save({validateBeforeSave:false});

  res.status(200).json({
    success:true
  });

});


// get all review of single product--------------------------------------->>

exports.getProductReview = catchAsyncError(async(req,res,next)=>{

const product = await  Product.findById(req.query.id);  // here we use query instead of params becoz params-> Request: GET /products/123  & query-> Request: GET /products?id=123

if(!product){
    return next(new ErrorHandler("Product not found",404));
}

res.status(200).json({
    success:true,
    reviews: product.reviews,
});
});

// delete review ------------------------------------------------------------>>

exports.deleteReview = catchAsyncError(async(req,res,next)=>{

const product = await Product.findById(req.query.productId);

if(!product){
    return next(new ErrorHandler("Product not found",404));
}

const reviews =  product.reviews.filter(rev=> rev._id.toString() !== req.query.id.toString());   //here we will add all the reviews which are not equal to that review we need to delete

let avg=0;

reviews.forEach((rev) =>{
 avg +=rev.rating;
});   

const rating = reviews.length === 0 ? 0 : avg / reviews.length;
const numOfReviews = reviews.length;

 await Product.findByIdAndUpdate(req.query.productId,{
    reviews,
    rating,
    numOfReviews,
 },
 {
    new:true,
    runValidators:true,
 });

res.status(200).json({
    success:true,
});

}); 