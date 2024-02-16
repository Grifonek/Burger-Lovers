import items from "./items.js";

// Array for ordered items
const cartItems = [];

// Elements
const containerItems = document.querySelector(".layers");
const orderBtn = document.querySelector(".order");
const closeModalBtn = document.querySelector(".btn--close-modal");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const containerItemsModal = document.querySelector(".modal__items");
const totalPriceModal = document.querySelector(".modal__price--class");

// Adding new items to the "Our products" section
const addNewItem = function () {
  for (let i = 0; i < items.length; i++) {
    let left = `
      <div class="item__layer">
          <img src="images/${items[i].name}.png" alt="burgerImg" class="img__left">
              <div class="desc__right">
                  <p>${items[i].description}</p>
              </div>
      </div>
      `;

    let right = `
        <div class="item__layer">
            <div class="desc__left">
              <p>${items[i].description}</p>
            </div>
          <img src="images/${items[i].name}.png" alt="burgerImg" class="img__right">
        </div>`;

    items[i].position === "left"
      ? containerItems.insertAdjacentHTML("afterend", left)
      : containerItems.insertAdjacentHTML("afterend", right);
  }
};
addNewItem();

// Adding new items to modal window "Create order"
const addNewItemModal = function () {
  for (let i = 0; i < items.length; i++) {
    let html = `
    <div class="modal__item" data-item-index="${i}">
        <h3 class="modal__item--name">${items[i].productName}</h3>
        <p class="modal__item--price">${items[i].price}$</p>
        <img src="images/${items[i].name}.png" alt="" class="modal__item--img">
        <p class="modal__item--amount">AMOUNT:</p>
        <div class="modal__amount">
            <div class="modal__amount--signs">
              <div><button class="btn__plus">+</button></div>
              <div><button class="btn__minus">-</button></div>
            </div>
            <div class="modal__amount--ks">${items[i].amount}ks</div>
        </div>
        <div class="modal__cart">
            <button class="modal__cart--text">ADD TO CART</button>
        </div>
    </div>
    `;

    containerItemsModal.insertAdjacentHTML("beforeend", html);
  }
};
addNewItemModal();

// Adding to cart after clicking "Add to cart" button
const addToCartBtn = document.querySelectorAll(".modal__cart--text");
const addToCart = function () {
  addToCartBtn.forEach((btn, index) => {
    btn.addEventListener("click", function () {
      const itemIndex = this.closest(".modal__item").dataset.itemIndex;
      const amountInput = document.querySelectorAll(".modal__amount--ks");
      const itemAmountElement = amountInput[index];
      const itemAmount = parseInt(itemAmountElement.textContent);
      const itemPrice = items[itemIndex].price;

      // Checking if the item amount is greater than zero
      if (itemAmount > 0) {
        const subtotal = itemAmount * itemPrice;

        // Checking items in array
        const cartItemIndex = cartItems.findIndex(
          (item) => item.productName === items[itemIndex].productName
        );

        if (cartItemIndex !== -1) {
          // Updating existing elements
          UpdateCart(cartItemIndex, itemAmount, subtotal);
        } else {
          // Pushing new items to the cartItem array
          const newItem = {
            productName: items[itemIndex].productName,
            name: items[itemIndex].name,
            amount: itemAmount,
            price: itemPrice,
            subtotal: subtotal,
          };
          cartItems.push(newItem);

          // Adding new ordered items to the "Your cart" section
          goToCartAndPayment(newItem);
        }

        // Updating total price
        totalPriceCart.textContent = "";
        let price = 0;
        for (let i = 0; i < cartItems.length; i++) {
          price += cartItems[i].subtotal;
        }
        totalPriceCart.insertAdjacentHTML("afterbegin", price + "$");

        console.log(cartItems);

        // Resetting amount to 0
        items[itemIndex].amount = 0;
        itemAmountElement.textContent = "0ks";

        // Updating total prize
        totalPrice(subtotal);
      }
    });
  });
};
addToCart();

// Adding new ordered items to the "Your cart" section
const totalPriceCart = document.querySelector(".total__price--cart");
const cartWindow = document.querySelector(".cart__items");
const goToCartAndPayment = function (item) {
  cartWindow.textContent = "";
  let html = `
    <div class="cart__item">
      <h3 class="cart__item--name">${item.productName}</h3>
      <img src="images/${item.name}.png" alt="" class="cart__item--img">
      <h4 class="cart__item--quantity">${item.amount}</h4>
      <h4 class="cart__item--price">${item.subtotal}$</h4>
      <button class="cart__delete">&times;</button>
    </div>
    `;

  cartWindow.insertAdjacentHTML("afterend", html);
};

