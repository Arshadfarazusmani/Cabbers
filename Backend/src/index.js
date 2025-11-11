import dotenv from "dotenv";
dotenv.config({
    path:".env"
})

import { app } from "./app.js";
import { connectDB } from "./db/db.js";


const PORT= process.env.PORT


connectDB().then(()=>{


    // app.get("/",(req,res)=>{
    //     res.send("<h1>Hello world</h1>")
    // })
    app.listen(PORT,()=>{
        console.log("server is running on ",PORT)
    })

}).catch((error)=>{
    console.log("Database connection error !!!",error)

})


