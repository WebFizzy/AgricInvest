document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.classList.add("js-enabled");

  if (window.lucide) {
    window.lucide.createIcons();
  }

  const header = document.getElementById("header");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileNav = document.getElementById("mobileNav");

  const setMenuOpen = (isOpen) => {
    mobileNav?.classList.toggle("open", isOpen);
    mobileMenuBtn?.setAttribute("aria-expanded", String(isOpen));
    mobileMenuBtn?.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation",
    );

    if (mobileMenuBtn) {
      mobileMenuBtn.innerHTML = isOpen
        ? '<i data-lucide="x"></i>'
        : '<i data-lucide="menu"></i>';
      window.lucide?.createIcons();
    }
  };

  mobileMenuBtn?.addEventListener("click", () => {
    const isOpen = mobileMenuBtn.getAttribute("aria-expanded") !== "true";
    setMenuOpen(isOpen);
  });

  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("click", (event) => {
    if (
      mobileNav?.classList.contains("open") &&
      mobileMenuBtn &&
      !mobileNav.contains(event.target) &&
      !event.composedPath().includes(mobileMenuBtn)
    ) {
      setMenuOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileNav?.classList.contains("open")) {
      setMenuOpen(false);
      mobileMenuBtn?.focus();
    }
  });

  const updateHeader = () => {
    header?.classList.toggle("scrolled", window.scrollY > 30);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const revealItems = document.querySelectorAll(".about-reveal");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const year = document.getElementById("currentYear");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterEmail = document.getElementById("newsletterEmail");
  const newsletterMessage = document.getElementById("newsletterMessage");

  newsletterForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (
      !(newsletterEmail instanceof HTMLInputElement) ||
      !(newsletterMessage instanceof HTMLElement)
    ) {
      return;
    }

    if (!newsletterEmail.value.trim() || !newsletterEmail.validity.valid) {
      newsletterMessage.textContent = "Please enter a valid email address.";
      newsletterMessage.style.color = "#ffb4b4";
      newsletterEmail.focus();
      return;
    }

    newsletterMessage.textContent =
      "Thanks for your interest. Newsletter sign-up is not connected yet.";
    newsletterMessage.style.color = "#80e5a3";
    newsletterForm.reset();
  });
});
