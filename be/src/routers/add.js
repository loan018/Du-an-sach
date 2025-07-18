import express from "express";
import {
  getAddresses,
  addAddress,
  deleteAddress,
  setDefaultAddress,
  updateAddress,
} from "../controllers/add.js";
import { auth } from "../middlewares/auth.js";


const routerAdd = express.Router();

routerAdd.get("/", auth, getAddresses);
routerAdd.post("/", auth, addAddress);
routerAdd.delete("/:id", auth, deleteAddress);
routerAdd.patch("/default/:id", auth, setDefaultAddress);
routerAdd.put("/:id", auth,updateAddress ); 

export default routerAdd;
