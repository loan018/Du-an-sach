import express from "express";
import {
  addToFavorites,
  removeFromFavorites,
  getFavoriteBooks,
} from "../controllers/favorite.js";
import { auth } from "../middlewares/auth.js";

const routerFavorite = express.Router();

routerFavorite.post("/:id",auth , addToFavorites);
routerFavorite.delete("/:id",auth , removeFromFavorites);
routerFavorite.get("/",auth , getFavoriteBooks);

export default routerFavorite;
