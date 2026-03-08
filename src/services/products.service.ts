import { randomUUID } from "crypto";
import { Product } from "../models/product.model";
import { ProductsRepository } from "../repositories/products.repository";

interface CreateProductInput {
  name: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
}

interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
}

export class ProductsService {
  private repository: ProductsRepository;

  constructor() {
    this.repository = new ProductsRepository();
  }

  async createProduct(input: CreateProductInput): Promise<Product> {
    if (!input.name || !input.category) {
      throw new Error("Name and category are required");
    }

    if (input.price == null || input.price < 0) {
      throw new Error("Price must be greater than or equal to 0");
    }

    if (input.stock == null || input.stock < 0) {
      throw new Error("Stock must be greater than or equal to 0");
    }

    const now = new Date().toISOString();

    const product: Product = {
      id: randomUUID(),
      name: input.name,
      price: input.price,
      category: input.category,
      stock: input.stock,
      image: input.image,
      createdAt: now,
      updatedAt: now
    };

    return this.repository.create(product);
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.repository.findById(id);
  }

  async getAllProducts(filters?: ProductFilters): Promise<Product[]> {

    const products = await this.repository.findAll();

    let filtered = products;

    if (filters?.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    if (filters?.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= filters.minPrice!);
    }

    if (filters?.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice!);
    }

    if (filters?.available) {
      filtered = filtered.filter(p => p.stock > 0);
    }

    return filtered;
  }

  async decreaseStock(id: string, quantity: number): Promise<Product> {

    if (quantity == null || quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    const product = await this.repository.findById(id);

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.stock < quantity) {
      throw new Error("Not enough stock");
    }

    return this.repository.updateStock(id, product.stock - quantity);
  }

  async updateProduct(
    id: string,
    input: {
      name: string;
      price: number;
      category: string;
      stock: number;
      image?: string;
    }
  ): Promise<Product> {

    if (!input.name || !input.category) {
      throw new Error("Name and category are required");
    }

    if (input.price == null || input.price < 0) {
      throw new Error("Price must be greater than or equal to 0");
    }

    if (input.stock == null || input.stock < 0) {
      throw new Error("Stock must be greater than or equal to 0");
    }

    const existingProduct = await this.repository.findById(id);

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    const updatedProduct: Product = {
      ...existingProduct,
      name: input.name,
      price: input.price,
      category: input.category,
      stock: input.stock,
      image: input.image,
      updatedAt: new Date().toISOString()
    };

    await this.repository.update(id, updatedProduct);

    return updatedProduct;
  }
}
