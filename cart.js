async function loadCart() {
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.id;

    const res = await fetch(`http://localhost:3000/api/cart/${userId}`);
    const data = await res.json();

    const container = document.querySelector(".cart-items");
    container.innerHTML = "";

    data.cart.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("cart-row");

      div.innerHTML = `
    <div class="cart-item cart-column">
        <img class="cart-item-image" src="${item.productId.imageUrl}" width="100">
        <span class="cart-item-title">${item.productId.title}</span>
    </div>

    <span class="cart-price cart-column">$${item.productId.price}</span>
    <div class="cart-quantity cart-column">
    <button class="qty-btn decrease-qty" data-id="${item.productId._id}">-</button>
    <span class="item-qty">${item.quantity}</span>
    <button class="qty-btn increase-qty" data-id="${item.productId._id}">+</button>

    <button class="remove-item-btn" data-id="${item.productId._id}">Remove</button>
</div>

   
`;
    container.appendChild(div);
    });
    // Calculate total
let total = 0;
data.cart.forEach(item => {
    total += item.productId.price * item.quantity;
});
document.querySelector(".cart-total-price").innerText = "$" + total;

}

document.addEventListener("DOMContentLoaded", loadCart);

document.getElementById("view-orders-btn").addEventListener("click", loadOrders);
document.getElementById("closeOrdersModal").addEventListener("click", () => {
    document.getElementById("ordersModal").style.display = "none";
});


// Load and display previous orders
async function loadOrders() {
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.id;

    const res = await fetch(`http://localhost:3000/api/orders/${userId}`);
    const data = await res.json();

    const container = document.getElementById("orders-list");
    container.innerHTML = "";

    if (data.orders.length === 0) {
        container.innerHTML = "<p>No previous orders found.</p>";
    }

    data.orders.forEach(order => {
        const div = document.createElement("div");
        div.classList.add("order-item");

        const date = new Date(order.createdAt).toLocaleString();

        let itemsHtml = "";
        order.items.forEach(i => {
            itemsHtml += `
              <div>
                <strong>${i.productId.title}</strong>  
                — ${i.quantity} × $${i.price}
              </div>`;
        });

        div.innerHTML = `
          <div class="single-order">
            <h4>Order on: ${date}</h4>
            ${itemsHtml}
            <p><strong>Total: $${order.totalPrice}</strong></p>
          </div>
          <hr>
        `;

        container.appendChild(div);
    });

    document.getElementById("ordersModal").style.display = "flex";
}


/* <!-- PURCHASE BUTTON SCRIPT --> */
document.querySelector(".btn-purchase").addEventListener("click", async () => {
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.id;

    const res = await fetch("http://localhost:3000/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
    });

    alert("Thank you for your purchase!");
    loadCart(); 
});



/* // <!-- REMOVE ITEM FROM CART SCRIPT --> */
document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("remove-item-btn")) {
        
        const productId = e.target.getAttribute("data-id");

        const token = localStorage.getItem("token");
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.id;

        await fetch("http://localhost:3000/api/cart/remove", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, productId })
        });

        alert("Product removed from cart");   
        loadCart(); 
    }
});

/* // <!-- INCREASE/DECREASE QUANTITY SCRIPT --> */
document.addEventListener("click", async (e) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.id;

    
    if (e.target.classList.contains("increase-qty")) {
        const productId = e.target.getAttribute("data-id");

        await fetch("http://localhost:3000/api/cart/increase", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, productId })
        });

        loadCart();
    }

    if (e.target.classList.contains("decrease-qty")) {
        const productId = e.target.getAttribute("data-id");

        await fetch("http://localhost:3000/api/cart/decrease", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, productId })
        });

        loadCart();
    }
});


