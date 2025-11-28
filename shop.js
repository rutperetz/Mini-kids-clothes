// =========================================
// GLOBAL array for sorting
// =========================================
let allProducts = [];

// ==============================
// Load products from the server
// ==============================
async function loadProducts() {
    try {
        const res = await fetch("http://localhost:3000/api/products");

        if (!res.ok) {
            alert("Failed to load products");
            return;
        }

        allProducts = await res.json();  // שמירה לשימוש במיון
        renderProducts(allProducts);

    } catch (err) {
        console.error("Error loading products:", err);
    }
    renderProducts(allProducts);
    await updatePricesDisplay();

}

// =======================================================
// Convert USD → ILS using public exchange-rate API
// =======================================================
let useILS = false;
async function convertToILS(priceUSD) {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const data = await res.json();

    const rateILS = data.rates.ILS;   // כמה שקלים = דולר אחד
    const priceILS = priceUSD * rateILS;

    return priceILS.toFixed(2);
}

// =======================================================
// Weather API – get Tel Aviv temperature
// =======================================================
async function getWeather() {
    const url =
      "https://api.open-meteo.com/v1/forecast?latitude=32.0853&longitude=34.7818&current_weather=true";

    try {
        const res = await fetch(url);
        const data = await res.json();

        return data.current_weather.temperature;
    } catch (err) {
        console.error("Weather API error:", err);
        return null;
    }
}


// ==================================
// Render products on the page
// ==================================
function renderProducts(products) {
    const container = document.getElementById("shop-items");
    container.innerHTML = "";

    const token = localStorage.getItem("token");
    let role = null;

    if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        role = payload.role;
    }

    products.forEach((product) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("shop-item");
        itemDiv.setAttribute("data-id", product._id);

        itemDiv.innerHTML = `
            <img class="shop-item-image" src="${product.imageUrl}">
            <span class="shop-item-title">${product.title}</span>
            <span class="shop-item-d">${product.description || ""}</span>

            <div class="shop-item-details">
               <span class="shop-item-price" data-price-usd="${product.price}">
               $${product.price}
              </span>

                <button class="btn btn-primary shop-item-button">ADD TO CART</button>
            </div>

            ${
                role === "admin"
                    ? `
            <div class="admin-actions">
                <button class="top-admin-btn admin-edit-btn" data-id="${product._id}">Edit</button>
                <button class="top-admin-btn admin-delete-btn" data-id="${product._id}">Delete</button>
            </div>
            `
                    : ""
            }
        `;

        container.appendChild(itemDiv);
    });

    if (typeof ready === "function") ready();
}

// ==================================
// Update prices according to selected currency
// ==================================
async function updatePricesDisplay() {
    const priceElements = document.querySelectorAll(".shop-item-price");

    for (const el of priceElements) {
        const priceUSD = Number(el.getAttribute("data-price-usd"));

        if (useILS) {
            const ils = await convertToILS(priceUSD);
            el.textContent = `${ils} ₪`;
        } else {
            el.textContent = `$${priceUSD}`;
        }
    }

    const btn = document.getElementById("toggle-currency-btn");
    if (btn) {
        btn.textContent = useILS ? "Show in $" : "Show in ₪";
    }
}


// ==================================
// On page load – load products
// ==================================
document.addEventListener("DOMContentLoaded", loadProducts);

//  DOMContentLoaded – Show weather
document.addEventListener("DOMContentLoaded", async () => {
    const temp = await getWeather();
    const weatherBox = document.getElementById("weather-info");

    if (weatherBox && temp !== null) {
        weatherBox.textContent = `Today's temperature: ${temp}°C`;
    }
});

// ==================================
// Show admin elements
// ==================================
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const addBtn = document.getElementById("add-product-btn");
    const statsBtn = document.getElementById("admin-stats-btn");

    if (!token) {
        if (addBtn) addBtn.style.display = "none";
        if (statsBtn) statsBtn.style.display = "none";
        return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.role === "admin") {
        if (addBtn) addBtn.style.display = "inline-block";
        if (statsBtn) {
            statsBtn.style.display = "inline-block";
            statsBtn.addEventListener("click", () => {
                window.location.href = "stats.html";
            });
        }
    }
});

