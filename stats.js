async function loadStats() {
            try {
                // PRODUCTS SUMMARY
                const prodRes = await fetch("http://localhost:3000/api/stats/products-summary");
                const prodData = await prodRes.json();

                const prodTableBody = document.querySelector("#products-table tbody");
                prodTableBody.innerHTML = `
                    <tr>
                        <td>${prodData.totalProducts}</td>
                        <td>${prodData.totalStock}</td>
                        <td>$${prodData.avgPrice.toFixed(2)}</td>
                        <td>$${prodData.minPrice}</td>
                        <td>$${prodData.maxPrice}</td>
                    </tr>
                `;

                // USERS REGISTERED BY MONTH
                const usersRes = await fetch("http://localhost:3000/api/stats/users-by-month");
                const usersData = await usersRes.json();

                const usersTableBody = document.querySelector("#users-table tbody");
                usersTableBody.innerHTML = usersData
                    .map(u => `
                        <tr>
                            <td>${u._id.year}</td>
                            <td>${u._id.month}</td>
                            <td>${u.count}</td>
                        </tr>
                    `)
                    .join("");
            } catch (err) {
                console.error("Error loading stats", err);
            }
        }

document.addEventListener("DOMContentLoaded", loadStats);
