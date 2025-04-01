    document.addEventListener("DOMContentLoaded", async () => {

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
        const token = localStorage.getItem("accessToken");

        try {
            const response = await fetch("http://localhost:8000/api/cart/", {
                method: "GET",
                headers: {
                    "Authorization": `${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 401) {
                const message = await response.json();
                showPopover(message.message + " please login again!",false);
                setTimeout(()=>window.location.href="./auth.html",2000);
                return;
            }else if (response.status === 404) {
                document.getElementById("cart-items").innerHTML = "<p class='text-center text-gray-500 text-lg'>Your cart is empty.</p>";
                document.getElementById("total-price").textContent = "0 EGP";
                return;
            }

            const data = await response.json();
            renderCart(data.cart);
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    });
    function renderCart(cart) {
        const cartContainer = document.getElementById("cart-content");
            cartContainer.innerHTML = "";
            let total = 0;

            if (!cart || cart.items.length === 0) {
                cartContainer.innerHTML = "<p class='text-center text-gray-500 text-lg'>Your cart is empty.</p>";
                document.getElementById("total-price").textContent = "0 EGP";
                return;
            }

            cart.items.forEach(item => {
                const itemElement = document.createElement("div");
                itemElement.classList.add("cart-item", "flex", "gap-5", "items-center", "border-b", "py-4");

                itemElement.innerHTML = `
                    <img src="${item.productId.picture}" alt="${item.productId.name}" class="w-16 h-16 object-cover rounded">
                    <div class="flex flex-col">
                        <h4 class="text-lg font-bold">${item.productId.name}</h4>
                        <p class="text-gray-600">${item.productId.price} EGP</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <button onclick="updateQuantity('${item.productId._id}', ${item.quantity - 1})" class="bg-red-500 text-white px-2 py-1 rounded">-</button>
                        <span class="px-3">${item.quantity}</span>
                        <button onclick="updateQuantity('${item.productId._id}', ${item.quantity + 1})" class="bg-green-500 text-white px-2 py-1 rounded">+</button>
                    </div>
                    <p class="font-semibold">${item.productId.price * item.quantity} EGP</p>
                    <button onclick="removeItem('${item.productId._id}')" class="text-red-500 hover:text-red-700">Remove</button>
                `;

                cartContainer.appendChild(itemElement);
                total += item.productId.price * item.quantity;
            });

            document.getElementById("total-price").textContent = `${total} EGP`;
        }

    async function updateQuantity(productId, quantity) {
        if (quantity < 1) 
            return;
        const token = localStorage.getItem("accessToken");
        try {
            const response = await fetch("http://localhost:8000/api/cart/update-quantity", {
                method: "POST",
                headers: {
                    "Authorization": `${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ productId, quantity })
            });

            if (response.status === 401) {
                const message = await response.json();
                showPopover(message.message + " please login again!",false);
                setTimeout(()=>window.location.href="./auth.html",2000);
                return;
            }

            const data = await response.json();
            renderCart(data.cart);
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    }

    async function removeItem(productId) {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await fetch("http://localhost:8000/api/cart/remove", {
                method: "POST",
                headers: {
                    "Authorization": `${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ productId })
            });

            if (response.status === 401) {
                const message = await response.json();
                showPopover(message.message + " please login again!",false);
                setTimeout(()=>window.location.href="./auth.html",2000);
                return;
            }

            const data = await response.json();
            renderCart(data.cart);
        } catch (error) {
            console.error("Error removing item:", error);
        }
    }

