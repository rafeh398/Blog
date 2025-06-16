import mongoose from "mongoose";
import bcrypt from "bcrypt"
const userSchema= new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },

},{timestamps:true})


//save krne se pele hash kr dena

userSchema.pre("save",  async function (next) {
    if(!this.isModified("password")) return next(); //if password is not modified then skip this fn

    this.password=await bcrypt.hash(this.password, 10)
    next()
})

//compare
userSchema.methods.isPasswordCorrect=async function (password) {
    return   await bcrypt.compare(password,this.password) //this.password is hashed in DB
       
   }

export const User=mongoose.model("User",userSchema)