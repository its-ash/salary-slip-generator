const STORAGE_KEY = "salarySlipGeneratorData";
const THEME_KEY = "salarySlipTheme";

const fields = {
  companyName: document.getElementById("companyName"),
  companyAddress: document.getElementById("companyAddress"),
  companyPhone: document.getElementById("companyPhone"),
  companyLogo: document.getElementById("companyLogo"),
  employeeName: document.getElementById("employeeName"),
  employeeId: document.getElementById("employeeId"),
  salaryMonth: document.getElementById("salaryMonth"),
  desiredNetPay: document.getElementById("desiredNetPay"),
  includePf: document.getElementById("includePf"),
  includePt: document.getElementById("includePt"),
  error: document.getElementById("error"),
  themeToggle: document.getElementById("themeToggle")
};

const rows = {
  pf: document.getElementById("rowPf"),
  pt: document.getElementById("rowPt")
};

const out = {
  companyName: document.getElementById("outCompanyName"),
  companyAddress: document.getElementById("outCompanyAddress"),
  companyPhone: document.getElementById("outCompanyPhone"),
  employeeName: document.getElementById("outEmployeeName"),
  employeeId: document.getElementById("outEmployeeId"),
  month: document.getElementById("outMonth"),
  generatedDate: document.getElementById("outGeneratedDate"),
  basic: document.getElementById("outBasic"),
  hra: document.getElementById("outHra"),
  special: document.getElementById("outSpecial"),
  lta: document.getElementById("outLta"),
  reimbursement: document.getElementById("outReimbursement"),
  uniformAllowance: document.getElementById("outUniformAllowance"),
  professionalPursuits: document.getElementById("outProfessionalPursuits"),
  telephoneInternet: document.getElementById("outTelephoneInternet"),
  variablePay: document.getElementById("outVariablePay"),
  pf: document.getElementById("outPf"),
  pt: document.getElementById("outPt"),
  otherDeduction: document.getElementById("outOtherDeduction"),
  gross: document.getElementById("outGross"),
  deductions: document.getElementById("outDeductions"),
  netPay: document.getElementById("outNetPay"),
  logo: document.getElementById("logoPreview")
};

let savedLogoDataUrl = "";
let isPdfDownloadInProgress = false;

