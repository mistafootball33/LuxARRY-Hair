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
      const name = btn.closest("[data-name]")?.dataset.name || "Item";
      showToast(`${name} added to cart 💗`);
    });
  });

  /* ----- newsletter forms (footer + modal) ----- */
  document.querySelectorAll(".js-newsletter").forEach((form) => {
    const email = form.querySelector('input[type="email"]');
    const msg = form.querySelector('[role="status"]');
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!email.checkValidity()) {
        msg.textContent = "Please enter a valid email address.";
        email.focus();
        return;
      }
      msg.textContent = "You're in! Check your inbox. ✨";
      form.reset();
      if (form.closest(".mailmodal")) {
        localStorage.setItem("luxarry-mail-snooze", String(Date.now() + 365 * 864e5));
        setTimeout(closeMailModal, 1400);
      }
    });
  });

  /* ----- mailing-list modal ----- */
  const mailModal = document.getElementById("mailModal");

  const closeMailModal = () => {
    if (!mailModal || mailModal.hidden) return;
    mailModal.hidden = true;
    if (!localStorage.getItem("luxarry-mail-snooze") || Number(localStorage.getItem("luxarry-mail-snooze")) < Date.now()) {
      localStorage.setItem("luxarry-mail-snooze", String(Date.now() + 7 * 864e5));
    }
  };

  if (mailModal) {
    const snoozed = Number(localStorage.getItem("luxarry-mail-snooze") || 0) > Date.now();
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    if (!snoozed && !standalone) {
      setTimeout(() => { mailModal.hidden = false; }, 1500);
    }
    mailModal.addEventListener("click", (e) => {
      if (e.target.closest("[data-mail-close]")) closeMailModal();
    });
  }

  /* ----- Acuity booking modal ----- */
  const bookModal = document.getElementById("bookModal");
  const bookBody = document.getElementById("bookModalBody");
  let acuityLoaded = false;

  const openBookModal = () => {
    if (!bookModal) return;
    const url = bookModal.dataset.acuityUrl || "";
    if (!acuityLoaded) {
      if (!url || url.includes("YOUR-ACUITY")) {
        bookBody.innerHTML =
          '<div class="bookmodal__setup">' +
          "<p><strong>Online booking is almost ready!</strong></p>" +
          "<p>DM us on Instagram <strong>@LUXARRYHAIR</strong> or email " +
          '<a href="mailto:hello@luxarryhair.com">hello@luxarryhair.com</a> to book your appointment today.</p>' +
          "</div>";
      } else {
        bookBody.innerHTML =
          '<iframe class="bookmodal__frame" src="' + url +
          '" title="Schedule an appointment with LuxARRY Hair" loading="eager"></iframe>';
      }
      acuityLoaded = true;
    }
    bookModal.hidden = false;
    document.body.style.overflow = "hidden";
  };

  const closeBookModal = () => {
    if (!bookModal || bookModal.hidden) return;
    bookModal.hidden = true;
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".js-book").forEach((el) =>
    el.addEventListener("click", (e) => {
      e.preventDefault();
      closeMenu();
      openBookModal();
    })
  );
  if (bookModal) {
    bookModal.addEventListener("click", (e) => {
      if (e.target.closest("[data-book-close]")) closeBookModal();
    });
  }

  /* ----- escape closes menu + modals ----- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeMenu(); closeMailModal(); closeBookModal(); }
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
