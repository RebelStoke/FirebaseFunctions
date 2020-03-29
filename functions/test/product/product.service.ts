import {ProductRepository} from "../../src/products/product.repository";
import {ProductService} from '../../src/products/product.service';
import {IMock, Mock} from "moq.ts";
import {Product} from '../../src/models/product';
import {Stock} from '../../src/models/stock';

describe('ProductService', () => {
  let productRepository: IMock<ProductRepository>;
  let productService: ProductService;

  let stock: Stock = {productID:"1", productAmount:8}
  let product: Product = {name:"RandomItem", id: "1", price: 7};

  beforeEach(() => {
    productRepository = new Mock<ProductRepository>()
      .setup(pr => pr.addProductToStock("RandomItem",stock))
      .returns(new Promise((resolve, reject) => {resolve()}));
    productService = new ProductService(productRepository.object());
  });

  it('Create stock should be named same as product ', async () => {
    const stock1: Stock = productService.createStock(product);
    expect(stock1.productID).toBe(product.name)
  });

  it('When creating stock. The default stock should be 5', async () => {
    const stock2: Stock = productService.createStock(product);
    expect(stock2.productAmount).toBe(8)
  });

});
