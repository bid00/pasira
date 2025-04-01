// Tailwind CSS
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Lora", "serif"],
        serif: ["Arima", "serif"],
      },
      colors: {
        mainColor: "#1C257E",
        mainColorHover: "#1434CB",
        secondColor: "#9D9D9D",
        ground: "#F7F7F7",
        mainText: "#C1C1C1",
        error: "#E14B4B",
      },
    },
  },
};

// Toggle Mobile Menu
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

menuToggle.addEventListener("click", () =>
  mobileMenu.classList.toggle("hidden")
);

const logout = document.getElementById("logout");
logout.addEventListener("click",()=>{
  localStorage.removeItem("accessToken");
  document.cookie = "accessToken" + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
  window.location.href="./auth.html";
})
