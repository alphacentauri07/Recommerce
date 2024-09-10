
const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error"); // middleware for errorHandler import

const product = require("./routes/productRoute"); //routes import

app.use(express.json());

app.use("/api/v1/",product); // api use just for product last "/something" will change for other put,update,delete & get

app.use(errorMiddleware); //using errorhandlers 

module.exports=app