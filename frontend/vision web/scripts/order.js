document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "http://localhost:8000/api/orders/";
  const accessToken = localStorage.getItem("accessToken");
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
  const headers = {
    "Content-Type": "application/json",
    Authorization: `${accessToken}`,
  };

  const tableBody = document.querySelector("tbody");
  //@desc get the username
  fetch("http://localhost:8000/api/user/getprofile", { headers })
  .then((response) =>{
    if (response.status === 401) {
      response.json().then((data)=>{showPopover(data.message + " please login again!",false);})
      setTimeout(()=>window.location.href="./auth.html",2000);
      return;
    }
    return response.json()
  })
  .then((data) => {
    name.innerHTML = data.fullName || "";
  }).catch((error) => console.error("Error fetching profile:", error));
  
  async function fetchOrders() {
    try {
      const response = await fetch(apiUrl, { headers });
  
      if (response.status === 404) {
        tableBody.innerHTML = "<tr><td colspan='4' class='p-4 text-center'>No orders yet.</td></tr>";
        return;
      }
      if (response.status === 401) {
        const message = await response.json();
        showPopover(message.message + " please login again!",false);
        setTimeout(()=>window.location.href="./auth.html",2000);
        return;
      }
  
      const data = await response.json();
      const orders = data.orders;
      console.log(data)
      tableBody.innerHTML = ""; // Clear static content
      console.log(orders);
  
      if (orders.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='4' class='p-4 text-center'>No orders yet.</td></tr>";
        return;
      }
  
      orders.forEach((order) => {
        const row = document.createElement("tr");
        row.classList.add("border-b", "border-b-mainText", "text-secondColor");
  
        row.innerHTML = `
          <td class="p-4">#${order.orderNumber}</td>
          <td class="p-4">${order.totalAmount} EGP</td>
          <td class="p-4">${new Date(order.date).toLocaleDateString()}</td>
          <td class="text-mainColor flex items-center justify-center">
            <button class="p-4 flex items-center gap-2 text-sm font-medium">
              ${order.status}
              <span>
                <svg width="9" height="12" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.16256 1.08669L8.41256 7.33669C8.49996 7.42379 8.56931 7.52728 8.61663 7.64124C8.66394 7.75519 8.6883 7.87737 8.6883 8.00075C8.6883 8.12414 8.66394 8.24632 8.61663 8.36027C8.56931 8.47423 8.49996 8.57772 8.41256 8.66482L2.16256 14.9148C1.98644 15.0909 1.74757 15.1899 1.4985 15.1899C1.24943 15.1899 1.01056 15.0909 0.834439 14.9148C0.658318 14.7387 0.559375 14.4998 0.559375 14.2508C0.559375 14.0017 0.658318 13.7628 0.834439 13.5867L6.42116 7.99997L0.833658 2.41326C0.657538 2.23713 0.558594 1.99826 0.558594 1.74919C0.558594 1.50012 0.657538 1.26125 0.833658 1.08513C1.00978 0.90901 1.24865 0.810064 1.49772 0.810064C1.74679 0.810064 1.98566 0.90901 2.16178 1.08513L2.16256 1.08669Z" fill="${order.status === 'Delivered' ? '#9D9D9D' : '#1C257E'}"/>
                </svg>
              </span>
            </button>
          </td>
        `;
  
        tableBody.appendChild(row);
      });
  
    } catch (error) {
      console.error("Error fetching orders:", error);
      tableBody.innerHTML = "<tr><td colspan='4' class='p-4 text-center text-red-500'>Failed to load orders.</td></tr>";
    }
  }
  fetchOrders();
});