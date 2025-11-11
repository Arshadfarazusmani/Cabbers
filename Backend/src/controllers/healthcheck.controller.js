import { asyncHandler } from "../utils/asyncHandler.js";
import { api_response } from "../utils/api-response.js";

const healthCheckController=asyncHandler(async(req , res , next )=>{

     const data ={
        love : "Nastaran!!"
    }
    res.status(200).json(new api_response(200,"ok",data))
   
})

export {healthCheckController}