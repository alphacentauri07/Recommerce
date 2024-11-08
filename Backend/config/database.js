
const mongoose = require("mongoose");

const connectDatabase = ()=>{

mongoose.connect(process.env.DB_URI).then((data)=>{
console.log(`Database is connected ${data.connection.host}`);
})/*.catch((err)=>{
    console.log(err);
})*/                 //this is replaced by unhandled promise rejection

}

module.exports = connectDatabase

