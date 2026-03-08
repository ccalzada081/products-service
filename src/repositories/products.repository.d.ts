import { Product } from "../models/product.model";
export declare class ProductsRepository {
    create(product: Product): Promise<Product>;
    findById(id: string): Promise<Product | null>;
    findAll(): Promise<Product[]>;
    update(id: string, updates: Partial<Product>): Promise<void>;
    updateStock(id: string, newStock: number): Promise<Product>;
}
//# sourceMappingURL=products.repository.d.ts.map