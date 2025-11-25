// Loads products from the server
async function loadProducts() {
    try {
        const res = await fetch("http://localhost:3000/api/products");
        const products = await res.json();

        if (!res.ok) {
            alert("Failed to load products");
            return;
        }

        renderProducts(products);

    } catch (err) {
        console.error("Error loading products:", err);
    }
}

// Displays the products on the page
function renderProducts(products) {
    const container = document.getElementById("shop-items");
    container.innerHTML = "";

    const token = localStorage.getItem("token");
    let role = null;

    // שליפת role מתוך הטוקן
    if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        role = payload.role;
    }

    products.forEach(product => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("shop-item");

        itemDiv.innerHTML = `
            <img class="shop-item-image" src="${product.imageUrl}">
            <span class="shop-item-title">${product.title}</span>
            <span class="shop-item-d">${product.description || ""}</span>

            <div class="shop-item-details">
                <span class="shop-item-price">$${product.price}</span>
                <button class="btn btn-primary shop-item-button">ADD TO CART</button>
            </div>
 
            
            ${role === "admin" ? `
            <div class="admin-actions">
            <button class="top-admin-btn admin-edit-btn" data-id="${product._id}">Edit</button>
            <button class="top-admin-btn admin-delete-btn" data-id="${product._id}">Delete</button>
            </div>
            ` : ""}

            
        `;

        container.appendChild(itemDiv);
    });

    
    if (typeof ready === "function") ready();
}

// Loads products when the page loads
document.addEventListener("DOMContentLoaded", loadProducts);

// Show admin buttons if the user is admin
window.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.role === "admin") {
        document.getElementById("add-product-btn").style.display = "inline-block";
      
    }
});


// Opening the model to add a product - clicking the Add Product button
document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("add-product-btn");
    if (addBtn) {
        addBtn.addEventListener("click", () => {
            document.getElementById("addProductModal").style.display = "flex";
        });
    }
});


// Closing the model for adding a product - clicking the Cancel button
document.addEventListener("DOMContentLoaded", () => {
    const closeBtn = document.getElementById("closeModal");
    const modal = document.getElementById("addProductModal");

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }
});

//Submitting the form and adding the product
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
                description: document.getElementById("p-desc").value
            };

            const res = await fetch("http://localhost:3000/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(newProduct)
            });

            console.log("Server response:", res.status);

            alert("Product added!");
            location.reload();
        });
    }
});


//Deleting a product - clicking the delete button
document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("admin-delete-btn")) {
        const id = e.target.getAttribute("data-id");
        const token = localStorage.getItem("token");

        if (!confirm("Are you sure you want to delete this product?")) return;

        await fetch(`http://localhost:3000/api/products/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        alert("Product deleted!");
        loadProducts();
    }
});


// Open the model - update the data directly to the model instances
document.addEventListener("click", async (e) => {
    const editBtn = e.target.closest(".admin-edit-btn");
    if (!editBtn) return;

    const id = editBtn.getAttribute("data-id");

    // Fetch the product from the server
    const res = await fetch(`http://localhost:3000/api/products/${id}`);
    const product = await res.json();

    // Fill in the fields
    document.getElementById("edit-title").value = product.title;
    document.getElementById("edit-price").value = product.price;
    document.getElementById("edit-image").value = product.imageUrl;
    document.getElementById("edit-stock").value = product.stock;
    document.getElementById("edit-desc").value = product.description;

    // Save ID for the duration of the update
    document.getElementById("edit-product-form").setAttribute("data-id", id);

    // Open a model
    document.getElementById("editProductModal").style.display = "flex";
});


// Closing the model for updating a product - clicking the Cancel button
document.addEventListener("DOMContentLoaded", () => {
    const closeEditBtn = document.getElementById("closeEditModal");
    if (closeEditBtn) {
        closeEditBtn.addEventListener("click", () => {
            document.getElementById("editProductModal").style.display = "none";
        });
    }
});


// Submitting the form and updating the product
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
                description: document.getElementById("edit-desc").value
            };

            const res = await fetch(`http://localhost:3000/api/products/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(updatedProduct)
            });

            console.log("UPDATE STATUS:", res.status);

            alert("Product updated!");
            document.getElementById("editProductModal").style.display = "none";

            loadProducts();
        });
    }
});
