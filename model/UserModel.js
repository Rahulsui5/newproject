import mongoose from "mongoose";
const userModelSchema=new mongoose.Schema({
    userName:{
        type:String,
        required:[true,"Name is required"],
        trim:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minlength:6
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    shippingAddress: [{
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pinCode: { type: String, required: true },
    }],
    orders:[{
        type:mongoose.Types.ObjectId,
        ref:"Order",
    }],
    carts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Cart",
    }]
},{timestamps:true}
)
const userModel=mongoose.model("UserModel",userModelSchema)
export default userModel