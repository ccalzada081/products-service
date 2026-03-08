import { Product } from "../models/product.model";
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
export declare class ProductsService {
    private repository;
    constructor();
    createProduct(input: CreateProductInput): Promise<Product>;
    getProductById(id: string): Promise<Product | null>;
    getAllProducts(filters?: ProductFilters): Promise<Product[]>;
    decreaseStock(id: string, quantity: number): Promise<Product>;
    updateProduct(id: string, input: {
        name: string;
        price: number;
        category: string;
        stock: number;
        image?: string;
    }): Promise<Product>;
}
export {};
//# sourceMappingURL=products.service.d.ts.map