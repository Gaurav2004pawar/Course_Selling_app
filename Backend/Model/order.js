import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
 
    email: {
      type: String,
     
    },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  paymentIntentId: String,
  amount: Number,
  status: {
    type: String,
    default: "completed",
  },
});

const Order = mongoose.model("Order", orderSchema);
export default Order