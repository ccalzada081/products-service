"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsRepository = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const product_model_1 = require("../models/product.model");
const dynamodb_1 = require("../utils/dynamodb");
const TABLE_NAME = process.env.PRODUCTS_TABLE || "Products";
class ProductsRepository {
    async create(product) {
        await dynamodb_1.dynamoDb.send(new lib_dynamodb_1.PutCommand({
            TableName: TABLE_NAME,
            Item: product
        }));
        return product;
    }
    async findById(id) {
        const result = await dynamodb_1.dynamoDb.send(new lib_dynamodb_1.GetCommand({
            TableName: TABLE_NAME,
            Key: { id }
        }));
        return result.Item || null;
    }
    async findAll() {
        const result = await dynamodb_1.dynamoDb.send(new lib_dynamodb_1.ScanCommand({
            TableName: TABLE_NAME
        }));
        return result.Items || [];
    }
    async update(id, updates) {
        await dynamodb_1.dynamoDb.send(new lib_dynamodb_1.UpdateCommand({
            TableName: TABLE_NAME,
            Key: { id },
            UpdateExpression: `
          SET #name = :name,
              price = :price,
              category = :category,
              stock = :stock,
              image = :image,
              updatedAt = :updatedAt
        `,
            ExpressionAttributeNames: {
                "#name": "name"
            },
            ExpressionAttributeValues: {
                ":name": updates.name,
                ":price": updates.price,
                ":category": updates.category,
                ":stock": updates.stock,
                ":image": updates.image,
                ":updatedAt": updates.updatedAt
            }
        }));
    }
    async updateStock(id, newStock) {
        const result = await dynamodb_1.dynamoDb.send(new lib_dynamodb_1.UpdateCommand({
            TableName: TABLE_NAME,
            Key: { id },
            UpdateExpression: `
          SET stock = :stock,
              updatedAt = :updatedAt
        `,
            ExpressionAttributeValues: {
                ":stock": newStock,
                ":updatedAt": new Date().toISOString()
            },
            ReturnValues: "ALL_NEW"
        }));
        return result.Attributes;
    }
}
exports.ProductsRepository = ProductsRepository;
//# sourceMappingURL=products.repository.js.map