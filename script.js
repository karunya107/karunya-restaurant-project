

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        navLinks.classList.toggle("active");

        const icon = menuToggle.querySelector("i");

        if (icon) {
            icon.classList.toggle("fa-bars");
            icon.classList.toggle("fa-xmark");
        }

    });

    // Close menu when a link is clicked

    navLinks.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("active");

            const icon = menuToggle.querySelector("i");

            if (icon) {
                icon.classList.add("fa-bars");
                icon.classList.remove("fa-xmark");
            }

        });

    });

    // Close menu when clicking outside

    document.addEventListener("click", event => {

        if (
            !navLinks.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {

            navLinks.classList.remove("active");

            const icon = menuToggle.querySelector("i");

            if (icon) {
                icon.classList.add("fa-bars");
                icon.classList.remove("fa-xmark");
            }

        }

    });

}




const filterButtons = document.querySelectorAll(".filter-btn");
const menuCards = document.querySelectorAll(".menu-card");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        // Remove active class

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const selectedCategory = button.dataset.filter;

        menuCards.forEach(card => {

            const cardCategory = card.dataset.category;

            if (
                selectedCategory === "all" ||
                selectedCategory === cardCategory
            ) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        });

    });

});


const cartItemsContainer = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");

const cartSubtotal = document.getElementById("cart-subtotal");
const deliveryFeeElement = document.getElementById("delivery-fee");
const cartTotal = document.getElementById("cart-total");

const checkoutButton = document.getElementById("checkout-btn");


// Load cart from local storage

let cart = [];

try {

    const savedCart = JSON.parse(
        localStorage.getItem("karunyaCart")
    );

    if (
        Array.isArray(savedCart) &&
        savedCart.every(item =>
            item &&
            typeof item.id === "string" &&
            typeof item.name === "string" &&
            Number.isFinite(item.price) &&
            item.price >= 0 &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0
        )
    ) {

        cart = savedCart;

    }

} catch (error) {

    console.warn("Could not load saved cart.");

    cart = [];

}


// Save cart

function saveCart() {

    localStorage.setItem(
        "karunyaCart",
        JSON.stringify(cart)
    );

}


// Format Indian currency

function formatPrice(amount) {

    return "₹" + amount.toLocaleString("en-IN");

}


const addToCartButtons = document.querySelectorAll(".add-to-cart");

addToCartButtons.forEach(button => {

    button.addEventListener("click", () => {

        const id = button.dataset.id;
        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        if (
            !id ||
            !name ||
            !Number.isFinite(price) ||
            price < 0
        ) {
            alert("Invalid food item.");
            return;
        }

        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {

            existingItem.quantity++;

        } else {

            cart.push({

                id: id,
                name: name,
                price: price,
                quantity: 1

            });

        }

        saveCart();

        updateCart();

        // Button feedback

        const originalText = button.innerHTML;

        button.innerHTML =
            '<i class="fa-solid fa-check"></i> Added';

        button.disabled = true;

        setTimeout(() => {

            button.innerHTML = originalText;
            button.disabled = false;

        }, 900);

    });

});



function updateCart() {

    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = "";

    let totalItems = 0;
    let subtotal = 0;

    cart.forEach(item => {

        totalItems += item.quantity;

        subtotal += item.price * item.quantity;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        const itemInfo = document.createElement("div");

        itemInfo.className = "cart-item-info";

        const itemName = document.createElement("h4");

        itemName.textContent = item.name;

        const itemPrice = document.createElement("p");

        itemPrice.textContent =
            formatPrice(item.price * item.quantity);

        itemInfo.append(itemName, itemPrice);


        const actions = document.createElement("div");

        actions.className = "cart-item-actions";


        // Decrease quantity

        const decreaseButton = document.createElement("button");

        decreaseButton.className = "quantity-btn";

        decreaseButton.textContent = "−";

        decreaseButton.setAttribute(
            "aria-label",
            "Decrease " + item.name
        );

        decreaseButton.addEventListener("click", () => {

            changeQuantity(item.id, -1);

        });


        // Quantity number

        const quantity = document.createElement("span");

        quantity.className = "quantity-number";

        quantity.textContent = item.quantity;


        // Increase quantity

        const increaseButton = document.createElement("button");

        increaseButton.className = "quantity-btn";

        increaseButton.textContent = "+";

        increaseButton.setAttribute(
            "aria-label",
            "Increase " + item.name
        );

        increaseButton.addEventListener("click", () => {

            changeQuantity(item.id, 1);

        });


        // Remove item

        const removeButton = document.createElement("button");

        removeButton.className = "remove-item";

        removeButton.innerHTML =
            '<i class="fa-solid fa-trash"></i>';

        removeButton.setAttribute(
            "aria-label",
            "Remove " + item.name
        );

        removeButton.addEventListener("click", () => {

            removeItem(item.id);

        });


        actions.append(
            decreaseButton,
            quantity,
            increaseButton,
            removeButton
        );

        cartItem.append(itemInfo, actions);

        cartItemsContainer.appendChild(cartItem);

    });


    // Empty cart

    if (cart.length === 0) {

        cartItemsContainer.innerHTML = `

            <div class="empty-cart">

                <i class="fa-solid fa-cart-shopping"></i>

                <h3>Your cart is empty</h3>

                <p>Add some delicious food from our menu!</p>

                <a href="#menu" class="btn btn-primary">
                    Explore Menu
                </a>

            </div>

        `;

    }


    // Delivery fee

    const deliveryFee = subtotal === 0 ? 0 : 30;

    const finalTotal = subtotal + deliveryFee;


    // Update displayed values

    if (cartCount) {
        cartCount.textContent = totalItems;
    }

    if (cartSubtotal) {
        cartSubtotal.textContent = formatPrice(subtotal);
    }

    if (deliveryFeeElement) {
        deliveryFeeElement.textContent = formatPrice(deliveryFee);
    }

    if (cartTotal) {
        cartTotal.textContent = formatPrice(finalTotal);
    }

    if (checkoutButton) {
        checkoutButton.disabled = cart.length === 0;
    }

    saveCart();

}



