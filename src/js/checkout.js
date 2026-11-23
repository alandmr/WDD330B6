import CheckoutProcess from "./CheckoutProcess.mjs";
import { loadHeaderFooter, renderCartItemsCount, alertMessage } from "./utils.mjs";

function isNotEmpty(value) {
  return value.trim() !== "";
}

function isValidZip(zip) {
  return /^\d{5}$/.test(zip);
}

function isValidCardNumber(cardNumber) {
  const cleanNumber = cardNumber.replace(/\s/g, "");

  // Debe tener 16 dígitos
  if (!/^\d{16}$/.test(cleanNumber)) {
    return false;
  }

  // El servicio de prueba solo acepta esta tarjeta
  if (cleanNumber !== "1234123412341234") {
    return false;
  }

  return true;
}

function isValidExpiration(expiration) {
  // Validar formato MM/YY
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiration)) {
    return false;
  }

  const [month, year] = expiration.split("/");

  const expMonth = parseInt(month, 10);
  const expYear = 2000 + parseInt(year, 10);

  const today = new Date();
  const currentMonth = today.getMonth() + 1; // Enero = 0
  const currentYear = today.getFullYear();

  // Año vencido
  if (expYear < currentYear) {
    return false;
  }

  // Mismo año pero mes vencido
  if (expYear === currentYear && expMonth < currentMonth) {
    return false;
  }

  return true;
}

function isValidSecurityCode(code) {
  return /^\d{3,4}$/.test(code);
}

const order = new CheckoutProcess("so-cart", ".order-summary");
order.init();

document.addEventListener("DOMContentLoaded", async () => {
  order.calculateOrderTotal();
  await loadHeaderFooter();
  renderCartItemsCount();
});

// Add event listeners to fire calculateOrderTotal when the user changes the zip code
document
  .querySelector("#zip")
  .addEventListener("blur", order.calculateOrderTotal.bind(order));

// listening for click on the button
document.querySelector("#checkout-btn").addEventListener("click", (e) => {
  e.preventDefault();

  const errors = [];

    if (!isNotEmpty(document.querySelector("#fname").value)) {
        errors.push("First Name is required");
    }

    if (!isNotEmpty(document.querySelector("#lname").value)) {
        errors.push("Last Name is required");
    }

    if (!isNotEmpty(document.querySelector("#street").value)) {
        errors.push("Street Address is required");
    }

    if (!isNotEmpty(document.querySelector("#city").value)) {
        errors.push("City is required");
    }

    if (!isNotEmpty(document.querySelector("#state").value)) {
        errors.push("State is required");
    }

    if (!isValidZip(document.querySelector("#zip").value)) {
        errors.push("ZIP Code must contain 5 digits");
    }

    if (!isValidCardNumber(document.querySelector("#cardNumber").value)) {
        errors.push("The length of the card number must be 16 digits and for this demo, the card number must be 1234123412341234");
    }

    if (!isValidExpiration(document.querySelector("#expiration").value)) {
        errors.push("Expiration date must be MM/YY and cannot be in the past");
    }

    if (!isValidSecurityCode(document.querySelector("#code").value)) {
        errors.push("Invalid Security Code");
    }

    if (errors.length > 0) {
        errors.forEach((error) => alertMessage(error, false));

    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });

    return;
    }

  order.checkout();
});
