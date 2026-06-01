import "dotenv/config";
import Order from "../model/orderModel.js";
import User from "../model/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const ORDER_STATUSES = [
  "Order Placed",
  "Packing",
  "Shipped",
  "Out for delivery",
  "Delivered",
  "Cancelled",
];

const CANCELLABLE_STATUSES = ["Order Placed", "Packing"];

const canCancel = (status) => CANCELLABLE_STATUSES.includes(status);

export const PlaceOrder = async (req, res) => {
  try {
    const { items, amount, address, PaymentMethod } = req.body;
    const userId = req.userId;

    const orderData = {
      items,
      amount,
      userId,
      address,
      PaymentMethod: PaymentMethod || "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    const isStripe = String(PaymentMethod || "").toLowerCase() === "stripe";

    const clearUserCart = async () => {
      await User.findByIdAndUpdate(userId, { cartData: {} });
    };

    // If payment method is stripe, create a Checkout Session and return the session url
    if (isStripe) {
      try {
        const stripeCurrency = (
          process.env.STRIPE_CURRENCY || "usd"
        ).toLowerCase();

        // build line items for Stripe
        const line_items = (items || []).map((item) => ({
          price_data: {
            currency: stripeCurrency,
            product_data: { name: item.name || "Item" },
            unit_amount: Math.round((item.price || 0) * 100),
          },
          quantity: item.quantity || 1,
        }));

        // add a delivery charge line item
        line_items.push({
          price_data: {
            currency: stripeCurrency,
            product_data: { name: "Delivery Charges" },
            unit_amount: 200,
          },
          quantity: 1,
        });

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items,
          mode: "payment",
          success_url: `${frontendUrl}/verify?success=true&orderId=${newOrder._id}`,
          cancel_url: `${frontendUrl}/verify?success=false&orderId=${newOrder._id}`,
        });

        await clearUserCart();

        return res
          .status(200)
          .json({ success: true, session_url: session.url });
      } catch (stripeError) {
        await Order.findByIdAndDelete(newOrder._id);
        console.log("Stripe session creation failed:", stripeError);
        return res.status(500).json({
          success: false,
          message: "Failed to create Stripe checkout session",
        });
      }
    }

    await clearUserCart();

    return res
      .status(201)
      .json({ success: true, message: "Order Placed", orderId: newOrder._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Order Place error" });
  }
};

export const verifyOrder = async (req, res) => {
  try {
    const { orderId, success } = req.body;
    if (!orderId)
      return res
        .status(400)
        .json({ success: false, message: "orderId required" });

    if (String(success) === "true") {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { payment: true },
        { new: true },
      );
      return res.status(200).json({ success: true, message: "Paid", order });
    } else {
      // payment failed/cancelled -> remove order
      await Order.findByIdAndDelete(orderId);
      return res.status(200).json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Error" });
  }
};

export const userOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.find({
      userId,
      deletedByUser: { $ne: true },
    }).sort({ date: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to load orders" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      deletedByAdmin: { $ne: true },
    }).sort({ date: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to load orders" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "Cancelled" && status !== "Cancelled") {
      return res
        .status(400)
        .json({ message: "Cannot change status of a cancelled order" });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({ message: "Status updated", order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update status" });
  }
};

export const updateOrderTracking = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { trackingNumber } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.trackingNumber = trackingNumber?.trim() || "";
    await order.save();

    return res.status(200).json({ message: "Tracking updated", order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update tracking" });
  }
};

const cancelOrderById = async (orderId, res) => {
  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.status === "Cancelled") {
    return res.status(400).json({ message: "Order is already cancelled" });
  }

  if (!canCancel(order.status)) {
    return res.status(400).json({
      message: "Order can only be cancelled before it is shipped",
    });
  }

  order.status = "Cancelled";
  await order.save();

  return res.status(200).json({ message: "Order cancelled", order });
};

export const cancelOrderUser = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.userId !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    return cancelOrderById(orderId, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to cancel order" });
  }
};

export const cancelOrderAdmin = async (req, res) => {
  try {
    const { orderId } = req.params;
    return cancelOrderById(orderId, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to cancel order" });
  }
};

export const deleteOrderUser = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.userId !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (order.status !== "Cancelled") {
      return res.status(400).json({
        message: "Only cancelled orders can be removed",
      });
    }

    order.deletedByUser = true;
    await order.save();

    return res.status(200).json({ message: "Order removed from your list" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete order" });
  }
};

export const deleteOrderAdmin = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "Cancelled") {
      return res.status(400).json({
        message: "Only cancelled orders can be removed",
      });
    }

    order.deletedByAdmin = true;
    await order.save();

    return res.status(200).json({ message: "Order removed from admin list" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete order" });
  }
};
