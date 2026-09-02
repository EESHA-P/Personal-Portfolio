(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     CONFIG — edit these values, do not touch markup elsewhere.
     ------------------------------------------------------------------ */
  var REPOS = [
    {
      name: "Fed-Fusion-T",
      description: "Federated CNN\u2013Transformer framework for MRI tumor classification.",
      language: "Python",
      url: "PASTE_GITHUB_URL_HERE" // <-- replace with the real repository URL
    },
    {
      name: "Code Review Assistant",
      description: "AI-powered static analysis tool with a FastAPI backend.",
      language: "Python",
      url: "PASTE_GITHUB_URL_HERE" // <-- replace with the real repository URL
    },
    {
      name: "Smart Parking & Traffic Control",
      description: "Simulated IoT parking system with predictive availability.",
      language: "Python",
      url: "PASTE_GITHUB_URL_HERE" // <-- replace with the real repository URL
    },
    {
      name: "Voice Assistant AI",
      description: "Real-time speech-to-speech assistant using the ElevenLabs API.",
      language: "Python",
      url: "PASTE_GITHUB_URL_HERE" // <-- replace with the real repository URL
    }
  ];

  var PROJECT_DETAILS = {
    fedfusion: {
      title: "Fed-Fusion-T",
      subtitle: "Federated CNN\u2013Transformer Framework for Medical Imaging Classification",
      problem: "Training strong medical-imaging models usually requires pooling patient scans from multiple hospitals into one central dataset \u2014 which raises data-privacy and governance concerns.",
      solution: "Fed-Fusion-T fuses two CNN backbones (ResNet101V2 + MobileNetV2) with a Transformer encoder, trained across simulated clients using federated averaging (FedAvg) so raw patient data never leaves its source.",
      pipeline: ["MRI Input", "\u2193 Preprocessing", "\u2193 ResNet101V2 + MobileNetV2", "\u2193 Feature Fusion", "\u2193 Transformer Encoder", "\u2193 Classification Head", "\u2193 4 Tumor Classes"],
      federated: ["Client 1 \u2500\u2510", "Client 2 \u2500\u2524", "Client 3 \u2500\u253C\u2192 FedAvg \u2192 Global Model", "Client 4 \u2500\u2524", "Client 5 \u2500\u2518"],
      metrics: [
        { label: "Accuracy \u2014 Brain Tumor MRI", value: "92.75%" },
        { label: "AUC-ROC \u2014 Brain Tumor MRI", value: "97.93%" },
        { label: "Accuracy \u2014 BRISC", value: "95.50%" },
        { label: "AUC-ROC \u2014 BRISC", value: "98.90%" }
      ],
      dataset: "9,388 MRI images across the Figshare, SARTAJ and Br35H datasets, plus the BRISC dataset, classified into glioma, meningioma, pituitary, and no-tumor.",
      learned: "Ran a 7-configuration ablation study (centralized vs. federated, single- vs. dual-backbone, with/without Transformer) with confusion-matrix and ROC analysis to isolate what each architectural choice actually contributed \u2014 the attention mechanism alone improved F1-score by 2\u20133% over CNN-only federated baselines.",
      github: "PASTE_GITHUB_URL_HERE"
    },
    codereview: {
      title: "Code Review Assistant",
      subtitle: "AI-Powered Static Analysis Tool",
      problem: "Getting fast, structured feedback on code quality \u2014 readability, modularity, bug risk \u2014 usually means waiting on a human reviewer or running several disconnected linting tools.",
      solution: "A full-stack FastAPI application that sends uploaded source code to a Hugging Face-hosted LLM, scores it 1\u201310 across three dimensions, and returns categorized, actionable suggestions through a drag-and-drop web dashboard.",
      pipeline: ["Code Upload", "\u2193 FastAPI Backend", "\u2193 LLM Scoring (readability / modularity / bug risk)", "\u2193 SQLite Review History", "\u2193 Dashboard Results"],
      federated: null,
      metrics: [
        { label: "Languages supported", value: "12" },
        { label: "Score scale", value: "1\u201310" }
      ],
      dataset: null,
      learned: "Designing a REST API around upload / list / retrieve review history taught me how to keep an LLM-backed feature predictable and inspectable rather than a black box \u2014 every score is stored and traceable back to the review that produced it.",
      github: "PASTE_GITHUB_URL_HERE"
    }
  };

  /* ------------------------------------------------------------------
     Scroll progress bar
     ------------------------------------------------------------------ */
  var progressBar = document.getElementById("scrollProgress");
  function updateProgress() {
    var h = document.documentElement;
    var scrolled = h.scrollTop;
    var height = h.scrollHeight - h.clientHeight;
    var pct = height > 0 ? (scrolled / height) * 100 : 0;
    progressBar.style.width = pct + "%";
  }
  document.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* ------------------------------------------------------------------
     Theme toggle (light / dark)
     ------------------------------------------------------------------ */
  var themeToggle = document.getElementById("themeToggle");
  themeToggle.addEventListener("click", function () {
    var current = document.documentElement.getAttribute("data-theme");
    var next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });

  /* ------------------------------------------------------------------
     Mobile nav toggle
     ------------------------------------------------------------------ */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  navToggle.addEventListener("click", function () {
    var isOpen = navLinks.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("is-open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ------------------------------------------------------------------
     Active nav link on scroll
     ------------------------------------------------------------------ */
  var sections = document.querySelectorAll("main .section, .hero");
  var navLinkEls = document.querySelectorAll(".nav-link");
  function setActiveLink() {
    var scrollPos = window.scrollY + 120;
    var currentId = "home";
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) currentId = sec.id;
    });
    navLinkEls.forEach(function (link) {
      var target = link.getAttribute("href").replace("#", "");
      link.classList.toggle("is-active", target === currentId);
    });
  }
  document.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  /* ------------------------------------------------------------------
     Scroll reveal
     ------------------------------------------------------------------ */
  var revealTargets = document.querySelectorAll(".section-inner > *, .project-card, .skill-card, .cert-card");
  revealTargets.forEach(function (el) { el.classList.add("reveal"); });

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ------------------------------------------------------------------
     Animated metric counters
     ------------------------------------------------------------------ */
  var counters = document.querySelectorAll(".metric-num");
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var isDecimal = String(target).indexOf(".") !== -1;
    if (prefersReducedMotion) {
      el.textContent = target + suffix;
      return;
    }
    var start = 0;
    var duration = 1100;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = start + (target - start) * eased;
      el.textContent = (isDecimal ? value.toFixed(2) : Math.round(value)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(animateCounter);
  }

  /* ------------------------------------------------------------------
     Project filtering
     ------------------------------------------------------------------ */
  var filterButtons = document.querySelectorAll(".filter-btn");
  var projectCards = document.querySelectorAll(".project-card");
  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterButtons.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      var filter = btn.getAttribute("data-filter");
      projectCards.forEach(function (card) {
        var match = filter === "all" || card.getAttribute("data-category") === filter;
        card.style.display = match ? "" : "none";
      });
    });
  });

  /* ------------------------------------------------------------------
     Project modal
     ------------------------------------------------------------------ */
  var modalOverlay = document.getElementById("modalOverlay");
  var modalContent = document.getElementById("modalContent");
  var modalClose = document.getElementById("modalClose");
  var lastFocused = null;

  function renderModal(key) {
    var d = PROJECT_DETAILS[key];
    if (!d) return;

    var pipelineHtml = d.pipeline.map(function (step) { return "<div>" + step + "</div>"; }).join("");
    var federatedHtml = d.federated
      ? '<div class="modal-section"><h4>Federated workflow</h4><div class="pipeline">' +
        d.federated.map(function (l) { return "<div>" + l + "</div>"; }).join("") +
        "</div></div>"
      : "";
    var metricsHtml = d.metrics.map(function (m) {
      return '<div class="metric"><span class="metric-num">' + m.value + '</span><span class="metric-label">' + m.label + "</span></div>";
    }).join("");
    var datasetHtml = d.dataset ? '<div class="modal-section"><h4>Dataset</h4><p>' + d.dataset + "</p></div>" : "";

    modalContent.innerHTML =
      '<h3 id="modalTitle">' + d.title + "</h3>" +
      '<p style="color:var(--text-muted); font-size:0.92rem;">' + d.subtitle + "</p>" +
      '<div class="modal-section"><h4>Problem</h4><p>' + d.problem + "</p></div>" +
      '<div class="modal-section"><h4>Solution</h4><p>' + d.solution + "</p></div>" +
      '<div class="modal-section"><h4>Architecture</h4><div class="pipeline">' + pipelineHtml + "</div></div>" +
      federatedHtml +
      '<div class="modal-section"><h4>Results</h4><div class="modal-metric-row">' + metricsHtml + "</div></div>" +
      datasetHtml +
      '<div class="modal-section"><h4>What I learned</h4><p>' + d.learned + "</p></div>" +
      '<div class="modal-section"><a class="btn btn-primary" href="' + d.github + '" target="_blank" rel="noopener">View on GitHub</a></div>';
  }

  function openModal(key) {
    lastFocused = document.activeElement;
    renderModal(key);
    modalOverlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    modalClose.focus();
  }
  function closeModal() {
    modalOverlay.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll("[data-open-modal]").forEach(function (btn) {
    btn.addEventListener("click", function () { openModal(btn.getAttribute("data-open-modal")); });
  });
  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", function (e) { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modalOverlay.classList.contains("is-open")) closeModal();
  });

  /* ------------------------------------------------------------------
     Repository cards (config-driven, graceful — no external API call
     is required; swap in a GitHub API fetch here if you want live
     stars/forks, with a try/catch fallback to this static config)
     ------------------------------------------------------------------ */
  var repoGrid = document.getElementById("repoGrid");
  if (repoGrid && REPOS.length) {
    repoGrid.innerHTML = REPOS.map(function (r) {
      return (
        '<div class="repo-card">' +
        '<p class="repo-name">' + r.name + "</p>" +
        '<p class="repo-desc">' + r.description + "</p>" +
        '<div class="repo-meta"><span>' + r.language + '</span><a href="' + r.url + '" target="_blank" rel="noopener">View \u2192</a></div>' +
        "</div>"
      );
    }).join("");
  }

  /* ------------------------------------------------------------------
     Back to top + footer year
     ------------------------------------------------------------------ */
  document.getElementById("backToTop").addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
  document.getElementById("year").textContent = new Date().getFullYear();
})();
