import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { DependencyFactory } from './dependency-factory';

const dependencyFactory = new DependencyFactory();

admin.initializeApp({
  projectId: "functions-project-7209f",
  databaseURL: "https://functions-project-7209f.firebaseio.com"
});
//Using tdd and functions (write-trigger) whenever a new product is added to products collection it will be created in stock with a count of 5.
exports.addProduct = functions.firestore
  .document('products/{productId}')
  .onCreate((snap, context) => {
    return dependencyFactory.getProductController().addProductToStock(snap, context);
  });
//When you buy a Product add it in an Order Collection and count down Stock (you can just fake it by making a new order, with multiple orderliness)
exports.purchaseProduct = functions.firestore
  .document('Orders/{orderId}')
  .onCreate((snap, context) => {
    return dependencyFactory.getProductController().purchaseProduct(snap, context);
  });
//Rename one Product will update the Product in all other Documents
exports.renameProduct = functions.firestore
  .document('products/{productId}')
  .onUpdate((snap,context) =>{
    return dependencyFactory.getProductController().renameProduct(snap,context);
  });
