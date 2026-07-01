import Order from "../Model/order.js";
import Stripe from "stripe";
import config from "../config.js";

const stripe = new Stripe(config.STRIPE_SECRET_KEY);

const verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session =
      await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    const existingPurchase = await Order.findOne({
      userId: session.metadata.userId,
      courseId: session.metadata.courseId,
    });

    if (existingPurchase) {
      return res.status(200).json({
        success: true,
        message: "Course already purchased",
      });
    }

    const purchase = await Order.create({
      userId: session.metadata.userId,
    email: session.metadata.email,
      courseId: session.metadata.courseId,
      paymentIntentId: session.payment_intent,
      amount: session.amount_total / 100,
      status: "completed",
    });

    return res.status(201).json({
      success: true,
      message: "Payment stored successfully",
      purchase,
    });
  } catch (error) {
    console.log("Verify Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default verifyPayment;