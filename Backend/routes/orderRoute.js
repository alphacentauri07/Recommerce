const express = require("express");
const { newOrder, getSingleOrder, myOrders, getAllOrders, deleteOrder, updateOrders } = require("../controllers/orderController");
const { isAutheticatedUser, autorizeRoles } = require("../middleware/auth");
const router = express.Router();


router.route("/order/new").post(isAutheticatedUser,newOrder);
router.route("/order/:id").get(isAutheticatedUser,getSingleOrder);
router.route("/orders/me").get(isAutheticatedUser,myOrders);
router.route("/admin/orders").get(isAutheticatedUser,autorizeRoles("admin"),getAllOrders);
router.route("/admin/order/:id")
.put(isAutheticatedUser,autorizeRoles("admin"),updateOrders)
.delete(isAutheticatedUser,autorizeRoles("admin"),deleteOrder);

module.exports = router;