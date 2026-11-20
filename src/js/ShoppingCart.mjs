import { getLocalStorage, setLocalStorage, renderListWithTemplate, renderCartItemsCount } from "./utils.mjs";

/** Template */
function cartItemTemplate(item, i) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images.PrimaryMedium}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color"><span class="label">Color:</span> ${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity"><span class="label">Quantity:</span> ${item.Quantity}</p>
  <p class="cart-card__price"><span class="label">Price:</span> $${item.FinalPrice}</p>
  <div class="action-buttons">
  <button data-index="${i}" class="edit-btn" data-id="${item.Id}">
    <i class="fa-solid fa-pen-to-square"></i>
  </button>

  <button data-index="${i}" class="remove-btn">
    <i class="fa-solid fa-trash"></i>
  </button>
</div>
</li>`;

  return newItem;
}

export default class ShoppingCart {
  constructor() {
    this.cartItems = getLocalStorage("so-cart");
  }

  async init() {
    this.renderCart();
    this.setupRemoveEvent();  
    this.setupEditEvent();

  }

  renderCart(clearCart = false) {
        const productList = document.querySelector(".product-list");
        
        // If there are no items in the cart, display a message
        if(this.cartItems === null || this.cartItems.length === 0){
            productList.innerHTML = `<p>Your cart is empty.</p>`
            return;
        }

        //otherwise render content
        //and display total in cart
        renderListWithTemplate(cartItemTemplate, productList, [...this.cartItems], "afterbegin", clearCart);
        this.showTotal();
    }

    /** Calculates the total in cart
    *  @returns {number} `total` or `0` when cart is empty
    */
    calculateTotal(){
        //Empty cart
        if (this.cartItems === null || this.cartItems.length === 0) {
            return 0;
        }

        let total = 0;
        this.cartItems.forEach((item) => (total += item.FinalPrice * item.Quantity));
        return parseFloat(total).toFixed(2);
    }

    /** Displays the total in cart and displays it to the user
     * @returns {void}
     */
    showTotal(){
        const cartFooter = document.querySelector(".cart-footer");
        const total = this.calculateTotal();

        //hide cart-footer if cart is empty
        if (total === 0 && !cartFooter.classList.contains("hide")) {
            cartFooter.classList.add("hide");
            return;
        }

        //otherwise
        cartFooter.classList.remove("hide");
        const totalElement = document.getElementById("cart-total");
        totalElement.textContent = total;
    }

    /** Receive the parameter 'index' from the data-index attribute of the button */
    removeItemFromCart(index){
        const updatedCart = this.cartItems.filter((_, i) => i !== parseInt(index)); // It only keeps in the array the Index NOT clicked.
        setLocalStorage("so-cart", updatedCart);
        //update cart
        this.cartItems = updatedCart;
        this.renderCart(true);
    }

    /** This piece of code adds an event listener to the product list, and when a click event occurs, it checks if the clicked element
    * has the class 'remove-btn'. If it does, it calls the removeItemFromCart function with the index of the item to be removed, which is stored in the data-index attribute of the button.*/
    setupRemoveEvent(){
      const showTotal = this.showTotal.bind(this);
      const removeItemFromCart = this.removeItemFromCart.bind(this);

      document.addEventListener("click", (e) => {
          const btn = e.target.closest(".remove-btn");
          if (!btn) return;

          const index = btn.dataset.index;
          removeItemFromCart(index);

          //update total in cart;
          showTotal();
          renderCartItemsCount();
          return;
        })
    }

  editItem(productId) {
    let cart = getLocalStorage("so-cart") || [];

    const product = cart.find((item) => item.Id === productId);

    if (!product) return;

    const newQuantity = prompt(
      `Enter the new quantity for product ${product.Name}:`,
      product.Quantity
    );

    if (newQuantity === null) return;

    const quantity = parseInt(newQuantity);

    if (isNaN(quantity) || quantity < 1) {
      alert("Please enter a valid quantity.");
      return;
    }

    // Actualizar cantidad
    product.Quantity = quantity;

    // Guardar en localStorage
    setLocalStorage("so-cart", cart);

    // Actualizar propiedad de la clase
    this.cartItems = cart;

    // Limpiar lista actual
    const productList = document.querySelector(".product-list");
    productList.innerHTML = "";

    // Volver a renderizar
    this.renderCart();

    // Actualizar total
    this.showTotal();

    // Actualizar contador del ícono del carrito
    renderCartItemsCount();
  }


  setupEditEvent() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".edit-btn");

      if (!btn) return;

      this.editItem(btn.dataset.id);
    });
  }
}


