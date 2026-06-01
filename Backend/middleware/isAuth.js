// import jwt from 'jsonwebtoken'



// const isAuth = async (req, res, next) => {
//     try {
//         let {token} = req.cookies

//         if(!token){
//              return res.status(400).json({message: "Unauthorized"})
//         }
    
       
//     let verifyToken = jwt.verify(token, process.env.JWT_SECRET )
//         if(!verifyToken){
//              return res.status(400).json({message: "Unauthorized"})
//         }
//             req.userId = verifyToken.userId
//             next()
//      } catch (error) { 
//         console.log( "isAuth error")
//         return res.status(500).json({message: `isAuth error ${error}`})
//     }
// }
// export default isAuth


import jwt from "jsonwebtoken"

const isAuth = async (req,res,next)=>{
    try {

        const token = req.cookies.token

        if(!token || typeof token !== 'string' || token.trim() === '' || !token.includes('.')){  // ADDED: Check if token is a valid JWT-like string before verifying
            return res.status(401).json({message:"Unauthorized - No Token"})
        }

        const verifyToken = jwt.verify(token,process.env.JWT_SECRET)

        req.userId = verifyToken.userId

        next()

    } catch (error) {

        console.log("isAuth error:",error)

        return res.status(401).json({message:"Invalid token"})
    }
}

export default isAuth