// Updating same elements in the cart
const UpdateCart = function (cartItemIndex, itemAmount, subtotal) {
  // Updating displayed item in the cart window
  const cartItemElement =
    document.querySelectorAll(".cart__item")[cartItemIndex];

  cartItemElement.querySelector(".cart__item--quantity").textContent =
    cartItems[cartItemIndex].amount += itemAmount;
  cartItemElement.querySelector(".cart__item--price").textContent = cartItems[
    cartItemIndex
  ].subtotal += subtotal;
};

// Counting total price
const totalPrice = function (subtotal) {
  // Calculating total sum of all items in the cart
  const sum = cartItems.reduce((total, item) => total + item.subtotal, 0);

  // Clearing existing content
  totalPriceModal.innerHTML = "";

  // Updating with new total price
  const html = `<h3 class="modal__price">TOTAL PRICE = ${sum}$</h3>`;
  totalPriceModal.insertAdjacentHTML("afterbegin", html);
};

// Increasing/decreasing of amount after clicking +/- button
const amountChange = function () {
  const btnPlus = document.querySelectorAll(".btn__plus");
  const btnMinus = document.querySelectorAll(".btn__minus");

  if (btnMinus !== "null" && btnPlus !== "null") {
    // For button minus
    btnMinus.forEach((btnMinus) => {
      btnMinus.addEventListener("click", function () {
        const itemIndex = this.closest(".modal__item").dataset.itemIndex;
        const itemAmountElement =
          this.closest(".modal__item").querySelector(".modal__amount--ks");

        // Decrease the item amount and update the display
        items[itemIndex].amount = Math.max(0, items[itemIndex].amount - 1);
        itemAmountElement.textContent = `${items[itemIndex].amount}ks`;

        // Updating price
        totalPrice();
      });
    });

    // For button plus
    btnPlus.forEach((btnPlus) => {
      btnPlus.addEventListener("click", function () {
        const itemIndex = this.closest(".modal__item").dataset.itemIndex;
        const itemAmountElement =
          this.closest(".modal__item").querySelector(".modal__amount--ks");

        // Increase the item amount and update the display
        items[itemIndex].amount += 1;
        itemAmountElement.textContent = `${items[itemIndex].amount}ks`;
      });
    });
  }
};
amountChange();

// Showing modal window when clicking "Create order" button
const showModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
  totalPrice();
};

