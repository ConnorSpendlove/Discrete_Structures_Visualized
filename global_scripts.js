document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("overlay");
  const closeBtn = document.getElementById("closeBtn");

  if (!hamburger || !mobileMenu) return;

  const openMenu = () => {
    mobileMenu.classList.add("open");
    overlay.classList.add("show");
    hamburger.classList.add("active");
  };

  const closeMenu = () => {
    mobileMenu.classList.remove("open");
    overlay.classList.remove("show");
    hamburger.classList.remove("active");
  };

  hamburger.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);
});
