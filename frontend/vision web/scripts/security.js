document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("accessToken");
    
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

    const name = document.querySelector("#name");

    //@desc get the username
    fetch("http://localhost:8000/api/user/getprofile", { headers:{"Authorization":`${token}`} })
    .then((response) =>{
        if (response.status === 401) {
        response.json().then((data)=>{showPopover(data.message + " please login again!",false);})
        setTimeout(()=>window.location.href="./auth.html",2000);
        return;
      }
      return response.json();
    })
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
            this.showPopover(result.message,false)
            document.getElementById("changePasswordForm").reset();
            localStorage.removeItem("accessToken");
            setTimeout(()=> window.location.href="./auth.html",2000);
        } else if(response.status===401){
            this.showPopover(result.message +" Please login again",false)
        }else if(response.status===422){
            this.showPopover(result.message,false)
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
    }
});
});