import express from "express";
import isAuth from "../middleware/isAuth.js";
import adminAuth from "../middleware/AdminAuth.js";
import {
  PlaceOrder,
  verifyOrder,
  userOrders,
  getAllOrders,
  updateOrderStatus,
  updateOrderTracking,
  cancelOrderUser,
  cancelOrderAdmin,
  deleteOrderUser,
  deleteOrderAdmin,
} from "../controller/orderController.js";

const orderRoutes = express.Router();

orderRoutes.post("/placeorder", isAuth, PlaceOrder);
// verify endpoint used by frontend after Stripe Checkout redirect
orderRoutes.post("/verify", verifyOrder);
orderRoutes.post("/userorder", isAuth, userOrders);
orderRoutes.post("/cancel/:orderId", isAuth, cancelOrderUser);
orderRoutes.delete("/delete/:orderId", isAuth, deleteOrderUser);

orderRoutes.get("/list", adminAuth, getAllOrders);
orderRoutes.patch("/:orderId/status", adminAuth, updateOrderStatus);
orderRoutes.patch("/:orderId/tracking", adminAuth, updateOrderTracking);
orderRoutes.post("/admin/cancel/:orderId", adminAuth, cancelOrderAdmin);
orderRoutes.delete("/admin/delete/:orderId", adminAuth, deleteOrderAdmin);

export default orderRoutes;
