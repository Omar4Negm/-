/* ============ الإعدادات: عدّل من هنا ============ */
const DAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];

// ترتيب الأعمدة من اليمين إلى اليسار
const COLUMNS = [
  { key: "day",       label: "اليوم",           width: "12%" },
  { key: "date",      label: "التاريخ",         width: "15%" },
  { key: "game",      label: "اسم اللعبة",      width: "18%" },
  { key: "goal",      label: "الهدف",           width: "18%" },
  { key: "materials", label: "المواد والأدوات", width: "19%" },
  { key: "notes",     label: "الملاحظات",       width: "18%" },
];

const YEARS_BEFORE = 2;  // عدد السنوات قبل السنة الحالية في القائمة
const YEARS_AFTER = 5;   // عدد السنوات بعد السنة الحالية
const DATE_PLACEHOLDER = "اختر التاريخ";

/* ============ بناء الجدول ============ */
const CAL_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3"/>' +
  '<path d="M8 3v4M16 3v4M3 10h18"/></svg>';

function buildTable() {
  const head = document.querySelector("#grid thead");
  const body = document.querySelector("#grid tbody");

  head.innerHTML =
    "<tr>" + COLUMNS.map(c => `<th style="width:${c.width}">${c.label}</th>`).join("") + "</tr>";

  body.innerHTML = DAYS.map((day, i) => `
    <tr>
      <td class="day">${day}</td>
      <td>
        <label class="date-box">
          <span class="date-text" data-ph="${DATE_PLACEHOLDER}"></span>
          ${CAL_ICON}
          <input type="date" class="date-input" data-row="${i}" aria-label="تاريخ يوم ${day}">
        </label>
      </td>
      <td><textarea class="game-text" aria-label="اسم اللعبة - ${day}"></textarea></td>
      <td><textarea aria-label="الهدف - ${day}"></textarea></td>
      <td><textarea aria-label="المواد والأدوات - ${day}"></textarea></td>
      <td><textarea aria-label="الملاحظات - ${day}"></textarea></td>
    </tr>`).join("");
}

/* ============ التاريخ بصيغة 05/11/2026 ============ */
function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function bindDates() {
  document.querySelectorAll(".date-input").forEach(input => {
    const text = input.parentElement.querySelector(".date-text");
    const update = () => { text.textContent = formatDate(input.value); };
    input.addEventListener("input", update);
    input.addEventListener("change", update);
    // فتح التقويم عند النقر على أي مكان في الحقل
    input.addEventListener("click", () => {
      if (typeof input.showPicker === "function") {
        try { input.showPicker(); } catch (e) { /* المتصفح سيتولى الفتح */ }
      }
    });
  });
}

function setupTextareas() {
  document.querySelectorAll(".grid textarea").forEach(textarea => {
    const fitContent = () => {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.max(textarea.scrollHeight, textarea.parentElement.clientHeight)}px`;
    };

    textarea.addEventListener("input", fitContent);
    fitContent();
  });
}

/* ============ العام الدراسي: 2026 / 2027 ============ */
function setupYear() {
  const select = document.getElementById("yearStart");
  const end = document.getElementById("yearEnd");
  const now = new Date();
  // بعد شهر أغسطس نعتبر أن عامًا دراسيًا جديدًا بدأ
  const current = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;

  for (let y = current - YEARS_BEFORE; y <= current + YEARS_AFTER; y++) {
    select.add(new Option(y, y, false, y === current));
  }
  const sync = () => { end.textContent = Number(select.value) + 1; };
  select.addEventListener("change", sync);
  sync();
}

/* ============ الأزرار ============ */
function setupButtons() {
  const previewBtn = document.getElementById("btnPreview");
  const previewText = document.getElementById("btnPreviewText");

  previewBtn.addEventListener("click", () => {
    const on = document.body.classList.toggle("preview");
    previewText.textContent = on ? "إنهاء المعاينة" : "معاينة قبل الطباعة";
  });

  document.getElementById("btnPrint").addEventListener("click", () => window.print());
}

/* ============ ملاءمة الصفحة للشاشات الصغيرة (للعرض فقط) ============ */
function fitToScreen() {
  const sheet = document.getElementById("sheet");
  sheet.style.zoom = 1;
  const mmToPx = sheet.offsetWidth; // عرض الصفحة بالبكسل
  const scale = Math.min(1, (window.innerWidth - 16) / mmToPx);
  sheet.style.zoom = scale;
}

window.addEventListener("beforeprint", () => { document.getElementById("sheet").style.zoom = 1; });
window.addEventListener("afterprint", fitToScreen);
window.addEventListener("resize", fitToScreen);

/* ============ تشغيل ============ */
buildTable();
bindDates();
setupTextareas();
setupYear();
setupButtons();
fitToScreen();
