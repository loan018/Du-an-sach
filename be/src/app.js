import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import connectDB from "./config/db";
import routerUser from "./routers/user.js";
import routerBanner from "./routers/banner.js";
import routerCategory from "./routers/category.js";
import routerBook from "./routers/books.js";
import routerReview from "./routers/review.js";
import routerCart from "./routers/cart.js";
import routerOrder from "./routers/order.js";
import routerDashboard from "./routers/stats.js";
import routerBell from "./routers/bell.js";
import routerFavorite from "./routers/favorite.js";
import path from "path";
import uploadRoute from "./routers/upload.js"; 
import routerAdd from "./routers/add.js";
import routerL from "./routers/lienhe.js";

dotenv.config();


const app = express();
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true              
}));
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/users", routerUser);
app.use("/api/banner", routerBanner);
app.use("/api/category", routerCategory);
app.use("/api/book", routerBook);
app.use("/api/review", routerReview);
app.use("/api/cart", routerCart);
app.use("/api/order", routerOrder);
app.use("/api/stats",routerDashboard)
app.use("/api/bell", routerBell);
app.use("/api/favorite",routerFavorite);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/upload", uploadRoute);
app.use("/api/address", routerAdd);
app.use("/api/contact", routerL); 

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});