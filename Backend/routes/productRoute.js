const express = require("express");

const {getAllProduct,createProduct,updateProduct,deleteProduct,getProductDetail, createProductReview, getProductReview, deleteReview} = require("../controllers/productController");
const { isAuthenticatedUser, autorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProduct); //isAuthenticated will check, whether user is login or not

router.route("/admin/product/new").post(isAuthenticatedUser,autorizeRoles("admin"),createProduct);   // authroles is added as admin for 
 
router.route("/admin/product/:id").put(isAuthenticatedUser,autorizeRoles("admin"),updateProduct).delete(isAuthenticatedUser,autorizeRoles("admin"),deleteProduct);

router.route("/product/:id").get(getProductDetail);

router.route("/review").put(isAuthenticatedUser,createProductReview);

router.route("/reviews").get(isAuthenticatedUser,getProductReview).delete(isAuthenticatedUser,deleteReview);
module.exports=router

