/*
    Author: Jonathan M. Lewellen
    Date: 09/29/2026
    Purpose: local storage, DOM manipulation, dynamic product display, event-driven programming, stock updates, cart rendering, timer logic, and browser console inspection.
*/

/* =========================================
    PRODUCT DATA
========================================= */

// STEP 3
const defaultProducts = [{
		id: 1,
		name: "Aurora Vase",
		price: 95,
		stock: 4,
		image: "images/AuroraVase.png",
		description: "Hand-blown glass vase with swirling aurora colors."
	},
	{
		id: 2,
		name: "Ember Bowl",
		price: 75,
		stock: 3,
		image: "images/EmberBowl.png",
		description: "Decorative fire-inspired centerpiece bowl."
	},
	{
		id: 3,
		name: "Crystal Wave",
		price: 120,
		stock: 2,
		image: "images/CrystalWave.png",
		description: "Ocean-inspired sculpture with flowing glass curves."
	},
	{
		id: 4,
		name: "Solar Lantern",
		price: 60,
		stock: 5,
		image: "images/SolarLantern.png",
		description: "Handcrafted lantern with warm glowing tones."
	},
	{
		id: 5,
		name: "Frost Pendant",
		price: 45,
		stock: 1,
		image: "images/FrostPendant.png",
		description: "Elegant frozen-glass pendant artwork."
	},
	{
		id: 6,
		name: "Nebula Orb",
		price: 140,
		stock: 0,
		image: "images/NebulaOrb.png",
		description: "Galaxy-inspired decorative glass orb."
	},
	{
    	id: 7,
    	name: "Handcrafted Glass Vase",
    	price: 45.00,
    	stock: 12,
    	image: "images/vase.png",
    	description: "A stunning, mouth-blown glass vase featuring an ocean-blue gradient swirl."
	},
	{
    	id: 8,
    	name: "Amber Glass Paperweight",
    	price: 28.50,
    	stock: 8,
    	image: "images/paperweight.png",
    	description: "Solid amber glass paperweight capturing warm, organic patterns inspired by nature."
	},
	{
    	id: 9,
    	name: "Iridescent Glass Sun Catcher",
    	price: 34.00,
    	stock: 15,
    	image: "images/suncatcher.png",
    	description: "An artisan sun catcher that refracts vibrant prismatic light across any room."
	}
];

/* =========================================
    LOCAL STORAGE SETUP
========================================= */

// STEP 4
let products = JSON.parse(localStorage.getItem("products")) || defaultProducts;
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let cartEndTime = localStorage.getItem("cartEndTime") || null;

/* =========================================
    DOM REFERENCES
========================================= */

const productGrid = document.getElementById("product-grid");
const cartCount = document.getElementById("cart-count");
const countdown = document.getElementById("countdown");
const notification = document.getElementById("notification");
const cartButton = document.getElementById("cart-button");

/* =========================================
    CART NAVIGATION (NEW PAGE)
========================================= */

// STEP 5
if (cartButton) {
   cartButton.addEventListener("click", () => window.location.href = "cart.html");

      cartButton.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          window.location.href = "cart.html";
      }
    });
}


/* =========================================
     CREATE TOOLTIP ELEMENT
========================================= */

// STEP 6
const tooltip = document.createElement("div");
tooltip.classList.add("mouse-tooltip");
tooltip.textContent = "OUT OF STOCK";
document.body.appendChild(tooltip);


/* =========================================
     DISPLAY PRODUCTS
========================================= */

// STEP 7
function displayProducts() {
    if (!productGrid) return;

    productGrid.innerHTML = "";
    products.forEach(product => {
        const card = document.createElement("article");
        card.classList.add("product-card");

        if (product.stock === 0) {
            card.classList.add("out-of-stock");

            card.addEventListener("mousemove", event => {
                tooltip.style.left = `${event.clientX}px`;
                tooltip.style.top = `${event.clientY}px`;
                tooltip.classList.add("show");
            });

            card.addEventListener("mouseleave", () => {
                tooltip.classList.remove("show");
            });
        }

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <section class="product-content">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>$${product.price}</p>
                <p class="stock">Available: ${product.stock}</p>
                <button
                    ${product.stock === 0 ? "disabled" : ""}
                    onclick="addToCart(${product.id})"
                    aria-label="Add ${product.name} to cart"
                >
                    Add To Cart
                </button>
            </section>
        `;

        productGrid.appendChild(card);
    });
}


/* =========================================
    ADD TO CART
========================================= */

// STEP 8
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if(product.stock <= 0) return;

    product.stock--;
    cart.push(product);

    saveData();
    startTimer();
    displayProducts();
    updateCartBadge();
    showNotification();
}


/* =========================================
    UPDATE CART COUNT BADGE
========================================= */
function updateCartBadge() {
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}


/* =========================================
    SAVE DATA
========================================= */

// STEP 9
function saveData() {
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("cart", JSON.stringify(cart));
    if(cartEndTime) localStorage.setItem("cartEndTime", cartEndTime);
}


/* =========================================
    NOTIFICATION
========================================= */
function showNotification() {
    if (!notification) return;
	notification.classList.add("show");
	setTimeout(() => notification.classList.remove("show"), 1500);
}

/* =========================================
    TIMER LOGIC
========================================= */

// STEP 10
function startTimer() {
    if(!cartEndTime) {
        cartEndTime = Date.now() + 15 * 60 * 1000; // 15 minutes
        localStorage.setItem("cartEndTime", cartEndTime);
    }
}

function updateTimer() {
    if(!countdown) return;
    if(!cartEndTime) {
        countdown.textContent = "15:00";
        return;
    }

    const remaining = cartEndTime - Date.now();

    if(remaining <= 0) {
        clearCart();
        return;
    }

    const m = Math.floor(remaining / 1000 / 60);
    const s = Math.floor((remaining / 1000) % 60);
    countdown.textContent = `${m}:${s.toString().padStart(2,"0")}`;
}


/* =========================================
    CLEAR CART
========================================= */

// STEP 11
function clearCart() {
   cart.forEach(item => {
       const p = products.find(x => x.id === item.id);
       if (p) p.stock++;
   });

   cart = [];
   cartEndTime = null;

   localStorage.removeItem("cart");
   localStorage.removeItem("cartEndTime");
   localStorage.setItem("products", JSON.stringify(products));

   displayProducts();
   updateCartBadge();

   if (countdown) countdown.textContent = "15:00";
   alert("Your item reservations have ended. Stock availability may have changed.");
}


/* =========================================
    INITIALIZATION
========================================= */
displayProducts();
updateCartBadge();
// Update countdown every second
setInterval(updateTimer, 1000);