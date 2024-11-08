const express = require("express");

const {getAllProduct,createProduct,updateProduct,deleteProduct,getProductDetail} = require("../controllers/productController");
const { isAutheticatedUser, autorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProduct); //isAuthenticated will check, we can use this route

router.route("/product/new").post(isAutheticatedUser,autorizeRoles("admin"),createProduct);   // authroles is added as admin for 
 
router.route("/product/:id").put(isAutheticatedUser,autorizeRoles("admin"),updateProduct).delete(isAutheticatedUser,autorizeRoles("admin"),deleteProduct).get(getProductDetail);



module.exports=router

