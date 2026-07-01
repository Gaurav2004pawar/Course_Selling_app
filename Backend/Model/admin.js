import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,   // ✅ String होना चाहिए
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,   // ✅ String होना चाहिए
    required: true,
    minlength: 6,
  },
}, { timestamps: true });

const Admin= mongoose.model("Admin", adminSchema);
export default Admin