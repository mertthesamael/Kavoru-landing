import { initFeaturePicker } from "./feature-picker";

const nav = document.querySelector(".nav") as HTMLElement;
const menuBtn = document.querySelector(".nav__menu") as HTMLButtonElement;

initFeaturePicker();

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

function initTabs(
  tabSelector: string,
  panelSelector: string,
  tabAttr: string,
  panelAttr: string,
) {
  const tabs = document.querySelectorAll(tabSelector);
  const panels = document.querySelectorAll(panelSelector);

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const id = tab.getAttribute(tabAttr);
      if (!id) return;

      tabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      panels.forEach((panel) => {
        panel.classList.toggle("active", panel.getAttribute(panelAttr) === id);
      });
    });
  });
}

initTabs(".code-tab:not(.terminal-tab)", ".code-block", "data-tab", "data-panel");
initTabs(".terminal-tab", ".terminal-block", "data-terminal", "data-terminal-panel");
initTabs(".deploy-tab", ".deploy-panel", "data-deploy-tab", "data-deploy-panel");

async function copyText(text: string, button: HTMLButtonElement, label = "Copy") {
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = "Copied!";
    button.classList.add("copied");
    setTimeout(() => {
      button.textContent = label;
      button.classList.remove("copied");
    }, 2000);
  } catch {
    button.textContent = "Failed";
    setTimeout(() => {
      button.textContent = label;
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
  const code = document.querySelector(".terminal-block.active code");
  if (code) void copyText(code.textContent ?? "", btn);
});

document.querySelector("[data-copy-hero]")?.addEventListener("click", (e) => {
  const btn = e.currentTarget as HTMLButtonElement;
  const text = document.querySelector(".hero__command-text");
  if (text) void copyText(text.textContent ?? "", btn);
});

document.querySelector("[data-copy-deploy]")?.addEventListener("click", (e) => {
  const btn = e.currentTarget as HTMLButtonElement;
  const code = document.querySelector(".deploy-panel.active .deploy-panel__code code");
  if (code) void copyText(code.textContent ?? "", btn, "Copy");
});

function initDeployMesh() {
  const nodes = document.querySelectorAll<HTMLElement>(".deploy-mesh__nodes .deploy-mesh__node");
  if (nodes.length === 0) return;

  let index = 0;
  let timer: ReturnType<typeof setInterval> | undefined;

  const highlight = (i: number) => {
    nodes.forEach((node, idx) => {
      node.classList.toggle("is-lit", idx === i);
    });
  };

  const startCycle = () => {
    if (timer) clearInterval(timer);
    highlight(index);
    timer = setInterval(() => {
      index = (index + 1) % nodes.length;
      highlight(index);
    }, 2200);
  };

  nodes.forEach((node, i) => {
    node.addEventListener("mouseenter", () => {
      if (timer) clearInterval(timer);
      index = i;
      highlight(i);
    });
    node.addEventListener("mouseleave", () => {
      startCycle();
    });
  });

  startCycle();
}

initDeployMesh();

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

document
  .querySelectorAll(
    ".feature-card, .stack__inner, .quickstart__card, .scaffold-terminal, .deploy-showcase, .deploy-step, .deploy-env-card, .hero__command",
  )
  .forEach((el) => {
    (el as HTMLElement).style.opacity = "0";
    (el as HTMLElement).style.transform = "translateY(16px)";
    (el as HTMLElement).style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(el);
  });

const style = document.createElement("style");
style.textContent = ".is-visible { opacity: 1 !important; transform: translateY(0) !important; }";
document.head.appendChild(style);