function changeQuantity(id, change) {

    const item = cart.find(item => item.id === id);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {

        cart = cart.filter(item => item.id !== id);

    }

    updateCart();

}


function removeItem(id) {

    cart = cart.filter(item => item.id !== id);

    updateCart();

}



if (checkoutButton) {

    checkoutButton.addEventListener("click", () => {

        if (cart.length === 0) {

            alert("Your cart is empty!");

            return;

        }

        const orderDetails = cart.map(item => {

            return (
                item.name +
                " x " +
                item.quantity +
                " = " +
                formatPrice(item.price * item.quantity)
            );

        }).join("\n");

        const subtotal = cart.reduce((sum, item) => {

            return sum + item.price * item.quantity;

        }, 0);

        const deliveryFee = 30;

        const total = subtotal + deliveryFee;


        const customerName = prompt(
            "Enter your name to continue:"
        );

        if (!customerName || !customerName.trim()) {

            alert("Please enter your name.");

            return;

        }

        const customerPhone = prompt(
            "Enter your 10-digit mobile number:"
        );

        if (!customerPhone || !/^[6-9]\d{9}$/.test(customerPhone.trim())) {

            alert("Please enter a valid 10-digit Indian mobile number.");

            return;

        }


        const confirmation = confirm(

            "KARUNYA RESTAURANT - ORDER SUMMARY\n\n" +

            "Customer: " + customerName.trim() + "\n\n" +

            orderDetails + "\n\n" +

            "Subtotal: " + formatPrice(subtotal) + "\n" +

            "Delivery: " + formatPrice(deliveryFee) + "\n" +

            "Total: " + formatPrice(total) + "\n\n" +

            "This is a demo checkout. No actual order or payment will be placed.\n\n" +

            "Continue with demo confirmation?"

        );


        if (confirmation) {

            alert(
                "Thank you, " +
                customerName.trim() +
                "!\n\nYour demo order summary has been confirmed.\nNo actual food order has been placed."
            );

            cart = [];

            updateCart();

            document.getElementById("menu")?.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

}



const galleryImages = document.querySelectorAll(".gallery-grid img");

let galleryPreview = null;

function closeGalleryPreview() {

    if (galleryPreview) {

        galleryPreview.remove();

        galleryPreview = null;

        document.removeEventListener(
            "keydown",
            handleGalleryEscape
        );

    }

}


function handleGalleryEscape(event) {

    if (event.key === "Escape") {

        closeGalleryPreview();

    }

}


galleryImages.forEach(image => {

    image.addEventListener("click", () => {

        closeGalleryPreview();

        galleryPreview = document.createElement("div");

        galleryPreview.className = "gallery-preview";

        const previewImage = document.createElement("img");

        previewImage.src = image.src;

        previewImage.alt = image.alt;


        const closeButton = document.createElement("button");

        closeButton.className = "preview-close";

        closeButton.innerHTML = "&times;";

        closeButton.setAttribute(
            "aria-label",
            "Close image preview"
        );


        closeButton.addEventListener(
            "click",
            closeGalleryPreview
        );


        galleryPreview.addEventListener("click", event => {

            if (event.target === galleryPreview) {

                closeGalleryPreview();

            }

        });


        galleryPreview.append(
            previewImage,
            closeButton
        );

        document.body.appendChild(galleryPreview);

        document.addEventListener(
            "keydown",
            handleGalleryEscape
        );

    });

});



const reservationForm = document.querySelector(".reservation-form");

const bookingDate = document.getElementById("booking-date");


// Prevent selecting past dates

if (bookingDate) {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const day = String(today.getDate()).padStart(2, "0");

    const todayString = `${year}-${month}-${day}`;

    bookingDate.min = todayString;

}


if (reservationForm) {

    reservationForm.addEventListener("submit", event => {

        event.preventDefault();


        const name = document.getElementById("customer-name").value.trim();

        const email = document.getElementById("customer-email").value.trim();

        const phone = document.getElementById("customer-phone").value.trim();

        const date = document.getElementById("booking-date").value;

        const time = document.getElementById("booking-time").value;

        const guests = document.getElementById("guests").value;


        // Name validation

        if (name.length < 2) {

            alert("Please enter a valid name.");

            return;

        }


        // Email validation

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            alert("Please enter a valid email address.");

            return;

        }


        // Phone validation

        if (!/^[6-9]\d{9}$/.test(phone)) {

            alert("Please enter a valid 10-digit Indian mobile number.");

            return;

        }


        // Date validation

        if (!date || date < todayString) {

            alert("Please select today or a future date.");

            return;

        }


   

        if (!time || !guests) {

            alert("Please select your booking time and number of guests.");

            return;

        }


      

        alert(

            "Thank you, " + name + "!\n\n" +

            "Your demo reservation request details:\n\n" +

            "Date: " + date + "\n" +

            "Time: " + time + "\n" +

            "Guests: " + guests + "\n\n" +

            "This is a frontend demo. Your table has not actually been booked."

        );


        reservationForm.reset();

    });

}



const currentYear = document.getElementById("current-year");

if (currentYear) {

    currentYear.textContent = new Date().getFullYear();

}



updateCart();


console.log(
    "Welcome to KARUNYA RESTAURANT!"
);

console.log(
    "Website JavaScript loaded successfully."
);
