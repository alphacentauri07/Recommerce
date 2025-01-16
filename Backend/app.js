
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");


const errorMiddleware = require("./middleware/error"); // middleware for errorHandler import


const product = require("./routes/productRoute"); //routes import
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");

app.use(express.json());
app.use(cookieParser()); // it is use so that we get token strore in cookie 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());


app.use("/api/v1/",product); // api use just for product last "/something" will change for other put,update,delete & get
app.use("/api/v1/",user);
app.use("/api/v1/",order);

app.use(errorMiddleware); //using errorhandlers 

module.exports=app