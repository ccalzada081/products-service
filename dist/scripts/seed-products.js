"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = require("crypto");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const dynamodb_1 = require("../src/utils/dynamodb");
dotenv_1.default.config();
const TABLE_NAME = process.env.PRODUCTS_TABLE || "Products";
const products = [
    { name: "Wireless Mouse", price: 25, category: "electronics", stock: 10, image: "https://via.placeholder.com/200" },
    { name: "Mechanical Keyboard", price: 80, category: "electronics", stock: 15, image: "https://via.placeholder.com/200" },
    { name: "Gaming Monitor", price: 220, category: "electronics", stock: 8, image: "https://via.placeholder.com/200" },
    { name: "USB-C Hub", price: 35, category: "electronics", stock: 20, image: "https://via.placeholder.com/200" },
    { name: "Laptop Stand", price: 40, category: "electronics", stock: 12, image: "https://via.placeholder.com/200" },
    { name: "Webcam HD", price: 55, category: "electronics", stock: 9, image: "https://via.placeholder.com/200" },
    { name: "Bluetooth Headphones", price: 95, category: "electronics", stock: 14, image: "https://via.placeholder.com/200" },
    { name: "External SSD 1TB", price: 130, category: "electronics", stock: 7, image: "https://via.placeholder.com/200" },
    { name: "RAM 16GB", price: 75, category: "electronics", stock: 18, image: "https://via.placeholder.com/200" },
    { name: "Gaming Chair", price: 180, category: "furniture", stock: 5, image: "https://via.placeholder.com/200" },
    { name: "Office Desk", price: 250, category: "furniture", stock: 4, image: "https://via.placeholder.com/200" },
    { name: "Desk Lamp", price: 30, category: "home", stock: 16, image: "https://via.placeholder.com/200" },
    { name: "Water Bottle", price: 15, category: "accessories", stock: 25, image: "https://via.placeholder.com/200" },
    { name: "Notebook", price: 8, category: "stationery", stock: 40, image: "https://via.placeholder.com/200" },
    { name: "Backpack", price: 60, category: "accessories", stock: 11, image: "https://via.placeholder.com/200" },
    { name: "Smartwatch", price: 150, category: "electronics", stock: 6, image: "https://via.placeholder.com/200" },
    { name: "Phone Charger", price: 20, category: "electronics", stock: 30, image: "https://via.placeholder.com/200" },
    { name: "Tablet", price: 300, category: "electronics", stock: 5, image: "https://via.placeholder.com/200" },
    { name: "Printer", price: 110, category: "electronics", stock: 3, image: "https://via.placeholder.com/200" },
    { name: "Mouse Pad", price: 12, category: "accessories", stock: 22, image: "https://via.placeholder.com/200" }
];
async function seedProducts() {
    try {
        for (const product of products) {
            const now = new Date().toISOString();
            await dynamodb_1.dynamoDb.send(new lib_dynamodb_1.PutCommand({
                TableName: TABLE_NAME,
                Item: {
                    id: (0, crypto_1.randomUUID)(),
                    ...product,
                    createdAt: now,
                    updatedAt: now
                }
            }));
        }
        console.log("Seed completed successfully");
    }
    catch (error) {
        console.error("Seed failed:", error);
    }
}
seedProducts();