// ==================================
// Open "Add Product" modal
// ==================================
document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("add-product-btn");
    if (addBtn) {
        addBtn.addEventListener("click", () => {
            document.getElementById("addProductModal").style.display = "flex";
        });
    }
});

// ==================================
// Close Add modal
// ==================================
document.addEventListener("DOMContentLoaded", () => {
    const closeBtn = document.getElementById("closeModal");
    const modal = document.getElementById("addProductModal");

    if (closeBtn && modal) {
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }
});

// ==================================
// Submit "Add Product"
// ==================================
document.addEventListener("DOMContentLoaded", () => {
    const addForm = document.getElementById("add-product-form");

    if (addForm) {
        addForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const token = localStorage.getItem("token");

            const newProduct = {
                title: document.getElementById("p-title").value,
                price: Number(document.getElementById("p-price").value),
                imageUrl: document.getElementById("p-image").value,
                stock: Number(document.getElementById("p-stock").value),
                description: document.getElementById("p-desc").value,
            };

            await fetch("http://localhost:3000/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify(newProduct),
            });

            alert("Product added!");
            location.reload();
        });
    }
});

// ==================================
// Delete product
// ==================================
document.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("admin-delete-btn")) return;

    const id = e.target.getAttribute("data-id");
    const token = localStorage.getItem("token");

    if (!confirm("Are you sure you want to delete this product?")) return;

    await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
    });

    alert("Product deleted!");
    loadProducts();
});

// ==================================
// Toggle currency button (USD ↔ ILS)
// ==================================
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("toggle-currency-btn");

    if (btn) {
        btn.addEventListener("click", async () => {
            useILS = !useILS;   // החלפת מצב
            await updatePricesDisplay();
        });
    }
});


// ==================================
// Edit Modal – open & fill
// ==================================
document.addEventListener("click", async (e) => {
    const editBtn = e.target.closest(".admin-edit-btn");
    if (!editBtn) return;

    const id = editBtn.getAttribute("data-id");

    const res = await fetch(`http://localhost:3000/api/products/${id}`);
    const product = await res.json();

    document.getElementById("edit-title").value = product.title;
    document.getElementById("edit-price").value = product.price;
    document.getElementById("edit-image").value = product.imageUrl;
    document.getElementById("edit-stock").value = product.stock;
    document.getElementById("edit-desc").value = product.description;

    document.getElementById("edit-product-form").setAttribute("data-id", id);

    document.getElementById("editProductModal").style.display = "flex";
});

// ==================================
// Close Edit modal
// ==================================
document.addEventListener("DOMContentLoaded", () => {
    const closeEditBtn = document.getElementById("closeEditModal");
    if (closeEditBtn) {
        closeEditBtn.addEventListener("click", () => {
            document.getElementById("editProductModal").style.display = "none";
        });
    }
});

// ==================================
// Submit Edit
// ==================================
document.addEventListener("DOMContentLoaded", () => {
    const editForm = document.getElementById("edit-product-form");

    if (editForm) {
        editForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const id = editForm.getAttribute("data-id");
            const token = localStorage.getItem("token");

            const updatedProduct = {
                title: document.getElementById("edit-title").value,
                price: Number(document.getElementById("edit-price").value),
                imageUrl: document.getElementById("edit-image").value,
                stock: Number(document.getElementById("edit-stock").value),
                description: document.getElementById("edit-desc").value,
            };

            await fetch(`http://localhost:3000/api/products/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify(updatedProduct),
            });

            alert("Product updated!");
            document.getElementById("editProductModal").style.display = "none";

            loadProducts();
        });
    }
});

// ==================================
// Add to cart
// ==================================
document.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("shop-item-button")) return;

    const item = e.target.closest(".shop-item");
    const productId = item.getAttribute("data-id");

    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.id;

    await fetch("http://localhost:3000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }),
    });

    alert("Product added to cart!");
});

// ==================================
// SORT A → Z (by title)
// ==================================
document.addEventListener("DOMContentLoaded", () => {
    const btnAlpha = document.getElementById("sort-alpha");

    if (btnAlpha) {
        btnAlpha.addEventListener("click", () => {
            const sorted = [...allProducts].sort((a, b) =>
                a.title.localeCompare(b.title)
            );
            renderProducts(sorted);
        });
    }
});
