// פונקציה שמחזירה את המשתמש הנוכחי מתוך localStorage
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

// פונקציה שבודקת אם המשתמש הוא אדמין
function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === "admin";
}

// פונקציה שמעדכנת את התפריט העליון (navbar)
function updateNavbar() {
    const user = getCurrentUser();
    const logInLi = document.getElementById("logIn"); // כבר קיים אצלך ב-HTML

    if (!logInLi) return;

    if (!user) {
        // אם אין משתמש מחובר – נציג קישור ל-Login
        logInLi.innerHTML = `<a href="logIn.html"><i class="bi bi-person-fill"></i></a>`;
    } else {
        // אם יש משתמש מחובר – נציג את שמו וכפתור Logout
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
                window.location.href = "store.html"; // חזרה לדף הבית
            });
        }
    }
}

// נפעיל את זה כשעמוד נטען
document.addEventListener("DOMContentLoaded", updateNavbar);
