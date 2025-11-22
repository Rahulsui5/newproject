import express from 'express'
import { addAddress, allUser, deleteAddress, loginUser, registerUser, singleUser } from '../controller/UserController.js'
const userRouter=express.Router()
userRouter.get("/AllUser",allUser)
userRouter.post("/SingleUser",singleUser)
userRouter.post("/RegisterUser",registerUser)
userRouter.post("/LoginUser",loginUser)
userRouter.put("/AddAddress",addAddress)
userRouter.delete("/DeleteAddress",deleteAddress)
export default userRouter