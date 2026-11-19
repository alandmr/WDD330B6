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