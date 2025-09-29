document.addEventListener("DOMContentLoaded", function () {
  const e = document.getElementById("theme-toggle");
  e.addEventListener("change", function () {
    setTimeout(() => {
      e.checked ? document.body.classList.add("dark") : document.body.classList.remove("dark");
    }, 200);
  });
  const t = document.getElementById("bottom-nav").querySelectorAll("svg"),
    n = ["home", "courses", "constraints", "schedule"],
    c = (e) => {
      document
        .querySelectorAll("main section")
        .forEach((e) => (e.style.display = "none")),
        (document.getElementById(n[e]).style.display = "block");
      if (n[e] === 'constraints') {
        updateExclusionModals();
      }
    };
  document
    .querySelectorAll("main section")
    .forEach((e) => (e.style.display = "none"));
  const o = () => {
    const e = document.getElementById("bottom-nav");
    if (window.innerWidth >= 1025) {
      e && (e.style.display = "none"),
        document
          .querySelectorAll("main section")
          .forEach((e) => (e.style.display = "none"));
      const t = document.querySelector("main section");
      return void (t && (t.style.display = "block"));
    }
    e && (e.style.display = "flex"),
      window.innerWidth < 600
        ? (t.forEach((e) => e.classList.remove("hidden", "active")),
          t[0] && t[0].classList.add("hidden"),
          t[1] && t[1].classList.add("active"))
        : (t.forEach((e) => e.classList.remove("hidden", "active")),
          t[1] && t[1].classList.add("hidden"),
          t[2] && t[2].classList.add("hidden"),
          t[0] && t[0].classList.add("active"));
    let n = -1;
    t.forEach((e, t) => {
      !e.classList.contains("hidden") &&
        e.classList.contains("active") &&
        (n = t);
    }),
      n >= 0 && c(n);
  };
  // Only run the responsive layout logic when the viewport width actually changes.
  // Many mobile browsers fire resize when the virtual keyboard opens (height changes)
  // which should not trigger a nav/tab switch. Track lastInnerWidth to ignore
  // height-only resizes.
  let lastInnerWidth = window.innerWidth;
  window.addEventListener("resize", function () {
    if (window.innerWidth === lastInnerWidth) return; // ignore height-only resizes
    lastInnerWidth = window.innerWidth;
    o();
  });
  o();
  let d = !1;
  t.forEach((e, t) => {
    !d &&
      null !== e.offsetParent &&
      e.classList.contains("active") &&
      (c(t), (d = !0));
  }),
    d ||
      t.forEach((e, n) => {
        d ||
          null === e.offsetParent ||
          (c(n),
          t.forEach((e) => e.classList.remove("active")),
          e.classList.add("active"),
          (d = !0));
      }),
    t.forEach((e, n) => {
      e.addEventListener("click", function () {
        e.classList.contains("hidden") ||
          (t.forEach((e) => e.classList.remove("active")),
          e.classList.add("active"),
          c(n));
      });
    });
  const s = document.getElementById("addCourse"),
    a = document.getElementById("courseName"),
    i = document.getElementById("courseModal"),
    l = document.querySelector(".modal-backdrop"),
    coursesList = document.getElementById("coursesList"),
    courses = [];
  let currentCourse = null,
    E,
    p;
  function setCurrentCourse(course) {
    currentCourse = course;
    E.innerHTML = '';
    p.innerHTML = '';
    course.lectures.slice().reverse().forEach(lecture => {
      const o = document.createElement("div");
      o.className = "item";
      o.innerHTML = `\n        <div>\n          <strong>${lecture.instructor}</strong><br>\n          ${lecture.day.charAt(0).toUpperCase() + lecture.day.slice(1)} ${lecture.period} ${lecture.group ? `- Group ${lecture.group}` : ''} - Room ${lecture.room}\n        </div>\n        <button class="remove-btn">×</button>\n      `;
      E.appendChild(o);
      o.querySelector(".remove-btn").addEventListener("click", function () {
        const index = course.lectures.indexOf(lecture);
        course.lectures.splice(index, 1);
        o.remove();
      });
    });
    course.sections.slice().reverse().forEach(section => {
      const o = document.createElement("div");
      o.className = "item";
      o.innerHTML = `\n        <div>\n          <strong>${section.instructor}</strong><br>\n          ${section.day.charAt(0).toUpperCase() + section.day.slice(1)} ${section.period} ${section.group ? `- Group ${section.group}` : ''} - Room ${section.room}\n        </div>\n        <button class="remove-btn">×</button>\n      `;
      p.appendChild(o);
      o.querySelector(".remove-btn").addEventListener("click", function () {
        const index = course.sections.indexOf(section);
        course.sections.splice(index, 1);
        o.remove();
      });
    });
  }
  function updateCourseIndices() {
    document.querySelectorAll('#coursesList .item').forEach((item, index) => {
      item.dataset.courseIndex = index;
    });
  }
  s.addEventListener("click", function () {
    const e = a.value.trim();
    if (e) {
      const existingCourse = courses.find(c => c.name === e);
      if (existingCourse) {
        setCurrentCourse(existingCourse);
        i.classList.add("show");
        a.value = "";
        return;
      }
      const course = { name: e, lectures: [], sections: [] };
      courses.push(course);
      saveCourses();
      const t = document.createElement("div");
      (t.className = "item"),
        (t.dataset.courseIndex = courses.length - 1),
        (t.innerHTML = `\n          <div>\n            <strong>${e}</strong>\n          </div>\n          <div style="display: flex; align-items: center; gap: 5px;">\n            <button class="edit-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>\n            <button class="remove-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>\n          </div>\n        `),
        coursesList.insertBefore(t, coursesList.firstChild),
        (a.value = ""),
        setCurrentCourse(course),
        i.classList.add("show"),
        t.querySelector(".edit-btn").addEventListener("click", function () {
          const index = this.parentElement.parentElement.dataset.courseIndex;
          setCurrentCourse(courses[index]);
          i.classList.add("show");
        }),
        t.querySelector(".remove-btn").addEventListener("click", function () {
          const index = this.parentElement.parentElement.dataset.courseIndex;
          courses.splice(index, 1);
          updateCourseIndices();
          this.parentElement.parentElement.remove();
          saveCourses();
        });
    }
  }),
    l.addEventListener("click", function () {
      i.classList.remove("show");
    });
  const r = document.querySelectorAll(".tab-button"),
    u = document.querySelectorAll(".tab-pane");
  r.forEach((e) => {
    e.addEventListener("click", function () {
      const e = this.getAttribute("data-tab");
      r.forEach((e) => e.classList.remove("active")),
        u.forEach((e) => e.classList.remove("active")),
        this.classList.add("active"),
        document.getElementById(e + "-tab").classList.add("active");
    });
  });
  const m = document.getElementById("addLecture"),
    v = document.getElementById("instructorName"),
    y = document.getElementById("roomNumber"),
    g = document.getElementById("groupNumber");
  E = document.getElementById("lecturesList");
  m.addEventListener("click", function () {
    const e = v.value.trim(),
      t = y.value.trim(),
      group = g.value.trim(),
      n = document.querySelector('input[name="day"]:checked').value,
      c = document.querySelector('input[name="period"]:checked').value,
      importance = document.querySelector('input[name="importance"]:checked').value;
    if (e && t && currentCourse) {
      const lecture = { instructor: e, room: t, group: group, day: n, period: c, importance: importance };
      currentCourse.lectures.push(lecture);
      saveCourses();
      const o = document.createElement("div");
      (o.className = "item"),
        (o.innerHTML = `\n        <div>\n          <strong>${e}</strong><br>\n          ${
          n.charAt(0).toUpperCase() + n.slice(1)
        } ${c} ${group ? `- Group ${group}` : ''} - Room ${t}\n        </div>\n        <button class="remove-btn">×</button>\n      `),
        E.prepend(o),
        (v.value = ""),
        (y.value = ""),
        (g.value = ""),
        o.querySelector(".remove-btn").addEventListener("click", function () {
          const index = currentCourse.lectures.indexOf(lecture);
          currentCourse.lectures.splice(index, 1);
          o.remove();
          saveCourses();
        });
    }
  });
  const h = document.getElementById("addSection"),
    L = document.getElementById("instructorNameSection"),
    f = document.getElementById("roomNumberSection"),
    gs = document.getElementById("groupNumberSection");
  p = document.getElementById("sectionsList");
  h.addEventListener("click", function () {
    const e = L.value.trim(),
      t = f.value.trim(),
      group = gs.value.trim(),
      n = document.querySelector('input[name="day"]:checked').value,
      c = document.querySelector('input[name="period"]:checked').value,
      importance = document.querySelector('input[name="importance"]:checked').value;
    if (e && t && currentCourse) {
      const section = { instructor: e, room: t, group: group, day: n, period: c, importance: importance };
      currentCourse.sections.push(section);
      saveCourses();
      const o = document.createElement("div");
      (o.className = "item"),
        (o.innerHTML = `\n        <div>\n          <strong>${e}</strong><br>\n          ${
          n.charAt(0).toUpperCase() + n.slice(1)
        } ${c} ${group ? `- Group ${group}` : ''} - Room ${t}\n        </div>\n        <button class="remove-btn">×</button>\n      `),
        p.prepend(o),
        (L.value = ""),
        (f.value = ""),
        (gs.value = ""),
        o.querySelector(".remove-btn").addEventListener("click", function () {
          const index = currentCourse.sections.indexOf(section);
          currentCourse.sections.splice(index, 1);
          o.remove();
          saveCourses();
        });
    }
  });
  function transformCoursesToSaveFormat(courses) {
    const result = {};
    courses.forEach(course => {
      result[course.name] = {
        "Lectures": {},
        "Sections": {}
      };
      course.lectures.forEach(lecture => {
        if (!result[course.name]["Lectures"][lecture.instructor]) {
          result[course.name]["Lectures"][lecture.instructor] = {};
        }
        result[course.name]["Lectures"][lecture.instructor][lecture.group] = {
          "day": lecture.day,
          "time": lecture.period,
          "room": lecture.room
        };
      });
      course.sections.forEach(section => {
        if (!result[course.name]["Sections"][section.instructor]) {
          result[course.name]["Sections"][section.instructor] = {};
        }
        result[course.name]["Sections"][section.instructor][section.group] = {
          "day": section.day,
          "time": section.period,
          "room": section.room
        };
      });
    });
    return result;
  }
  function saveCourses() {
    const data = transformCoursesToSaveFormat(courses);
    localStorage.setItem('coursesData', JSON.stringify(data));
  }
  function loadCourses() {
    const data = localStorage.getItem('coursesData');
    if (data) {
      const parsed = JSON.parse(data);
      courses.length = 0;
      for (const courseName in parsed) {
        const course = { name: courseName, lectures: [], sections: [] };
        for (const instructor in parsed[courseName]["Lectures"]) {
          for (const group in parsed[courseName]["Lectures"][instructor]) {
            const lec = parsed[courseName]["Lectures"][instructor][group];
            course.lectures.push({
              instructor: instructor,
              group: group,
              day: lec.day,
              period: lec.time,
              room: lec.room,
              importance: "normal"
            });
          }
        }
        for (const instructor in parsed[courseName]["Sections"]) {
          for (const group in parsed[courseName]["Sections"][instructor]) {
            const sec = parsed[courseName]["Sections"][instructor][group];
            course.sections.push({
              instructor: instructor,
              group: group,
              day: sec.day,
              period: sec.time,
              room: sec.room,
              importance: "normal"
            });
          }
        }
        courses.push(course);
      }
      coursesList.innerHTML = '';
      courses.forEach((course, index) => {
        const t = document.createElement("div");
        t.className = "item";
        t.dataset.courseIndex = index;
        t.innerHTML = `\n          <div>\n            <strong>${course.name}</strong>\n          </div>\n          <div style="display: flex; align-items: center; gap: 5px;">\n            <button class="edit-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>\n            <button class="remove-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>\n          </div>\n        `;
        coursesList.insertBefore(t, coursesList.firstChild);
        t.querySelector(".edit-btn").addEventListener("click", function () {
          const index = this.parentElement.parentElement.dataset.courseIndex;
          setCurrentCourse(courses[index]);
          i.classList.add("show");
        });
        t.querySelector(".remove-btn").addEventListener("click", function () {
          const index = this.parentElement.parentElement.dataset.courseIndex;
          courses.splice(index, 1);
          updateCourseIndices();
          this.parentElement.parentElement.remove();
          saveCourses();
        });
      });
    }
  }
  // Constraints functionality
  let constraints = {
    excludedDays: [],
    excludedPeriods: [],
    excludedLectures: [],
    excludedSections: [],
    minDaysPerWeek: 1,
    maxDaysPerWeek: 6,
    minSessionsPerDay: 1,
    maxSessionsPerDay: 3,
    // Default to unchecked: do not allow gaps by default
    allowGaps: false
  };

  function saveConstraints() {
    localStorage.setItem('constraintsData', JSON.stringify(constraints));
  }

  function loadConstraints() {
    const data = localStorage.getItem('constraintsData');
    if (data) {
      constraints = JSON.parse(data);
      // Migration: force allowGaps to false for all existing users.
      // This will overwrite any previously saved preference and persist the change.
      if (constraints.allowGaps !== false) {
        constraints.allowGaps = false;
        try {
          localStorage.setItem('constraintsData', JSON.stringify(constraints));
        } catch (err) {
          console.warn('Failed to persist migrated constraintsData:', err);
        }
      }
    }
    updateConstraintsUI();
  }

  function updateConstraintsUI() {
    // Update number inputs
    document.getElementById('min-days-week').value = constraints.minDaysPerWeek;
    document.getElementById('max-days-week').value = constraints.maxDaysPerWeek;
    document.getElementById('min-sessions-day').value = constraints.minSessionsPerDay;
    document.getElementById('max-sessions-day').value = constraints.maxSessionsPerDay;

    // Update allow gaps
    document.getElementById('allow-gaps').checked = constraints.allowGaps;

    // Update exclusion modals
    updateExclusionModals();
  }

  function updateExclusionModals() {
    // Update days modal
    const daysList = document.getElementById('excluded-days-list');
    daysList.innerHTML = '';
    const allDays = [
      { key: 'sat', label: 'Saturday' },
      { key: 'sun', label: 'Sunday' },
      { key: 'mon', label: 'Monday' },
      { key: 'tue', label: 'Tuesday' },
      { key: 'wed', label: 'Wednesday' },
      { key: 'thu', label: 'Thursday' }
    ];

    allDays.forEach(day => {
      const isExcluded = constraints.excludedDays.includes(day.key);
      if (isExcluded) {
        const item = createExclusionItem(day.label, () => {
          constraints.excludedDays = constraints.excludedDays.filter(d => d !== day.key);
          saveConstraints();
          updateExclusionModals();
        });
        daysList.appendChild(item);
      }
    });

    // Update periods modal
    const periodsList = document.getElementById('excluded-periods-list');
    periodsList.innerHTML = '';
    const allPeriods = [
      { key: '8:30', label: '8:30' },
      { key: '10:30', label: '10:30' },
      { key: '12:30', label: '12:30' },
      { key: '14:30', label: '14:30' },
      { key: '16:30', label: '16:30' },
      { key: '18:30', label: '18:30' }
    ];

    allPeriods.forEach(period => {
      const isExcluded = constraints.excludedPeriods.includes(period.key);
      if (isExcluded) {
        const item = createExclusionItem(period.label, () => {
          constraints.excludedPeriods = constraints.excludedPeriods.filter(p => p !== period.key);
          saveConstraints();
          updateExclusionModals();
        });
        periodsList.appendChild(item);
      }
    });

    // Update lectures modal
    const lecturesList = document.getElementById('excluded-lectures-list');
    const lecturesSelect = document.getElementById('add-lecture-select');
    lecturesList.innerHTML = '';
    lecturesSelect.innerHTML = '<option value="">Select a lecture to exclude</option>';

    courses.forEach(course => {
      course.lectures.forEach((lecture, index) => {
        const optionValue = `${course.name}|${index}`;
        const optionLabel = `${course.name} - ${lecture.instructor} (${lecture.day} ${lecture.period})`;
        const option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionLabel;
        lecturesSelect.appendChild(option);
      });
    });

    constraints.excludedLectures.forEach((excluded, index) => {
      const course = courses.find(c => c.name === excluded.course);
      if (course && course.lectures[excluded.index]) {
        const lecture = course.lectures[excluded.index];
        const label = `${course.name} - ${lecture.instructor} (${lecture.day} ${lecture.period})`;
        const item = createExclusionItem(label, () => {
          constraints.excludedLectures.splice(index, 1);
          saveConstraints();
          updateExclusionModals();
        });
        lecturesList.appendChild(item);
      }
    });

    // Update sections modal
    const sectionsList = document.getElementById('excluded-sections-list');
    const sectionsSelect = document.getElementById('add-section-select');
    sectionsList.innerHTML = '';
    sectionsSelect.innerHTML = '<option value="">Select a section to exclude</option>';

    courses.forEach(course => {
      course.sections.forEach((section, index) => {
        const optionValue = `${course.name}|${index}`;
        const optionLabel = `${course.name} - ${section.instructor} (${section.day} ${section.period})`;
        const option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionLabel;
        sectionsSelect.appendChild(option);
      });
    });

    constraints.excludedSections.forEach((excluded, index) => {
      const course = courses.find(c => c.name === excluded.course);
      if (course && course.sections[excluded.index]) {
        const section = course.sections[excluded.index];
        const label = `${course.name} - ${section.instructor} (${section.day} ${section.period})`;
        const item = createExclusionItem(label, () => {
          constraints.excludedSections.splice(index, 1);
          saveConstraints();
          updateExclusionModals();
        });
        sectionsList.appendChild(item);
      }
    });
  }

  function createExclusionItem(label, onDelete) {
    const item = document.createElement('div');
    item.className = 'exclusion-item';

    const content = document.createElement('div');
    content.className = 'exclusion-item-content';
    content.textContent = label;

    const actions = document.createElement('div');
    actions.className = 'exclusion-item-actions';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete';
    deleteBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3,6 5,6 21,6"></polyline>
        <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>
    `;
    deleteBtn.addEventListener('click', onDelete);

    actions.appendChild(deleteBtn);
    item.appendChild(content);
    item.appendChild(actions);

    return item;
  }

  // Modal management
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
  }

  // Event listeners for exclusion buttons
  document.querySelectorAll('.exclusion-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const type = this.dataset.type;
      const modalId = `${type}Modal`;
      openModal(modalId);
    });
  });

  // Event listeners for add exclusion buttons
  document.querySelectorAll('.add-exclusion-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const type = this.dataset.type;
      let select, array, key;

      switch (type) {
        case 'days':
          select = document.getElementById('add-day-select');
          array = constraints.excludedDays;
          key = select.value;
          if (key && !array.includes(key)) {
            array.push(key);
          }
          break;
        case 'periods':
          select = document.getElementById('add-period-select');
          array = constraints.excludedPeriods;
          key = select.value;
          if (key && !array.includes(key)) {
            array.push(key);
          }
          break;
        case 'lectures':
          select = document.getElementById('add-lecture-select');
          const lectureValue = select.value;
          if (lectureValue) {
            const [courseName, index] = lectureValue.split('|');
            if (!constraints.excludedLectures.some(ex => ex.course === courseName && ex.index === parseInt(index))) {
              constraints.excludedLectures.push({ course: courseName, index: parseInt(index) });
            }
          }
          break;
        case 'sections':
          select = document.getElementById('add-section-select');
          const sectionValue = select.value;
          if (sectionValue) {
            const [courseName, index] = sectionValue.split('|');
            if (!constraints.excludedSections.some(ex => ex.course === courseName && ex.index === parseInt(index))) {
              constraints.excludedSections.push({ course: courseName, index: parseInt(index) });
            }
          }
          break;
      }

      if (select) select.value = '';
      saveConstraints();
      updateExclusionModals();
    });
  });

  // Close modal when clicking backdrop
  document.querySelectorAll('.exclusion-modal .modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', function() {
      const modal = this.closest('.exclusion-modal');
      modal.classList.remove('show');
    });
  });
  document.querySelectorAll('#constraints input[type="checkbox"]:not([data-type])').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const id = this.id;
      if (id.startsWith('exclude-')) {
        if (id.includes('sat') || id.includes('sun') || id.includes('mon') || id.includes('tue') || id.includes('wed') || id.includes('thu')) {
          const day = id.replace('exclude-', '');
          if (this.checked) {
            if (!constraints.excludedDays.includes(day)) constraints.excludedDays.push(day);
          } else {
            constraints.excludedDays = constraints.excludedDays.filter(d => d !== day);
          }
        } else if (id.includes('830') || id.includes('1030') || id.includes('1230') || id.includes('1430') || id.includes('1630') || id.includes('1830')) {
          const periodMap = {'830': '8:30', '1030': '10:30', '1230': '12:30', '1430': '14:30', '1630': '16:30', '1830': '18:30'};
          const period = periodMap[id.replace('exclude-', '')];
          if (this.checked) {
            if (!constraints.excludedPeriods.includes(period)) constraints.excludedPeriods.push(period);
          } else {
            constraints.excludedPeriods = constraints.excludedPeriods.filter(p => p !== period);
          }
        } else if (id === 'allow-gaps') {
          constraints.allowGaps = this.checked;
        }
      }
      saveConstraints();
    });
  });

  document.querySelectorAll('#constraints input[type="number"]').forEach(input => {
    input.addEventListener('change', function() {
      const id = this.id;
      const value = parseInt(this.value);
      if (id === 'min-days-week') constraints.minDaysPerWeek = value;
      else if (id === 'max-days-week') constraints.maxDaysPerWeek = value;
      else if (id === 'min-sessions-day') constraints.minSessionsPerDay = value;
      else if (id === 'max-sessions-day') constraints.maxSessionsPerDay = value;
      saveConstraints();
    });
  });

  // Update exclude lists when courses change
  const originalSaveCourses = saveCourses;
  saveCourses = function() {
    originalSaveCourses();
    updateExclusionModals();
  };

  loadCourses();
  loadConstraints();
});
