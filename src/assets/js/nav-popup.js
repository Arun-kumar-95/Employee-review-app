const toggler = document.querySelector(".nav--toggler");
const nav = document.querySelector("nav.nav--wrapper");
let isOpen = false;
toggler.addEventListener("click", function (e) {
  e.preventDefault();
  toggler.classList.toggle("open");

  isOpen ? (nav.style.display = "none") : (nav.style.display = "block");
  isOpen = isOpen ? false : true;
});
