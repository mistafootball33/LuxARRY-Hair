/* LuxARRY Hair — PWA install prompt with per-device instructions */
(() => {
  "use strict";

  /* register service worker */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }

  /* skip if already installed / running standalone */
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;
  if (standalone) return;

  /* don't nag: snooze for 7 days after dismissal */
  const SNOOZE_KEY = "luxarry-install-snooze";
  const snoozedUntil = Number(localStorage.getItem(SNOOZE_KEY) || 0);
  if (Date.now() < snoozedUntil) return;

  /* platform detection */
  const ua = navigator.userAgent;
  const isIOS =
    /iPhone|iPad|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/.test(ua);

  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  const shareIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m8 7 4-4 4 4"/><rect x="4" y="11" width="16" height="10" rx="2"/></svg>';
  const menuIcon =
    '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>';
  const plusIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 9v6M9 12h6"/></svg>';

  const steps = (items) =>
    items
      .map(
        (s, i) =>
          `<li><span class="pwa__num">${i + 1}</span><span>${s}</span></li>`
      )
      .join("");

  const iosSteps = steps([
    `Tap the <strong>Share</strong> button ${shareIcon} in your browser bar`,
    `Scroll and tap <strong>Add to Home Screen</strong> ${plusIcon}`,
    `Tap <strong>Add</strong> — LuxARRY appears on your home screen 💗`
  ]);
  const androidSteps = steps([
    `Tap the <strong>menu</strong> button ${menuIcon} in Chrome`,
    `Tap <strong>Add to Home screen</strong> (or <strong>Install app</strong>)`,
    `Confirm — LuxARRY appears on your home screen 💗`
  ]);
  const desktopSteps = steps([
    `Look for the <strong>install icon</strong> ${plusIcon} in the address bar`,
    `Click it and choose <strong>Install</strong>`,
    `LuxARRY opens in its own window like a real app 💗`
  ]);

  /* build the popup */
  const wrap = document.createElement("div");
  wrap.className = "pwa";
  wrap.setAttribute("role", "dialog");
  wrap.setAttribute("aria-modal", "true");
  wrap.setAttribute("aria-label", "Install the LuxARRY Hair app");
  wrap.innerHTML = `
    <div class="pwa__backdrop" data-close></div>
    <div class="pwa__card">
      <button class="pwa__x" type="button" aria-label="Close" data-close>&times;</button>
      <img class="pwa__icon" src="img/icons/icon-192.png" alt="" width="72" height="72" />
      <h3 class="pwa__title">Get the <em>Lux</em>ARRY App</h3>
      <p class="pwa__sub">Add us to your home screen for one-tap access to new drops, deals &amp; hair inspo.</p>
      <div class="pwa__body"></div>
      <p class="pwa__later"><button type="button" data-close>Maybe later</button></p>
    </div>`;

  const body = wrap.querySelector(".pwa__body");

  const showSteps = () => {
    if (isIOS) {
      body.innerHTML = `<p class="pwa__how">On iPhone &amp; iPad:</p><ol class="pwa__steps">${iosSteps}</ol>`;
    } else if (isAndroid) {
      body.innerHTML = `<p class="pwa__how">On Android:</p><ol class="pwa__steps">${androidSteps}</ol>`;
    } else {
      body.innerHTML = `<p class="pwa__how">On your computer:</p><ol class="pwa__steps">${desktopSteps}</ol>`;
    }
  };

  const showInstallButton = () => {
    body.innerHTML = `<button class="btn btn--pink pwa__install" type="button">Install App</button>`;
    body.querySelector(".pwa__install").addEventListener("click", async () => {
      if (!deferredPrompt) return showSteps();
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      deferredPrompt = null;
      if (choice.outcome === "accepted") close(true);
      else showSteps();
    });
  };

  const close = (installed) => {
    wrap.classList.remove("pwa--in");
    setTimeout(() => wrap.remove(), 300);
    localStorage.setItem(
      SNOOZE_KEY,
      String(Date.now() + (installed ? 365 : 7) * 24 * 60 * 60 * 1000)
    );
  };

  wrap.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) close(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.contains(wrap)) close(false);
  });
  window.addEventListener("appinstalled", () => close(true));

  /* open after the visitor has settled in */
  setTimeout(() => {
    if (deferredPrompt) showInstallButton();
    else showSteps();
    document.body.appendChild(wrap);
    requestAnimationFrame(() => wrap.classList.add("pwa--in"));
  }, 6000);
})();
