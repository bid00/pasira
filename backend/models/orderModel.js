import mongoose, { Schema, model } from "mongoose";

const orderSchema = new Schema({
  orderNumber:{type:Number},
  userId: { type: mongoose.Schema.Types.ObjectId,ref:"User", required: true },
  email: { type: String, required: true },
  shippingAddress: { type: String, required: true },
  phone: { type: String, required: true },
  items: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, default: "Pending" },
  date:{type:Number , default:Date.now()}
}, { timestamps: true });

export default model("Order", orderSchema);
