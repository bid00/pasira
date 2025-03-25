document.addEventListener("DOMContentLoaded", function () {
    const productsContainer = document.querySelector("#products"); // Adjusted to match your container ID
    const token = localStorage.getItem("accessToken");
    // Fetch products from backend
    fetch("http:localhost:8000/api/products/") // Update with your actual API endpoint
        .then(response => response.json())
        .then(products => {
            products.forEach(product => {
                const productCard = document.createElement("div");
                productCard.classList.add("swiper-slide");
                productCard.innerHTML = `
                    <div class="product-item image-zoom-effect link-effect">
                        <div class="image-holder position-relative">
                            <a href="index.html">
                                <img src="${product.picture}" alt="${product.name}" class="product-image img-fluid"/>
                            </a>
                            <div class="product-content">
                                <h5 class="text-uppercase fs-5 mt-3">
                                    <a href="index.html">${product.name}</a>
                                    <button class="add-to-cart btn btn-primary" data-id="${product.id}">+</button>
                                </h5>
                                <a href="#" class="text-decoration-none" data-after="Add to cart">
                                    <span>$${product.price.toFixed(2)}</span>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
                productsContainer.appendChild(productCard);
            });
        })
        .catch(error => console.error("Error fetching products:", error));

    // Add to Cart functionality
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("add-to-cart")) {
            const productId = event.target.getAttribute("data-id");
            
            fetch("http://localhost:8000/api/cart/add", {
                method: "POST",
                headers: { 
                    "Authorization":`${token}`,
                    "Content-Type": "application/json" },
                body: JSON.stringify({ productId,"quantity":"1" })
            })
            .then(response => {
                if (response.status===401) {
                    window.location.href="./auth.html";
                }
                response.json()})
            .then(() => {
                showPopover("Item added successfully!", true);
            })
            .catch(() => showPopover("Failed to add item.", false));
        }
    });function showPopover(message, success) {
        // Check if popover exists, if not, create it
        let popover = document.getElementById("popover");
        if (!popover) {
            popover = document.createElement("div");
            popover.id = "popover";
            document.body.appendChild(popover);
        }
    
        // Set inner content and Bootstrap classes
        popover.innerHTML = `
            <div class="d-flex align-items-center">
                <span>${message}</span>
                <a href="./cart.html" class="btn btn-sm btn-light ms-3">Go to Cart</a>
            </div>
        `;
    
        // Apply Bootstrap styling
        popover.className = `toast align-items-center text-white ${success ? "bg-success" : "bg-danger"} show`;
    
        // Force visibility
        popover.style.position = "fixed";
        popover.style.bottom = "20px";
        popover.style.right = "20px";
        popover.style.padding = "15px";
        popover.style.borderRadius = "8px";
        popover.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
        popover.style.zIndex = "1050";
    
        // Auto-hide after 3 seconds
        setTimeout(() => {
            popover.classList.remove("show");
            setTimeout(() => {
                if (popover) popover.remove();
            }, 10000);
        }, 10000);
    }
      
});