// Closing module window
const closeModal = function (e) {
  e.preventDefault();
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// Scrolling to products after clicking "Our products"
document
  .querySelector(".btn--scroll-to")
  .addEventListener("click", function (e) {
    e.preventDefault();

    if (e.target.classList.contains("nav__link")) {
      const id = e.target.getAttribute("href");
      document.querySelector(id).scrollIntoView({ behavior: "smooth" });
    }
  });

// Selecting payment method in "Your cart"
const selectedPaymentMethod = document.querySelector(
  ".selected__payment--cart"
);
const paymentMethods = document.querySelectorAll(".payment__img");
const paymentMethodSelect = function (event) {
  event.preventDefault();

  paymentMethods.forEach((method) => {
    method.classList.remove("selected");
  });

  event.target.classList.add("selected");

  selectedPaymentMethod.textContent = "";
  if (
    event.target.classList.contains("selected") &&
    event.target.classList.contains("card")
  ) {
    selectedPaymentMethod.insertAdjacentHTML("afterbegin", "CREDIT CARD");
  } else if (
    event.target.classList.contains("selected") &&
    event.target.classList.contains("cash")
  ) {
    selectedPaymentMethod.insertAdjacentHTML("afterbegin", "CASH");
  } else {
    selectedPaymentMethod.insertAdjacentHTML("afterbegin", "APPLE PAY");
  }
};

document.querySelectorAll(".payment__method").forEach((item) => {
  item.addEventListener("click", paymentMethodSelect);
});

// Clearing forms after clicking "Submit your order and proceed to pay"
const clearFormInputs = function () {
  const formInputs = document.querySelectorAll(
    '.column__1 input[type="text"], .column__1 textarea, input[type="text"]'
  );
  formInputs.forEach((input) => {
    input.value = "";
  });
  paymentMethods.forEach((method) => {
    method.classList.remove("selected");
  });

  selectedPaymentMethod.textContent = "";
  totalPriceCart.textContent = "";
  cartWindow.textContent = "";
};

// Error function
const errorFunc = function (input) {
  // let allFilled = false;
  const errorElement = input.parentNode.nextElementSibling;
  if (!errorElement) {
    // Create a new error message element
    const newErrorElement = document.createElement("div");
    newErrorElement.classList.add("error-message");
    newErrorElement.textContent = "This field is required";
    // Insert the error message after the input field
    input.parentNode.insertAdjacentElement("afterend", newErrorElement);
  }
};

// Finish button
const finishBtn = document.querySelector(".finish__btn--btn");
finishBtn.addEventListener("click", function () {
  // Removing all existing error messages
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((errorMessage) => errorMessage.remove());

  // Checking if all form inputs are filled
  const formInputs = document.querySelectorAll(
    '.person__form input[type="text"]'
  );
  let allFilled = true;

  formInputs.forEach((input) => {
    if (input.value.trim() === "") {
      allFilled = false;
      errorFunc(input);
    }
  });

  if (allFilled) {
    clearFormInputs();

    if (cartItems.length !== 0) {
      changeText(finishBtn, "YOUR ORDER LANDED IN OUR KITCHEN, THANK YOU!");
    }

    // Clearing all items in the cart
    cartItems.length = 0;

    // Removing each cart item from the DOM
    const cartItemsElements = document.querySelectorAll(".cart__item");
    cartItemsElements.forEach((item) => item.remove());
  }
});

// Going to cart after clicking "Go to cart and payment" button
const cartModal = document.querySelector(".cart__container");
const goToCartAndPaymentBtn = document.querySelector(".modal__cart-payment");
const header = document.querySelector(".header");
const layerss = document.querySelector(".layerss");
const footer = document.querySelector(".footer");
goToCartAndPaymentBtn.addEventListener("click", function () {
  cartModal.classList.remove("hidden-cart");
  header.classList.add("hidden");
  layerss.classList.add("hidden");
  footer.classList.add("hidden");
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
  deleteCartItem();
  updateTotalPriceCart();
});

// Updating total price in cart
const updateTotalPriceCart = function () {
  let totalPrice = 0;

  for (let i = 0; i < cartItems.length; i++) {
    totalPrice += cartItems[i].subtotal;
  }
  totalPriceCart.textContent = totalPrice + "$";
};

// Going back to order after clicking arrow in cart
const backBtn = document.querySelector(".back__btn--btn");
backBtn.addEventListener("click", function () {
  // Storing ordered items in local storage
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  window.location.href = "index.html";
});

// Getting ordered items from local storage
const getStorage = function () {
  const storage = localStorage.getItem("cartItems");
  console.log(`storage is: ${storage}`);

  if (storage) {
    // Clearing existing contents of cartItems
    cartItems.length = 0;
    // Parsing stored items and pushing them into cartItems array
    JSON.parse(storage).forEach((item) => cartItems.push(item));
  }

  // Displaying cart items in the UI
  cartItems.forEach((item) => goToCartAndPayment(item));

  updateTotalPriceCart();
};
getStorage();

// Updating local storage
const updateLocalStorage = function () {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
};

// Deleting items from cart
const deleteCartItem = function () {
  const deleteButtons = document.querySelectorAll(".cart__delete");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Finding parent cart item of the clicked delete button
      const cartItem = this.closest(".cart__item");

      // Getting the index of the cart item in the cartItems array
      const index = cartItems.findIndex(
        (item) =>
          item.productName ===
          cartItem.querySelector(".cart__item--name").textContent
      );
      // Removing the cart item from the DOM
      cartItem.remove();
      // Removing the item from the cartItems array
      cartItems.splice(index, 1);

      console.log(cartItems);

      updateLocalStorage();

      updateTotalPriceCart();
    });
  });
};

// Changing text function
const messageText = document.querySelector(".btn__large");
const changeText = function (item, mess) {
  item.textContent = "";
  let html = mess;
  item.insertAdjacentHTML("afterbegin", html);
};

// Contact form
const column1 = document.querySelectorAll(".column__1");
const contactForm = document.querySelector(".input-container");
messageText.addEventListener("click", function () {
  // Removing all existing error messages
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((errorMessage) => errorMessage.remove());

  // Checking if all form inputs are filled
  const formInputs = contactForm.querySelectorAll(
    '.column__1 input[type="text"], .column__1 textarea'
  );
  let allFilled = true;

  formInputs.forEach((input) => {
    if (input.value.trim() === "") {
      allFilled = false;
      errorFunc(input);
    }
  });

  if (allFilled) {
    clearFormInputs(column1);
    changeText(messageText, "MESSAGE SENT");
  }
});

orderBtn.addEventListener("click", showModal);
closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);
