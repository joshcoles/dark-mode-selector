import "./index.css";

// UI elements
const modeSelector = document.querySelector("#mode-selector");
const darkButton = modeSelector.querySelector('label[for="dark"]');
const systemButton = modeSelector.querySelector('label[for="system"]');
const lightButton = modeSelector.querySelector('label[for="light"]');

// Event handlers
const handleDarkSelection = () => window.darkModeSettings.applyDark();
const handleSystemSelection = () => window.darkModeSettings.applySystem();
const handleLightSelection = () => window.darkModeSettings.applyLight();

// For keyboard accessibility, simulate a click on
// relevant label when the user presses Enter or Space
const handleKeydown = (event) => {
  const label = event.currentTarget;
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    label.click();
  }
};

// Ensure the correct theme is applied to UI / semantic elements on load
const applySavedTheme = (theme) => {
  modeSelector.querySelectorAll("input").forEach((input) => {
    input.checked = false;
    if (input.value === theme) {
      input.checked = true;
    }
  });

  modeSelector.querySelectorAll("label").forEach((label) => {
    label.setAttribute("aria-checked", label.htmlFor === theme);
  });
};

const applyThemeUpdateListeners = () => {
  darkButton?.addEventListener("click", handleDarkSelection);
  systemButton?.addEventListener("click", handleSystemSelection);
  lightButton?.addEventListener("click", handleLightSelection);

  modeSelector.querySelectorAll("label").forEach((label) => {
    label.addEventListener("keydown", handleKeydown);
  });
};

const removeThemeUpdateListeners = () => {
  darkButton?.removeEventListener("click", handleDarkSelection);
  systemButton?.removeEventListener("click", handleSystemSelection);
  lightButton?.removeEventListener("click", handleLightSelection);

  modeSelector.querySelectorAll("label").forEach((label) => {
    label.removeEventListener("keydown", handleKeydown);
  });
};

if (modeSelector) {
  window.darkModeSettings.onThemeUpdate((theme) => {
    if (!["light", "dark", "system"].includes(theme)) {
      return;
    }

    applySavedTheme(theme);
  });

  applyThemeUpdateListeners();
}

window.addEventListener("beforeunload", () => removeThemeUpdateListeners);
