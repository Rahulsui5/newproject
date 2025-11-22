import orderModel from "../model/OrderModel.js";
import cartModel from "../model/CartModel.js";
import userModel from "../model/UserModel.js";
// export const placeOrder = async (req, res) => {
//   try {
//     const { userId, shippingAddress, paymentMethod } = req.body;
//     const cart = await cartModel.findOne({ user: userId })
//     .populate("items.product");
//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({ message: "Your cart is empty!", success: false });
//     }
//     const order = new orderModel({
//       user: userId,
//       products: cart.items.map((item) => ({
//         product: item.product,
//         quantity: item.quantity,
//         price: item.total,
//       })),
//       shippingAddress,
//       paymentMethod,
//       paymentStatus,
//       totalAmount: cart.totalPrice,
//     });

//     await order.save();
//     cart.items = [];
//     cart.totalQuantity = 0;
//     cart.totalPrice = 0;
//     await cart.save();
//     const existUser=await userModel.findById(userId)
//     existUser.orders.push(order._id)
//     existUser.carts=[]
//     await existUser.save()
//     res.status(201).json({
//       message: "Order placed successfully!",
//       success: true,
//       order,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error placing order!",
//       success: false,
//       error: error.message,
//     });
//   }
// };

import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const placeOrder = async (req, res) => {
  try {
    const { userId, shippingAddress, paymentMethod } = req.body;

    const cart = await cartModel.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty!", success: false });
    }

    const orderAmount = cart.totalPrice * 100; // Razorpay needs paise

    // 🔹 Online payment — create Razorpay order
    if (paymentMethod === "card") {
      const razorpayOrder = await razorpay.orders.create({
        amount: orderAmount,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
      });

      return res.status(200).json({
        success: true,
        message: "Razorpay order created successfully!",
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
      });
    }

    // 🔹 COD — directly create order
    const newOrder = new orderModel({
      user: userId,
      products: cart.items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.total,
      })),
      shippingAddress,
      paymentMethod: "cod",
      paymentStatus: "Pending",
      totalAmount: cart.totalPrice,
    });

    await newOrder.save();

    cart.items = [];
    cart.totalQuantity = 0;
    cart.totalPrice = 0;
    await cart.save();

    const existUser = await userModel.findById(userId);
    existUser.orders.push(newOrder._id);
    existUser.carts = [];
    await existUser.save();

    res.status(201).json({
      message: "Order placed successfully (COD)!",
      success: true,
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error placing order!",
      success: false,
      error: error.message,
    });
  }
};

// Verify Razorpay payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, shippingAddress } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed!" });
    }

    // Payment verified — create final order
    const cart = await cartModel.findOne({ user: userId }).populate("items.product");

    const order = new orderModel({
      user: userId,
      products: cart.items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.total,
      })),
      shippingAddress,
      paymentMethod: "card",
      paymentStatus: "Paid",
      orderStatus: "Processing",
      totalAmount: cart.totalPrice,
    });

    await order.save();

    cart.items = [];
    cart.totalQuantity = 0;
    cart.totalPrice = 0;
    await cart.save();

    const existUser = await userModel.findById(userId);
    existUser.orders.push(order._id);
    existUser.carts = [];
    await existUser.save();

    res.status(200).json({
      success: true,
      message: "Payment verified and order placed successfully!",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error verifying payment!",
      error: error.message,
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found!", success: false });
    }

    if (order.orderStatus === "Delivered") {
      return res.status(400).json({ message: "Delivered orders cannot be cancelled!", success: false });
    }

    order.orderStatus = "Cancelled";
    await order.save();

    res.status(200).json({
      message: "Order cancelled successfully!",
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error cancelling order!",
      success: false,
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const {orderId, status } = req.body;
    const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status!", success: false });
    }
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found!", success: false });
    }

    order.orderStatus = status;
    await order.save();

    res.status(200).json({
      message: "Order status updated successfully!",
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating order status!",
      success: false,
      error: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find()
      .populate("user")
      .populate("products.product");

    res.status(200).json({
      message: "All orders fetched successfully!",
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching orders!",
      success: false,
      error: error.message,
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const {userId}=req.body
    const orders = await orderModel.find({ user:userId })
      .populate("products.product")
      .sort({ createdAt: -1 });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found!", success: false });
    }
    res.status(200).json({
      message: "User orders fetched successfully!",
      numberOfOrder:orders.length,
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user orders!",
      success: false,
      error: error.message,
    });
  }
};
