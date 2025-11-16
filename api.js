// api.js
const API_BASE = "http://localhost:3000/api";

function authFetch(path, options = {}) {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
    });
}
