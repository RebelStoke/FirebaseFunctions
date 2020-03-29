import {Change, EventContext} from 'firebase-functions';
import { DocumentSnapshot } from "firebase-functions/lib/providers/firestore";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { Product } from "../models/product";

export class ProductControllerFirebase implements ProductController {
  constructor(private productService: ProductService) {}

  purchaseProduct(snap: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>, context: EventContext): Promise<void> {
    return this.productService.purchaseProduct(context.params.orderId);
  }

  addProductToStock(snap: DocumentSnapshot, context: EventContext): Promise<void> {
    return this.productService.addProductToStock(context.params.productId, snap.data() as Product);
  }

  renameProduct(snap: Change<DocumentSnapshot>, context: EventContext): Promise<void> {
    return this.productService.renameProduct(context.params.productId, snap.before.data() as Product, snap.after.data() as Product);
  }



}
