import User from "../model/userModel.js";
import validator from "validator"
import bcrypt from "bcryptjs"
import { genToken, genToken1 } from "../config/token.js";


/*USer Registration page */

export const registration = async (req,res) => {

try {

const {name,email,password} = req.body; 
const existUser = await User.findOne({email})

if(existUser){
    return res.status(400).json({message:"User already exist"})}

 if(!validator.isEmail(email)){
    return res.status(400).json({message:"Invalid email"})}

if(password.length < 8){
    return res.status(400).json({message:"Password must be at least 8 characters long"})}

let hashPassword = await bcrypt.hash(password,10)

const user = await User.create({name,email,password:hashPassword})

let token = await genToken(user._id)
console.log("Registration token:", token)  // ADDED: Log the token for debugging
res.cookie("token",token,{
    httpOnly:true,
    secure:false,  // CHANGED: Set to false for local HTTP development
    sameSite:"lax",  // CHANGED: Use 'lax' for local development instead of 'none'
    maxAge:7*24*60*60*1000

})
res.status(201).json(user)
}catch(error){
    console.log("register error",error)
    return res.status(500).json({message:"registration error ${error}"})
}
}

/* USer login page */

export const login = async (req,res) => {

try {
    let {email,password} = req.body; 
    let user = await User.findOne({email}) 
    if(!user){
        return res.status(400).json({message:"User not found"})}
    let isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(400).json({message:"Invalid credentials"})}

        let token = await genToken(user._id)
        console.log("Generated token:", token)  // ADDED: Log the token for debugging
res.cookie("token",token,{
    httpOnly:true,
    secure:false,  // CHANGED: Set to false for local HTTP development
    sameSite:"lax",  // CHANGED: Use 'lax' for local development instead of 'none'
    maxAge:7*24*60*60*1000

})
res.status(201).json({message:"Login successfully"})
    }catch(error){
        console.log("Login error",error)
        return res.status(500).json({message:"Login error ${error}"})

    }

}


/*User logout page */

export const logOut = async (req,res) => {

try { 
res.clearCookie("token")    
res.status(200).json({message:"LogOut successful"})
}catch(error){
    console.log("LogOut error",error)
    return res.status(500).json({message:"LogOut error ${error}"})
}
}

// export const googlelogin = async (req,res) => {

// try {
//     let {name,email} = req.body; 
//     let user = await User.findOne({email}) 
//     if(!user){
//     user = await User.create({
//         name,email})
//     }
//     let token = await genToken(user._id)
//     res.cookie("token",token,{
//     httpOnly:true,
//     secure:true,
//     sameSite:"none",
//     maxAge:7*24*60*60*1000
// })
// return res.status(200).json(user)

// }catch(error){
//     console.log("Google Login error",error)
//    return res.status(500).json({message:`Google Login error ${error}`})
// } 


// export const googlelogin = async (req,res) => {

// try {
//     let {name,email} = req.body; 
//     let user = await User.findOne({email})                
//     if(!user){
//     user = await User.create({
//         name,email})
//     }       
//     let token = await genToken(user._id)    
//     res.cookie("token",token,{
//     httpOnly:true,
//     secure:false,
//     sameSite:"Strict",
//     maxAge:7*24*60*60*1000
// })
// return res.status(200).json(user)   
// }catch(error){
//     console.log("Google Login error",error)
//    return res.status(500).json({message:`Google Login error ${error}`})
// }
// }

export const googlelogin = async (req,res) => {

try {

let {name,email} = req.body;

let user = await User.findOne({email})

if(!user){

let randomPassword = await bcrypt.hash(email + "googleAuth",10)

user = await User.create({
    name,
    email,
    password: randomPassword
})
}

let token = await genToken(user._id)

res.cookie("token",token,{
 httpOnly:true,
 secure:false,
 sameSite:"lax",
 maxAge:7*24*60*60*1000
})

return res.status(200).json(user)

}catch(error){

console.log("Google Login error",error)

return res.status(500).json({message:`Google Login error ${error}`})

}

}


// Admin Login Functionlity
export const adminLogin =async(req,res)=>{
    try{
        let {email , password} =req.body
        if(email=== process.env.ADMIN_EMAIL && password=== process.env.ADMIN_PASSWORD){

        let token = await genToken1(email)

        res.cookie("token",token,{
        httpOnly:true,
        secure:false,
        sameSite:"lax",
        maxAge:1*24*60*60*1000
})

return res.status(200).json(token)

        } 
 return res.status(400).json({message:"Invalid Cresdentials"})

    }
    catch (error){


        console.log("Admin Login error",error)

return res.status(500).json({message:`Admin Login error ${error}`})

    }
}