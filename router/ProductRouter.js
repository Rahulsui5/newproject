import express from 'express'
import { addProductController, deleteProductController, getProductController, getSingleProductController, updateProductController } from "../controller/ProductController.js";
const ProductRouter=express.Router()
ProductRouter.post("/AddProduct",addProductController)
ProductRouter.get("/GetProduct",getProductController)
ProductRouter.put("/UpdateProduct/:id",updateProductController)
ProductRouter.delete("/DeleteProduct/:id",deleteProductController)
ProductRouter.get("/GetSingleProduct/:id",getSingleProductController)
export default ProductRouter

// backend/
// │
// ├── 📁 config/
// │   ├── db.js                 # MongoDB connection setup
// │   └── cloudinary.js         # (optional) Cloudinary image upload config
// │
// ├── 📁 controllers/
// │   ├── authController.js     # signup, login, logout, etc.
// │   ├── productController.js  # CRUD for products
// │   ├── userController.js     # user profile management
// │   └── orderController.js    # order and checkout logic
// │
// ├── 📁 models/
// │   ├── User.js               # User schema (email, password, etc.)
// │   ├── Product.js            # Product schema (name, price, etc.)
// │   ├── Order.js              # Order schema
// │   └── Cart.js               # (optional) Cart schema if you want persistent carts
// │
// ├── 📁 routes/
// │   ├── authRoutes.js
// │   ├── productRoutes.js
// │   ├── userRoutes.js
// │   └── orderRoutes.js
// │
// ├── 📁 middleware/
// │   ├── authMiddleware.js     # JWT verify token middleware
// │   ├── adminMiddleware.js    # restrict routes to admin only
// │   └── errorMiddleware.js    # centralized error handling
// │
// ├── 📁 utils/
// │   ├── generateToken.js      # function to generate JWT
// │   └── sendEmail.js          # (optional) email utility for password reset etc.
// │
// ├── 📁 uploads/                # static image uploads (if not using cloud)
// │
// ├── .env                      # environment variables (PORT, MONGO_URI, JWT_SECRET)
// ├── server.js                 # main entry point
// ├── package.json
// └── README.md
