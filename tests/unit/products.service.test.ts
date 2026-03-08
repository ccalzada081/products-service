import { ProductsService } from "../../src/services/products.service";
import { ProductsRepository } from "../../src/repositories/products.repository";
import type { Product } from "../../src/models/product.model";

jest.mock("../../src/repositories/products.repository");

describe("ProductsService", () => {
  let service: ProductsService;
  let repositoryMock: jest.Mocked<ProductsRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProductsService();
    repositoryMock = (service as any).repository as jest.Mocked<ProductsRepository>;
  });

  test("should throw error if name is missing", async () => {
    await expect(
      service.createProduct({
        name: "",
        price: 10,
        category: "electronics",
        stock: 5
      })
    ).rejects.toThrow("Name and category are required");
  });

  test("should throw error if price is negative", async () => {
    await expect(
      service.createProduct({
        name: "Mouse",
        price: -5,
        category: "electronics",
        stock: 5
      })
    ).rejects.toThrow("Price must be greater than or equal to 0");
  });

  test("should throw error if stock is negative", async () => {
    await expect(
      service.createProduct({
        name: "Keyboard",
        price: 50,
        category: "electronics",
        stock: -2
      })
    ).rejects.toThrow("Stock must be greater than or equal to 0");
  });

  test("should create product successfully", async () => {
    repositoryMock.create.mockImplementation(async (product) => product);

    const result = await service.createProduct({
      name: "Mouse",
      price: 25,
      category: "electronics",
      stock: 10,
      image: "https://via.placeholder.com/200"
    });

    expect(result.name).toBe("Mouse");
    expect(result.price).toBe(25);
    expect(result.category).toBe("electronics");
    expect(result.stock).toBe(10);
    expect(result.id).toBeDefined();
    expect(repositoryMock.create).toHaveBeenCalled();
  });

  test("should get product by id", async () => {
    const product: Product = {
      id: "p1",
      name: "Keyboard",
      price: 80,
      category: "electronics",
      stock: 5,
      image: "https://via.placeholder.com/200",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    repositoryMock.findById.mockResolvedValue(product);

    const result = await service.getProductById("p1");

    expect(result).toEqual(product);
    expect(repositoryMock.findById).toHaveBeenCalledWith("p1");
  });

  test("should return filtered products by category", async () => {
    const products: Product[] = [
      {
        id: "p1",
        name: "Mouse",
        price: 25,
        category: "electronics",
        stock: 10,
        image: "https://via.placeholder.com/200",
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01"
      },
      {
        id: "p2",
        name: "Chair",
        price: 180,
        category: "furniture",
        stock: 3,
        image: "https://via.placeholder.com/200",
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01"
      }
    ];

    repositoryMock.findAll.mockResolvedValue(products);

    const result = await service.getAllProducts({ category: "electronics" });

    expect(result).toHaveLength(1);
    expect(result[0].category).toBe("electronics");
  });

  test("should return filtered products by price range", async () => {
    const products: Product[] = [
      {
        id: "p1",
        name: "Mouse",
        price: 25,
        category: "electronics",
        stock: 10,
        image: "https://via.placeholder.com/200",
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01"
      },
      {
        id: "p2",
        name: "Monitor",
        price: 220,
        category: "electronics",
        stock: 3,
        image: "https://via.placeholder.com/200",
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01"
      }
    ];

    repositoryMock.findAll.mockResolvedValue(products);

    const result = await service.getAllProducts({ minPrice: 20, maxPrice: 50 });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Mouse");
  });

  test("should return only available products", async () => {
    const products: Product[] = [
      {
        id: "p1",
        name: "Mouse",
        price: 25,
        category: "electronics",
        stock: 10,
        image: "https://via.placeholder.com/200",
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01"
      },
      {
        id: "p2",
        name: "Monitor",
        price: 220,
        category: "electronics",
        stock: 0,
        image: "https://via.placeholder.com/200",
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01"
      }
    ];

    repositoryMock.findAll.mockResolvedValue(products);

    const result = await service.getAllProducts({ available: true });

    expect(result).toHaveLength(1);
    expect(result[0].stock).toBeGreaterThan(0);
  });

  test("should decrease stock successfully", async () => {
    const product: Product = {
      id: "p1",
      name: "Mouse",
      price: 25,
      category: "electronics",
      stock: 10,
      image: "https://via.placeholder.com/200",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01"
    };

    const updatedProduct: Product = {
      ...product,
      stock: 8,
      updatedAt: "2026-01-02"
    };

    repositoryMock.findById.mockResolvedValue(product);
    repositoryMock.updateStock.mockResolvedValue(updatedProduct);

    const result = await service.decreaseStock("p1", 2);

    expect(result.stock).toBe(8);
    expect(repositoryMock.updateStock).toHaveBeenCalledWith("p1", 8);
  });

  test("should throw error if product does not exist when decreasing stock", async () => {
    repositoryMock.findById.mockResolvedValue(null);

    await expect(service.decreaseStock("p1", 2)).rejects.toThrow("Product not found");
  });

  test("should throw error if not enough stock", async () => {
    const product: Product = {
      id: "p1",
      name: "Mouse",
      price: 25,
      category: "electronics",
      stock: 1,
      image: "https://via.placeholder.com/200",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01"
    };

    repositoryMock.findById.mockResolvedValue(product);

    await expect(service.decreaseStock("p1", 2)).rejects.toThrow("Not enough stock");
  });

  test("should throw error if quantity is invalid when decreasing stock", async () => {
    await expect(service.decreaseStock("p1", 0)).rejects.toThrow(
      "Quantity must be greater than 0"
    );
  });

  test("should update product successfully", async () => {
    const existingProduct: Product = {
      id: "p1",
      name: "Mouse",
      price: 25,
      category: "electronics",
      stock: 10,
      image: "https://via.placeholder.com/200",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01"
    };

    repositoryMock.findById.mockResolvedValue(existingProduct);
    repositoryMock.update.mockResolvedValue();

    const result = await service.updateProduct("p1", {
      name: "Mouse Pro",
      price: 35,
      category: "electronics",
      stock: 8,
      image: "https://via.placeholder.com/300"
    });

    expect(result.name).toBe("Mouse Pro");
    expect(result.price).toBe(35);
    expect(repositoryMock.update).toHaveBeenCalled();
  });

  test("should throw error if product does not exist when updating", async () => {
    repositoryMock.findById.mockResolvedValue(null);

    await expect(
      service.updateProduct("p1", {
        name: "Mouse Pro",
        price: 35,
        category: "electronics",
        stock: 8,
        image: "https://via.placeholder.com/300"
      })
    ).rejects.toThrow("Product not found");
  });

  test("should throw error if update product name is missing", async () => {
    await expect(
      service.updateProduct("p1", {
        name: "",
        price: 35,
        category: "electronics",
        stock: 8,
        image: "https://via.placeholder.com/300"
      })
    ).rejects.toThrow("Name and category are required");
  });

  test("should throw error if update product price is negative", async () => {
    await expect(
      service.updateProduct("p1", {
        name: "Mouse Pro",
        price: -1,
        category: "electronics",
        stock: 8,
        image: "https://via.placeholder.com/300"
      })
    ).rejects.toThrow("Price must be greater than or equal to 0");
  });

  test("should throw error if update product stock is negative", async () => {
    await expect(
      service.updateProduct("p1", {
        name: "Mouse Pro",
        price: 35,
        category: "electronics",
        stock: -1,
        image: "https://via.placeholder.com/300"
      })
    ).rejects.toThrow("Stock must be greater than or equal to 0");
  });
});

