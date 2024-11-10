const express = require("express");

const {getAllProduct,createProduct,updateProduct,deleteProduct,getProductDetail, createProductReview, getProductReview, deleteReview} = require("../controllers/productController");
const { isAutheticatedUser, autorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProduct); //isAuthenticated will check, whether user is login or not

router.route("/admin/product/new").post(isAutheticatedUser,autorizeRoles("admin"),createProduct);   // authroles is added as admin for 
 
router.route("/admin/product/:id").put(isAutheticatedUser,autorizeRoles("admin"),updateProduct).delete(isAutheticatedUser,autorizeRoles("admin"),deleteProduct);

router.route("/product/:id").get(getProductDetail);

router.route("/review").put(isAutheticatedUser,createProductReview);

router.route("/reviews").get(isAutheticatedUser,getProductReview).delete(isAutheticatedUser,deleteReview);
module.exports=router

