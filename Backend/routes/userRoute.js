const express= require("express");
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword } = require("../controllers/userController");
const { isAutheticatedUser, autorizeRoles } = require("../middleware/auth");



const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logout);

router.route("/me").get(isAutheticatedUser,getUserDetails);
router.route("/password/update").put(isAutheticatedUser,updatePassword);
module.exports = router