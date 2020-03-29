import { ProductRepository } from "./product.repository";
import { Product } from "../models/product";
import { Stock } from "../models/stock";

export class ProductService {

  constructor(private productRepository: ProductRepository) {
  }

  addProductToStock(productId: string, product: Product): Promise<any> {
    return this.productRepository.addProductToStock(productId, this.createStock(product));
  }

  createStock(product: Product): Stock {
    const stockDocument: Stock = {
      productID: product.name,
      productAmount: 5
    }
    return stockDocument;
  }

  purchaseProduct(orderId: string): Promise<any> {
    return this.productRepository.purchaseProduct(orderId);
  }

  renameProduct(productId: string, beforeP: Product, afterP: Product) {
    return this.productRepository.renameProduct(productId, beforeP,afterP);
  }


}
