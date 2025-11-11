import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import crypto from "crypto"
import bcrypt from "bcrypt" 

const UserSchema = new mongoose.Schema(
    {

        username:{
        type: String,
        required: true,
        unique: true ,
        lowercase: true,
        trim : true , 
        index : true 
    },


    avatar: {
      type: String, // <--- Change this to String
      default: "https://default-avatar.com/image.png", // Optional: A default avatar if none is uploaded
    },

    email:{
        type: String,
        unique:true,
        required: true,
        lowercase: true,
        trim : true , 
        minlength: [ 5, 'Email must be at least 5 characters long' ],
        
    },
     fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [ 3, 'First name must be at least 3 characters long' ],
        },
        lastname: {
            type: String,
            minlength: [ 3, 'Last name must be at least 3 characters long' ],
        }
    },
    password:{
        type: String,
        required:[true,"Password required "]

    },
    is_EmailVarified:{
        type: Boolean,
        default: false
    },

    refreshToken:{
        type : String
    },

    forgotPasswordToken: {
        type: String

    },

    forgotPasswordTokenExpiry:{
        type : Date
    },

    emailVarificationToken:{
        type: String
    },

    emailVarificationTokenExpiry:{
        type:Date
    },

     socketId: {
        type: String,
    },






    },{timestamps: true});


     UserSchema.pre("save", async function(next){
            if(this.isModified("password")){
                this.password = await bcrypt.hash(this.password, 10);
                return next();
            }
            return next();

           });


    UserSchema.methods.comparePassword = async function(password){
               return await bcrypt.compare(password, this.password);
           };

   // Generating Accesss Token 

UserSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            "expiresIn":process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
// Generating Refresh  Token 

UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            "expiresIn":process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

// genating temporary tokens 

UserSchema.methods.genarateTemporaryTokens= function () {

    const unhashedToken= crypto.randomBytes(20).toString("hex")

    const HashedToken = crypto.createHash("sha256").update(unhashedToken).digest("hex")

    const TokenExpiry= Date.now() + (20*60*1000)

    return {unhashedToken,HashedToken,TokenExpiry}
    
}


export const User = mongoose.model("User", UserSchema);