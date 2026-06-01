import express from "express";
import isAuth from "../middleware/isAuth.js";
import {
  processMessage,
  searchProductsForChat,
  getProductDetailsForChat,
} from "../controller/chatbotController.js";

const chatbotRoutes = express.Router();

chatbotRoutes.post("/message", isAuth, processMessage);
chatbotRoutes.post("/search", isAuth, searchProductsForChat);
chatbotRoutes.get("/product/:productId", isAuth, getProductDetailsForChat);

export default chatbotRoutes;
