const express= require("express");
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, deleteUser, updateRole } = require("../controllers/userController");
const { isAuthenticatedUser, autorizeRoles } = require("../middleware/auth");



const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logout);


router.route("/me").get(isAuthenticatedUser,getUserDetails);

router.route("/password/update").put(isAuthenticatedUser,updatePassword);

router.route("/me/update").put(isAuthenticatedUser,updateProfile);  // update profile

router.route("/admin/users").get(isAuthenticatedUser,autorizeRoles("admin"),getAllUsers);

router.route("/admin/user/:id")
.get(isAuthenticatedUser,autorizeRoles("admin"),getSingleUser).put(isAuthenticatedUser,autorizeRoles("admin"),updateRole).delete(isAuthenticatedUser,autorizeRoles("admin"),deleteUser);
    
module.exports = router