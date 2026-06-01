import uploadOnCloudinary from "../config/cloudinary.js";
import Product from "../model/productModel.js";
import Order from "../model/orderModel.js";

const computeRatingSummary = (product) => {
  const ratingCount = product.ratings?.length || 0;
  const ratingTotal =
    product.ratings?.reduce((sum, item) => sum + Number(item.value || 0), 0) ||
    0;
  const ratingAverage =
    ratingCount > 0 ? Number((ratingTotal / ratingCount).toFixed(1)) : 0;

  return { ratingCount, ratingTotal, ratingAverage };
};

export const addProduct = async (req, res) => {
  try {
    let { name, description, price, category, subcategory, sizes, bestseller } =
      req.body;

    let image1 = await uploadOnCloudinary(req.files.image1[0].path);
    let image2 = await uploadOnCloudinary(req.files.image2[0].path);
    let image3 = await uploadOnCloudinary(req.files.image3[0].path);
    let image4 = await uploadOnCloudinary(req.files.image4[0].path);

    let productData = {
      name,
      description,
      price: Number(price),
      category,
      subcategory,
      sizes: JSON.parse(sizes),
      bestseller: bestseller === "true" ? true : false,
      date: Date.now(),
      image1,
      image2,
      image3,
      image4,
    };

    const product = await Product.create(productData);

    return res.status(201).json(product);
  } catch (error) {
    console.log("addProduct error:", error);

    return res.status(401).json({ message: `Product adding error ${error}` });
  }
};

export const listProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json(products);
  } catch (error) {
    console.log("listProducts error:", error);
    return res.status(401).json({ message: `Product listing error ${error}` });
  }
};

export const removeProduct = async (req, res) => {
  try {
    let { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ message: "Product removed successfully", product });
  } catch (error) {
    console.log("removeProduct error:", error);
    return res.status(401).json({ message: `Product removing error ${error}` });
  }
};

export const updateProduct = async (req, res) => {
  try {
    let { id } = req.params;
    let { name, description, price, category, subcategory, sizes, bestseller } =
      req.body;

    let updateData = {
      name,
      description,
      price: Number(price),
      category,
      subcategory,
      sizes: JSON.parse(sizes),
      bestseller: bestseller === "true" ? true : false,
    };

    // Handle image updates if provided
    if (req.files) {
      if (req.files.image1 && req.files.image1[0]) {
        updateData.image1 = await uploadOnCloudinary(req.files.image1[0].path);
      }
      if (req.files.image2 && req.files.image2[0]) {
        updateData.image2 = await uploadOnCloudinary(req.files.image2[0].path);
      }
      if (req.files.image3 && req.files.image3[0]) {
        updateData.image3 = await uploadOnCloudinary(req.files.image3[0].path);
      }
      if (req.files.image4 && req.files.image4[0]) {
        updateData.image4 = await uploadOnCloudinary(req.files.image4[0].path);
      }
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return res
      .status(200)
      .json({ message: "Product updated successfully", product });
  } catch (error) {
    console.log("updateProduct error:", error);
    return res.status(401).json({ message: `Product updating error ${error}` });
  }
};

export const rateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, orderId } = req.body;
    const userId = req.userId;

    const numericRating = Number(rating);

    if (
      !Number.isFinite(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    if (!orderId) {
      return res.status(400).json({ message: "orderId is required" });
    }

    const [product, order] = await Promise.all([
      Product.findById(id),
      Order.findById(orderId),
    ]);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (String(order.userId) !== String(userId)) {
      return res
        .status(403)
        .json({ message: "Not authorized to rate this order" });
    }

    const hasPurchasedItem =
      Array.isArray(order.items) &&
      order.items.some((item) => String(item._id || item.id) === String(id));

    if (!hasPurchasedItem) {
      return res
        .status(400)
        .json({ message: "This product is not part of the order" });
    }

    if (!Array.isArray(product.ratings)) {
      product.ratings = [];
    }

    const existingRatingIndex = product.ratings.findIndex(
      (item) =>
        String(item.userId) === String(userId) &&
        String(item.orderId) === String(orderId),
    );

    if (existingRatingIndex >= 0) {
      product.ratings[existingRatingIndex].value = numericRating;
    } else {
      product.ratings.push({ userId, orderId, value: numericRating });
    }

    const summary = computeRatingSummary(product);
    product.ratingCount = summary.ratingCount;
    product.ratingTotal = summary.ratingTotal;
    product.ratingAverage = summary.ratingAverage;

    await product.save();

    return res.status(200).json({
      message: "Rating saved successfully",
      product,
    });
  } catch (error) {
    console.log("rateProduct error:", error);
    return res.status(500).json({ message: `Product rating error ${error}` });
  }
};
