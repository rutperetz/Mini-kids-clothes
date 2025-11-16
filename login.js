// מאזינים לשליחת הטופס
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // לא לרענן את העמוד

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            // שגיאה מהשרת (אימייל/סיסמה לא נכונים או שגיאה אחרת)
            alert(data.error || "Login failed");
            return;
        }

        // אם הגענו לכאן – ההתחברות הצליחה
        // נשמור token + user ב-localStorage כדי שנוכל להשתמש בזה בשאר האתר
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Logged in successfully as " + data.user.name);

        // מעבירים לעמוד הראשי / חנות
        window.location.href = "store.html"; // אפשר לשנות ל-shop.html אם תרצו

    } catch (err) {
        console.error(err);
        alert("Error connecting to server");
    }
});
