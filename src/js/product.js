import { setLocalStorage, getLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {

let products = getLocalStorage("so-cart") || [];""
let isNewProduct = true;

  product.Quantity = 1;
  
  //Using a Hasmap to set each product by its id
  //This helps to search a product in the car and avoid duplicates
try {

  const cartMap = new Map();

  products.forEach(item => {
    cartMap.set(item.Id, item);
  });
  
  //If the product already exists
  //update the quantity
  if (cartMap.has(product.Id)) {
    const existingProduct = cartMap.get(product.Id);

    existingProduct.Quantity += 1;

    cartMap.set(product.Id, existingProduct);
    isNewProduct = false;

  } else {
    // If not exits, added to it
    cartMap.set(product.Id, product);
  }

  //converting HasMap to array so that it can be used in localStorage
  products = [...cartMap.values()];
  setLocalStorage("so-cart", products);

  }catch (error) {
    console.error("Error:", error);
  }

  //Alert the user that the product has been addded to his/her cart.
  const message = isNewProduct
      ? "Product added to cart"
      : "One more has been added to your cart";
  alert(message);
  return;
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
