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
