const AUTH_API = "http://localhost:8080/api/auth";

// ===== LOGIN PAGE =====
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const errorMsg = document.getElementById("errorMsg");

        fetch(`${AUTH_API}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
            .then(res => res.json().then(data => ({ status: res.status, data })))
            .then(({ status, data }) => {
                if (status === 200) {
                    localStorage.setItem("scamshield_user", data.email);
                    window.location.href = "dashboard.html";
                } else {
                    errorMsg.textContent = data.message;
                    errorMsg.classList.remove("hidden");
                }
            });
    });
}

// ===== REGISTER PAGE =====
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const errorMsg = document.getElementById("errorMsg");
        const successMsg = document.getElementById("successMsg");

        fetch(`${AUTH_API}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
            .then(res => res.json().then(data => ({ status: res.status, data })))
            .then(({ status, data }) => {
                if (status === 200) {
                    successMsg.textContent = "Account created! Redirecting to login...";
                    successMsg.classList.remove("hidden");
                    errorMsg.classList.add("hidden");
                    setTimeout(() => window.location.href = "login.html", 1500);
                } else {
                    errorMsg.textContent = data.message;
                    errorMsg.classList.remove("hidden");
                    successMsg.classList.add("hidden");
                }
            });
    });
}

// ===== DASHBOARD PROTECTION =====
const userEmailEl = document.getElementById("userEmail");
if (userEmailEl) {
    const user = localStorage.getItem("scamshield_user");
    if (!user) {
        window.location.href = "login.html";
    } else {
        userEmailEl.textContent = user;
    }
}

// ===== LOGOUT =====
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("scamshield_user");
        window.location.href = "login.html";
    });
}