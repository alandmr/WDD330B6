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

/** Renders a component using a template*/
export function renderWithTemplate(template, parentElement, data, callback){
  parentElement.innerHTML = template;
  if(callback){
      callback(data);
  }
}

/** Loads a template from a url 
 * @returns {string | null} `string`, and returns `null` when there is an error or status != 200
*/
export async function loadTemplate(path){
    try {
      const res = await fetch(path);
      
      if(!res.ok){
          return null;
      }
      const template = await res.text();
      return template;
      
    } catch (error) {
        return null;
    }
}

/** Loads header and footer elements dinamically */
export async function loadHeaderFooter(){
    const headerTemplate = await loadTemplate("../partials/header.html");
    const footerTemplate = await loadTemplate("../partials/footer.html");

    if(headerTemplate !== null){
      const headerElement = document.getElementById("header");
      renderWithTemplate(headerTemplate, headerElement);
    }

    if(footerTemplate !== null){
      const footerElement = document.getElementById("footer");
      renderWithTemplate(footerTemplate, footerElement);
    }
}

/** Helps to calculate the discount of a product
 * @returns { null | number} `number` discount percent and `null` when there is not a discount.
 */
export function getDiscountPercent(product){
   const retail = product.SuggestedRetailPrice;
   const final = product.FinalPrice;
   if (!retail || final >= retail) return null;
   const percent = Math.round(((retail - final) / retail) * 100);
   return percent; 
}

// Add a function to render the cart items count in the backpack
export function renderCartItemsCount() {
  const storedCart = getLocalStorage("so-cart") || [];
  const cartItems = Array.isArray(storedCart) ? storedCart : [storedCart];
  const totalCount = cartItems.reduce(
    (sum, item) => sum + (item?.Quantity || 1),
    0,
  );

  const cartClassElement = document.querySelector("#cart-cant-items");

  if (!cartClassElement) return;

  if (totalCount > 0) {
    if (cartClassElement.classList.contains("none")) {
        cartClassElement.classList.replace("none", "cart-cant-items");
      }
    cartClassElement.textContent = totalCount;
  } else {
      cartClassElement.classList.replace("cart-cant-items", "none");
      cartClassElement.textContent = "";
    }
}

export function alertMessage(message, scroll = true) {
  // create element to hold the alert
  const alert = document.createElement("div");
  // add a class to style the alert
  alert.classList.add("alert-item");
  // set the contents. You should have a message and an X or something the user can click on to remove
  const text = document.createElement("span");
  text.textContent = message;
  const close = document.createElement("button");
  close.classList.add("close-alert");
  close.type = "button";
  close.textContent = "X";
  alert.append(text, close);

  // add a listener to the alert to see if they clicked on the X
  // if they did then remove the child
  alert.addEventListener("click", function(e) {
      if (e.target === close) { // only remove the alert when the close button is clicked
        main.removeChild(this);
      }
  })
  // add the alert to the top of main
  const main = document.querySelector("main");
  main.prepend(alert);
  // make sure they see the alert by scrolling to the top of the window
  // you may not always want to do this...so default to scroll=true, but allow it to be passed in and overridden.
  if(scroll)
    window.scrollTo(0,0);
}