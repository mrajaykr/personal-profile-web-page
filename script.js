const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("#navLinks");
const themeButton = document.querySelector(".theme-toggle");
const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
const modal = document.querySelector("#projectModal");
const modalTitle = document.querySelector("#modalTitle");
const modalDetails = document.querySelector("#modalDetails");
const modalClose = document.querySelector(".modal-close");
const contactForm = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");
const backToTop = document.querySelector(".back-to-top");
const skillBars = document.querySelectorAll(".skill-bar span");
const counters = document.querySelectorAll("[data-count]");
const revealItems = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("main section[id]");
const navItems = document.querySelectorAll(".nav-links a");

document.querySelector("#year").textContent = new Date().getFullYear();

const savedTheme = localStorage.getItem("portfolioTheme");
if (savedTheme === "dark") {
  document.body.classList.add("dark-theme");
  themeButton.textContent = "Dark";
}

menuButton.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  document.body.classList.toggle("menu-open", isOpen);
  menuButton.setAttribute("aria-expanded", isOpen);
});

navItems.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

themeButton.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-theme");
  themeButton.textContent = isDark ? "Dark" : "Light";
  localStorage.setItem("portfolioTheme", isDark ? "dark" : "light");
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hide", !shouldShow);
    });
  });
});

projectCards.forEach((card) => {
  const detailButton = card.querySelector(".text-button");

  detailButton.addEventListener("click", () => {
    modalTitle.textContent = card.dataset.title;
    modalDetails.textContent = card.dataset.details;
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  });
});

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const message = document.querySelector("#message").value.trim();

  if (!name || !email || !message) {
    formStatus.textContent = "Please fill in all fields.";
    formStatus.style.color = "var(--warm)";
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    formStatus.textContent = "Please enter a valid email address.";
    formStatus.style.color = "var(--warm)";
    return;
  }

  formStatus.textContent = `Thanks, ${name}. Your message is ready to send.`;
  formStatus.style.color = "var(--accent)";
  contactForm.reset();
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("show", window.scrollY > 500);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.14 });

revealItems.forEach((item) => revealObserver.observe(item));

const skillsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      skillBars.forEach((bar) => {
        bar.style.width = `${bar.dataset.level}%`;
      });
      skillsObserver.disconnect();
    }
  });
}, { threshold: 0.35 });

skillsObserver.observe(document.querySelector("#skills"));

function animateCounter(counter) {
  const target = Number(counter.dataset.count);
  const duration = 900;
  const startTime = performance.now();

  function update(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    counter.textContent = Math.floor(progress * target);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      counter.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      counters.forEach(animateCounter);
      counterObserver.disconnect();
    }
  });
}, { threshold: 0.45 });

counterObserver.observe(document.querySelector(".quick-stats"));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const activeId = entry.target.id;
      navItems.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
      });
    }
  });
}, { rootMargin: "-45% 0px -45% 0px" });

sections.forEach((section) => sectionObserver.observe(section));