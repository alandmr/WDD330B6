import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");

  // If there are no items in the cart, display a message
  // Empty cart Error: Cart.html
  if (cartItems === null || cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML =
      "<p>Your cart is empty.</p>";
    return;
  } else {
    const htmlItems = cartItems.map((item, i) => cartItemTemplate(item, i));
    document.querySelector(".product-list").innerHTML = htmlItems.join("");

    //display total in cart
    showTotal();
  }
}

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

// Receive the parameter 'index' from the data-index attribute of the button
function removeItemFromCart(index) {
  const cart = getLocalStorage("so-cart");
  const updatedCart = cart.filter((_, i) => i !== parseInt(index)); // It only keeps in the array the Index NOT clicked.
  setLocalStorage("so-cart", updatedCart);
  renderCartContents();
}

/** Calculates the total in cart
 *  @returns {number} `total` or `0` when cart is empty
 */
function calculateTotal() {
  const cartItems = getLocalStorage("so-cart");

  //Empty cart
  if (!cartItems || cartItems.length === 0) {
    return 0;
  }

  let total = 0;
  cartItems.forEach((item) => (total += item.FinalPrice * item.Quantity));
  return total;
}

/** Displays the total in cart and displays it to the user */
function showTotal() {
  const cartFooter = document.querySelector(".cart-footer");
  const total = calculateTotal();

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

renderCartContents();

// This piece of code adds an event listener to the product list, and when a click event occurs, it checks if the clicked element
// has the class 'remove-btn'. If it does, it calls the removeItemFromCart function with the index of the item to be removed, which is stored in the data-index attribute of the button.
document.querySelector(".product-list").addEventListener("click", (e) => {
  const btn = e.target.closest(".remove-btn");

  if (!btn) return;

  const index = btn.dataset.index;

  removeItemFromCart(index);

  //update total in cart
  showTotal();
});
