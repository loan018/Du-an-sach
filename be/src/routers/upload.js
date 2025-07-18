// routes/upload.ts
import express from "express";
import multer from "multer";
import path from "path";
import {updateAvatar} from "../controllers/user.js";
import { auth } from "../middlewares/auth.js";


const uploadRoute = express.Router();

// Cấu hình lưu file
const storage = multer.diskStorage({
  destination: "uploads/", // thư mục lưu ảnh
  filename: (_, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname)); // ảnh.jpg
  },
});

const upload = multer({ storage });

// API: POST /api/upload/avatar
uploadRoute.post("/avatar", auth,upload.single("avatar"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Không có file được upload" });
  }

  req.body.avatar = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  updateAvatar(req, res);


  // Trả về đường dẫn ảnh đã upload
  res.json({
  url: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
});
});

export default uploadRoute;
