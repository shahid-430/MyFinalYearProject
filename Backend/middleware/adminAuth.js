//authorication for admin here we generate a token for admin

import jwt from 'jsonwebtoken'

const adminAuth = async (req,res,next)=>{

    try{
    let {token}=req.cookies

    if (!token){
      return res.status(400).json({message:"Not Authoriezd Login Again"})
    }

    let verifyToken = jwt.verify(token,process.env.JWT_SECRET)

    if (!verifyToken){
        return status(400).json({message:"Not Authorized Login Again, Invalid token"})
    }

    req.adminEmail = process.env.ADMIN_EMAIL
        next()
    }
    catch(error){
       console.log("adminAuth error:",error)

        return res.status(401).json({message:`admiAuth error ${error}`}) 
    }
}
export default adminAuth