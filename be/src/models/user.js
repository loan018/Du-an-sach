import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tên không được để trống"]
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email không được để trống"],
    match: [/.+\@.+\..+/, "Email không hợp lệ"]
  },
  password: {
    type: String,
    required: [true, "Mật khẩu không được để trống"],
    minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"]
  },
  role: {
    type: String,
    enum: ["user", "admin", "staff"],
    default: "user"
  },
   isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;