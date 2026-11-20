import { getDiscountPercent, renderListWithTemplate } from "./utils.mjs";

function discountBadge(product) {
  const percent = getDiscountPercent(product);
  if(!percent) return "";
  return `<span class="discount-badge">${percent}% off</span>`;
}

function productCartTemplate(product) {
  return `<li class="product-card">
            ${discountBadge(product)}
            <a href="product_pages/?product=${product.Id}">
              <img
                src="${product.Image}"
                alt="Image of ${product.NameWithoutBrand}"
              />
              <h3 class="card__brand">${product.Brand.Name}</h3>
              <h2 class="card__name">${product.NameWithoutBrand}</h2>
              <p class="product-card__price">$${product.FinalPrice}</p>
            </a>
            <button class="quick-view-btn" data-id="${product.Id}">Quick view</button>
          </li>`;
}

function quickViewTemplate(product) {
  return `<button class="quick-view__close" aria-label="Close quick view">&times;</button>
    <img src="${product.Image}" alt="Image of ${product.NameWithoutBrand}" />
    <h3 class="card__brand">${product.Brand.Name}</h3>
    <h2 class="card__name">${product.NameWithoutBrand}</h2>
    <p class="quick-view__color">${product.Colors[0].ColorName}</p>
    <p class="product-card__price">$${product.FinalPrice}</p>
    <div class="quick-view__description">${product.DescriptionHtmlSimple}</div>
    <a class="quick-view__details" href="product_pages/?product=${product.Id}">See full details</a>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = [];
  }

  async init() {
    const list = await this.dataSource.getData();
    this.renderList(list);
    this.initQuickView();
  }

  renderList(list) {
    this.products = list.filter(
      (product) => !["989CG", "880RT"].includes(product.Id),
    );
    renderListWithTemplate(
      productCartTemplate,
      this.listElement,
      this.products,
    );
  }

  initQuickView() {
    // One <dialog> is shared by every product card
    this.dialog = document.createElement("dialog");
    this.dialog.classList.add("quick-view");
    document.body.appendChild(this.dialog);

    // Event delegation: a single listener on the list handles every button
    this.listElement.addEventListener("click", (event) => {
      const button = event.target.closest(".quick-view-btn");
      if (button) this.showQuickView(button.dataset.id);
    });

    // Close with the × button or by clicking the dark backdrop
    this.dialog.addEventListener("click", (event) => {
      if (
        event.target === this.dialog ||
        event.target.closest(".quick-view__close")
      ) {
        this.dialog.close();
      }
    });
  }

  showQuickView(productId) {
    const product = this.products.find((item) => item.Id === productId);
    if (!product) return;
    this.dialog.innerHTML = quickViewTemplate(product);
    this.dialog.showModal();
  }
}
