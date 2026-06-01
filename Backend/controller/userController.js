import User from "../model/userModel.js";



export const getCurrentUser = async (req, res) => {
    try {
        let user = await User.findById(req.userId).select("-password")
        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        return res.status(200).json(user)



    }catch (error) {
        console.log(error)
        return res.status(500).json({message: `Get Current User error ${error}`})
    }
}

//getcurrent admin controller

export const getAdmin = async (req, res) => {
    try {
        let adminEmail = req.adminEmail
        if(!adminEmail){
            return res.status(404).json({message: "Admin not found"})  
        }

        return res.status(201).json({
            email:adminEmail,
            role:"admin"
        })
       


    }catch (error) {
        console.log(error)
        return res.status(500).json({message: `Get Admin error ${error}`})
    }
}





