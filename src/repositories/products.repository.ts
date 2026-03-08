import { GetCommand, PutCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { Product } from "../models/product.model";
import { dynamoDb } from "../utils/dynamodb";

const TABLE_NAME = process.env.PRODUCTS_TABLE || "Products";

export class ProductsRepository {

  async create(product: Product): Promise<Product> {
    await dynamoDb.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: product
      })
    );

    return product;
  }

  async findById(id: string): Promise<Product | null> {
    const result = await dynamoDb.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { id }
      })
    );

    return (result.Item as Product) || null;
  }

  async findAll(): Promise<Product[]> {
    const result = await dynamoDb.send(
      new ScanCommand({
        TableName: TABLE_NAME
      })
    );

    return (result.Items as Product[]) || [];
  }

  async update(id: string, updates: Partial<Product>): Promise<void> {
    await dynamoDb.send(
      new UpdateCommand({
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
      })
    );
  }

  async updateStock(id: string, newStock: number): Promise<Product> {
    const result = await dynamoDb.send(
      new UpdateCommand({
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
      })
    );

    return result.Attributes as Product;
  }
}
