import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { getParam, loadHeaderFooter, renderCartItemsCount, Breadcrumb, capitalizeFirstLetter } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  //loads header and footer elements dinamically
  await loadHeaderFooter();
  //renders the number of items in the cart
  renderCartItemsCount();
});

const category = getParam("category");
const categoryTitle = document.getElementById("category");
categoryTitle.textContent = category;


const dataSource = new ProductData(category);
const products = await dataSource.getData(category);
const element = document.querySelector(".product-list");
const productList = new ProductList(category, dataSource, element);

Breadcrumb([
  {
    label: `${capitalizeFirstLetter(category)} → (${products.length} items)`
  }
]);

productList.init();
