// טוען מוצרים מהשרת
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

// מצייר מוצרים על המסך
function renderProducts(products) {
    const container = document.getElementById("shop-items");

    container.innerHTML = ""; // ריק לפני ציור

    products.forEach(p => {
        const html = `
        <div class="shop-item">
            <img class="shop-item-image" src="${p.image}" />
            <span class="shop-item-title">${p.name}</span>
            <span class="shop-item-d">${p.description}</span>
            <div class="shop-item-details">
                <span class="shop-item-price">$${p.price}</span>
                <button class="btn btn-primary shop-item-button" type="button">ADD TO CART</button>
            </div>
        </div>
        `;
        container.innerHTML += html;
    });

    // אחרי שהמוצרים נטענו – מפעילים את לוגיקת העגלה
    if (typeof ready === "function") ready();
}

document.addEventListener("DOMContentLoaded", loadProducts);

window.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.role === "admin") {
        document.getElementById("add-product-btn").style.display = "inline-block";
        //document.getElementById("manage-stock-btn").style.display = "inline-block";
        //document.getElementById("delete-product-btn").style.display = "inline-block";
    }
});

document.getElementById("add-product-btn").addEventListener("click", () => {
    document.getElementById("add-product-form").style.display = "block";
});

document.getElementById("add-product-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const newProduct = {
        title: document.getElementById("p-title").value,
        price: Number(document.getElementById("p-price").value),
        imageUrl: document.getElementById("p-image").value,
        stock: Number(document.getElementById("p-stock").value),
        description: document.getElementById("p-desc").value
    };

    await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(newProduct)
    });

    alert("Product added!");
    location.reload();
});

document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-btn")) {
        const id = e.target.dataset.id;
        const token = localStorage.getItem("token");

        await fetch(`http://localhost:3000/api/products/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        alert("Product deleted!");
        loadProductsFromServer();
    }
});

document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("edit-btn")) {

        const id = e.target.dataset.id;
        const newPrice = prompt("Enter new price:");
        const newStock = prompt("Enter new stock:");

        const token = localStorage.getItem("token");

        await fetch(`http://localhost:3000/api/products/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                price: Number(newPrice),
                stock: Number(newStock)
            })
        });

        alert("Product updated!");
        loadProductsFromServer();
    }
});

async function loadProductsFromServer() {
    try {
        const res = await fetch("http://localhost:3000/api/products");
        const products = await res.json();

        const container = document.querySelector(".shop-items");
        container.innerHTML = "";

        const user = getUserFromToken();

        products.forEach(product => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("shop-item");

            itemDiv.innerHTML = `
                <img class="shop-item-image" src="${product.imageUrl}">
                <span class="shop-item-title">${product.title}</span>
                <span class="shop-item-d">${product.description || ""}</span>

                <div class="shop-item-details">
                    <span class="shop-item-price">$${product.price}</span>
                    <button class="btn btn-primary shop-item-button" type="button">ADD TO CART</button>
                </div>
            `;

            // ⭐ אם המשתמש אדמין – מוסיפים כפתורי ניהול
            if (user && user.role === "admin") {
                itemDiv.innerHTML += `
                    <div class="admin-actions">
                        <button class="admin-delete-btn" data-id="${product._id}">🗑 Delete</button>
                        <button class="admin-edit-btn" data-id="${product._id}">✏ Edit</button>
                    </div>
                `;
            }

            container.appendChild(itemDiv);
        });

        // מפעיל פונקציות של העגלה
        if (typeof ready === "function") ready();

    } catch (err) {
        console.error("שגיאה בטעינת מוצרים:", err);
    }
}

document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("admin-delete-btn")) {

        const id = e.target.dataset.id;
        const token = localStorage.getItem("token");

        if (!confirm("Are you sure you want to delete this product?")) return;

        await fetch(`http://localhost:3000/api/products/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        alert("Product deleted!");
        loadProductsFromServer();
    }
});




// ------------------------------------------------------------------
// 6️⃣ פונקציית עדכון מוצר — UPDATE PRODUCT
// ------------------------------------------------------------------
document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("admin-edit-btn")) {

        const id = e.target.dataset.id;
        const token = localStorage.getItem("token");

        const newPrice = prompt("Enter new price:");
        const newStock = prompt("Enter new stock:");

        await fetch(`http://localhost:3000/api/products/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                price: Number(newPrice),
                stock: Number(newStock)
            })
        });

        alert("Product updated!");
        loadProductsFromServer();
    }
});