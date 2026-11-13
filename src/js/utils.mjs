// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// getParam function
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product
}

//render with template
export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false){
  const htmlStrings = list.map(template); 
  if(clear){
      parentElement.innerHTML = "";
   }   
   parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// show the number of items in the cart on the backpack icon
export function updateCartCount() {
  const cart = getLocalStorage("so-cart") || [];
  const total = cart.reduce((sum, item) => sum + (item.Quantity || 1), 0);
  const cartLink = document.querySelector(".cart");
  if (!cartLink) return;

  let badge = cartLink.querySelector(".cart-count");
  if (!badge) {
    badge = document.createElement("span");
    badge.className = "cart-count";
    cartLink.append(badge);
  }

  badge.textContent = total;
  badge.hidden = total === 0;
}