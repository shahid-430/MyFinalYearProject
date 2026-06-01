import mongoose from "mongoose"


const orderSchema = new mongoose.Schema({

    userId:{
        type:String,
        required: true
    },

     items:{
        type:Array,
        required: true
    },

     amount:{
        type:Number,
        required: true
    },
    
     address:{
        type:Object,
        required: true
    },
     status:{
        type:String,
        required: true,
        default: 'Order Placed'
    },
     PaymentMethod:{
        type:String,
          default:'COD'
    },

     payment:{
        type:Boolean,
        required: true,
        default:false
    },

     date:{
        type:Number,
          default:Date.now
    },

     trackingNumber:{
        type:String,
        default: ""
    },

     deletedByUser:{
        type:Boolean,
        default: false
    },

     deletedByAdmin:{
        type:Boolean,
        default: false
    },

},{timestamps: true})


const Order = mongoose.model('Order' , orderSchema)

export default Order