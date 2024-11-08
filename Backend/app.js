
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const errorMiddleware = require("./middleware/error"); // middleware for errorHandler import


const product = require("./routes/productRoute"); //routes import
const user = require("./routes/userRoute");

app.use(express.json());
app.use(cookieParser()); // it is use so that we get token strore in cookie 

app.use("/api/v1/",product); // api use just for product last "/something" will change for other put,update,delete & get
app.use("/api/v1/",user);


app.use(errorMiddleware); //using errorhandlers 

module.exports=app