/*
 * Shared text-size control for Lana's Pages.
 * Include on any page with: <script src="font-control.js" defer></script>
 *
 * Scales the whole page by resetting the root font-size (all component
 * CSS here is written in rem, so everything scales together and reflows
 * normally instead of clipping or overlapping). The chosen size is saved
 * in localStorage and shared across every page on this site, so it only
 * needs to be set once — handy on e-ink readers like a Kindle Scribe where
 * the default size is often too small and pinch-zoom doesn't reflow text.
 */
(function () {
  var KEY = "lp-font-scale";
  var MIN = 0.75;
  var MAX = 2;
  var STEP = 0.1;
  var DEFAULT_SCALE = 1;

  function getScale() {
    var stored;
    try {
      stored = parseFloat(localStorage.getItem(KEY));
    } catch (e) {
      stored = NaN;
    }
    if (isNaN(stored)) return DEFAULT_SCALE;
    return Math.min(MAX, Math.max(MIN, stored));
  }

  function applyScale(scale) {
    scale = Math.round(Math.min(MAX, Math.max(MIN, scale)) * 100) / 100;
    document.documentElement.style.fontSize = (scale * 100) + "%";
    try {
      localStorage.setItem(KEY, String(scale));
    } catch (e) { /* localStorage unavailable: scale still applies for this view */ }
    if (label) label.textContent = Math.round(scale * 100) + "%";
    return scale;
  }

  var label;

  function makeButton(text, ariaLabel) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = text;
    btn.setAttribute("aria-label", ariaLabel);
    btn.style.cssText =
      "border:none;background:transparent;color:inherit;font:inherit;" +
      "font-weight:700;width:2.1rem;height:2.1rem;min-width:2.1rem;" +
      "border-radius:999px;cursor:pointer;display:flex;align-items:center;" +
      "justify-content:center;line-height:1;";
    btn.addEventListener("mouseenter", function () { btn.style.background = "rgba(120,130,150,0.14)"; });
    btn.addEventListener("mouseleave", function () { btn.style.background = "transparent"; });
    return btn;
  }

  function build() {
    var style = document.createElement("style");
    style.textContent =
      "#lp-font-widget { position: fixed; bottom: 16px; right: 16px; z-index: 2147483647; " +
      "display: flex; align-items: center; gap: 2px; padding: 4px; border-radius: 999px; " +
      "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, sans-serif; " +
      "font-size: 0.875rem; -webkit-user-select: none; user-select: none; " +
      "background: #ffffff; color: #1c2128; border: 1px solid #d7dbe2; " +
      "box-shadow: 0 2px 10px rgba(16,24,40,0.12); }" +
      "@media (prefers-color-scheme: dark) { #lp-font-widget { background: #171b21; color: #e7e9ec; border-color: #30363f; } }" +
      "#lp-font-widget .lp-label { min-width: 2.6rem; text-align: center; font-weight: 600; opacity: 0.7; }";
    document.head.appendChild(style);

    var wrap = document.createElement("div");
    wrap.id = "lp-font-widget";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", "Text size");

    var minus = makeButton("A−", "Decrease text size");
    label = document.createElement("span");
    label.className = "lp-label";
    var plus = makeButton("A+", "Increase text size");
    var reset = makeButton("↺", "Reset text size");
    reset.style.fontSize = "0.8em";

    minus.addEventListener("click", function () { applyScale(getScale() - STEP); });
    plus.addEventListener("click", function () { applyScale(getScale() + STEP); });
    reset.addEventListener("click", function () { applyScale(DEFAULT_SCALE); });

    wrap.appendChild(minus);
    wrap.appendChild(label);
    wrap.appendChild(plus);
    wrap.appendChild(reset);
    document.body.appendChild(wrap);
  }

  function init() {
    build();
    applyScale(getScale());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
