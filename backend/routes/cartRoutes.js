import { Router } from "express";
const router = Router();
import {addToCart,getCart,removeFromCart,updateQuantity} from "../controllers/cartController.js";

router.post("/add", addToCart);
router.get("/", getCart);
router.post("/update-quantity", updateQuantity);
router.post("/remove",removeFromCart);

export default router;
