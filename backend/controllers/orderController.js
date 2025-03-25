import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";


//@desc place new order
//@route /api/orders/checkout
export const placeOrder = async (req, res) => {
  const { email, phone, paymentMethod ,totalAmount} = req.body;
  const user = req.user.id;
  console.log(totalAmount);
  try {
    //@desc Check if the user's cart exists and is not empty
    const cart = await Cart.findOne({ userId: user });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    //@desc Count existing orders to generate an incremented order number
    const orderCount = await Order.countDocuments(); //@desc Get total orders
    const newOrderNumber = orderCount + 1; //@desc Increment order number
    const shippingAddress= req.body.country + " " +req.body.city +" "+req.body.state ;
    const newOrder = new Order({
      orderNumber: newOrderNumber, //@desc Assign auto-incremented order number
      userId: user,
      email,
      shippingAddress,
      phone,
      items: cart.items,
      totalAmount,
      paymentMethod,
      status: "Pending",
    });

    await newOrder.save();
    await Cart.deleteOne({ userId: user });

    res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error processing order",
      error,
    });
  }
};

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const user = req.user.id;
    const orders = await Order.find({ userId:user });
    if (!orders.length) {
      return res.status(404).json({ message: "No orders found" });
    }
    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching orders", error });
  }
};