document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("accessToken");
    const name = document.querySelector("#name");
    if (!token) {
        alert("Access token not found. Please log in.");
        window.location.href= "./auth.html"
        return;
      }
    //@desc get the username
    fetch("http://localhost:8000/api/user/getprofile", { headers:{"Authorization":`${token}`} })
    .then((response) => response.json())
    .then((data) => {
      name.innerHTML = data.fullName || "";
    }).catch((error) => console.error("Error fetching profile:", error));

    const form = document.getElementById("changePasswordForm")
    form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const cNewPassword = document.getElementById("confirmPassword").value;
    

    if (newPassword !== cNewPassword) {
        alert("New password and confirm password do not match!");
        return;
    }


    try {
        const response = await fetch("http://localhost:8000/api/user/changepassword", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`
            },
            body: JSON.stringify({
                oldPassword,
                cNewPassword,
                newPassword
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert("Password changed successfully!");
            document.getElementById("changePasswordForm").reset();
            localStorage.removeItem("accessToken");
            window.location.href="./auth.html"
        } else {
            alert(result.message || "Failed to change password");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
    }
});
});