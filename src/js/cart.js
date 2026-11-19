import { loadHeaderFooter } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

//load header and footer dinamically
loadHeaderFooter();

//Loads shopping cart and its functionality
const sCart = new ShoppingCart();
sCart.init();
