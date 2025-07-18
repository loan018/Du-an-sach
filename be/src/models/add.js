import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    ward: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["home", "office"],
      default: "home",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Address", addressSchema);
