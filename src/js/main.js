import { loadHeaderFooter, renderCartItemsCount } from "./utils.mjs";

//loads header and footer elements dinamically
document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter();
  renderCartItemsCount();
});
