import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { getParam, loadHeaderFooter } from "./utils.mjs";

//loads header and footer elements dinamically
loadHeaderFooter();

const category = getParam("category");
const categoryTitle = document.getElementById("category");
categoryTitle.textContent = category;

const dataSource = new ProductData(category);
const element = document.querySelector(".product-list");
const productList = new ProductList(category, dataSource, element);
productList.init();
