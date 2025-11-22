import userModel from "../model/UserModel.js";
import bcrypt from 'bcrypt'
export const registerUser = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        if (!userName || !email || !password) {
            return res.status(400).json({
                message: "Please fill the feilds",
                success: false
            })
        }
        const exisitingUser = await userModel.findOne({ email })
        if (exisitingUser) {
            return res.status(400).json({
                message: "User already exists",
                success: false
            })
        }
        const hashpassword = await bcrypt.hash(password, 10)
        const createdUser = await userModel.create({
            userName,
            email,
            password: hashpassword
        })
        res.status(200).json({
            message: "User registered successfully",
            success: true,
            createdUser
        })
    } catch (error) {
        res.status(500).json({
            message: "Error while register",
            success: false,
            error
        })
    }
}
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Please fill the feilds",
                success: false
            })
        }
        const checkUser = await userModel.findOne({ email })
        if (!checkUser) {
            return res.status(400).json({
                message: "No user found please register",
                success: false
            })
        }
        const login = await bcrypt.compare(password, checkUser.password)
        console.log(login)
        if (!login) {
            return res.status(400).json({
                message: "Invalid password",
                success: false
            })
        }
        res.status(200).json({
            message: "User login successfully",
            success: true,
            checkUser
        })
    } catch (error) {
        res.status(500).json({
            message: "Error while login",
            success: false,
            error
        })
    }
}
export const allUser = async (req, res) => {
    try {
        const user = await userModel.find()
        if (user.length < 1) {
            return res.status(400).json({
                message: "No user is available",
                success: false
            })
        }
        res.status(200).json({
            userCount: user.length,
            message: "All users",
            success: true,
            user
        })
    } catch (error) {
        res.status(500).json({
            message: "Error while getting user"
        })
    }
}
export const singleUser = async (req, res) => {
    try {
        const { userId } = req.body
        const user = await userModel.findById(userId)
        if (user.length < 1) {
            return res.status(400).json({
                message: "No user is available",
                success: false
            })
        }
        res.status(200).json({
            message: "User",
            success: true,
            user
        })
    } catch (error) {
        res.status(500).json({
            message: "Error while getting user"
        })
    }
}
export const addAddress = async (req, res) => {
    try {
        const { fullName, phone, address, city, state, pinCode, userId } = req.body
        if (!fullName || !phone || !address || !city || !state || !pinCode || !userId) {
            return res.status(400).json({
                message: "Please fill the fields",
                success: false,
            })
        }
        const user = await userModel.findById(userId)
        const shippingAddress = {
            fullName,
            phone,
            address,
            city,
            state,
            pinCode,
        }
        user.shippingAddress.push(shippingAddress)
        await user.save()
        res.status(200).json({
            message: "Added address",
            success: true
        })
    } catch (error) {
        res.status(500).json({
            message: "Error while adding address",
            success: false,
            error
        })
    }
}
export const deleteAddress = async (req, res) => {
    try {
        const { id,userId } = req.body
        if (!id || !userId) {
            return res.status(400).json({
                message: "Fill the fields",
                success: false,
            })
        }
        const existUser = await userModel.findById(userId)
        existUser.shippingAddress.pull(id)
        await existUser.save()
        res.status(200).json({
            message: "Address deleted",
            success: true,
            existUser
        })
    } catch (error) {
        res.status(500).json({
            message: "Error while deleting address",
            success: false,
            error
        })
    }
}