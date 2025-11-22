import mongoose from 'mongoose'
const productSchema= new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Please provide a product name"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Please provide product price"],
    },

    originalPrice: {
      type: Number,
      required: [true, "Please provide original price"],
    },

    discount: {
      type: String,
      default: "0% OFF",
    },

    image: {
      type: [String],
      required: [true, "Please provide at least one product image"],
    },

    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
    },

    reviews: {
      type: Number,
      default: 0,
    },
    delivery: {
      type: String,
      enum: ["Free Delivery", "Paid Delivery", "Fast Delivery"],
      default: "Free Delivery",
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    category: {
      type: String,
      required: [true, "Please specify category"],
      trim: true,
    },

    brand: {
      type: String,
      required: [true, "Please specify brand name"],
      trim: true,
    },

    subCategory: {
      type: String,
      required: [true, "Please specify subcategory"],
      trim: true,
    },
  },
  { timestamps: true }
)
const productModel= mongoose.model("productModel",productSchema)
export default productModel