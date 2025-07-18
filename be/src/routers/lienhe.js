import express from "express";
import {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
} from "../controllers/lienhe.js";
import { auth } from "../middlewares/auth.js";

const routerL = express.Router();

routerL.post("/",auth, createContact);
routerL.get("/",auth, getAllContacts);
routerL.get("/:id",auth, getContactById);
routerL.put("/:id",auth, updateContact);
routerL.delete("/:id",auth, deleteContact);

export default routerL;
