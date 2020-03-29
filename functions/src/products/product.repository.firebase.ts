import * as admin from 'firebase-admin';
import { ProductRepository } from "./product.repository";
import { Stock } from '../models/stock';
import {Product} from '../models/product';
import {Order} from '../models/order';


export class ProductRepositoryFirebase implements ProductRepository {

  addProductToStock(productId: string, stock: Stock): Promise<any> {
    return admin.firestore().doc(`Stock/${productId}`).set(stock).catch();
  }

  renameProduct(productId: string, beforePr: Product, afterPr: Product): Promise<any>  {
    this.checkStockForRenameInStock(productId, afterPr);
    return this.checkStockForRenameInOrders(productId, beforePr, afterPr);
  }

 private checkStockForRenameInStock(productId: string, afterP: Product)  {
    admin.firestore().doc(`Stock/${productId}`).get().then(function(doc) {
      const stock = doc.data() as Stock;
      stock.productID = afterP.id;

      admin.firestore()
       .doc(`Stock/${productId}`)
       .update(stock).catch()
       .catch(error => {
         console.log(error);
       });
   }).catch(error =>{
     console.log(error);
   });
   };


  private checkStockForRenameInOrders(productId: string, beforeP: Product, afterP: Product) :Promise<any>  {
    //Gets the OrdersList where the productName equals that of the updated product
    return admin.firestore().collectionGroup('OrdersList').where('productBID', '==', productId).get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        const order = doc.data() as Order;
        const orderId: string = doc.ref.parent.parent!.id;

        //Sets product's productName to the after product name
        order.productName = afterP.name;
        admin.firestore().collectionGroup('OrdersList');
        admin.firestore().collection('Orders').doc(orderId).collection('Orderlist').doc(doc.id).update(order).catch();
      });
    })
      .catch(error => {
        console.log(error);
      });
  };

  purchaseProduct(orderId: any): Promise<any> {
   const o = this.createFakeOrder();
    //Buys a product
    admin.firestore().doc(`Orders/${orderId}`)
      .collection(`OrdersList`)
      .doc(o.productId).set({o})
      .catch(error => {
      console.log(error);
    });

    return admin.firestore().collection(`Stock`).doc(o.productId).get().then(function(doc) {
      const stock = doc.data() as Stock;
      stock.productAmount--;

      admin.firestore().collection(`Stock`).doc(o.productId).update(stock)
        .catch(error => {
          console.log(error);
        });
    });
  }
  createFakeOrder(): Order {
    return{
      productId: "N4WCCDSFGSDGkSFG5Y",
      productName: "CKGFAASDFGSSFDKFSFS",
      productAmount: 2
    };
  }
}
