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
