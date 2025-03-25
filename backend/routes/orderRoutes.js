import { Router } from "express";
import { placeOrder, getUserOrders } from "../controllers/orderController.js";

const router = Router();

// /api/order/checkout

router.post("/checkout", placeOrder);
// /api/order/
router.get("/", getUserOrders);

export default router;
