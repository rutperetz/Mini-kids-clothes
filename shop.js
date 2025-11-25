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

// מציג את המוצרים בעמוד
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

            
        `;

        container.appendChild(itemDiv);
    });

    // הפעלה של לוגיקה של העגלה
    if (typeof ready === "function") ready();
}

// טוען מוצרים בעת טעינת הדף
document.addEventListener("DOMContentLoaded", loadProducts);

// הצגת כפתורי אדמין אם המשתמש אדמין
window.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.role === "admin") {
        document.getElementById("add-product-btn").style.display = "inline-block";
        document.getElementById("edit-product-btn").style.display = "inline-block";
        document.getElementById("delete-product-btn").style.display = "inline-block";
    }
});



// פתיחת חלון ההוספה
document.getElementById("add-product-btn").addEventListener("click", () => {
    document.getElementById("addProductModal").style.display = "flex";
});

// סגירת חלון ההוספה
window.addEventListener("DOMContentLoaded", () => {

    const closeBtn = document.getElementById("closeModal");
    const modal = document.getElementById("addProductModal");

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });
});


//שליחת הטופס לשרת
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









