const Product = require("../models/productModel")

exports.createProduct = async(req,res,next)=>{
   
    const product = await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    })

}


exports.getAllProduct = async (req,res,next)=>{

    const products = await Product.find();
    res.status(201).json({
       success:true,
       products
    });

}

exports.updateProduct = async(req,res,next)=>{

    let product = await Product.findById(req.params.id);
   
    if(!product){
        return res.status(500).json({
            success:false,
            message:"product not found "
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body);

    res.status(200).json({
        success:true,
        message:"product hase been updated"
    })

}

exports.deleteProduct = async(req,res,next)=>{

const product = await Product.findById(req.params.id);

if(!product){
    return res.status(500).json({
        success:false,
        message:"product not found"
    })
}

   await product.deleteOne();
    
   res.status(200).json({
    success:true,
    message:"product has successfully removed"
   })
}