import express from "express";
import {
  addToCart,
  getUserCart,
  updateCartItem,
  removeCartItem
} from "../controller/CartController.js";
const router = express.Router();
router.post("/AddToCart", addToCart);
router.get("/GetUserCart/:userId", getUserCart);
router.put("/UpdateCart", updateCartItem);
router.delete("/RemoveCart", removeCartItem);
// router.delete("/clear", clearCart);
export default router;
