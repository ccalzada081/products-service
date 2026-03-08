import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ProductsService } from "./services/products.service";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const productsService = new ProductsService();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    service: "products-service",
    status: "ok"
  });
});

app.post("/products", async (req, res) => {
  try {
    const product = await productsService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({
      error: "INVALID_DATA",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

app.get("/products", async (req, res) => {
  try {

    const filters = {
      category: req.query.category as string | undefined,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      available: req.query.available === "true"
    };

    const products = await productsService.getAllProducts(filters);

    res.status(200).json({
      items: products,
      count: products.length
    });

  } catch (_error) {

    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Failed to fetch products"
    });

  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const product = await productsService.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Product not found"
      });
    }

    res.status(200).json(product);
  } catch (_error) {
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Failed to fetch product"
    });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const product = await productsService.updateProduct(req.params.id, req.body);

    res.status(200).json(product);

  } catch (error) {

    const message = error instanceof Error ? error.message : "Unknown error";

    if (message === "Product not found") {
      return res.status(404).json({
        error: "NOT_FOUND",
        message
      });
    }

    if (
      message === "Name and category are required" ||
      message === "Price must be greater than or equal to 0" ||
      message === "Stock must be greater than or equal to 0"
    ) {
      return res.status(400).json({
        error: "INVALID_DATA",
        message
      });
    }

    res.status(500).json({
      error: "INTERNAL_ERROR",
      message
    });
  }
});

app.put("/products/:id/stock", async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const product = await productsService.decreaseStock(id, quantity);

    res.status(200).json(product);

  } catch (error) {

    const message = error instanceof Error ? error.message : "Unknown error";

    if (message === "Product not found") {
      return res.status(404).json({
        error: "NOT_FOUND",
        message
      });
    }

    if (message === "Not enough stock" || message === "Quantity must be greater than 0") {
      return res.status(400).json({
        error: "STOCK_ERROR",
        message
      });
    }

    res.status(500).json({
      error: "INTERNAL_ERROR",
      message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Products service running on port ${PORT}`);
});
