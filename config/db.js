import mongoose from 'mongoose'
import colors from 'colors'
import dotenv from 'dotenv'
dotenv.config()
const connection=async()=>{
    try {
        await mongoose.connect(process.env.DBURL)
        console.log("Connected to mongodb".bgCyan.white)
    } catch (error) {
        console.log(error)
    }
}
export default connection