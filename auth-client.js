function getCurrentUser() {
    const userJson = localStorage.getItem("user");
    if (!userJson) return null;
    try {
        return JSON.parse(userJson);
    } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        return null;
    }
}

//Check if the user is an admin
function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === "admin";
}

//Updates the top menu
function updateNavbar() {
    const user = getCurrentUser();
    const logInLi = document.getElementById("logIn"); 

    if (!logInLi) return;

    if (!user) {
        logInLi.innerHTML = `<a href="logIn.html"><i class="bi bi-person-fill"></i></a>`;
    } else {
        // Logged in user – we will display their name and a Logout button
        logInLi.innerHTML = `
            <span style="color:white; margin-right:8px;">
                Hello, ${user.name}
            </span>
            <a href="#" id="logoutLink" title="Logout">
                <i class="bi bi-box-arrow-right"></i>
            </a>
        `;

        const logoutLink = document.getElementById("logoutLink");
        if (logoutLink) {
            logoutLink.addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                alert("Logged out");
                window.location.href = "store.html"; 
            });
        }
    }
}

document.addEventListener("DOMContentLoaded", updateNavbar);
