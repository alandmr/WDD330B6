import { loadHeaderFooter, renderCartItemsCount } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

loadHeaderFooter();

document.addEventListener("DOMContentLoaded", async () => {
  //load header and footer dinamically
  await loadHeaderFooter();
  renderCartItemsCount();
  //Loads shopping cart and its functionality
  const sCart = new ShoppingCart();
  sCart.init();
});
