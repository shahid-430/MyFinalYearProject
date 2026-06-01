import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image1: {
      type: String,
      required: true,
    },
    image2: {
      type: String,
      required: true,
    },
    image3: {
      type: String,
      required: true,
    },
    image4: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subcategory: {
      type: String,
      required: true,
    },
    sizes: {
      type: Array,
      required: true,
    },
    date: {
      type: Number,
      required: true,
    },
    bestseller: {
      type: Boolean,
    },

    ratingCount: {
      type: Number,
      default: 0,
    },

    ratingTotal: {
      type: Number,
      default: 0,
    },

    ratingAverage: {
      type: Number,
      default: 0,
    },

    ratings: {
      type: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
          },
          value: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
