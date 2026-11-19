import { getLocalStorage, setLocalStorage, renderListWithTemplate } from "./utils.mjs";

/** Template */
function cartItemTemplate(item, i) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color"><span class="label">Color:</span> ${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity"><span class="label">Quantity:</span> ${item.Quantity}</p>
  <p class="cart-card__price"><span class="label">Price:</span> $${item.FinalPrice}</p>
  <button data-index="${i}" class="remove-btn"><i class="fa-solid fa-trash"></i></button>
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
  }

  renderCart(clearCart=false) {
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
        return total;
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
          return;
        })
    }

}
