import express from "express";
import {
  placeOrder,
  cancelOrder,
  updateOrderStatus,
  getAllOrders,
  getUserOrders,
  verifyPayment
} from "../controller/OrderController.js";

const router = express.Router();

router.post("/PlaceOrder", placeOrder);
router.post("/Verify-payment", verifyPayment);
router.put("/CancelOrder", cancelOrder);
router.put("/UpdateStatus", updateOrderStatus);
router.post("/GetUserOrder", getUserOrders);
router.get("/GetAllOrder", getAllOrders);

export default router;
