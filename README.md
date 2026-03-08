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
```

---

## Environment Variables

Create a `.env` file in the root of the project.

```env
PORT=3001
AWS_REGION=us-east-1
PRODUCTS_TABLE=Products
```

---

## DynamoDB Table

### Table name

```
Products
```

### Partition key

```
id (String)
```

---

## Product Model

```json
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
```

---

## Installation

Install dependencies:

```bash
npm install
```

Run in development mode:

```bash
npm run dev
```

Build project:

```bash
npm run build
```

Run compiled version:

```bash
npm start
```

---

## API Endpoints

### Health Check

```
GET /health
```

---

### Get All Products

```
GET /products
```

Returns all products in the catalog.

---

### Get Product by ID

```
GET /products/:id
```

Returns a single product by its ID.

Example:

```
GET /products/2abfdf43-7190-4711-a553-bf8e9e6e0e76
```

---

### Create Product

```
POST /products
```

Request body:

```json
{
  "name": "Wireless Mouse",
  "price": 25,
  "category": "electronics",
  "stock": 10,
  "image": "https://via.placeholder.com/200"
}
```

---

### Update Product

```
PUT /products/:id
```

Request body:

```json
{
  "name": "Wireless Mouse Pro",
  "price": 30,
  "category": "electronics",
  "stock": 12
}
```

---

### Decrease Stock

```
PUT /products/:id/stock
```

Request body:

```json
{
  "quantity": 2
}
```

This endpoint is used internally by the **Orders Service** to decrease product stock when an order is confirmed.

---

## Filters

The `GET /products` endpoint supports filters through query parameters.

### Filter by category

```
GET /products?category=electronics
```

### Filter by price range

```
GET /products?minPrice=20&maxPrice=200
```

### Filter by availability

```
GET /products?available=true
```

---

## Example Requests

### Create Product

```
POST /products
```

```json
{
  "name": "Wireless Mouse",
  "price": 25,
  "category": "electronics",
  "stock": 10,
  "image": "https://via.placeholder.com/200"
}
```

---

### Update Stock

```
PUT /products/:id/stock
```

```json
{
  "quantity": 2
}
```

---

## Seed Data

This project includes a seed script that inserts at least **20 sample products** into DynamoDB.

Run:

```bash
npm run seed
```

---

## Testing

Run unit tests with coverage:

```bash
npm test
```

### Coverage

- Statements: **86%+**
- Lines: **85%+**
- Branches: **88%+**

The service exceeds the required **80% unit test coverage**.

---

## Docker

Build Docker image:

```bash
docker build -t products-service .
```

Run container:

```bash
docker run -p 3001:3001 products-service
```

---

## Postman Collection

A Postman collection is included in the repository:

```
Products Service API.postman_collection.json
```

It contains:

- valid requests
- filtered requests
- stock update requests

---

## Notes

This service stores product data in **DynamoDB**.

The **Orders Service** depends on this microservice to validate product stock and update inventory during order confirmation.
