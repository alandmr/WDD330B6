import { getLocalStorage, setLocalStorage, } from "./utils.mjs"

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init() {
            // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
        this.product = await this.dataSource.findProductById(this.productId);
        // the product details are needed before rendering the HTML
        this.renderProductDetails();
        // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
        // the product details are needed before rendering the HTML
        // once the HTML is rendered, add a listener to the Add to Cart button
        // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on 'this' to understand why.
        document.getElementById("addToCart")
          .addEventListener("click", this.addProductToCart.bind(this));
    }

    addProductToCart() {
        let cart = getLocalStorage("so-cart") || [];
        let isNewProduct = true;

        if (!Array.isArray(cart)) cart = cart ? [cart] : [];
        const existing = cart.find((item) => item.Id === this.product.Id);
        if (existing) {
            existing.Quantity = (existing.Quantity || 1) + 1;
            isNewProduct = false;
        } else {
            this.product.Quantity = 1;
            cart.push(this.product);
        }
        setLocalStorage("so-cart", cart);
        //Alert the user that the product has been addded to his/her cart.
        const message = isNewProduct
            ? "Product added to cart"
            : "One more has been added to your cart";
        alert(message);
    }
    
    renderProductDetails() {
        productDetailsTemplate(this.product);
    }
}

function productDetailsTemplate(product) {
    
    document.querySelector("h2").textContent = product.Brand.Name;
    document.querySelector("h3").textContent = product.NameWithoutBrand;

    const productImage = document.getElementById("productImage");
    productImage.src = product.Image;
    productImage.alt = product.NameWithoutBrand;



    document.getElementById("productPrice").textContent = product.FinalPrice;
    document.getElementById("productColor").textContent = product.Colors[0].ColorName;
    document.getElementById("productDesc").innerHTML = product.DescriptionHtmlSimple;

    document.getElementById("addToCart").dataset.id = product.Id;
}