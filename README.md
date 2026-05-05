# Salary Slip Generator

A simple vanilla JavaScript web app to generate a salary slip from desired Net Pay, preview it instantly, and export it as PDF.

## Features

- Net Pay based salary calculation (auto computes Gross and all components)
- Company details input:
  - Company name
  - Address
  - Phone number
  - Logo upload
- Employee details input:
  - Employee name
  - Employee ID
  - Salary month
- Auto-calculated earnings and deductions
- One-click PDF export (browser print to Save as PDF)
- Print layout with borders and margins
- Black-and-white print output
- LocalStorage persistence for input data (including logo)
- Mobile responsive layout

## Salary Calculation Logic

The app derives Gross Salary from Net Pay and then computes components.

- Basic: 40% of Gross
- HRA: 20% of Gross
- Leave Travel Allowance: 5% of Gross
- Reimbursement: 4% of Gross
- Uniform Allowance: 3% of Gross
- Professional Pursuits: 3% of Gross
- Telephone & Internet Expenses: 2% of Gross
- Variable Pay: 8% of Gross
- Special Allowance: 15% of Gross

Deductions:

- Provident Fund (PF): 12% of Basic
- Professional Tax: 200
- Other Deductions: 0

Net Pay is shown after total deductions.

## Project Structure

- `index.html` - complete app (HTML, CSS, JavaScript)

## How To Run

### Option 1: Open directly

1. Open `index.html` in a browser.

### Option 2: Run a local static server

1. From project root, run:

```bash
python3 -m http.server 8080
```

2. Open: http://localhost:8080

## How To Use

1. Fill company details and optionally upload logo.
2. Fill employee details.
3. Enter desired monthly Net Pay.
4. Click Generate Slip.
5. Click Download PDF.
6. In print dialog, choose Save as PDF.

## Print/PDF Notes

- Layout is optimized for A4.
- Table borders are enforced for print.
- Print is styled to black and white.
- If needed, in browser print settings:
  - Margins: Default/Custom as preferred
  - Headers and footers: Off

## Data Persistence

Input data is automatically saved in LocalStorage and restored on reload.

Stored items include:

- Company details
- Employee details
- Salary month
- Net Pay
- Uploaded logo (as Data URL)

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript

## License

This project is open for personal and educational use.
