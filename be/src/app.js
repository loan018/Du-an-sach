import express from "express";
import dotenv from 'dotenv';
import connectDB from "./config/db";

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded())

app.get('/',(request, response)=>{
  return response.send("Hello world")
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});