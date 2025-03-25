document.addEventListener("DOMContentLoaded", function () {
    // Function to show Bootstrap Toast dynamically
    function showToast(message, isError = false) {
        const toastEl = document.getElementById("responseToast");
        const toastBody = document.querySelector("#responseToast .toast-body");

        if (toastEl && toastBody) {
            toastBody.innerText = message;

            // Change toast color based on success or error
            toastEl.classList.remove("text-bg-success", "text-bg-danger");
            toastEl.classList.add(isError ? "text-bg-danger" : "text-bg-success");

            // Show toast with auto-hide
            const toast = new bootstrap.Toast(toastEl, { delay: 5000 });
            toast.show();
        }
    }

    // Function to handle form submission
    function handleSubmit(formSelector, endpoint) {
        const form = document.querySelector(formSelector);
        if (!form) return;

        form.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent default form submission

            const formData = new FormData(form);
            const jsonObject = {};

            formData.forEach((value, key) => {
                jsonObject[key] = value;
            });

            fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jsonObject), // Sending as JSON
            })
            .then(response => {
                if (response.status === 400) {
                    throw new Error("All fields are required.");
                }
                return response.json();
            })
            .then(data => {
                showToast("✅ Message sent successfully! We will contact you soon.");
                console.log("Success:", data);
                form.reset(); // Clear the form after submission
            })
            .catch(error => {
                showToast("⚠️ All fields are required.", true); // Show error toast
                console.error("Error:", error);
            });
        });
    }

    // Contact Form
    handleSubmit("#contactForm", "http://localhost:8000/api/mail/contact");

    // Request a Call-Back Form
    handleSubmit("#callbackForm", "http://localhost:8000/api/mail/callback");

    //mail list
    handleSubmit("#maillist","http://localhost:8000/api/mail/subscribe")
});
