const nav = document.querySelector(".nav") as HTMLElement;
const menuBtn = document.querySelector(".nav__menu") as HTMLButtonElement;

window.addEventListener("scroll", () => {
  nav.classList.toggle("is-scrolled", window.scrollY > 8);
});

menuBtn?.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  menuBtn.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll('.nav__links a, .nav__actions a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    menuBtn?.setAttribute("aria-expanded", "false");
  });
});

const tabs = document.querySelectorAll(".code-tab");
const panels = document.querySelectorAll(".code-block");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const id = tab.getAttribute("data-tab");
    if (!id) return;

    tabs.forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");

    panels.forEach((panel) => {
      panel.classList.toggle("active", panel.getAttribute("data-panel") === id);
    });
  });
});

async function copyText(text: string, button: HTMLButtonElement) {
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = "Copied!";
    button.classList.add("copied");
    setTimeout(() => {
      button.textContent = "Copy";
      button.classList.remove("copied");
    }, 2000);
  } catch {
    button.textContent = "Failed";
    setTimeout(() => {
      button.textContent = "Copy";
    }, 2000);
  }
}

document.querySelector("[data-copy]")?.addEventListener("click", (e) => {
  const btn = e.currentTarget as HTMLButtonElement;
  const active = document.querySelector(".code-block.active code");
  if (active) void copyText(active.textContent ?? "", btn);
});

document.querySelector("[data-copy-terminal]")?.addEventListener("click", (e) => {
  const btn = e.currentTarget as HTMLButtonElement;
  const code = document.querySelector("#terminal-code code");
  if (code) void copyText(code.textContent ?? "", btn);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
);

document.querySelectorAll(".feature-card, .stack__inner, .quickstart__card").forEach((el) => {
  (el as HTMLElement).style.opacity = "0";
  (el as HTMLElement).style.transform = "translateY(16px)";
  (el as HTMLElement).style.transition = "opacity 0.5s ease, transform 0.5s ease";
  observer.observe(el);
});

const style = document.createElement("style");
style.textContent = ".is-visible { opacity: 1 !important; transform: translateY(0) !important; }";
document.head.appendChild(style);