function formatCurrency(value) {
  return Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatMonth(value) {
  if (!value) return "-";
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleString("en-IN", { month: "long", year: "numeric" });
}

function slugifyFilenamePart(value, fallback) {
  const cleaned = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || fallback;
}

function buildPdfFilename() {
  const monthValue = formatMonth(fields.salaryMonth.value);
  const monthPart = monthValue === "-"
    ? "month"
    : slugifyFilenamePart(monthValue.replace(/\s+/g, "-"), "month");
  const namePart = slugifyFilenamePart(fields.employeeName.value, "employee");
  return `${monthPart}__${namePart}.pdf`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function downloadPdfWithFilename() {
  if (isPdfDownloadInProgress) {
    return;
  }

  isPdfDownloadInProgress = true;
  const filename = buildPdfFilename();
  const slipEl = document.getElementById("slip");
  const styleLink = '<link rel="stylesheet" href="style.css">';

  const printWindowMarkup = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(filename)}</title>
  ${styleLink}
  <style>
    body { padding: 0; margin: 0; background: #fff; }
    .no-print, .top-bar, .marquee, .construction-zone, .hit-counter, .color-squares, .footer { display: none !important; }
    .app { display: block !important; }
    .card { border: none; box-shadow: none; padding: 0; margin: 0; }
    .card__title-bar { display: none; }
    .card__content { border: none; box-shadow: none; padding: 0; margin: 0; }
    .slip { border: 2px solid #000; padding: 10px; min-width: 0; gap: 6px; }
    .slip__head { border-bottom: 2px solid #000; padding-bottom: 6px; }
    .slip__title { font-size: 1.1rem; color: #000 !important; animation: none !important; }
    .slip__company-name { font-size: 1rem; }
    .slip__company-meta { font-size: 0.78rem; }
    .slip__logo { width: 48px; height: 48px; }
    .slip__meta { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-bottom: 4px; font-size: 0.82rem; }
    .slip-table { font-size: 0.78rem; }
    .slip-table th, .slip-table td { border: 1px solid #000 !important; padding: 3px 6px; }
    .slip-table th { background: #e9ecef !important; color: #000 !important; font-weight: 700; }
    .slip__totals { gap: 6px; }
    .slip__total-item { border: 1px solid #000; padding: 4px 6px; font-size: 0.85rem; }
    .slip__total-item--full { grid-column: span 2; border: 2px solid #000; background: #f8f9fa !important; color: #000 !important; font-size: 0.95rem; }
    .slip__note { margin-top: 6px; font-size: 0.74rem; }
  </style>
</head>
<body>
  ${slipEl.outerHTML}
  <script>
    window.addEventListener("afterprint", () => {
      window.close();
    });
    window.focus();
    setTimeout(() => window.print(), 80);
  <\/script>
<\/body>
<\/html>`;

  const blob = new Blob([printWindowMarkup], { type: "text/html" });
  const blobUrl = URL.createObjectURL(blob);
  const printWin = window.open(blobUrl, "_blank", "noopener,noreferrer");

  if (!printWin) {
    URL.revokeObjectURL(blobUrl);
    fields.error.textContent = "Popup blocked. Please allow popups and click Download PDF again.";
    isPdfDownloadInProgress = false;
    return;
  }

  try {
    printWin.document.title = filename;
  } catch (_error) {
  }

  const cleanup = () => {
    URL.revokeObjectURL(blobUrl);
    isPdfDownloadInProgress = false;
  };
  printWin.addEventListener("beforeunload", cleanup, { once: true });
  setTimeout(cleanup, 120000);
}

function saveFormData() {
  const data = {
    companyName: fields.companyName.value,
    companyAddress: fields.companyAddress.value,
    companyPhone: fields.companyPhone.value,
    employeeName: fields.employeeName.value,
    employeeId: fields.employeeId.value,
    salaryMonth: fields.salaryMonth.value,
    desiredNetPay: fields.desiredNetPay.value,
    includePf: fields.includePf.checked,
    includePt: fields.includePt.checked,
    logoDataUrl: savedLogoDataUrl
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadFormData() {
  const rawData = localStorage.getItem(STORAGE_KEY);
  if (!rawData) {
    return;
  }

  try {
    const data = JSON.parse(rawData);

    const suspiciousText = [
      data.companyName,
      data.companyAddress,
      data.companyPhone,
      data.employeeName,
      data.employeeId
    ]
      .map((value) => String(value || "").toLowerCase())
      .join(" ");

    if (
      suspiciousText.includes("const blob = new blob") ||
      suspiciousText.includes("window.open(bloburl") ||
      suspiciousText.includes("function updateslip")
    ) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    fields.companyName.value = data.companyName || "";
    fields.companyAddress.value = data.companyAddress || "";
    fields.companyPhone.value = data.companyPhone || "";
    fields.employeeName.value = data.employeeName || "";
    fields.employeeId.value = data.employeeId || "";
    fields.salaryMonth.value = data.salaryMonth || "";
    fields.desiredNetPay.value = data.desiredNetPay || "";
    fields.includePf.checked = data.includePf !== undefined ? data.includePf : true;
    fields.includePt.checked = data.includePt !== undefined ? data.includePt : true;
    savedLogoDataUrl = data.logoDataUrl || "";

    if (savedLogoDataUrl) {
      out.logo.src = savedLogoDataUrl;
      out.logo.style.display = "block";
    }
  } catch (_error) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function updateSlip() {
  const netPayInput = Number(fields.desiredNetPay.value);
  const includePf = fields.includePf.checked;
  const includePt = fields.includePt.checked;
  const professionalTax = includePt ? 200 : 0;
  const otherDeduction = 0;
  const fixedDeductions = professionalTax + otherDeduction;

  if (!netPayInput || netPayInput <= 0) {
    fields.error.textContent = "Please enter a valid desired net pay.";
    return;
  }

  const gross = includePf
    ? (netPayInput + fixedDeductions) / 0.952
    : (netPayInput + fixedDeductions);

  fields.error.textContent = "";

  const basic = gross * 0.4;
  const hra = gross * 0.2;
  const lta = gross * 0.05;
  const reimbursement = gross * 0.04;
  const uniformAllowance = gross * 0.03;
  const professionalPursuits = gross * 0.03;
  const telephoneInternet = gross * 0.02;
  const variablePay = gross * 0.08;
  const pf = includePf ? basic * 0.12 : 0;
  const specialAllowance = gross * 0.15;

  const totalDeductions = pf + professionalTax + otherDeduction;
  const netPay = gross - totalDeductions;

  rows.pf.style.display = includePf ? "" : "none";
  rows.pt.style.display = includePt ? "" : "none";

  out.companyName.textContent = fields.companyName.value.trim() || "Your Company";
  out.companyAddress.textContent = fields.companyAddress.value.trim() || "Address not provided";
  out.companyPhone.textContent = fields.companyPhone.value.trim() || "Phone not provided";
  out.employeeName.textContent = fields.employeeName.value.trim() || "-";
  out.employeeId.textContent = fields.employeeId.value.trim() || "-";
  out.month.textContent = formatMonth(fields.salaryMonth.value);
  out.generatedDate.textContent = new Date().toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric"
  });

  out.basic.textContent = formatCurrency(basic);
  out.hra.textContent = formatCurrency(hra);
  out.special.textContent = formatCurrency(specialAllowance);
  out.lta.textContent = formatCurrency(lta);
  out.reimbursement.textContent = formatCurrency(reimbursement);
  out.uniformAllowance.textContent = formatCurrency(uniformAllowance);
  out.professionalPursuits.textContent = formatCurrency(professionalPursuits);
  out.telephoneInternet.textContent = formatCurrency(telephoneInternet);
  out.variablePay.textContent = formatCurrency(variablePay);
  out.pf.textContent = formatCurrency(pf);
  out.pt.textContent = formatCurrency(professionalTax);
  out.otherDeduction.textContent = formatCurrency(otherDeduction);
  out.gross.textContent = formatCurrency(gross);
  out.deductions.textContent = formatCurrency(totalDeductions);
  out.netPay.textContent = formatCurrency(netPay);
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = saved ? saved === "dark" : prefersDark;

  if (isDark) {
    document.body.classList.add("dark");
    fields.themeToggle.setAttribute("aria-pressed", "true");
    fields.themeToggle.querySelector(".material-symbols").textContent = "dark_mode";
    fields.themeToggle.querySelector(".btn__label").textContent = "DARK";
  } else {
    fields.themeToggle.setAttribute("aria-pressed", "false");
    fields.themeToggle.querySelector(".material-symbols").textContent = "light_mode";
    fields.themeToggle.querySelector(".btn__label").textContent = "LIGHT";
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  fields.themeToggle.setAttribute("aria-pressed", String(isDark));
  fields.themeToggle.querySelector(".material-symbols").textContent = isDark ? "dark_mode" : "light_mode";
  fields.themeToggle.querySelector(".btn__label").textContent = isDark ? "DARK" : "LIGHT";
}

document.getElementById("generateBtn").addEventListener("click", updateSlip);

document.getElementById("downloadBtn").addEventListener("click", () => {
  const netPayInput = Number(fields.desiredNetPay.value);
  if (!netPayInput || netPayInput <= 0) {
    fields.error.textContent = "Generate the slip first by entering valid net pay.";
    return;
  }
  fields.error.textContent = "";
  updateSlip();
  downloadPdfWithFilename();
});

fields.themeToggle.addEventListener("click", toggleTheme);

fields.companyLogo.addEventListener("change", (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) {
    out.logo.style.display = "none";
    out.logo.src = "";
    savedLogoDataUrl = "";
    saveFormData();
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    out.logo.src = e.target && e.target.result ? String(e.target.result) : "";
    savedLogoDataUrl = out.logo.src;
    out.logo.style.display = out.logo.src ? "block" : "none";
    saveFormData();
  };
  reader.readAsDataURL(file);
});

fields.includePf.addEventListener("change", () => {
  saveFormData();
  if (Number(fields.desiredNetPay.value) > 0) {
    updateSlip();
  }
});

fields.includePt.addEventListener("change", () => {
  saveFormData();
  if (Number(fields.desiredNetPay.value) > 0) {
    updateSlip();
  }
});

fields.desiredNetPay.addEventListener("input", () => {
  saveFormData();
  if (Number(fields.desiredNetPay.value) > 0) {
    updateSlip();
  }
});

[
  fields.companyName,
  fields.companyAddress,
  fields.companyPhone,
  fields.employeeName,
  fields.employeeId,
  fields.salaryMonth
].forEach((inputEl) => {
  inputEl.addEventListener("input", () => {
    saveFormData();
    if (Number(fields.desiredNetPay.value) > 0) {
      updateSlip();
    }
  });
});

initTheme();
loadFormData();
if (Number(fields.desiredNetPay.value) > 0) {
  updateSlip();
}