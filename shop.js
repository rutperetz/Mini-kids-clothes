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

        const products = await res.json();
        renderProducts(products);
    } catch (err) {
        console.error("Error loading products:", err);
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

    // שליפת role מתוך הטוקן (JWT)
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
                <span class="shop-item-price">$${product.price}</span>
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
// On page load – load products
// ==================================
document.addEventListener("DOMContentLoaded", loadProducts);

// ==================================
// Show admin buttons + Admin link
// ==================================
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const adminLink = document.getElementById("adminLink");
    const addBtn = document.getElementById("add-product-btn");

    // אם אין טוקן – להסתיר אלמנטים של אדמין
    if (!token) {
        if (adminLink) adminLink.style.display = "none";
        if (addBtn) addBtn.style.display = "none";
        return;
    }

    // פענוח ה-JWT
    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.role === "admin") {
        if (adminLink) adminLink.style.display = "inline-block"; // קישור ל-stats.html
        if (addBtn) addBtn.style.display = "inline-block";       // כפתור הוספת מוצר
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
// Close "Add Product" modal
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
// Submit "Add Product" form
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

            const res = await fetch("http://localhost:3000/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify(newProduct),
            });

            console.log("Server response:", res.status);

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
        headers: {
            Authorization: "Bearer " + token,
        },
    });

    alert("Product deleted!");
    loadProducts();
});

// ==================================
// Open "Edit Product" modal + fill data
// ==================================
document.addEventListener("click", async (e) => {
    const editBtn = e.target.closest(".admin-edit-btn");
    if (!editBtn) return;

    const id = editBtn.getAttribute("data-id");

    // Fetch product from server
    const res = await fetch(`http://localhost:3000/api/products/${id}`);
    const product = await res.json();

    // Fill modal fields
    document.getElementById("edit-title").value = product.title;
    document.getElementById("edit-price").value = product.price;
    document.getElementById("edit-image").value = product.imageUrl;
    document.getElementById("edit-stock").value = product.stock;
    document.getElementById("edit-desc").value = product.description;

    // Save ID on the form
    document.getElementById("edit-product-form").setAttribute("data-id", id);

    // Open modal
    document.getElementById("editProductModal").style.display = "flex";
});

// ==================================
// Close "Edit Product" modal
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
// Submit "Edit Product" form
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

            const res = await fetch(`http://localhost:3000/api/products/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify(updatedProduct),
            });

            console.log("UPDATE STATUS:", res.status);

            alert("Product updated!");
            document.getElementById("editProductModal").style.display = "none";

            loadProducts();
        });
    }
});

// ==================================
// Add item to cart
// ==================================
document.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("shop-item-button")) return;

    const item = e.target.closest(".shop-item");
    const productId = item.getAttribute("data-id");

    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.id;

    const res = await fetch("http://localhost:3000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }),
    });

    const data = await res.json();
    console.log("Cart updated:", data);
    alert("Product added to cart!");
});
