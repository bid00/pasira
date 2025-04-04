const loginForm = document.getElementById("login-form");
const createAccountForm = document.getElementById("create-account-form");
const loginTab = document.getElementById("login-tab");
const createTab = document.getElementById("create-tab");

function showLogin() {
  loginForm.classList.remove("hidden");
  createAccountForm.classList.add("hidden");
  loginTab.classList.remove("border-mainText");
  loginTab.classList.add("text-mainColor", "border-mainColor");
  createTab.classList.remove("text-mainColor", "border-mainColor");
}

function showCreateAccount() {
  loginForm.classList.add("hidden");
  createAccountForm.classList.remove("hidden");
  loginTab.classList.remove("text-mainColor", "border-mainColor");
  createTab.classList.remove("border-mainText");
  createTab.classList.add("text-mainColor", "border-mainColor");
}

const popover = document.getElementById("popover");
    const popoverMessage = document.getElementById("popover-message");
    const popoverClose = document.getElementById("popover-close");

    const showPopover = (message, success = true) => {
        popoverMessage.textContent = message;
        popover.classList.add(success ? "success" : "error");
        popover.style.display = "block";
    };

    popoverClose.addEventListener("click", () => {
        popover.style.display = "none";
        popover.classList.remove("success", "error");
    });

    createAccountForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fullName = document.getElementById("register-name").value;
        const phone = document.getElementById("register-phone").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;

        const response = await fetch("http://localhost:8000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({ fullName, phone, email, password })
        });

        const data = await response.json();
        showPopover(data.message, response.ok);
        showLogin();
    });
    
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        const response = await fetch("http://localhost:8000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("accessToken", data.accessToken);
            showPopover("Login successful! Redirecting...", true);
            setTimeout(() => window.location.href = "./profile.html", 2000);
        } else {
            showPopover(data.message, false);
        }
    });
    function getCookie(name) {
        const cookies = document.cookie.split("; ");
        for (let cookie of cookies) {
            const [key, value] = cookie.split("=");
            if (key === name) return value;
        }
        return null;
    }

    function loginWithGoogle() {
        // Open Google login in a new tab
        window.open("http://localhost:8000/api/auth/google", "_self");

    };
    document.addEventListener("DOMContentLoaded", function() {
        const token = getCookie("accessToken");
        localStorage.setItem("accessToken",token);
        if (token) {
            showPopover("Login successful! Redirecting...", true);
            window.location.href = "./profile.html"
        } 
    });
    