/* ==========================================
   AGRILEDGER - MAIN JAVASCRIPT
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }

  /* ======================================
       PRELOADER
    ====================================== */

  const preloader = document.getElementById("preloader");

  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader?.classList.add("hide");
    }, 500);
  });

  // Fallback
  setTimeout(() => {
    preloader?.classList.add("hide");
  }, 2500);

  /* ======================================
       CURRENT YEAR
    ====================================== */

  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* ======================================
       STICKY HEADER
    ====================================== */

  const header = document.getElementById("header");

  function updateHeader() {
    if (!header) return;

    if (window.scrollY > 30) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", updateHeader);

  updateHeader();

  /* ======================================
       MOBILE NAVIGATION
    ====================================== */

  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileNav = document.getElementById("mobileNav");

  function closeMobileMenu() {
    mobileNav?.classList.remove("open");

    mobileMenuBtn?.setAttribute("aria-expanded", "false");

    if (mobileMenuBtn) {
      mobileMenuBtn.innerHTML = '<i data-lucide="menu"></i>';
    }

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  mobileMenuBtn?.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("open");

    mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));

    mobileMenuBtn.innerHTML = isOpen
      ? '<i data-lucide="x"></i>'
      : '<i data-lucide="menu"></i>';

    if (window.lucide) {
      lucide.createIcons();
    }
  });

  // Close menu after clicking a navigation link

  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // Close menu after clicking outside

  document.addEventListener("click", (event) => {
    if (
      mobileNav &&
      mobileMenuBtn &&
      mobileNav.classList.contains("open") &&
      !mobileNav.contains(event.target) &&
      !event.composedPath().includes(mobileMenuBtn)
    ) {
      closeMobileMenu();
    }
  });

  /* ======================================
       LIVE TICKER
    ====================================== */

  const tickerTrack = document.getElementById("tickerTrack");

  if (tickerTrack) {
    // Duplicate the ticker items for continuous scrolling.

    const originalItems = tickerTrack.innerHTML;

    tickerTrack.innerHTML = originalItems + originalItems;
  }

  /* ======================================
       HERO INVESTMENT SIMULATOR
    ====================================== */

  const heroAmount = document.getElementById("heroAmount");
  const heroReturn = document.getElementById("heroReturn");

  function updateHeroCalculator() {
    if (!heroAmount || !heroReturn) return;

    let amount = parseFloat(heroAmount.value);

    if (isNaN(amount) || amount < 0) {
      amount = 0;
    }

    const annualRate = 8;

    const projectedReturn = amount * (1 + annualRate / 100);

    heroReturn.textContent = projectedReturn.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  heroAmount?.addEventListener("input", updateHeroCalculator);

  updateHeroCalculator();

  /* ======================================
       PORTFOLIO FILTER
    ====================================== */

  const filterButtons = document.querySelectorAll(".filter-btn");

  const portfolioCards = document.querySelectorAll(".portfolio-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove previous active state

      filterButtons.forEach((btn) => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      const filter = button.dataset.filter;

      portfolioCards.forEach((card) => {
        const category = card.dataset.category;

        const matches = filter === "all" || category === filter;

        if (matches) {
          card.classList.remove("hide-card");
        } else {
          card.classList.add("hide-card");
        }
      });
    });
  });

  /* ======================================
       MAIN ROI CALCULATOR
    ====================================== */

  const investmentAmount = document.getElementById("investmentAmount");

  const investmentSlider = document.getElementById("investmentSlider");

  const annualRate = document.getElementById("annualRate");

  const investmentDuration = document.getElementById("investmentDuration");

  const projectedValue = document.getElementById("projectedValue");

  const initialInvestment = document.getElementById("initialInvestment");

  const estimatedProfit = document.getElementById("estimatedProfit");

  const periodResult = document.getElementById("periodResult");

  const rateResult = document.getElementById("rateResult");

  const principalBar = document.getElementById("principalBar");

  const growthBar = document.getElementById("growthBar");

  const rateButtons = document.querySelectorAll(".rate-btn");

  // Currency formatting

  function formatCurrency(value) {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  // Calculate simple-interest projection

  function calculateInvestment() {
    if (
      !investmentAmount ||
      !investmentSlider ||
      !annualRate ||
      !investmentDuration
    ) {
      return;
    }

    let principal = parseFloat(investmentAmount.value);

    let rate = parseFloat(annualRate.value);

    let months = parseInt(investmentDuration.value);

    if (isNaN(principal) || principal < 0) {
      principal = 0;
    }

    if (isNaN(rate) || rate < 0) {
      rate = 0;
    }

    if (rate > 100) {
      rate = 100;
    }

    if (isNaN(months) || months < 1) {
      months = 12;
    }

    // Keep the slider within its supported range.

    const sliderMin = Number(investmentSlider.min);

    const sliderMax = Number(investmentSlider.max);

    investmentSlider.value = Math.min(
      sliderMax,
      Math.max(sliderMin, principal),
    );

    // Simple interest formula:
    // Interest = Principal x Annual Rate x Time

    const time = months / 12;

    const profit = principal * (rate / 100) * time;

    const total = principal + profit;

    // Update output values

    projectedValue.textContent = formatCurrency(total);

    initialInvestment.textContent = formatCurrency(principal);

    estimatedProfit.textContent = "+" + formatCurrency(profit);

    periodResult.textContent = months + " Months";

    rateResult.textContent = rate + "%";

    // Update visualization

    const principalPercentage = total > 0 ? (principal / total) * 100 : 0;

    const growthPercentage = total > 0 ? (profit / total) * 100 : 0;

    principalBar.style.width = principalPercentage + "%";

    growthBar.style.width = growthPercentage + "%";

    // Update rate buttons

    rateButtons.forEach((button) => {
      const buttonRate = Number(button.dataset.rate);

      button.classList.toggle("active", buttonRate === rate);
    });
  }

  // Amount input

  investmentAmount?.addEventListener("input", () => {
    calculateInvestment();
  });

  // Slider input

  investmentSlider?.addEventListener("input", () => {
    investmentAmount.value = investmentSlider.value;

    calculateInvestment();
  });

  // Annual rate input

  annualRate?.addEventListener("input", calculateInvestment);

  // Duration input

  investmentDuration?.addEventListener("change", calculateInvestment);

  // Quick rate selection

  rateButtons.forEach((button) => {
    button.addEventListener("click", () => {
      annualRate.value = button.dataset.rate;

      calculateInvestment();
    });
  });

  calculateInvestment();

  /* ======================================
       MODAL SYSTEM
    ====================================== */

  const modals = document.querySelectorAll(".modal");

  let lastFocusedElement = null;

  function openModal(modalId) {
    const modal = document.getElementById(modalId);

    if (!modal) return;

    // Close other modals first.

    modals.forEach((item) => {
      item.classList.remove("show");
    });

    lastFocusedElement = document.activeElement;

    modal.classList.add("show");

    document.body.classList.add("modal-open");

    const focusable = modal.querySelector("button, input, select, textarea");

    focusable?.focus();
  }

  function closeModal(modal) {
    if (!modal) return;

    modal.classList.remove("show");

    const anotherModalOpen = [...modals].some((item) =>
      item.classList.contains("show"),
    );

    if (!anotherModalOpen) {
      document.body.classList.remove("modal-open");

      lastFocusedElement?.focus();
    }
  }

  // Open modal buttons

  document.querySelectorAll("[data-open-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      const modalId = button.dataset.openModal;

      openModal(modalId);

      closeMobileMenu();
    });
  });

  // Close modal buttons and overlays

  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      closeModal(button.closest(".modal"));
    });
  });

  // Escape key

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      modals.forEach((modal) => {
        if (modal.classList.contains("show")) {
          closeModal(modal);
        }
      });
    }
  });

  /* ======================================
       INVESTMENT DETAILS MODAL
    ====================================== */

  const investmentTitle = document.getElementById("investmentTitle");

  const investmentDescription = document.getElementById(
    "investmentDescription",
  );

  document.querySelectorAll(".invest-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const portfolioName = button.dataset.invest;

      investmentTitle.textContent = portfolioName;

      investmentDescription.textContent =
        "Explore the details of " +
        portfolioName +
        ". This is an illustrative portfolio example. " +
        "Actual investment documentation, asset verification, " +
        "pricing, eligibility and risks would need to be provided " +
        "before any real investment could be made.";

      openModal("investmentModal");
    });
  });

  /* ======================================
       INVESTMENT PLAN SELECTION
    ====================================== */

  document.querySelectorAll(".plan-select").forEach((button) => {
    button.addEventListener("click", () => {
      const selectedPlan = button.dataset.plan;

      investmentTitle.textContent = selectedPlan;

      investmentDescription.textContent =
        "You selected the " +
        selectedPlan +
        ". This plan is a frontend demonstration. " +
        "Actual subscription and payment processing have not been configured.";

      openModal("investmentModal");
    });
  });

  /* ======================================
       LOGIN FORM
    ====================================== */

  const loginForm = document.getElementById("loginForm");

  const loginMessage = document.getElementById("loginMessage");

  loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();

    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
      loginMessage.textContent = "Please complete all fields.";

      return;
    }

    loginMessage.textContent =
      "Demo only: Authentication is not connected. No account has been accessed.";

    loginMessage.style.color = "#159447";
  });

  /* ======================================
       WALLET CONNECTION SIMULATION
    ====================================== */

  const walletButtons = document.querySelectorAll(".wallet-option");

  const walletMessage = document.getElementById("walletMessage");

  walletButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const walletName = button.dataset.wallet;

      walletMessage.style.color = "#159447";

      walletMessage.textContent =
        walletName +
        " selected. This demonstration does not connect to a real wallet.";

      // No provider request, signing or transaction is performed.
    });
  });

  /* ======================================
       FAQ ACCORDION
    ====================================== */

  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question?.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all accordion items

      faqItems.forEach((faq) => {
        faq.classList.remove("active");

        faq
          .querySelector(".faq-question")
          ?.setAttribute("aria-expanded", "false");
      });

      // Open selected item

      if (!isActive) {
        item.classList.add("active");

        question.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ======================================
       VIDEO DEMO
    ====================================== */

  const videoPlayBtn = document.getElementById("videoPlayBtn");

  videoPlayBtn?.addEventListener("click", () => {
    openModal("demoModal");
  });

  /* ======================================
       NEWSLETTER VALIDATION
    ====================================== */

  const newsletterForm = document.getElementById("newsletterForm");

  const newsletterEmail = document.getElementById("newsletterEmail");

  const newsletterMessage = document.getElementById("newsletterMessage");

  newsletterForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = newsletterEmail.value.trim();

    if (!email) {
      newsletterMessage.textContent = "Please enter your email address.";

      newsletterMessage.style.color = "#ffb4b4";

      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      newsletterMessage.textContent = "Please enter a valid email address.";

      newsletterMessage.style.color = "#ffb4b4";

      return;
    }

    newsletterMessage.textContent =
      "Thank you! The newsletter interface is working. Connect a mailing service to save subscriptions.";

    newsletterMessage.style.color = "#80e5a3";

    newsletterForm.reset();
  });

  /* ======================================
       SIMULATED ACTIVITY FEED
    ====================================== */

  const activityFeed = document.getElementById("activityFeed");

  const activityExamples = [
    {
      message: "Sample portfolio view: Premium Corn Farmland.",
      time: "DEMO",
    },

    {
      message: "Sample portfolio view: Smart Hydroponic Farm.",
      time: "DEMO",
    },

    {
      message: "Sample market update: Agricultural commodities.",
      time: "DEMO",
    },

    {
      message: "Sample portfolio view: Premium Cattle Portfolio.",
      time: "DEMO",
    },

    {
      message: "Sample platform event: Investment calculator opened.",
      time: "DEMO",
    },
  ];

  let activityIndex = 0;

  function updateActivityFeed() {
    if (!activityFeed) return;

    const activity = activityExamples[activityIndex];

    activityFeed.innerHTML = `

            <div class="activity-item">

                <i data-lucide="activity"></i>

                <span>${activity.message}</span>

                <small>${activity.time}</small>

            </div>

        `;

    if (window.lucide) {
      lucide.createIcons();
    }

    activityIndex++;

    if (activityIndex >= activityExamples.length) {
      activityIndex = 0;
    }
  }

  // Start simulated feed

  updateActivityFeed();

  setInterval(updateActivityFeed, 7000);

  /* ======================================
       TOAST NOTIFICATIONS
    ====================================== */

  const toastContainer = document.getElementById("toastContainer");

  function showToast(message, icon = "check-circle") {
    if (!toastContainer) return;

    const toast = document.createElement("div");

    toast.className = "toast";

    const iconElement = document.createElement("i");

    iconElement.setAttribute("data-lucide", icon);

    const textElement = document.createElement("span");

    textElement.textContent = message;

    toast.appendChild(iconElement);

    toast.appendChild(textElement);

    toastContainer.appendChild(toast);

    if (window.lucide) {
      lucide.createIcons();
    }

    setTimeout(() => {
      toast.classList.add("remove");

      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4000);
  }

  // Example: notify users when they select a portfolio.

  document.querySelectorAll(".invest-btn").forEach((button) => {
    button.addEventListener("click", () => {
      showToast("Portfolio information opened.", "info");
    });
  });

  /* ======================================
       LEGAL INFORMATION MODAL
    ====================================== */

  const legalTitle = document.getElementById("legalTitle");

  const legalDescription = document.getElementById("legalDescription");

  const legalContent = {
    "Privacy Policy":
      "Your privacy policy should explain what personal information is collected, why it is collected, how it is stored, how it is protected and how users can exercise their privacy rights.",

    "Terms of Service":
      "Your terms of service should describe platform usage, account responsibilities, eligibility, payment conditions, limitations and applicable dispute procedures.",

    "Risk Disclosure":
      "Agricultural investments can involve loss of capital, weather events, crop failures, commodity volatility, operational risks, regulatory changes and liquidity limitations. No returns are guaranteed.",

    "Cookie Policy":
      "Your cookie policy should explain the cookies and tracking technologies used by the platform and how users can manage their preferences.",
  };

  document.querySelectorAll(".legal-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const title = link.dataset.legal;

      legalTitle.textContent = title;

      legalDescription.textContent = legalContent[title] || "";

      openModal("legalModal");
    });
  });

  /* ======================================
       BACK TO TOP
    ====================================== */

  const backToTop = document.getElementById("backToTop");

  function updateBackToTop() {
    if (window.scrollY > 500) {
      backToTop?.classList.add("show");
    } else {
      backToTop?.classList.remove("show");
    }
  }

  window.addEventListener("scroll", updateBackToTop);

  updateBackToTop();

  backToTop?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  /* ======================================
       SCROLL REVEAL ANIMATIONS
    ====================================== */

  const revealElements = document.querySelectorAll(
    ".section-heading, " +
      ".intro-content, " +
      ".intro-image-wrapper, " +
      ".how-image, " +
      ".how-content, " +
      ".market-card, " +
      ".feature-card, " +
      ".portfolio-card, " +
      ".plan-card, " +
      ".project-card, " +
      ".testimonial-card, " +
      ".impact-content, " +
      ".impact-image, " +
      ".faq-item",
  );

  revealElements.forEach((element) => {
    element.classList.add("reveal");
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");

            observerInstance.unobserve(entry.target);
          }
        });
      },

      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px",
      },
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  /* ======================================
       CLOSE MOBILE MENU ON RESIZE
    ====================================== */

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });

  /* ======================================
       INITIALIZE COMPLETE
    ====================================== */

  console.log(
    "%cAgriLedger Frontend Initialized",
    "color:#159447;font-size:16px;font-weight:bold;",
  );

  console.log(
    "Demo mode: No real investments, payments, wallets, accounts or market feeds are connected.",
  );
});
