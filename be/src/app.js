import express from "express";
import dotenv from 'dotenv';
import connectDB from "./config/db";
import routerUser from "./routers/user.js";
import routerBanner from "./routers/banner.js";
import routerCategory from "./routers/category.js";
import routerBook from "./routers/books.js";
import routerReview from "./routers/review.js";
import routerCart from "./routers/cart.js";
import routerOrder from "./routers/order.js";
import routerDashboard from "./routers/stats.js";


dotenv.config();


const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded())

app.use("/api/users", routerUser);
app.use("/api/banner", routerBanner);
app.use("/api/category", routerCategory);
app.use("/api/book", routerBook);
app.use("/api/review", routerReview);
app.use("/api/cart", routerCart);
app.use("/api/order", routerOrder);
app.use("/api/stats",routerDashboard)
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});