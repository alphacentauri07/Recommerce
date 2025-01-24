
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");

const errorMiddleware = require("./middleware/error"); // middleware for errorHandler import

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}


const product = require("./routes/productRoute"); //routes import
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser()); // it is use so that we get token strore in cookie 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());


app.use("/api/v1/",product); // api use just for product last "/something" will change for other put,update,delete & get
app.use("/api/v1/",user);
app.use("/api/v1/",order);
app.use("/api/v1/",payment);

app.use(express.static(path.join(__dirname,"../frontend/build")));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });

app.use(errorMiddleware); //using errorhandlers 

module.exports=app