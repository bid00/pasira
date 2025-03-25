import { Schema, model } from "mongoose";
import { type } from "os";

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  picture:{
    type:String,
    required:true
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = model("Product", ProductSchema);

export default Product;
