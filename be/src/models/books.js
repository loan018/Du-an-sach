import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Tiêu đề sách là bắt buộc"],
      trim: true,
      minlength: [2, "Tiêu đề sách quá ngắn"],
      maxlength: [255, "Tiêu đề sách quá dài"],
    },
    image: {
      type: String,
      required: [true, "Ảnh sách là bắt buộc"],
      match: [/^https?:\/\/.+/, "Ảnh phải là một đường dẫn hợp lệ (URL)"],
    },
    oldPrice: {
      type: Number,
      default: 0,
      min: [1000, "Giá cũ phải lớn hơn 1000"],
    },
    price: {
      type: Number,
      required: [true, "Giá là bắt buộc"],
      min: [1000, "Giá phải lớn hơn 1000"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Danh mục là bắt buộc"],
    },
    author: {
      type: String,
      required: [true, "Tác giả là bắt buộc"],
      trim: true,
      minlength: [2, "Tên tác giả quá ngắn"],
      maxlength: [100, "Tên tác giả quá dài"],
    },
    description: {
      type: String,
      default: "",
      maxlength: [1500, "Mô tả sách không được vượt quá 1500 ký tự"],
    },
    quantity: {
      type: Number,
      required: [true, "Số lượng là bắt buộc"],
      min: [0, "Số lượng không được âm"],
    },
    sold: {
      type: Number,
      default: 0,
      min: [0, "Số lượng đã bán không được âm"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Book", bookSchema);
