(function () {
  "use strict";

  /* ── CSS injected at runtime ────────────────────────────────────── */
  const style = document.createElement("style");
  style.textContent = `
    .field-error   { border-color: #ef4444 !important; box-shadow: 0 0 0 2px rgba(239,68,68,.15) !important; }
    .field-success { border-color: #22c55e !important; box-shadow: 0 0 0 2px rgba(34,197,94,.12) !important; }
    .error-msg {
      display: block;
      margin-top: 4px;
      font-size: 0.78rem;
      color: #ef4444;
      animation: errFadeIn .15s ease;
    }
    @keyframes errFadeIn { from { opacity:0; transform:translateY(-3px); } to { opacity:1; transform:translateY(0); } }
    .btn-save:disabled { opacity:.5; cursor:not-allowed; }
  `;
  document.head.appendChild(style);

  /* ── Field rules ────────────────────────────────────────────────── */
  const RULES = [
    {
      id: "national-id",
      label: "National ID",
      validate: (v) => /^\d{11}$/.test(v.trim()),
      message: "National ID must be exactly 11 digits.",
    },
    {
      id: "genotype",
      label: "Genotype",
      validate: (v) => v !== "",
      message: "Please select a genotype.",
    },
    {
      id: "gender",
      label: "Gender",
      validate: (v) => v !== "",
      message: "Please select a gender.",
    },
    {
      id: "first-name",
      label: "First Name",
      validate: (v) => /^[A-Za-z\s\-']{2,}$/.test(v.trim()),
      message: "First name must be at least 2 characters (letters, spaces, hyphens).",
    },
    {
      id: "last-name",
      label: "Last Name",
      validate: (v) => /^[A-Za-z\s\-']{2,}$/.test(v.trim()),
      message: "Last name must be at least 2 characters (letters, spaces, hyphens).",
    },
    {
      id: "mobile",
      label: "Mobile",
      validate: (v) => /^[+]?[\d\s\-]{10,15}$/.test(v.trim()),
      message: "Enter a valid mobile number (10–15 digits).",
    },
    {
      id: "email",
      label: "E-mail",
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      message: "Enter a valid email address.",
    },
    {
      id: "age",
      label: "Age",
      validate: (v) => {
        const n = Number(v);
        return Number.isInteger(n) && n >= 0 && n <= 150;
      },
      message: "Age must be a whole number between 0 and 150.",
    },
    {
      id: "department",
      label: "Department",
      validate: (v) => v.trim().length >= 2,
      message: "Department is required.",
    },
    {
      id: "dob",
      label: "Date of Birth",
      validate: (v) => {
        const d = new Date(v.trim());
        return !isNaN(d.getTime()) && d <= new Date();
      },
      message: "Enter a valid date of birth (must not be in the future).",
    },
    {
      id: "marital",
      label: "Marital Status",
      validate: (v) => v !== "",
      message: "Please select a marital status.",
    },
    {
      id: "blood-type",
      label: "Blood Type",
      validate: (v) => v !== "",
      message: "Please select a blood type.",
    },
    {
      id: "country",
      label: "Country",
      validate: (v) => v !== "",
      message: "Please select a country.",
    },
    {
      id: "zip",
      label: "Zip Code",
      validate: (v) => /^[A-Za-z0-9]{4,10}$/.test(v.trim()),
      message: "Zip code must be 4–10 alphanumeric characters.",
    },
    {
      id: "state",
      label: "State",
      validate: (v) => v !== "",
      message: "Please select a state.",
    },
    {
      id: "street",
      label: "Street",
      validate: (v) => v.trim().length >= 3,
      message: "Street address is required.",
    },
    {
      id: "city",
      label: "City",
      validate: (v) => v !== "",
      message: "Please select a city.",
    },
  ];

  /* ── Helper: find or create the error <span> beneath a field ─────── */
  function getErrorSpan(el) {
    const wrapper = el.closest(".field-row") || el.parentElement;
    let span = wrapper.querySelector(".error-msg");
    if (!span) {
      span = document.createElement("span");
      span.className = "error-msg";
      // Append after the input/select (or after input-icon-wrap)
      const target = el.closest(".input-icon-wrap") || el;
      target.insertAdjacentElement("afterend", span);
    }
    return span;
  }

  /* ── Validate a single rule; returns true if valid ──────────────── */
  function validateField(rule) {
    const el = document.getElementById(rule.id);
    if (!el) return true; // skip if not in DOM

    const valid = rule.validate(el.value);
    const span = getErrorSpan(el);

    if (valid) {
      el.classList.remove("field-error");
      el.classList.add("field-success");
      span.textContent = "";
    } else {
      el.classList.remove("field-success");
      el.classList.add("field-error");
      span.textContent = rule.message;
    }
    return valid;
  }

  /* ── Validate all rules; returns true only if everything passes ─── */
  function validateAll() {
    return RULES.map(validateField).every(Boolean);
  }

  /* ── Clear state for a single field ────────────────────────────── */
  function clearField(el) {
    if (!el) return;
    el.classList.remove("field-error", "field-success");
    const span = getErrorSpan(el);
    span.textContent = "";
  }

  /* ── Wire up live feedback on each field ──────────────────────── */
  RULES.forEach((rule) => {
    const el = document.getElementById(rule.id);
    if (!el) return;

    const eventType = el.tagName === "SELECT" ? "change" : "input";

    el.addEventListener(eventType, () => {
      validateField(rule);
    });

    // Also validate on blur so tabbing through shows errors
    el.addEventListener("blur", () => validateField(rule));
  });

  /* ── Save button – run full validation on click ─────────────────── */
  const saveBtn = document.querySelector(".btn-save");
  if (saveBtn) {
    saveBtn.addEventListener("click", (e) => {
      const allValid = validateAll();
      if (!allValid) {
        e.preventDefault();
        // Scroll the first error into view
        const firstError = document.querySelector(".field-error");
        if (firstError) {
          firstError.scrollIntoView({ behavior: "smooth", block: "center" });
          firstError.focus();
        }
      } else {
        // All valid – put your form-submission logic here
        console.log("Form is valid – ready to submit.");
        // Example: document.querySelector('form').submit();
      }
    });
  }

  /* ── Clear button – reset values AND all validation state ───────── */
  const clearBtn = document.querySelector(".btn-clear");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      RULES.forEach((rule) => {
        const el = document.getElementById(rule.id);
        if (!el) return;

        if (el.tagName === "SELECT") {
          el.selectedIndex = 0;
        } else {
          el.value = "";
        }
        clearField(el);
      });
    });
  }
})();