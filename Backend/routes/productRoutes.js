import express from "express";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/AdminAuth.js";
import isAuth from "../middleware/isAuth.js";
import {
  addProduct,
  listProducts,
  removeProduct,
  updateProduct,
  rateProduct,
} from "../controller/productController.js";

let productRoutes = express.Router();

productRoutes.post(
  "/addproduct",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct,
);

productRoutes.get("/list", listProducts);
productRoutes.post("/rate/:id", isAuth, rateProduct);
productRoutes.post("/remove/:id", adminAuth, removeProduct);
productRoutes.post(
  "/update/:id",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  adminAuth,
  updateProduct,
);

export default productRoutes;
