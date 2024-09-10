
const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database")

dotenv.config({path:"Backend/config/config.env"});

connectDatabase();

app.listen(process.env.PORT || 3000,()=>{

console.log(`server is running at http://localhost:${process.env.PORT}`)
});