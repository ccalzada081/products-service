"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const crypto_1 = require("crypto");
const products_repository_1 = require("../repositories/products.repository");
class ProductsService {
    constructor() {
        this.repository = new products_repository_1.ProductsRepository();
    }
    async createProduct(input) {
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
        const product = {
            id: (0, crypto_1.randomUUID)(),
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
    async getProductById(id) {
        return this.repository.findById(id);
    }
    async getAllProducts(filters) {
        const products = await this.repository.findAll();
        let filtered = products;
        if (filters?.category) {
            filtered = filtered.filter(p => p.category === filters.category);
        }
        if (filters?.minPrice !== undefined) {
            filtered = filtered.filter(p => p.price >= filters.minPrice);
        }
        if (filters?.maxPrice !== undefined) {
            filtered = filtered.filter(p => p.price <= filters.maxPrice);
        }
        if (filters?.available) {
            filtered = filtered.filter(p => p.stock > 0);
        }
        return filtered;
    }
    async decreaseStock(id, quantity) {
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
    async updateProduct(id, input) {
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
        const updatedProduct = {
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
exports.ProductsService = ProductsService;
