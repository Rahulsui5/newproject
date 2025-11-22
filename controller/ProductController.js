import productModel from '../model/ProductModel.js'
// Add Product Controller
export const addProductController = async (req, res) => {
  try {
    const {name,price,originalPrice,discount,image,rating,reviews,delivery,inStock,category,brand,subCategory} = req.body;
    if (
      !name ||
      !price ||
      !originalPrice ||
      !discount ||
      !image ||
      !delivery ||
      inStock === undefined ||
      !category ||
      !brand ||
      !subCategory
    ) {
      return res.status(400).json({
          message: "All required fields must be filled!",
          success: false,
      });
    }
    if (price < 0 || originalPrice < 0) {
      return res.status(400).json({
          message: "Price and Original Price must be positive numbers!",
          success: false,
      });
    }
    if (!Array.isArray(image) || image.length === 0) {
      return res.status(400).json({
          message: "Image must be a non-empty array of valid URLs!",
          success: false,
      });
    }
    const newProduct = await productModel.create({
      name,
      price,
      originalPrice,
      discount,
      image,
      rating,
      reviews,
      delivery,
      inStock,
      category,
      brand,
      subCategory,
    });
    res.status(201).json({
      success: true,
      message: " Product added successfully!",
      product: newProduct,
    });

  } catch (error) {
    console.error(" Error while adding product:", error);
    res.status(500).json({
      success: false,
      message: "Error while adding the product!",
      error: error.message,
    });
  }
};
// Get Product Controller
export const getProductController = async (req, res) => {
  try {
    const products = await productModel.find();
    if (!products || products.length === 0) {
      return res.status(404).json({
          message: "No products found!",
          success: false,
      });
    }

    res.status(200).json({
        message: "Fetched products successfully!",
        totalProduct:products.length,
        success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
        message: "Error while getting the products",
        success: false,
      error: error.message,
    });
  }
};
// Delete Product Controller
export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({
          message: "Product not found!",
          success: false,
      });
    }
    await productModel.findByIdAndDelete(id);

    res.status(200).json({
        message: "Product deleted successfully!",
        success: true,
    });
  } catch (error) {
    res.status(500).json({
        message: "Error while deleting product!",
        success: false,
      error: error.message,
    });
  }
};
// Update Product Controller
export const updateProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({
          message: "Product not found!",
          success: false,
      });
    }
    if (updates.price && updates.price < 0) {
      return res.status(400).json({
          message: "Price must be a positive number!",
          success: false,
      });
    }

    if (updates.originalPrice && updates.originalPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Original price must be a positive number!",
      });
    }
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: " Product updated successfully!",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while updating product!",
      error: error.message,
    });
  }
};
// Get Single Product by ID
export const getSingleProductController = async (req, res) => {
  try {
    const { id } = req.params; 
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required!",
      });
    }
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Product fetched successfully!",
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while fetching product",
      error: error.message,
    });
  }
};
