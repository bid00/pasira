import Product from "../models/productsModel.js";

//@desc Create product with image upload
//@route /api/products/add

const createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    const picture = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !price || !picture) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = new Product({ name, price, picture });
    await product.save();

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating product", error });
  }
};

//@desc Get all products
//@route GET /api/products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}, "name price picture");

    const updatedProducts = products.map(item => ({
      id:item._id,
      name: item.name,
      price: item.price,
      picture: `${req.protocol}://${req.get("host")}${item.picture}`, 
    }));

    res.status(200).json(updatedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products", error });
  }
};


export { createProduct, getProducts };
