const express = require("express");
const { newOrder, getSingleOrder, myOrders, getAllOrders, deleteOrder, updateOrders } = require("../controllers/orderController");
const { isAuthenticatedUser, autorizeRoles } = require("../middleware/auth");
const router = express.Router();


router.route("/order/new").post(isAuthenticatedUser,newOrder);
router.route("/order/:id").get(isAuthenticatedUser,getSingleOrder);
router.route("/orders/me").get(isAuthenticatedUser,myOrders);
router.route("/admin/orders").get(isAuthenticatedUser,autorizeRoles("admin"),getAllOrders);
router.route("/admin/order/:id")
.put(isAuthenticatedUser,autorizeRoles("admin"),updateOrders)
.delete(isAuthenticatedUser,autorizeRoles("admin"),deleteOrder);

module.exports = router;