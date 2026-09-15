// ========================================
// PRIMA FITNESS CLUB — TRIAL INVITATION V4
// Mobile-first, normal scroll, no reveal/loader animations.
// ========================================

const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSemuJxc7TC7dRVGNmSC9sgX99qY2gkb9ECRJYomlRoII1lwPg/formResponse";
const ENTRY_NAME = "entry.964726218";
const ENTRY_WHATSAPP = "entry.1194023553";
const ENTRY_GUEST_COUNT = "entry.1804860749";

// URL example:
// https://domain.com/?to=Prof.%20Dr.%20Febri%20Al-Hafis&jabatan=Rektor
const params = new URLSearchParams(window.location.search);
const guestName = decodeURIComponent(params.get("to") || "GUEST")
  .replace(/\+/g, " ")
  .trim() || "GUEST";

const guestTitle = params.get("jabatan")
  ? decodeURIComponent(params.get("jabatan")).replace(/\+/g, " ").trim()
  : "";

const guestNameEl = document.getElementById("guestName");
const guestTitleEl = document.getElementById("guestTitle");
const formNameEl = document.getElementById("formName");
const thankYouNameEl = document.getElementById("thankYouName");

// Date parameter: ?date=2026-09-20 (also accepts DD-MM-YYYY / DD/MM/YYYY)
const rawDate = params.get("date") || "2026-09-20";

function parseEventDate(value) {
  let m = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3], 7, 0, 0);
  m = value.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/);
  if (m) return new Date(+m[3], +m[2] - 1, +m[1], 7, 0, 0);
  return new Date(2026, 8, 20, 7, 0, 0);
}

const eventDateObject = parseEventDate(rawDate);
const dayNames = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"];
const eventDayText = dayNames[eventDateObject.getDay()];
const eventDateText = `${monthNames[eventDateObject.getMonth()]} ${eventDateObject.getDate()}, ${eventDateObject.getFullYear()}`;

const monthNamesID = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const eventDateTextID = `${eventDateObject.getDate()} ${monthNamesID[eventDateObject.getMonth()]} ${eventDateObject.getFullYear()}`;
const countdownLabelEl = document.getElementById("countdownLabel");

document.querySelectorAll(".event-row span:first-child").forEach(el => el.textContent = eventDayText);
document.querySelectorAll(".event-row strong").forEach(el => el.textContent = eventDateText);
document.querySelectorAll(".info-card").forEach(card => {
  if (card.querySelector("span")?.textContent.trim() === "DATE") {
    const value = card.querySelector("strong");
    if (value) value.textContent = eventDateText;
  }
});
if (countdownLabelEl) {
  countdownLabelEl.textContent = `Menuju ${eventDateTextID}, pukul 07.00 WIB.`;
}

document.querySelectorAll(".detail-item").forEach(item => {
    const label = item.querySelector("span")?.textContent.trim().toUpperCase();

    if (label === "DATE") {
        const date = item.querySelector("strong");
        const day = item.querySelector("small");

        if (date) date.textContent = eventDateText;
        if (day) day.textContent = eventDayText;
    }
});

guestNameEl.textContent = guestName;
guestTitleEl.textContent = guestTitle;
formNameEl.value = guestName;
thankYouNameEl.textContent = guestName;

// ----------------------------------------
// MOBILE MENU
// ----------------------------------------
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

menuBtn.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

mobileMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

// ----------------------------------------
// MODAL HELPERS
// ----------------------------------------
function openModal(id) {
  const modal = document.getElementById(id);
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");

  if (!document.querySelector(".modal.active")) {
    document.body.classList.remove("modal-open");
  }
}

document.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", () => closeModal(button.dataset.close));
});

document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
  backdrop.addEventListener("click", () => closeModal(backdrop.parentElement.id));
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    const activeModal = document.querySelector(".modal.active");
    if (activeModal) closeModal(activeModal.id);
  }
});

// ----------------------------------------
// RSVP CHOICES
// YES -> show RSVP form
// NO  -> show simple thank-you message
// ----------------------------------------
document.getElementById("attendBtn").addEventListener("click", () => {
  formNameEl.value = guestName;
  openModal("formModal");
});

document.getElementById("declineBtn").addEventListener("click", () => {
  openModal("declineModal");
});

// ----------------------------------------
// GOOGLE FORM SUBMISSION
// Uses the user's exact Google Form entry IDs.
// ----------------------------------------
const rsvpForm = document.getElementById("rsvpForm");

rsvpForm.addEventListener("submit", event => {
  event.preventDefault();

  const whatsapp = document.getElementById("whatsapp").value.trim();
  const guestCount = document.getElementById("guestCount").value;

  if (!whatsapp || !guestCount) {
    rsvpForm.reportValidity();
    return;
  }

  const submitForm = document.createElement("form");
  submitForm.method = "POST";
  submitForm.action = GOOGLE_FORM_ACTION;
  submitForm.target = "googleFormFrame";
  submitForm.style.display = "none";

  const fields = {
    [ENTRY_NAME]: guestName,
    [ENTRY_WHATSAPP]: whatsapp,
    [ENTRY_GUEST_COUNT]: guestCount
  };

  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    submitForm.appendChild(input);
  });

  document.body.appendChild(submitForm);
  submitForm.submit();
  submitForm.remove();

  rsvpForm.reset();
  formNameEl.value = guestName;
  closeModal("formModal");
  openModal("thankYouModal");
});

// ----------------------------------------
// COUNTDOWN — 20 SEPTEMBER 2026, 07:00 WIB
// ----------------------------------------
const eventDate = eventDateObject.getTime();
const countdownIds = ["days", "hours", "minutes", "seconds"];

function updateCountdown() {
  const distance = eventDate - Date.now();

  if (distance <= 0) {
    countdownIds.forEach(id => {
      document.getElementById(id).textContent = "00";
    });
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);
