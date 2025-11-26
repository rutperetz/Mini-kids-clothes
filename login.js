document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault(); 
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        
        // If there is an error connecting
        if (!res.ok) {
            alert(data.error || "Login failed");
            return;
        }

        // Save token and user info in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Logged in successfully as " + data.user.name);

        window.location.href = "store.html"; 

    } catch (err) {
        console.error(err);
        alert("Error connecting to server");
    }
});
