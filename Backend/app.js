
const express = require("express");
const app = express();

const product = require("./routes/productRoute");
app.use(express.json());

app.use("/api/v1/",product); // api use just for product last "/something" will change for other put,update,delete & get

module.exports=app
