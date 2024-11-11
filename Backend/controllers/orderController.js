const Order = require("../models/orderModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const Product = require("../models/productModel");
const User  = require("../models/userModel");
//order a product ---------------------------------->

exports.newOrder = catchAsyncError(async(req,res,next)=>{

const{
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
} = req.body;


const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt:Date.now(),
    user:req.user._id,

});


res.status(200).json({
    success:true,
    order,
});
});

// get single order(admin)-------------------------------->>

exports.getSingleOrder  = catchAsyncError(async(req,res,next)=>{

const order = await Order.findById(req.params.id).populate("user","name email");
// what will populate do is when findbyid will return user id so populate will go to user db and search for that id corresponding email & name
if(!order){
    return next(new ErrorHandler("Order not found with this Id",404));
}

res.status(200).json({
    success:true,
    order,
});
});

// get logged in user orders------------------------->

exports.myOrders  = catchAsyncError(async(req,res,next)=>{

    const order = await Order.find({user:req.user._id});   // we use filter to just find all orders with logged in user
    
    res.status(200).json({
        success:true,
        order,
    });
    });


    // get all orders(admin)--------------------------------->

    exports.getAllOrders  = catchAsyncError(async(req,res,next)=>{

        const orders = await Order.find();
        
    let totalAmount = 0;
    
    orders.forEach((res)=>{
        totalAmount += res.totalPrice; // totalPrice taken from model  
    });// for admin to get total
        
        res.status(200).json({
            success:true,
            totalAmount,
            orders,
        });
        });


 // update order status(admin)---------------------------------->       

 exports.updateOrders  = catchAsyncError(async(req,res,next)=>{

    const order = await Order.findById(req.params.id); //here we provide order id

    if(!order){
        return next(new ErrorHandler("Order not found with this Id",404));
    }


    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("You have already delivered this order",400));
    }

    //orderItems is array so we apply for each  and we need to modify stock so we need product id and product quantity
   //using order id modify that order ids orderItems array
   for (const item of order.orderItems) {
    await updateStock(item.product, item.quantity); // here item.product is product id
}

   order.orderStatus = req.body.status; // order status which is processed will update to shipped/delivered
   
   if(req.body.status === "Delivered"){ // becoz we dont want the time to get updated on shipped
    order.deliveredAt = Date.now() 
   }

   await order.save({validateBeforeSave:false}); 

    res.status(200).json({
        success:true,
    });
    });


    async function updateStock(id,quantity){
    const product = await Product.findById(id); // we find that product by id

      product.stock-=quantity;   // we reduce product stock (stock is creted by us in product model)
       await product.save({validateBeforeSave:false});
    }


    // delete order-------------------------------------------->>>


    exports.deleteOrder  = catchAsyncError(async(req,res,next)=>{

        const order = await Order.findById(req.params.id);   // we use filter to just find all orders with logged in user
        
        if(!order){
            return next(new ErrorHandler("Order not found with this Id",404));
        }
        await  order.deleteOne();

        res.status(200).json({
            success:true,
        });
        });