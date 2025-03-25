import { Router } from "express";
import {getProducts,createProduct}  from "../controllers/productController.js";
import upload from "../middleware/upload.js";
const router = Router();

//@desc get all products
router.get("/", getProducts);

//@desc add new product
router.post("/add",upload.single("picture"),createProduct)
export default router;
