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
  (navContainer.innerHTML = ""),
    e <= 597
      ? (["courses", "constraints", "schedules"].forEach((e, t) => {
          const n = document.createElement("button");
          (n.className = `nav-item ${currentPage === e ? "active" : ""}`),
            n.setAttribute("data-page", e),
            (n.innerHTML = icons[e]),
            n.addEventListener("click", () => showPage(e)),
            navContainer.appendChild(n);
        }),
        "combined" !== currentPage || showPage("courses"))
      : (["combined", "schedules"].forEach((e, t) => {
          const n = document.createElement("button");
          (n.className = `nav-item ${currentPage === e ? "active" : ""}`),
            n.setAttribute("data-page", e),
            (n.innerHTML = icons[e]),
            n.addEventListener("click", () => showPage(e)),
            "schedules" === e && (n.style.marginLeft = "auto"),
            navContainer.appendChild(n);
        }),
        ("courses" !== currentPage && "constraints" !== currentPage) ||
          showPage("combined"));
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
  const s = [...n].find((t) => t.getAttribute("data-page") === e);
  s && s.classList.add("active");
}
updateNavigation(),
  window.addEventListener("resize", updateNavigation),
  body.setAttribute("data-theme", "light");
class CourseManager {
  constructor() {
    (this.courses = JSON.parse(localStorage.getItem("courses")) || []),
      (this.currentCourse = null),
      (this.currentLectures = []),
      (this.currentSections = []),
      this.initializeEventListeners(),
      this.renderCourses();
  }
  initializeEventListeners() {
    document
      .getElementById("addCourseBtn")
      .addEventListener("click", () => this.showModal()),
      document
        .querySelector(".modal-backdrop")
        .addEventListener("click", () => this.saveAndHideModal()),
      document.querySelectorAll(".tab-btn").forEach((e) => {
        e.addEventListener("click", (e) =>
          this.switchTab(e.target.dataset.tab)
        );
      }),
      document
        .getElementById("addLectureBtn")
        .addEventListener("click", () => this.addLecture()),
      document
        .getElementById("addSectionBtn")
        .addEventListener("click", () => this.addSection()),
      document
        .getElementById("courseNameInput")
        .addEventListener("input", (e) => {
          document.getElementById("addCourseBtn").disabled =
            !e.target.value.trim();
        });
  }
  showModal(e = null) {
    (this.currentCourse = e),
      (this.currentLectures = e ? [...e.lectures] : []),
      (this.currentSections = e ? [...e.sections] : []),
      document.getElementById("courseModal").classList.add("show"),
      e
        ? (document.getElementById("courseNameInput").value = e.name)
        : (this.clearForm("lecture"), this.clearForm("section")),
      this.renderLectures(),
      this.renderSections(),
      this.switchTab("lectures");
  }
  hideModal() {
    const e = null !== this.currentCourse;
    document.getElementById("courseModal").classList.remove("show"),
      this.resetModal(),
      e || (document.getElementById("courseNameInput").value = "");
  }
  saveAndHideModal() {
    this.saveCourse(), this.hideModal();
  }
  resetModal() {
    this.clearForm("lecture"),
      this.clearForm("section"),
      (this.currentLectures = []),
      (this.currentSections = []),
      (this.currentCourse = null);
  }
  switchTab(e) {
    document.querySelectorAll(".tab-btn").forEach((t) => {
      t.classList.toggle("active", t.dataset.tab === e);
    }),
      document.querySelectorAll(".tab-content").forEach((t) => {
        t.classList.toggle("active", t.id === `${e}Tab`);
      });
  }
  clearForm(e) {
    (document.getElementById(`${e}Day`).value = "SAT"),
      (document.getElementById(`${e}Period`).value = "8:30"),
      (document.getElementById(`${e}Room`).value = ""),
      (document.getElementById(`${e}Opportunity`).value = "not important");
  }
  addLecture() {
    const e = {
      id: Date.now(),
      day: document.getElementById("lectureDay").value,
      period: document.getElementById("lecturePeriod").value,
      room: document.getElementById("lectureRoom").value,
      opportunity: document.getElementById("lectureOpportunity").value,
    };
    this.currentLectures.unshift(e),
      this.renderLectures(),
      this.clearForm("lecture"),
      this.saveCourseWithoutClosing();
  }
  addSection() {
    const e = {
      id: Date.now(),
      day: document.getElementById("sectionDay").value,
      period: document.getElementById("sectionPeriod").value,
      room: document.getElementById("sectionRoom").value,
      opportunity: document.getElementById("sectionOpportunity").value,
    };
    this.currentSections.unshift(e),
      this.renderSections(),
      this.clearForm("section"),
      this.saveCourseWithoutClosing();
  }
  renderLectures() {
    document.getElementById("lecturesList").innerHTML = this.currentLectures
      .map(
        (e) =>
          `\n      <div class="item-entry">\n        <div class="item-info">\n          <div><strong>${
            e.day
          }</strong> at ${e.period}</div>\n          <div>Room: ${
            e.room || "N/A"
          } | ${
            e.opportunity
          }</div>\n        </div>\n        <button class="delete-item-btn" onclick="courseManager.deleteLecture(${
            e.id
          })">Delete</button>\n      </div>\n    `
      )
      .join("");
  }
  renderSections() {
    document.getElementById("sectionsList").innerHTML = this.currentSections
      .map(
        (e) =>
          `\n      <div class="item-entry">\n        <div class="item-info">\n          <div><strong>${
            e.day
          }</strong> at ${e.period}</div>\n          <div>Room: ${
            e.room || "N/A"
          } | ${
            e.opportunity
          }</div>\n        </div>\n        <button class="delete-item-btn" onclick="courseManager.deleteSection(${
            e.id
          })">Delete</button>\n      </div>\n    `
      )
      .join("");
  }
  deleteLecture(e) {
    (this.currentLectures = this.currentLectures.filter((t) => t.id !== e)),
      this.renderLectures();
  }
  deleteSection(e) {
    (this.currentSections = this.currentSections.filter((t) => t.id !== e)),
      this.renderSections();
  }
  saveCourse() {
    const e = document.getElementById("courseNameInput").value.trim(),
      t = {
        id: this.currentCourse ? this.currentCourse.id : Date.now(),
        name: e,
        lectures: this.currentLectures,
        sections: this.currentSections,
      };
    if (this.currentCourse) {
      const e = this.courses.findIndex((e) => e.id === this.currentCourse.id);
      this.courses[e] = t;
    } else this.courses.unshift(t);
    this.saveToStorage(),
      this.renderCourses(),
      this.hideModal(),
      (document.getElementById("courseNameInput").value = "");
  }
  saveCourseWithoutClosing() {
    const e = document.getElementById("courseNameInput").value.trim();
    if (!this.currentCourse) return;
    const t = {
        id: this.currentCourse.id,
        name: e,
        lectures: this.currentLectures,
        sections: this.currentSections,
      },
      n = this.courses.findIndex((e) => e.id === this.currentCourse.id);
    (this.courses[n] = t), this.saveToStorage(), this.renderCourses();
  }
  deleteCourse(e) {
    (this.courses = this.courses.filter((t) => t.id !== e)),
      this.saveToStorage(),
      this.renderCourses();
  }
  editCourse(e) {
    const t = this.courses.find((t) => t.id === e);
    t && this.showModal(t);
  }
  renderCourses() {
    document.getElementById("coursesList").innerHTML = this.courses
      .map(
        (e) =>
          `\n      <div class="course-item">\n        <div class="course-info">\n          <h3>${
            e.name
          }</h3>\n          <div class="course-stats">\n            ${
            e.lectures.length
          } Lecture${1 !== e.lectures.length ? "s" : ""}, \n            ${
            e.sections.length
          } Section${
            1 !== e.sections.length ? "s" : ""
          }\n          </div>\n        </div>\n        <div class="course-actions">\n          <button class="edit-btn" onclick="courseManager.editCourse(${
            e.id
          })">Edit</button>\n          <button class="delete-btn" onclick="courseManager.deleteCourse(${
            e.id
          })">Delete</button>\n        </div>\n      </div>\n    `
      )
      .join("");
  }
  saveToStorage() {
    localStorage.setItem("courses", JSON.stringify(this.courses));
  }
}
const courseManager = new CourseManager();
