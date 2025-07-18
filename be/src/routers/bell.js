import express from "express";
import {
  getNotifications,
  createNotification,
  markAsRead,
  deleteNotification,
  markAllAsRead,
  searchAdminData,
} from "../controllers/bell.js";
import { auth } from "../middlewares/auth.js";
import { requireStaffOrAdmin } from "../middlewares/role.js"; 

const routerBell = express.Router();
routerBell.get("/", auth, getNotifications);
routerBell.post("/", auth, createNotification);
routerBell.patch("/:id/read", auth, markAsRead);
routerBell.patch("/read/all", auth, markAllAsRead);
routerBell.delete("/:id", auth, deleteNotification);
routerBell.get("/search", auth, requireStaffOrAdmin, searchAdminData);

export default routerBell;
