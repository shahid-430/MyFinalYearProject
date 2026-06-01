
import User from '../model/userModel.js'

export const addToCart  =  async ( req,res) =>{

    try{

        const {itemId,size} = req.body
        const userData = await User.findById(req.userId);
// chwck user exist
if(!userData){
        return res.status(400).json({message: "User Not found"});
}

//ensure cartdata is intiaalized\
let cartData = userData.cartData || {};
if(cartData[itemId] ){

    if(cartData[itemId][size]){
        cartData[itemId][size] += 1;
    } else{
        cartData[itemId][size] =1;

    }
}else{

    cartData[itemId] ={};
    cartData[itemId][size] = 1;
}
await User.findByIdAndUpdate(req.userId,{cartData});
 return res.status(201).json({message: "Added to Cart"});


    } catch(error){

        console.log(error)
         return res.status(500).json({message: "Add to error"});

    }



}



export const UpdateCart  =  async ( req,res) =>{

    try{
 
        const {itemId,size,quantity} = req.body
        const userData = await User.findById(req.userId)
        if(!userData){
            return res.status(404).json({message: "User not found"})
        }

        let cartData = userData.cartData || {}
        if(!cartData[itemId]){
            cartData[itemId] = {}
        }
        cartData[itemId][size] = quantity
        await User.findByIdAndUpdate(req.userId,{cartData})

         return res.status(201).json({message: "cart Updated"});



    }catch(error){
                console.log(error)
                return res.status(500).json({message: "update cart error"});

    }



}




export const getUserCart  =  async ( req,res) =>{

    try{

        const userData = await User.findById(req.userId)
        if(!userData){
            return res.status(404).json({message: "User not found"})
        }

        let cartData = userData.cartData || {}

         return res.status(200).json(cartData);

    } catch(error){

        console.log(error)
         return res.status(500).json({message: "getusercart error"});

    }



}