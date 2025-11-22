import cartModel from "../model/CartModel.js";
import productModel from "../model/ProductModel.js";
import userModel from "../model/UserModel.js";
export const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity = 1 } = req.body;
        if (!userId || !productId) {
            return res.status(200).json({
                message: "Missing required fields!",
                success: false,
            });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(200).json({
                message: "Product not found!",
                success: false,
            });
        }

        let cart = await cartModel.findOne({ user: userId });

        if (!cart) {
            cart = new cartModel({
                user:userId,
                items: [],
            });
        }

        const existingItem = cart.items.find(
            (item) => item.product.toString() === productId
        );

        if (existingItem) {
            return res.status(200).json({
                message: "Item already exists in the cart!",
                success: false
            });
        }

        const newItem = {
            product: productId,
            quantity,
            price: product.price,
            total: product.price * quantity,
        };

        cart.items.push(newItem);
        cart.totalQuantity = cart.items.reduce((sum, i) => sum + i.quantity, 0);
        cart.totalPrice = cart.items.reduce((sum, i) => sum + i.total, 0);
        const existUser = await userModel.findById(userId)
        existUser.carts.push(productId)
        await existUser.save();
        await cart.save();
        res.status(201).json({
            message: "Item added to cart successfully!",
            success: true,
            cart,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error adding to cart!",
            success: false,
            error: error.message,
        });
    }
};

export const getUserCart = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(200).json({
                message: "User ID is required!",
                success: false,
            });
        }
        const cart = await cartModel
            .findOne({ user: userId })
            .populate("items.product");

        if (!cart) {
            return res.status(200).json({
                message: "Cart not found!",
                success: false,
            });
        }
        res.status(200).json({
            message: "Cart fetched successfully!",
            success: true,
            cart,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching cart!",
            success: false,
            error: error.message,
        });
    }
};

export const updateCartItem = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        let cart = await cartModel.findOne({ user: userId });
        if (!cart) {
            return res.status(200).json({
                message: "Cart not found!",
                success: false,
            });
        }

        const item = cart.items.find(
            (item) => item.product.toString() === productId
        );

        if (!item) {
            return res.status(200).json({
                message: "Item not found in cart!",
                success: false,
            });
        }

        item.quantity = quantity;
        item.total = item.price * quantity;

        cart.totalQuantity = cart.items.reduce((sum, i) => sum + i.quantity, 0);
        cart.totalPrice = cart.items.reduce((sum, i) => sum + i.total, 0);

        await cart.save();

        res.status(200).json({
            message: "Cart updated successfully!",
            success: true,
            cart,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating cart!",
            success: false,
            error: error.message,
        });
    }
};

export const removeCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        let cart = await cartModel.findOne({ user: userId });
        if (!cart) {
            return res.status(200).json({
                message: "Cart not found!",
                success: false,
            });
        }
        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId
        );
        cart.totalQuantity = cart.items.reduce((sum, i) => sum + i.quantity, 0);
        cart.totalPrice = cart.items.reduce((sum, i) => sum + i.total, 0);
        const existUser = await userModel.findById(userId)
        if (existUser) {
            console.log(existUser.carts)
            existUser.carts.pull(productId)
            await existUser.save()
        }
        await cart.save();
        res.status(200).json({
            message: "Item removed successfully!",
            success: true,
            cart,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error removing item!",
            success: false,
            error: error.message,
        });
    }
};

// export const clearCart = async (req, res) => {
//     try {
//         const { userId } = req.body;
//         const cart = await cartModel.findOne({ user: userId });
//         if (!cart) {
//             return res.status(200).json({
//                 message: "Cart not found!",
//                 success: false,
//             });
//         }

//         cart.items = [];
//         cart.totalQuantity = 0;
//         cart.totalPrice = 0;
//         await cart.save();

//         res.status(200).json({
//             message: "Cart cleared successfully!",
//             success: true,
//             cart,
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: "Error clearing cart!",
//             success: false,
//             error: error.message,
//         });
//     }
// };
