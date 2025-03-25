  document.addEventListener("DOMContentLoaded", async () => {
  const confirmBtn = document.getElementById("confirm-btn");
  const token = localStorage.getItem("accessToken");
    let totalAmount=0;
  // Fetch cart data
  
    try {
      const response = await fetch("http://localhost:8000/api/cart/", {
        method: "GET",
        headers: {
            "Authorization": `${token}`,
            "Content-Type": "application/json"
        }
    });
      if (!response.ok) throw new Error("Failed to fetch cart data");
      else if (response ===404) {
        document.getElementById("cart-items").innerHTML = "<p class='text-center text-gray-500 text-lg'>Your cart is empty.</p>";
        document.getElementById("total-price").textContent = "0 EGP";
      }

      const cart = await response.json();
      updateOrderSummary(cart.cart);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  // Update the order summary dynamically
  function updateOrderSummary(cart) {
    const orderSummary = document.getElementById("order-items-container"); 
    if (!orderSummary) return; // Ensure the container exists

    // Clear previous items
    orderSummary.innerHTML = "";

    if (!cart || !cart.items || cart.items.length === 0) {
      orderSummary.innerHTML = "<p>Your cart is empty.</p>";
      document.getElementById("subtotal").innerText = "0 EGP";
      document.getElementById("total").innerText = "3 EGP"; // Shipping Fee only
      return;
    }
    let total=0;
    cart.items.forEach(item => {
      const itemElement = document.createElement("div");
      itemElement.classList.add("flex", "gap-5", "items-center", "border-b", "py-4");
      itemElement.innerHTML = `
        <div class="order-item">
          <img src="${item.productId.picture || 'placeholder.jpg'}" alt="${item.productId.name}" class="product-image w-16 h-16 object-cover" />
          <p><strong>${item.productId.name}</strong></p>
          <p>Qty: ${item.quantity}</p>
          <p>Price: ${item.productId.price} EGP</p>
        </div>
      `;
      orderSummary.appendChild(itemElement);
      total += item.productId.price * item.quantity;
    });

    // Update totals
    document.getElementById("subtotal").innerText = `${total} EGP`;
    totalAmount = total+3
    document.getElementById("total").innerText = `${totalAmount} EGP`; // Including 3 EGP for shipping
}
console.log(totalAmount);

  // Place an order
  confirmBtn.addEventListener("click", async () => {
    const orderData = {
      email: document.getElementById("email").value,
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        city: document.getElementById("city").value,
        phone: document.getElementById("phone").value,
        country: document.getElementById("country").value,
        state: document.getElementById("state").value,
        zip: document.getElementById("zip").value,
        totalAmount:`${Number(totalAmount)}`,
        paymentMethod: "Cash on Delivery", // Change as needed
    };
    console.log(orderData);
    try {
      const response = await fetch("http://localhost:8000/api/orders/checkout", {
        method: "POST",
        headers: { 
          "Authorization": `${token}`,
          "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error("Order placement failed");

      const result = await response.json();
      console.log("Order placed:", result);
      window.location.href = "./confirmation.html"; // Redirect to payment page
    } catch (error) {
      console.error("Error placing order:", error);
    }
  });

});
