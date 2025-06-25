import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Người dùng là bắt buộc"],
    },
   shippingInfo: {
  name: {
    type: String,
    required: [true, "Tên người nhận là bắt buộc"],
    trim: true,
    minlength: [2, "Tên quá ngắn"],
    maxlength: [100, "Tên quá dài"],
  },
  address: {
    type: String,
    required: [true, "Địa chỉ là bắt buộc"],
    trim: true,
    minlength: [5, "Địa chỉ quá ngắn"],
    maxlength: [200, "Địa chỉ quá dài"],
  },
  phone: {
    type: String,
    required: [true, "Số điện thoại là bắt buộc"],
    trim: true,
    match: [/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ"],
  },
},
    items: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
          required: [true, "Sách là bắt buộc"],
        },
        quantity: {
          type: Number,
          required: [true, "Số lượng là bắt buộc"],
          min: [1, "Số lượng tối thiểu là 1"],
        },
        price: {
          type: Number,
          required: [true, "Giá là bắt buộc"],
          min: [1000, "Giá tối thiểu là 1000"],
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, "Tổng tiền là bắt buộc"],
      min: [1000, "Tổng tiền tối thiểu là 1000"],
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ["cod", "momo"],
        message: "Phương thức thanh toán không hợp lệ",
      },
      default: "cod",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "confirming", "shipping", "delivered", "cancelled"],
        message: "Trạng thái đơn hàng không hợp lệ",
      },
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
