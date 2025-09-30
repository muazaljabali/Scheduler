document.addEventListener("DOMContentLoaded", function () {
  const e = document.getElementById("theme-toggle");
  e.addEventListener("change", function () {
    setTimeout(() => {
      e.checked
        ? document.body.classList.add("dark")
        : document.body.classList.remove("dark");
    }, 200);
  });
  const t = document.getElementById("bottom-nav").querySelectorAll("svg"),
    n = ["home", "courses", "constraints", "schedule"],
    o = (e) => {
      document
        .querySelectorAll("main section")
        .forEach((e) => (e.style.display = "none")),
        (document.getElementById(n[e]).style.display = "block"),
        "constraints" === n[e] && (O(), Z()),
        "schedule" === n[e] &&
          (function () {
            let e = "default";
            if (
              (Z(),
              p.forEach((e) => {
                J(e);
              }),
              0 === p.length)
            )
              return void (document.getElementById("schedule").innerHTML =
                '<div class="no-courses-message">No courses added yet.<br>Please add some courses first.</div>');
            const t = R(),
              n = [],
              o = new Set();
            for (const e of t)
              K(e) && !X(e, o) && (n.push(e), o.add(JSON.stringify(e)));
            function s(t) {
              let n = [...t];
              "days-asc" === e
                ? n.sort((e, t) => g(e) - g(t))
                : "days-desc" === e
                ? n.sort((e, t) => g(t) - g(e))
                : "sessions-asc" === e
                ? n.sort((e, t) => E(e) - E(t))
                : "sessions-desc" === e
                ? n.sort((e, t) => E(t) - E(e))
                : n.sort((e, t) => {
                    const n = x(e),
                      o = x(t);
                    if (n !== o) return o - n;
                    const s = e.filter(
                        (e) => "important" === e.importance
                      ).length,
                      c = e.filter(
                        (e) => "semi-important" === e.importance
                      ).length,
                      r = t.filter((e) => "important" === e.importance).length,
                      i = t.filter(
                        (e) => "semi-important" === e.importance
                      ).length;
                    return s !== r
                      ? r - s
                      : c !== i
                      ? c - i
                      : A.allowGaps
                      ? Y(e) - Y(t)
                      : 0;
                  }),
                (function (e) {
                  const t = document.getElementById("schedules-container");
                  (t.innerHTML = ""),
                    e.forEach((e, n) => {
                      const o = document.createElement("div");
                      o.className = "schedule-card";
                      const s = Y(e);
                      let c = "";
                      A.allowGaps && s > 0
                        ? (c = ` <span style="color: #666; font-weight: normal; font-size: 0.85em;">(${s} gap${
                            s > 1 ? "s" : ""
                          })</span>`)
                        : A.allowGaps &&
                          0 === s &&
                          (c =
                            ' <span style="color: #4CAF50; font-weight: normal; font-size: 0.85em;">(no gaps)</span>');
                      let r = `<h3>Schedule ${n + 1}${c}</h3>`;
                      r += '<div class="schedule-list">';
                      const i = [
                          "Saturday",
                          "Sunday",
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                        ],
                        a = {
                          "8:30": 0,
                          "10:30": 1,
                          "12:30": 2,
                          "14:30": 3,
                          "16:30": 4,
                          "18:30": 5,
                        };
                      e.sort((e, t) => {
                        const n = i.indexOf(v(e.day)),
                          o = i.indexOf(v(t.day));
                        if (n !== o) return n - o;
                        const s = e.time.split("-")[0],
                          c = t.time.split("-")[0];
                        return a[s] - a[c];
                      }),
                        e.forEach((e) => {
                          r += `<div class="schedule-item">\n          <div>${v(
                            e.day
                          )} ${e.time}</div>\n          <div><strong class="${
                            e.type
                          }">${e.course}</strong></div>\n          <div>${
                            e.instructor
                          }${e.group ? `, ${e.group}` : ""}${
                            e.room ? `, Room ${e.room}` : ""
                          }</div>\n        </div>`;
                        }),
                        (r += "</div>"),
                        (o.innerHTML = r),
                        t.appendChild(o);
                    });
                })(n);
            }
            (document.getElementById("schedule").innerHTML =
              '<div class="sort-controls"><label for="sort-select">Sort by:</label><select id="sort-select"><option value="default">Default</option><option value="days-asc">Days per week (Ascending)</option><option value="days-desc">Days per week (Descending)</option><option value="sessions-asc">Sessions per day (Ascending)</option><option value="sessions-desc">Sessions per day (Descending)</option></select></div><div id="schedules-container" class="schedules-container"></div>'),
              document
                .getElementById("sort-select")
                .addEventListener("change", function () {
                  (e = this.value), s(n);
                });
            const c = document.getElementById("schedules-container");
            if (0 === n.length) {
              const e = t,
                n = e.length,
                o = [];
              let s = 0;
              for (const t of e) {
                Q(t).valid && (s++, o.push({ combo: t, reasons: [] }));
              }
              let r = `<p>No valid schedules found. ${s}/${n} combinations passed basic checks.</p>`;
              const i = p.filter((e) => 0 === J(e).length);
              if (
                (i.length > 0 &&
                  ((r += `<p><strong>Note:</strong> ${i.length} course(s) were skipped because all their lectures/sections are excluded:</p>`),
                  (r += "<ul>"),
                  i.forEach((e) => {
                    r += `<li>${e.name}</li>`;
                  }),
                  (r += "</ul>")),
                (r += `<details><summary>Show diagnostics - Combinations that passed basic checks (${Math.min(
                  50,
                  o.length
                )} examples)</summary>`),
                0 === o.length)
              )
                r += "<p>No combinations passed basic checks.</p>";
              else
                for (let e = 0; e < Math.min(50, o.length); e++) {
                  const t = o[e];
                  (r +=
                    '<div style="border:1px solid #4CAF50; margin:8px; padding:8px; background-color:#f0f8f0;">'),
                    (r += `<strong>Valid Example ${e + 1}</strong><ul>`),
                    t.combo.forEach((e) => {
                      r += `<li>${e.course} - ${e.type} - ${
                        e.instructor
                      } (Group ${e.group || ""}) - ${e.day} ${e.time} in ${
                        e.room
                      }</li>`;
                    }),
                    (r +=
                      '</ul><div style="color:#2e7d32"><strong>Status:</strong> Passed all basic checks</div></div>');
                }
              return (r += "</details>"), void (c.innerHTML = r);
            }
            s(n);
          })();
    },
    s = Array.from(t).find(
      (e) =>
        e.classList.contains("bi") && e.classList.contains("bi-calendar4-week")
    );
  s &&
    s.addEventListener("click", function () {
      W();
    }),
    document
      .querySelectorAll("main section")
      .forEach((e) => (e.style.display = "none"));
  const c = () => {
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
      n >= 0 && o(n);
  };
  let r = window.innerWidth;
  window.addEventListener("resize", function () {
    window.innerWidth !== r && ((r = window.innerWidth), c());
  }),
    c();
  let i = !1;
  t.forEach((e, t) => {
    !i &&
      null !== e.offsetParent &&
      e.classList.contains("active") &&
      (o(t), (i = !0));
  }),
    i ||
      t.forEach((e, n) => {
        i ||
          null === e.offsetParent ||
          (o(n),
          t.forEach((e) => e.classList.remove("active")),
          e.classList.add("active"),
          (i = !0));
      }),
    t.forEach((e, n) => {
      e.addEventListener("click", function () {
        e.classList.contains("hidden") ||
          (t.forEach((e) => e.classList.remove("active")),
          e.classList.add("active"),
          o(n));
      });
    });
  const a = document.getElementById("addCourse"),
    d = document.getElementById("courseName"),
    l = document.getElementById("courseModal"),
    u = document.querySelector(".modal-backdrop"),
    m = document.getElementById("coursesList"),
    p = [];
  let y,
    f,
    h = null;
  function v(e) {
    return (
      {
        sun: "Sunday",
        mon: "Monday",
        tue: "Tuesday",
        wed: "Wednesday",
        thu: "Thursday",
        sat: "Saturday",
      }[e] || e
    );
  }
  function g(e) {
    return new Set(e.map((e) => e.day)).size;
  }
  function E(e) {
    const t = {};
    return (
      e.forEach((e) => {
        t[e.day] = (t[e.day] || 0) + 1;
      }),
      Math.max(...Object.values(t), 0)
    );
  }
  function x(e) {
    let t = 0;
    return (
      e.forEach((e) => {
        const n = e.course,
          o = e.instructor,
          s = e.type;
        if (A.preferredInstructors[n]) {
          const e = A.preferredInstructors[n];
          "lecture" === s && e.lecture === o
            ? (t += 10)
            : "section" === s && e.section === o && (t += 10);
        }
      }),
      t
    );
  }
  function k(e) {
    (h = e), (y.innerHTML = ""), (f.innerHTML = "");
    const t =
      "lectures" ===
      document.querySelector(".tab-button.active").getAttribute("data-tab")
        ? e.lecturesImportance || "important"
        : e.sectionsImportance || "important";
    b({ day: "sat", period: "8:30", importance: t });
    const n = e.lecturesImportance || "important",
      o = {};
    e.lectures.forEach((e) => {
      o[e.instructor] || (o[e.instructor] = []), o[e.instructor].push(e);
    }),
      Object.keys(o)
        .reverse()
        .forEach((t) => {
          const n = o[t],
            s = document.createElement("div");
          s.className = "item";
          let c = n
            .map(
              (e) =>
                `${v(e.day)} ${e.period} ${
                  e.group ? `${e.group}` : ""
                } - Room ${e.room}`
            )
            .join("<br>");
          (s.innerHTML = `\n          <div>\n            <strong>${t}</strong><br>\n            ${c}\n          </div>\n          <button class="remove-btn">×</button>\n        `),
            y.appendChild(s),
            s
              .querySelector(".remove-btn")
              .addEventListener("click", function () {
                (e.lectures = e.lectures.filter((e) => e.instructor !== t)),
                  s.remove(),
                  H();
              });
        });
    {
      const e = document.createElement("div");
      (e.className = "item"),
        (e.innerHTML = `<div><strong>Lectures Importance: ${n}</strong></div>`),
        y.appendChild(e);
    }
    const s = e.sectionsImportance || "important",
      c = {};
    e.sections.forEach((e) => {
      c[e.instructor] || (c[e.instructor] = []), c[e.instructor].push(e);
    }),
      Object.keys(c)
        .reverse()
        .forEach((t) => {
          const n = c[t],
            o = document.createElement("div");
          o.className = "item";
          let s = n
            .map(
              (e) =>
                `${v(e.day)} ${e.period} ${
                  e.group ? `${e.group}` : ""
                } - Room ${e.room}`
            )
            .join("<br>");
          (o.innerHTML = `\n          <div>\n            <strong>${t}</strong><br>\n            ${s}\n          </div>\n          <button class="remove-btn">×</button>\n        `),
            f.appendChild(o),
            o
              .querySelector(".remove-btn")
              .addEventListener("click", function () {
                (e.sections = e.sections.filter((e) => e.instructor !== t)),
                  o.remove(),
                  H();
              });
        });
    {
      const e = document.createElement("div");
      (e.className = "item"),
        (e.innerHTML = `<div><strong>Sections Importance: ${s}</strong></div>`),
        f.appendChild(e);
    }
  }
  function b() {
    (document.getElementById("instructorName").value = ""),
      (document.getElementById("roomNumber").value = ""),
      (document.getElementById("groupNumber").value = ""),
      (document.getElementById("instructorNameSection").value = ""),
      (document.getElementById("roomNumberSection").value = ""),
      (document.getElementById("groupNumberSection").value = ""),
      document.querySelectorAll('input[name="day"]').forEach((e) => {
        e.checked = "sat" === e.value;
      }),
      document.querySelectorAll('input[name="period"]').forEach((e) => {
        e.checked = "8:30" === e.value;
      }),
      document.querySelectorAll('input[name="importance"]').forEach((e) => {
        e.checked = "important" === e.value;
      });
  }
  function S() {
    document.querySelectorAll("#coursesList .item").forEach((e, t) => {
      e.dataset.courseIndex = t;
    });
  }
  a.addEventListener("click", function () {
    const e = d.value.trim();
    if (e) {
      const t = p.find((t) => t.name === e);
      if (t) return k(t), l.classList.add("show"), void (d.value = "");
      const n = {
        name: e,
        lectures: [],
        sections: [],
        lecturesImportance: "important",
        sectionsImportance: "important",
      };
      p.push(n), H();
      const o = document.createElement("div");
      (o.className = "item"),
        (o.dataset.courseIndex = p.length - 1),
        (o.innerHTML = `\n        <div>\n          <strong>${e}</strong>\n        </div>\n        <div style="display: flex; align-items: center; gap: 5px;">\n          <button class="edit-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>\n          <button class="remove-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>\n        </div>\n      `),
        m.insertBefore(o, m.firstChild),
        (d.value = ""),
        k(n),
        l.classList.add("show"),
        o.querySelector(".edit-btn").addEventListener("click", function () {
          const e = this.parentElement.parentElement.dataset.courseIndex;
          k(p[e]), l.classList.add("show");
        }),
        o.querySelector(".remove-btn").addEventListener("click", function () {
          const e = this.parentElement.parentElement.dataset.courseIndex,
            t = p[e].name;
          A.preferredInstructors[t] && delete A.preferredInstructors[t],
            p.splice(e, 1),
            S(),
            this.parentElement.parentElement.remove(),
            H();
        });
    }
  }),
    u.addEventListener("click", function () {
      l.classList.remove("show");
    });
  const L = document.querySelectorAll(".tab-button"),
    I = document.querySelectorAll(".tab-pane");
  let $ = { day: "sat", period: "8:30", importance: "important" },
    w = { day: "sat", period: "8:30", importance: "important" };
  function b(e) {
    (document.querySelector(`input[name="day"][value="${e.day}"]`).checked =
      !0),
      (document.querySelector(
        `input[name="period"][value="${e.period}"]`
      ).checked = !0),
      (document.querySelector(
        `input[name="importance"][value="${e.importance}"]`
      ).checked = !0);
  }
  L.forEach((e) => {
    e.addEventListener("click", function () {
      const e = this.getAttribute("data-tab");
      if (
        (L.forEach((e) => e.classList.remove("active")),
        I.forEach((e) => e.classList.remove("active")),
        this.classList.add("active"),
        document.getElementById(e + "-tab").classList.add("active"),
        "lectures" === e)
      ) {
        const e = (h && h.lecturesImportance) || "important";
        b({ ...$, importance: e });
      } else if ("sections" === e) {
        const e = (h && h.sectionsImportance) || "important";
        b({ ...$, importance: e });
      }
    });
  }),
    document
      .querySelectorAll('.filter-switch input[type="radio"]')
      .forEach((e) => {
        e.addEventListener("change", (e) => {
          const t = document
              .querySelector(".tab-button.active")
              .getAttribute("data-tab"),
            n = document.querySelector('input[name="day"]:checked').value,
            o = document.querySelector('input[name="period"]:checked').value,
            s = document.querySelector(
              'input[name="importance"]:checked'
            ).value;
          h &&
            e.target &&
            "importance" === e.target.name &&
            ("lectures" === t
              ? (h.lecturesImportance = s)
              : "sections" === t && (h.sectionsImportance = s),
            H(),
            k(h)),
            "lectures" === t
              ? ($ = { day: n, period: o, importance: s })
              : "sections" === t && (w = { day: n, period: o, importance: s });
        });
      });
  const B = document.getElementById("addLecture"),
    D = document.getElementById("instructorName"),
    T = document.getElementById("roomNumber"),
    M = document.getElementById("groupNumber");
  (y = document.getElementById("lecturesList")),
    B.addEventListener("click", function () {
      const e = D.value.trim(),
        t = T.value.trim(),
        n = M.value.trim(),
        o = document.querySelector('input[name="day"]:checked').value,
        s = document.querySelector('input[name="period"]:checked').value;
      if (e && t && h) {
        h.lecturesImportance = document.querySelector(
          'input[name="importance"]:checked'
        ).value;
        const c = { instructor: e, room: t, group: n, day: o, period: s };
        h.lectures.push(c),
          H(),
          k(h),
          (D.value = ""),
          (T.value = ""),
          (M.value = "");
      }
    });
  const P = document.getElementById("addSection"),
    N = document.getElementById("instructorNameSection"),
    C = document.getElementById("roomNumberSection"),
    q = document.getElementById("groupNumberSection");
  let H = function () {};
  function W() {
    (m.innerHTML = ""),
      p.forEach((e, t) => {
        const n = document.createElement("div");
        (n.className = "item"),
          (n.dataset.courseIndex = t),
          (n.innerHTML = `\n        <div>\n          <strong>${e.name}</strong>\n        </div>\n        <div style="display: flex; align-items: center; gap: 5px;">\n          <button class="edit-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>\n          <button class="remove-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>\n        </div>\n      `),
          m.insertBefore(n, m.firstChild),
          n.querySelector(".edit-btn").addEventListener("click", function () {
            const e = this.parentElement.parentElement.dataset.courseIndex;
            k(p[e]), l.classList.add("show");
          }),
          n.querySelector(".remove-btn").addEventListener("click", function () {
            const e = this.parentElement.parentElement.dataset.courseIndex,
              t = p[e].name;
            A.preferredInstructors[t] && delete A.preferredInstructors[t],
              p.splice(e, 1),
              S(),
              this.parentElement.parentElement.remove(),
              H();
          });
      });
  }
  (f = document.getElementById("sectionsList")),
    P.addEventListener("click", function () {
      const e = N.value.trim(),
        t = C.value.trim(),
        n = q.value.trim(),
        o = document.querySelector('input[name="day"]:checked').value,
        s = document.querySelector('input[name="period"]:checked').value;
      if (e && t && h) {
        h.sectionsImportance = document.querySelector(
          'input[name="importance"]:checked'
        ).value;
        const c = { instructor: e, room: t, group: n, day: o, period: s };
        h.sections.push(c),
          H(),
          k(h),
          (N.value = ""),
          (C.value = ""),
          (q.value = "");
      }
    });
  let A = {
    excludedDays: [],
    excludedPeriods: [],
    excludedLectures: [],
    excludedSections: [],
    excludedTimeSlots: [],
    minDaysPerWeek: 1,
    maxDaysPerDay: 6,
    minSessionsPerDay: 1,
    maxSessionsPerDay: 6,
    allowGaps: !1,
    preferredInstructors: {},
  };
  function O() {
    const e = document.getElementById("excluded-days-list");
    (e.innerHTML = ""),
      [
        { key: "sat", label: "Saturday" },
        { key: "sun", label: "Sunday" },
        { key: "mon", label: "Monday" },
        { key: "tue", label: "Tuesday" },
        { key: "wed", label: "Wednesday" },
        { key: "thu", label: "Thursday" },
      ].forEach((t) => {
        if (A.excludedDays.includes(t.key)) {
          const n = j(t.label, () => {
            (A.excludedDays = A.excludedDays.filter((e) => e !== t.key)), O();
          });
          e.appendChild(n);
        }
      });
    const t = document.getElementById("excluded-periods-list");
    (t.innerHTML = ""),
      [
        { key: "8:30", label: "8:30" },
        { key: "10:30", label: "10:30" },
        { key: "12:30", label: "12:30" },
        { key: "14:30", label: "14:30" },
        { key: "16:30", label: "16:30" },
        { key: "18:30", label: "18:30" },
      ].forEach((e) => {
        if (A.excludedPeriods.includes(e.key)) {
          const n = j(e.label, () => {
            (A.excludedPeriods = A.excludedPeriods.filter((t) => t !== e.key)),
              O();
          });
          t.appendChild(n);
        }
      });
    const n = document.getElementById("excluded-lectures-list"),
      o = document.getElementById("add-lecture-select");
    (n.innerHTML = ""),
      (o.innerHTML = '<option value="">Select a lecture to exclude</option>'),
      p.forEach((e) => {
        e.lectures.forEach((t, n) => {
          const s = `${e.name}|${t.instructor}|${t.day}|${t.period}`,
            c = `${e.name} - ${t.instructor} (${t.day} ${t.period})`,
            r = document.createElement("option");
          (r.value = s), (r.textContent = c), o.appendChild(r);
        });
      }),
      A.excludedLectures.forEach((e, t) => {
        const o = j(
          `${e.course} - ${e.instructor} (${e.day} ${e.period})`,
          () => {
            A.excludedLectures.splice(t, 1), O();
          }
        );
        n.appendChild(o);
      });
    const s = document.getElementById("excluded-sections-list"),
      c = document.getElementById("add-section-select");
    (s.innerHTML = ""),
      (c.innerHTML = '<option value="">Select a section to exclude</option>'),
      p.forEach((e) => {
        e.sections.forEach((t, n) => {
          const o = `${e.name}|${t.instructor}|${t.day}|${t.period}`,
            s = `${e.name} - ${t.instructor} (${t.day} ${t.period})`,
            r = document.createElement("option");
          (r.value = o), (r.textContent = s), c.appendChild(r);
        });
      }),
      A.excludedSections.forEach((e, t) => {
        const n = j(
          `${e.course} - ${e.instructor} (${e.day} ${e.period})`,
          () => {
            A.excludedSections.splice(t, 1), O();
          }
        );
        s.appendChild(n);
      });
    const r = document.getElementById("excluded-timeslots-list");
    (r.innerHTML = ""),
      A.excludedTimeSlots.forEach((e, t) => {
        const n = j(
          `${
            {
              sat: "Saturday",
              sun: "Sunday",
              mon: "Monday",
              tue: "Tuesday",
              wed: "Wednesday",
              thu: "Thursday",
            }[e.day] || e.day
          } ${e.period}`,
          () => {
            A.excludedTimeSlots.splice(t, 1), O();
          }
        );
        r.appendChild(n);
      });
  }
  function j(e, t) {
    const n = document.createElement("div");
    n.className = "exclusion-item";
    const o = document.createElement("div");
    (o.className = "exclusion-item-content"), (o.textContent = e);
    const s = document.createElement("div");
    s.className = "exclusion-item-actions";
    const c = document.createElement("button");
    return (
      (c.className = "delete"),
      (c.innerHTML =
        '\n      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n        <polyline points="3,6 5,6 21,6"></polyline>\n        <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>\n        <line x1="10" y1="11" x2="10" y2="17"></line>\n        <line x1="14" y1="11" x2="14" y2="17"></line>\n      </svg>\n    '),
      c.addEventListener("click", t),
      s.appendChild(c),
      n.appendChild(o),
      n.appendChild(s),
      n
    );
  }
  function G() {
    const e = document.getElementById("preferred-instructors-list");
    (e.innerHTML = ""),
      Object.entries(A.preferredInstructors).forEach(([t, n]) => {
        if (n.lecture) {
          const o = document.createElement("div");
          (o.className = "preference-item-container"),
            (o.innerHTML = `\n          <div class="preference-item-info">\n            ${t} - Lecture: ${n.lecture}\n          </div>\n          <button class="preference-remove-btn" data-course="${t}" data-type="lecture">×</button>\n        `),
            e.appendChild(o);
        }
        if (n.section) {
          const o = document.createElement("div");
          (o.className = "preference-item-container"),
            (o.innerHTML = `\n          <div class="preference-item-info">\n            ${t} - Section: ${n.section}\n          </div>\n          <button class="preference-remove-btn" data-course="${t}" data-type="section">×</button>\n        `),
            e.appendChild(o);
        }
      }),
      e.querySelectorAll(".preference-remove-btn").forEach((e) => {
        e.addEventListener("click", function () {
          const e = this.dataset.course,
            t = this.dataset.type;
          A.preferredInstructors[e] &&
            (delete A.preferredInstructors[e][t],
            A.preferredInstructors[e].lecture ||
              A.preferredInstructors[e].section ||
              delete A.preferredInstructors[e]),
            G();
        });
      });
  }
  document.querySelectorAll(".exclusion-btn").forEach((e) => {
    e.addEventListener("click", function () {
      var e;
      (e = `${this.dataset.type}Modal`),
        document.getElementById(e).classList.add("show");
    });
  }),
    document.querySelectorAll(".add-exclusion-btn").forEach((e) => {
      e.addEventListener("click", function () {
        let e, t, n;
        switch (this.dataset.type) {
          case "days":
            (e = document.getElementById("add-day-select")),
              (t = A.excludedDays),
              (n = e.value) && !t.includes(n) && t.push(n);
            break;
          case "periods":
            (e = document.getElementById("add-period-select")),
              (t = A.excludedPeriods),
              (n = e.value) && !t.includes(n) && t.push(n);
            break;
          case "lectures":
            const o = (e = document.getElementById("add-lecture-select")).value;
            if (o) {
              const [e, t, n, s] = o.split("|");
              A.excludedLectures.some(
                (o) =>
                  o.course === e &&
                  o.instructor === t &&
                  o.day === n &&
                  o.period === s
              ) ||
                A.excludedLectures.push({
                  course: e,
                  instructor: t,
                  day: n,
                  period: s,
                });
            }
            break;
          case "sections":
            const s = (e = document.getElementById("add-section-select")).value;
            if (s) {
              const [e, t, n, o] = s.split("|");
              A.excludedSections.some(
                (s) =>
                  s.course === e &&
                  s.instructor === t &&
                  s.day === n &&
                  s.period === o
              ) ||
                A.excludedSections.push({
                  course: e,
                  instructor: t,
                  day: n,
                  period: o,
                });
            }
            break;
          case "timeslots":
            const c = document.getElementById("add-timeslot-day-select").value,
              r = document.getElementById("add-timeslot-period-select").value;
            c &&
              r &&
              (A.excludedTimeSlots.push({ day: c, period: r }),
              (document.getElementById("add-timeslot-day-select").value = ""),
              (document.getElementById("add-timeslot-period-select").value =
                ""));
        }
        e && (e.value = ""), O();
      });
    }),
    document
      .querySelectorAll(".exclusion-modal .modal-backdrop")
      .forEach((e) => {
        e.addEventListener("click", function () {
          this.closest(".exclusion-modal").classList.remove("show");
        });
      }),
    document
      .querySelectorAll('#constraints input[type="checkbox"]:not([data-type])')
      .forEach((e) => {
        e.addEventListener("change", function () {
          const e = this.id;
          if (e.startsWith("exclude-"))
            if (
              e.includes("sat") ||
              e.includes("sun") ||
              e.includes("mon") ||
              e.includes("tue") ||
              e.includes("wed") ||
              e.includes("thu")
            ) {
              const t = e.replace("exclude-", "");
              this.checked
                ? A.excludedDays.includes(t) || A.excludedDays.push(t)
                : (A.excludedDays = A.excludedDays.filter((e) => e !== t));
            } else if (
              e.includes("830") ||
              e.includes("1030") ||
              e.includes("1230") ||
              e.includes("1430") ||
              e.includes("1630") ||
              e.includes("1830")
            ) {
              const t = {
                830: "8:30",
                1030: "10:30",
                1230: "12:30",
                1430: "14:30",
                1630: "16:30",
                1830: "18:30",
              }[e.replace("exclude-", "")];
              this.checked
                ? A.excludedPeriods.includes(t) || A.excludedPeriods.push(t)
                : (A.excludedPeriods = A.excludedPeriods.filter(
                    (e) => e !== t
                  ));
            } else "allow-gaps" === e && (A.allowGaps = this.checked);
        });
      }),
    document
      .querySelectorAll('#constraints input[type="number"]')
      .forEach((e) => {
        e.addEventListener("change", function () {
          const e = this.id,
            t = parseInt(this.value);
          "min-days-week" === e
            ? (A.minDaysPerWeek = t)
            : "max-days-week" === e
            ? (A.maxDaysPerWeek = t)
            : "min-sessions-day" === e
            ? (A.minSessionsPerDay = t)
            : "max-sessions-day" === e && (A.maxSessionsPerDay = t);
        });
      }),
    document.addEventListener("DOMContentLoaded", function () {
      const e = document.getElementById("add-preferred-instructor");
      e &&
        e.addEventListener("click", function () {
          const e = document.getElementById("course-select"),
            t = document.getElementById("instructor-type-select"),
            n = document.getElementById("instructor-select"),
            o = e.value,
            s = t.value,
            c = n.value;
          o &&
            s &&
            c &&
            (A.preferredInstructors[o] || (A.preferredInstructors[o] = {}),
            (A.preferredInstructors[o][s] = c),
            (e.value = ""),
            (t.value = ""),
            (n.value = ""),
            (n.innerHTML = '<option value="">Select instructor</option>'),
            G());
        });
    });
  const z = H;
  function R() {
    const e = [];
    return (
      (function t(n, o) {
        if (n === p.length) return void e.push([...o]);
        const s = J(p[n]);
        if (0 !== s.length)
          for (const e of s) o.push(...e), t(n + 1, o), o.splice(-e.length);
        else t(n + 1, o);
      })(0, []),
      e
    );
  }
  function J(e) {
    if (
      "not-important" === e.lecturesImportance &&
      "not-important" === e.sectionsImportance
    )
      return [];
    const t = [],
      n = e.lectures.filter(
        (t) =>
          !(function (e, t) {
            return A.excludedLectures.some(
              (n) =>
                n.course === e.name &&
                n.instructor === t.instructor &&
                n.day === t.day &&
                n.period === t.period
            );
          })(e, t)
      ),
      o = e.sections.filter(
        (t) =>
          !(function (e, t) {
            return A.excludedSections.some(
              (n) =>
                n.course === e.name &&
                n.instructor === t.instructor &&
                n.day === t.day &&
                n.period === t.period
            );
          })(e, t)
      ),
      s = "not-important" !== e.lecturesImportance ? n : [],
      c = "not-important" !== e.sectionsImportance ? o : [];
    if (s.length > 0 && c.length > 0) {
      const n = {};
      s.forEach((e) => {
        n[e.instructor] || (n[e.instructor] = []), n[e.instructor].push(e);
      });
      const o = {};
      c.forEach((e) => {
        o[e.instructor] || (o[e.instructor] = []), o[e.instructor].push(e);
      });
      for (const s in n) {
        const c = new Set(n[s].map((e) => e.group));
        for (const r in o) {
          const i = new Set(o[r].map((e) => e.group));
          if ([...c].filter((e) => i.has(e)).length > 0)
            for (const c of n[s])
              for (const n of o[r])
                t.push([
                  {
                    course: e.name,
                    type: "lecture",
                    instructor: c.instructor,
                    group: c.group,
                    day: c.day,
                    time: c.period,
                    room: c.room,
                    importance: e.lecturesImportance || "important",
                    index: e.lectures.indexOf(c),
                  },
                  {
                    course: e.name,
                    type: "section",
                    instructor: n.instructor,
                    group: n.group,
                    day: n.day,
                    time: n.period,
                    room: n.room,
                    importance: e.sectionsImportance || "important",
                    index: e.sections.indexOf(n),
                  },
                ]);
        }
      }
    } else if (s.length > 0)
      for (const n of s)
        t.push([
          {
            course: e.name,
            type: "lecture",
            instructor: n.instructor,
            group: n.group,
            day: n.day,
            time: n.period,
            room: n.room,
            importance: e.lecturesImportance || "important",
            index: e.lectures.indexOf(n),
          },
        ]);
    else if (c.length > 0)
      for (const n of c)
        t.push([
          {
            course: e.name,
            type: "section",
            instructor: n.instructor,
            group: n.group,
            day: n.day,
            time: n.period,
            room: n.room,
            importance: e.sectionsImportance || "important",
            index: e.sections.indexOf(n),
          },
        ]);
    return t.sort((e, t) => {
      const n = x(e);
      return x(t) - n;
    });
  }
  H = function () {
    z(),
      O(),
      (function () {
        const e = document.getElementById("course-select"),
          t = document.getElementById("instructor-type-select"),
          n = document.getElementById("instructor-select");
        function o() {
          const o = e.value,
            s = t.value;
          if (
            ((n.innerHTML = '<option value="">Select instructor</option>'),
            o && s)
          ) {
            const e = p.find((e) => e.name === o);
            if (e) {
              const t = "lecture" === s ? e.lectures : e.sections;
              [...new Set(t.map((e) => e.instructor))].forEach((e) => {
                const t = document.createElement("option");
                (t.value = e), (t.textContent = e), n.appendChild(t);
              });
            }
          }
        }
        (e.innerHTML = '<option value="">Select a course</option>'),
          p.forEach((t) => {
            const n = document.createElement("option");
            (n.value = t.name), (n.textContent = t.name), e.appendChild(n);
          }),
          e.addEventListener("change", o),
          t.addEventListener("change", o);
      })(),
      G();
  };
  const U = R(),
    F = [],
    V = new Set();
  for (const e of U) K(e) && !X(e, V) && (F.push(e), V.add(JSON.stringify(e)));
  function K(e) {
    const t = new Map();
    for (const n of e) {
      const e = `${n.day}-${n.time}`;
      t.has(e) || t.set(e, []), t.get(e).push(n);
    }
    for (const [n, o] of t)
      if (o.length > 1) {
        const t = o.filter((e) => "important" === e.importance),
          s = o.filter((e) => "semi-important" === e.importance);
        if (t.length > 1 || s.length > 1) return !1;
        if (t.length > 0 && s.length > 0)
          for (let t = e.length - 1; t >= 0; t--) {
            const o = e[t];
            "semi-important" === o.importance &&
              `${o.day}-${o.time}` === n &&
              e.splice(t, 1);
          }
      }
    for (const t of e) {
      const e = {
        Saturday: "sat",
        Sunday: "sun",
        Monday: "mon",
        Tuesday: "tue",
        Wednesday: "wed",
        Thursday: "thu",
      }[t.day];
      if (e && A.excludedDays.includes(e)) return !1;
      const n = t.time.split("-")[0];
      if (A.excludedPeriods.includes(n)) return !1;
      if (A.excludedTimeSlots.some((t) => t.day === e && t.period === n))
        return !1;
      if (
        "lecture" === t.type &&
        A.excludedLectures.some(
          (e) =>
            e.course === t.course &&
            e.instructor === t.instructor &&
            e.day === t.day &&
            e.period === t.time
        )
      )
        return !1;
      if (
        "section" === t.type &&
        A.excludedSections.some(
          (e) =>
            e.course === t.course &&
            e.instructor === t.instructor &&
            e.day === t.day &&
            e.period === t.time
        )
      )
        return !1;
    }
    const n = new Set(e.map((e) => e.day)).size;
    if (n < A.minDaysPerWeek || n > A.maxDaysPerWeek) return !1;
    const o = {};
    for (const t of e) o[t.day] = (o[t.day] || 0) + 1;
    for (const e of Object.values(o))
      if (e < A.minSessionsPerDay || e > A.maxSessionsPerDay) return !1;
    if (!A.allowGaps) {
      const t = {
        "8:30": 0,
        "10:30": 1,
        "12:30": 2,
        "14:30": 3,
        "16:30": 4,
        "18:30": 5,
      };
      for (const n in o) {
        const o = e
          .filter((e) => e.day === n)
          .map((e) => t[e.time.split("-")[0]])
          .sort((e, t) => e - t);
        if (o.length > 1)
          for (let e = 0; e < o.length - 1; e++)
            if (o[e + 1] !== o[e] + 1) return !1;
      }
    }
    return !0;
  }
  function Q(e) {
    const t = [],
      n = new Map();
    for (const t of e) {
      const e = `${t.day}-${t.time}`;
      n.has(e) || n.set(e, []), n.get(e).push(t);
    }
    for (const [e, o] of n)
      if (o.length > 1) {
        const e = o.filter((e) => "important" === e.importance),
          n = o.filter((e) => "semi-important" === e.importance);
        e.length > 1 &&
          t.push(`Multiple important sessions at ${o[0].day} ${o[0].time}`),
          n.length > 1 &&
            t.push(
              `Multiple semi-important sessions at ${o[0].day} ${o[0].time}`
            );
      }
    for (const n of e) {
      const e = {
        Saturday: "sat",
        Sunday: "sun",
        Monday: "mon",
        Tuesday: "tue",
        Wednesday: "wed",
        Thursday: "thu",
      }[n.day];
      e && A.excludedDays.includes(e) && t.push(`Excluded day: ${n.day}`);
      const o = n.time.split("-")[0];
      A.excludedPeriods.includes(o) && t.push(`Excluded period: ${o}`),
        A.excludedTimeSlots.some((t) => t.day === e && t.period === o) &&
          t.push(`Excluded time slot: ${n.day} ${o}`),
        "lecture" === n.type &&
          A.excludedLectures.some(
            (e) =>
              e.course === n.course &&
              e.instructor === n.instructor &&
              e.day === n.day &&
              e.period === n.time
          ) &&
          t.push(
            `Excluded lecture: ${n.course} - ${n.instructor} (${n.day} ${n.time})`
          ),
        "section" === n.type &&
          A.excludedSections.some(
            (e) =>
              e.course === n.course &&
              e.instructor === n.instructor &&
              e.day === n.day &&
              e.period === n.time
          ) &&
          t.push(
            `Excluded section: ${n.course} - ${n.instructor} (${n.day} ${n.time})`
          );
    }
    const o = new Set(e.map((e) => e.day)).size;
    o < A.minDaysPerWeek && t.push(`Too few days (${o} < ${A.minDaysPerWeek})`),
      o > A.maxDaysPerWeek &&
        t.push(`Too many days (${o} > ${A.maxDaysPerWeek})`);
    const s = {};
    for (const t of e) s[t.day] = (s[t.day] || 0) + 1;
    for (const [e, n] of Object.entries(s))
      n < A.minSessionsPerDay &&
        t.push(`Day ${e} has too few sessions (${n} < ${A.minSessionsPerDay})`),
        n > A.maxSessionsPerDay &&
          t.push(
            `Day ${e} has too many sessions (${n} > ${A.maxSessionsPerDay})`
          );
    if (!A.allowGaps) {
      const n = {
        "8:30": 0,
        "10:30": 1,
        "12:30": 2,
        "14:30": 3,
        "16:30": 4,
        "18:30": 5,
      };
      for (const [o, c] of Object.entries(s)) {
        const s = e
          .filter((e) => e.day === o)
          .map((e) => n[e.time.split("-")[0]])
          .sort((e, t) => e - t);
        if (s.length > 1)
          for (let e = 0; e < s.length - 1; e++)
            s[e + 1] !== s[e] + 1 &&
              t.push(
                `Gap on ${o} between periods index ${s[e]} and ${s[e + 1]}`
              );
      }
    }
    return { valid: 0 === t.length, reasons: t };
  }
  function X(e, t) {
    const n = JSON.stringify(e);
    return t.has(n);
  }
  function Y(e) {
    const t = {
      "8:30": 0,
      "10:30": 1,
      "12:30": 2,
      "14:30": 3,
      "16:30": 4,
      "18:30": 5,
    };
    let n = 0;
    const o = {};
    for (const n of e)
      o[n.day] || (o[n.day] = []), o[n.day].push(t[n.time.split("-")[0]]);
    for (const e in o) {
      const t = o[e].sort((e, t) => e - t);
      if (t.length > 1)
        for (let e = 0; e < t.length - 1; e++) {
          const o = t[e + 1] - t[e] - 1;
          o > 0 && (n += o);
        }
    }
    return n;
  }
  function Z() {
    const e = document.getElementById("allow-gaps");
    e && (A.allowGaps = e.checked);
    const t = document.getElementById("min-days-week"),
      n = document.getElementById("max-days-week"),
      o = document.getElementById("min-sessions-day"),
      s = document.getElementById("max-sessions-day");
    t && (A.minDaysPerWeek = parseInt(t.value) || 1),
      n && (A.maxDaysPerWeek = parseInt(n.value) || 6),
      o && (A.minSessionsPerDay = parseInt(o.value) || 1),
      s && (A.maxSessionsPerDay = parseInt(s.value) || 6);
  }
  W(),
    isNaN(A.minDaysPerWeek) && (A.minDaysPerWeek = 1),
    isNaN(A.maxDaysPerWeek) && (A.maxDaysPerWeek = 6),
    isNaN(A.minSessionsPerDay) && (A.minSessionsPerDay = 1),
    isNaN(A.maxSessionsPerDay) && (A.maxSessionsPerDay = 6),
    (document.getElementById("min-days-week").value = A.minDaysPerWeek),
    (document.getElementById("max-days-week").value = A.maxDaysPerWeek),
    (document.getElementById("min-sessions-day").value = A.minSessionsPerDay),
    (document.getElementById("max-sessions-day").value = A.maxSessionsPerDay),
    (document.getElementById("allow-gaps").checked = A.allowGaps),
    O();
  const _ = document.getElementById("courses"),
    ee = document.createElement("input");
  (ee.type = "file"), (ee.accept = ".json"), (ee.style.display = "none");
  const te = document.createElement("div");
  (te.style.display = "flex"),
    (te.style.justifyContent = "center"),
    (te.style.gap = "8px"),
    (te.style.margin = "12px 0");
  const ne = document.createElement("button");
  (ne.className = "exclusion-btn compact-btn"),
    (ne.innerHTML =
      '\n    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>\n      <polyline points="7,10 12,15 17,10"></polyline>\n      <line x1="12" y1="15" x2="12" y2="3"></line>\n    </svg>\n    Load Courses\n  '),
    ne.addEventListener("click", () => ee.click()),
    ee.addEventListener("change", (e) => {
      const t = e.target.files[0];
      if (t) {
        const e = new FileReader();
        (e.onload = (e) => {
          try {
            const t = (e) => {
                if (!e) return e;
                const t = { "2:30": "14:30", "4:30": "16:30", "6:30": "18:30" };
                return t[e] ? t[e] : e;
              },
              n = JSON.parse(e.target.result);
            p.length = 0;
            for (const e in n) {
              const o = {
                name: e,
                lectures: [],
                sections: [],
                lecturesImportance: n[e].Lectures.importance || "important",
                sectionsImportance: n[e].Sections.importance || "important",
              };
              for (const s in n[e].Lectures) {
                if ("importance" === s) continue;
                const c = n[e].Lectures[s];
                for (const e in c) {
                  const n = c[e];
                  o.lectures.push({
                    instructor: s,
                    group: e,
                    day: n.day,
                    period: t(n.time),
                    room: n.room,
                  });
                }
              }
              for (const s in n[e].Sections) {
                if ("importance" === s) continue;
                const c = n[e].Sections[s];
                for (const e in c) {
                  const n = c[e];
                  o.sections.push({
                    instructor: s,
                    group: e,
                    day: n.day,
                    period: t(n.time),
                    room: n.room,
                  });
                }
              }
              p.push(o);
            }
            W();
          } catch (e) {
            alert("Invalid JSON file");
          }
        }),
          e.readAsText(t);
      }
    });
  const oe = document.createElement("button");
  (oe.className = "exclusion-btn compact-btn"),
    (oe.innerHTML =
      '\n    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>\n      <polyline points="17,8 12,3 7,8"></polyline>\n      <line x1="12" y1="3" x2="12" y2="15"></line>\n    </svg>\n    Save Courses\n  '),
    oe.addEventListener("click", () => {
      const e = ((e) => {
          const t = {};
          return (
            p.forEach((e) => {
              t[e.name] = { Lectures: {}, Sections: {} };
              const n = e.lecturesImportance || "important",
                o = e.sectionsImportance || "important",
                s = {};
              e.lectures.forEach((e) => {
                s[e.instructor] || (s[e.instructor] = {}),
                  (s[e.instructor][e.group] = {
                    day: e.day,
                    time: e.period,
                    room: e.room,
                  });
              }),
                (t[e.name].Lectures = { importance: n, ...s });
              const c = {};
              e.sections.forEach((e) => {
                c[e.instructor] || (c[e.instructor] = {}),
                  (c[e.instructor][e.group] = {
                    day: e.day,
                    time: e.period,
                    room: e.room,
                  });
              }),
                (t[e.name].Sections = { importance: o, ...c });
            }),
            t
          );
        })(),
        t = new Blob([JSON.stringify(e, null, 2)], {
          type: "application/json",
        }),
        n = URL.createObjectURL(t),
        o = document.createElement("a");
      (o.href = n),
        (o.download = "courses.json"),
        o.click(),
        URL.revokeObjectURL(n);
    }),
    te.appendChild(ne),
    te.appendChild(oe),
    _.insertBefore(te, m),
    _.insertBefore(ee, m);
  const se = document.createElement("div");
  (se.className = "button-separator"), _.insertBefore(se, m);
});
