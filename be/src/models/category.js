import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên danh mục là bắt buộc"],
      trim: true,
      unique: true,
      minlength: [2, "Tên danh mục tối thiểu 2 ký tự"],
      maxlength: [100, "Tên danh mục tối đa 100 ký tự"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Mô tả danh mục tối đa 500 ký tự"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
      min: [0, "Thứ tự không được nhỏ hơn 0"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Auto generate slug trước khi lưu
categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
