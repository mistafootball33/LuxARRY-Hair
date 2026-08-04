/* LuxARRY Hair — interactions */
(() => {
  "use strict";

  /* ----- mobile menu ----- */
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("siteNav");

  const closeMenu = () => {
    nav.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  /* ----- cart + toast ----- */
  const cartCount = document.getElementById("cartCount");
  const toast = document.getElementById("toast");
  let count = 0;
  let toastTimer;

  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  };

  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      count += 1;
      cartCount.textContent = count;
      cartCount.classList.remove("bump");
      void cartCount.offsetWidth; /* restart animation */
      cartCount.classList.add("bump");
      const name = btn.closest(".product")?.dataset.name || "Item";
      showToast(`${name} added to cart 💗`);
    });
  });

  /* ----- newsletter ----- */
  const form = document.getElementById("newsletterForm");
  const email = document.getElementById("newsletterEmail");
  const msg = document.getElementById("newsletterMsg");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!email.checkValidity()) {
      msg.textContent = "Please enter a valid email address.";
      msg.style.color = "#ff6fae";
      email.focus();
      return;
    }
    msg.textContent = "You're in! Check your inbox for 10% off. ✨";
    msg.style.color = "";
    form.reset();
  });

  /* ----- reveal on scroll ----- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }
})();
