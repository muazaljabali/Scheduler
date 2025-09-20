const themeToggle = document.getElementById("themeToggle"),
  body = document.body;
themeToggle.addEventListener("click", () => {
  const e = "dark" === body.getAttribute("data-theme") ? "light" : "dark";
  body.setAttribute("data-theme", e);
});
const pages = document.querySelectorAll(".page"),
  navContainer = document.getElementById("navContainer");
let currentPage = "courses";
const icons = {
  courses:
    '<svg viewBox="0 0 24 24">\n                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>\n            </svg>',
  constraints:
    '<svg viewBox="0 0 24 24">\n                <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>\n            </svg>',
  schedules:
    '<svg viewBox="0 0 24 24">\n                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>\n            </svg>',
  combined:
    '<svg viewBox="0 0 24 24">\n                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>\n            </svg>',
};
function updateNavigation() {
  const e = window.innerWidth;
  if (((navContainer.innerHTML = ""), e <= 480)) {
    ["courses", "constraints", "schedules"].forEach((e, t) => {
      const n = document.createElement("button");
      (n.className = `nav-item ${currentPage === e ? "active" : ""}`),
        n.setAttribute("data-page", e),
        (n.innerHTML = icons[e]),
        n.addEventListener("click", () => showPage(e)),
        navContainer.appendChild(n);
    });
    "combined" !== currentPage || showPage("courses");
  } else {
    ["combined", "schedules"].forEach((e, t) => {
      const n = document.createElement("button");
      (n.className = `nav-item ${currentPage === e ? "active" : ""}`),
        n.setAttribute("data-page", e),
        (n.innerHTML = icons[e]),
        n.addEventListener("click", () => showPage(e)),
        "schedules" === e && (n.style.marginLeft = "auto"),
        navContainer.appendChild(n);
    }),
      ("courses" !== currentPage && "constraints" !== currentPage) ||
        showPage("combined");
  }
}
function showPage(e) {
  pages.forEach((e) => {
    e.classList.remove("active");
  });
  const t = document.getElementById(e);
  t && (t.classList.add("active"), (currentPage = e));
  const n = navContainer.querySelectorAll(".nav-item");
  n.forEach((e) => {
    e.classList.remove("active");
  });
  const c = [...n].find((t) => t.getAttribute("data-page") === e);
  c && c.classList.add("active");
}
updateNavigation(),
  window.addEventListener("resize", updateNavigation),
  body.setAttribute("data-theme", "light");
