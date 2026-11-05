import { setLocalStorage, getLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  let products = getLocalStorage("so-cart");
  product.Quantity = 1;
  //Using a Hasmap to set each product by its id
  //This helps to search a product in the car and avoid duplicates
  const cartMap = products
    ? new Map(products)
    : new Map().set(product.Id, product);

  //If the product already exists
  //update the quantity
  if (cartMap.has(product.Id) && products) {
    const { Quantity } = cartMap.get(product.Id);
    product.Quantity += Quantity;
    cartMap.set(product.Id, product);
  }

  //converting HasMap to array so that it can be used in localStorage
  products = Array.from(cartMap);
  setLocalStorage("so-cart", products);

  //Alert the user that the product has been addded to his/her cart.
  const message =
    product.Quantity === 1
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
