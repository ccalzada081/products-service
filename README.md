# Products Service

Products Service is the microservice responsible for managing the product catalog of the application.

It provides product CRUD operations, search with filters, stock control, and seed data for initial testing.

---

## Tech Stack

- Node.js
- TypeScript
- Express
- DynamoDB
- AWS SDK v3
- Jest
- Docker
- Postman

---

## Responsibilities

This microservice is responsible for:

- Creating products
- Listing products
- Getting a product by ID
- Updating products
- Decreasing stock
- Filtering products by category, price range, and availability

---

## Project Structure

```bash
products-service
├── scripts
├── src
│   ├── models
│   ├── repositories
│   ├── services
│   ├── utils
│   └── app.ts
├── tests
│   └── unit
├── Dockerfile
├── jest.config.js
├── package.json
├── tsconfig.json
└── Products Service API.postman_collection.json

Environment Variables

Create a .env file in the root of the project:

PORT=3001
AWS_REGION=us-east-1
PRODUCTS_TABLE=Products
DynamoDB Table
Table name
Products
Partition key
id (String)
Product model
{
  "id": "uuid",
  "name": "Wireless Mouse",
  "price": 25,
  "category": "electronics",
  "stock": 10,
  "image": "https://via.placeholder.com/200",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
Installation

Install dependencies:

npm install

Run in development mode:

npm run dev

Build project:

npm run build

Run compiled version:

npm start
API Endpoints
Health check
GET /health
Get all products
GET /products
Get product by ID
GET /products/:id
Create product
POST /products
Update product
PUT /products/:id
Decrease stock
PUT /products/:id/stock
Filters

The GET /products endpoint supports filters through query parameters.

Filter by category
GET /products?category=electronics
Filter by price range
GET /products?minPrice=20&maxPrice=200
Filter by availability
GET /products?available=true
Example Requests
Create product
POST /products
{
  "name": "Wireless Mouse",
  "price": 25,
  "category": "electronics",
  "stock": 10,
  "image": "https://via.placeholder.com/200"
}
Update stock
PUT /products/:id/stock
{
  "quantity": 2
}
Seed Data

This project includes a seed script that inserts at least 20 sample products into DynamoDB.

Run:

npm run seed
Testing

Run unit tests with coverage:

npm test
Coverage

Statements: 86%+

Lines: 85%+

Branches: 88%+

The service exceeds the required 80% unit test coverage.

Docker

Build Docker image:

docker build -t products-service .

Run container:

docker run -p 3001:3001 products-service
Postman Collection

A Postman collection is included in the repository:

Products Service API.postman_collection.json

It contains:

valid requests

filtered requests

stock update requests

Notes

This service stores product data in DynamoDB.

Orders Service depends on this microservice to validate stock and update inventory.

The stock update endpoint is used internally by Orders Service during order confirmation
