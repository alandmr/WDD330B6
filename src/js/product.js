import { getParam, loadHeaderFooter, renderCartItemsCount } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  //loads header and footer elements dinamically
  await loadHeaderFooter();
  //renders the number of items in the cart
  renderCartItemsCount();
});

const dataSource = new ProductData();
const productID = getParam("product");

const product = new ProductDetails(productID, dataSource);
product.init();
