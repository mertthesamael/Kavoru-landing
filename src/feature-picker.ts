import {
  OPTIONAL_FEATURES,
  allFeaturesEnabled,
  buildNextSteps,
  buildScaffoldCommand,
  buildScaffoldFlags,
  minimalFeatures,
  type FeatureId,
  type FeatureSelection,
} from "./features";

export function initFeaturePicker() {
  const root = document.querySelector<HTMLElement>("#scaffold-terminal");
  const list = root?.querySelector(".scaffold-terminal__list");
  const body = root?.querySelector(".scaffold-terminal__body");
  const countEl = root?.querySelector("[data-feature-count]");
  const flagsEl = root?.querySelector("[data-command-flags]");
  const nextEl = root?.querySelector("[data-next-steps]");
  const projectInput = root?.querySelector<HTMLInputElement>(
    ".scaffold-terminal__project",
  );
  const copyBtn = root?.querySelector<HTMLButtonElement>("[data-copy-scaffold]");
  const selectAllBtn = root?.querySelector("[data-scaffold-all]");
  const minimalBtn = root?.querySelector("[data-scaffold-minimal]");

  if (!root || !list || !body || !countEl || !flagsEl || !nextEl || !projectInput) {
    return;
  }

  let selection = allFeaturesEnabled();
  let activeIndex = 0;
  const rows: HTMLButtonElement[] = [];

  function projectName() {
    return projectInput.value.trim() || "my-api";
  }

  function syncCards() {
    document.querySelectorAll("[data-feature-card]").forEach((card) => {
      const el = card as HTMLElement;
      const id = el.dataset.featureCard as FeatureId | undefined;
      if (!id) return;
      const on = selection[id];
      el.classList.toggle("feature-card--off", !on);
      el.classList.toggle("feature-card--on", on);
    });
  }

  function syncRow(row: HTMLButtonElement, index: number) {
    const id = row.dataset.featureId as FeatureId;
    const checked = selection[id];
    const isActive = index === activeIndex;

    row.classList.toggle("is-active", isActive);
    row.setAttribute("aria-pressed", String(checked));
    row.setAttribute("aria-selected", String(isActive));
  }

  function updateCommandLine() {
    const name = projectName();
    flagsEl.textContent = buildScaffoldFlags(selection);
    nextEl.textContent = buildNextSteps(name);
    root.dataset.command = buildScaffoldCommand(selection, name);
  }

  function render() {
    const enabled = OPTIONAL_FEATURES.filter((f) => selection[f.id]).length;
    countEl.textContent = `${enabled}/${OPTIONAL_FEATURES.length}`;
    rows.forEach((row, index) => syncRow(row, index));
    updateCommandLine();
    syncCards();
  }

  function toggleAt(index: number) {
    const feature = OPTIONAL_FEATURES[index];
    if (!feature) return;
    selection[feature.id] = !selection[feature.id];
    render();
  }

  function focusRow(index: number) {
    activeIndex = index;
    rows[activeIndex]?.scrollIntoView({ block: "nearest" });
    render();
  }

  function buildRows() {
    list.replaceChildren();

    OPTIONAL_FEATURES.forEach((feature, index) => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "scaffold-row";
      row.dataset.featureId = feature.id;
      row.setAttribute("role", "option");
      row.setAttribute("aria-pressed", "true");
      row.innerHTML = `
        <span class="scaffold-row__check" aria-hidden="true"></span>
        <span class="scaffold-row__content">
          <span class="scaffold-row__label">${feature.label}</span>
          <span class="scaffold-row__desc">${feature.description}</span>
        </span>
      `;

      row.addEventListener("click", () => {
        activeIndex = index;
        toggleAt(index);
      });

      row.addEventListener("mouseenter", () => {
        activeIndex = index;
        render();
      });

      rows.push(row);
      list.append(row);
    });
  }

  body.addEventListener("keydown", (event) => {
    const key = event.key;

    if (key === "ArrowDown") {
      event.preventDefault();
      focusRow((activeIndex + 1) % rows.length);
      return;
    }

    if (key === "ArrowUp") {
      event.preventDefault();
      focusRow((activeIndex - 1 + rows.length) % rows.length);
      return;
    }

    if (key === " " || key === "Enter") {
      event.preventDefault();
      if (key === "Enter" && event.metaKey) {
        void copyCommand();
        return;
      }
      toggleAt(activeIndex);
      return;
    }

    if (key === "a" || key === "A") {
      selection = allFeaturesEnabled();
      render();
      return;
    }

    if (key === "m" || key === "M") {
      selection = minimalFeatures();
      render();
    }
  });

  projectInput.addEventListener("input", () => {
    updateCommandLine();
  });

  selectAllBtn?.addEventListener("click", () => {
    selection = allFeaturesEnabled();
    render();
  });

  minimalBtn?.addEventListener("click", () => {
    selection = minimalFeatures();
    render();
  });

  document.querySelectorAll<HTMLElement>("[data-feature-card]").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.featureCard as FeatureId | undefined;
      if (!id) return;
      selection[id] = !selection[id];
      activeIndex = OPTIONAL_FEATURES.findIndex((f) => f.id === id);
      render();
      root.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });

  async function copyCommand() {
    const text = root.dataset.command ?? buildScaffoldCommand(selection, projectName());
    if (!copyBtn) return;
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = "Copied!";
      copyBtn.classList.add("copied");
      setTimeout(() => {
        copyBtn.textContent = "Copy command";
        copyBtn.classList.remove("copied");
      }, 2000);
    } catch {
      copyBtn.textContent = "Failed";
      setTimeout(() => {
        copyBtn.textContent = "Copy command";
      }, 2000);
    }
  }

  copyBtn?.addEventListener("click", () => void copyCommand());

  buildRows();
  render();
}
