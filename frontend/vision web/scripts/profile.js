document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "http://localhost:8000/api/user/getprofile";
  const accessToken = localStorage.getItem("accessToken");

  const headers = {
    Authorization: `${accessToken}`,
  };

  const form = document.querySelector("form");
  const inputs = form.querySelectorAll("input");
  const editButton = document.createElement("button");
  const updateButton = document.createElement("button");
  const profilePicDiv = document.querySelector("#profilepic"); 
  const uploadButton = profilePicDiv.nextElementSibling;
  const name = document.querySelector("#name");
  
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
  editButton.textContent = "Edit";
  editButton.classList.add("w-full","max-w-[365px]", "mx-auto", "bg-mainColor", "block", "text-white", "p-4", "rounded-lg");

  updateButton.textContent = "Update";
  updateButton.classList.add("bg-green-500","w-full","max-w-[365px]", "mx-auto", "block", "text-white", "p-4", "rounded-lg");
  updateButton.style.display = "none"; 
  uploadButton.disabled = true;
  form.appendChild(editButton);
  form.appendChild(updateButton);
  let selectedFile = null;

  // Fetch and populate user data
  fetch(apiUrl, { headers })
    .then((response) => {
      if (response.status === 401) {
        response.json().then((data)=>{showPopover(data.message + " please login again!",false);})
        setTimeout(()=>window.location.href="./auth.html",2000);
        return;
      }
      return response.json()})
    .then((data) => {
      inputs[0].value = data.fullName || "";
      inputs[1].value = data.phone || "";
      inputs[2].value = data.email || "";
      name.innerHTML = data.fullName || "";

      // Set profile picture
      if (data.picture) {
        profilePicDiv.style.backgroundImage = `url(${data.picture})`;
        profilePicDiv.style.backgroundSize = "cover";
        profilePicDiv.style.backgroundPosition = "center";
      }

      inputs.forEach((input) => (input.disabled = true));
    })
    
    .catch((error) => console.error("Error fetching profile:", error));

  // Enable form editing
  editButton.addEventListener("click", (e) => {
    e.preventDefault();
    inputs.forEach((input) => (input.disabled = false));
    editButton.style.display = "none";
    uploadButton.disabled = false;
    updateButton.style.display = "block";
  });

  uploadButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (uploadButton.disabled) return;

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.click();

    fileInput.addEventListener("change", () => {
      selectedFile = fileInput.files[0]; 
      if (!selectedFile) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        profilePicDiv.style.backgroundImage = `url(${e.target.result})`;
      };
      reader.readAsDataURL(selectedFile);
    });
  });


  // Send update request
  updateButton.addEventListener("click", (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("fullName", inputs[0].value);
    formData.append("phoneNumber", inputs[1].value);
    formData.append("email", inputs[2].value);


    if (selectedFile) {
      formData.append("picture", selectedFile);
    }


    fetch("http://localhost:8000/api/user/updateprofile", {
      method: "PATCH",
      headers,
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Profile updated successfully!");
        inputs.forEach((input) => (input.disabled = true));
        uploadButton.disabled = true;
        editButton.style.display = "block";
        updateButton.style.display = "none";
        window.location.href = "./profile.html"
      })
      .catch((error) => console.error("Error updating profile:", error));
  });

});
