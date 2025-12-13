/* ===== ELEMENTS ===== */
const title = document.getElementById("title");
const totalPriceEl = document.getElementById("totalPrice");
const qtyEl = document.getElementById("qty");
const sizeEl = document.getElementById("size");

const upiQR = document.getElementById("upiQR");
const upiLink = document.getElementById("upiLink");
const upiAny = document.getElementById("upiAny");
const upiGpay = document.getElementById("upiGpay");
const upiPhonePe = document.getElementById("upiPhonePe");

const orderForm = document.getElementById("orderForm");
const screenshotInput = document.getElementById("screenshot");
const preview = document.getElementById("preview");
const spinner = document.getElementById("spinner");
const payBtn = document.getElementById("payBtn");

/* ===== URL PARAMS ===== */
const p = new URLSearchParams(location.search);
const product = p.get("name") || "Product";
const price = Number(p.get("price") || 0);
const qty = Number(p.get("qty") || 1);
const size = p.get("size") || "-";

const total = price * qty;

/* ===== DISPLAY ===== */
title.innerText = product;
totalPriceEl.innerText = `Total: ₹${total}`;
qtyEl.innerText = qty;
sizeEl.innerText = size;

/* ===== UPI ===== */
const UPI = "naveenmaan@ptyes";
const PAYEE = "STRIDE Store";
const upi = `upi://pay?pa=${UPI}&pn=${encodeURIComponent(PAYEE)}&am=${total}&cu=INR`;

upiQR.src =
  "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
  encodeURIComponent(upi);

upiLink.href = upi;
upiAny.href = upi;
upiGpay.href = `tez://upi/pay?pa=${UPI}&pn=${encodeURIComponent(PAYEE)}&am=${total}&cu=INR`;
upiPhonePe.href = `phonepe://pay?pa=${UPI}&pn=${encodeURIComponent(PAYEE)}&am=${total}&cu=INR`;

/* ===== SCREENSHOT PREVIEW ===== */
screenshotInput.addEventListener("change", () => {
  const file = screenshotInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    preview.innerHTML = `<img src="${reader.result}" />`;
  };
  reader.readAsDataURL(file);
});

/* ===== SUBMIT ===== */
orderForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = screenshotInput.files[0];
  if (!file) {
    alert("Please upload payment screenshot");
    return;
  }

  payBtn.disabled = true;
  spinner.style.display = "block";

  /* ===== FORM DATA (CORRECT WAY) ===== */
  const fd = new FormData();

  // customer info
  fd.append("name", orderForm.name.value);
  fd.append("email", orderForm.email.value);
  fd.append("phone", orderForm.phone.value);
  fd.append("address", orderForm.address.value);

  // order info
  fd.append("product", product);
  fd.append("amount", total);
  fd.append("quantity", qty);
  fd.append("size", size);

  // screenshot
/* ===== SUBMIT ===== */
orderForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = screenshotInput.files[0];
  if (!file) {
    alert("Please upload payment screenshot");
    return;
  }

  payBtn.disabled = true;
  spinner.style.display = "block";

  const fd = new FormData(orderForm);

  fd.append("product", product);
  fd.append("amount", total);
  fd.append("quantity", qty);
  fd.append("size", size);

  try {
    await fetch(
      "https://script.google.com/macros/s/AKfycbyDuq3-8nGqSwOJKJPPLy4JFV_g3lNI_qxKtEVLL2OKIs2L3WG1PqbhwRXmSpH04ZfnEA/exec",
      {
        method: "POST",
        body: fd
      }
    );

    /* ===== INVOICE ===== */
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.text("STRIDE - Payment Invoice", 20, 20);

    pdf.setFontSize(12);
    pdf.text(`Product: ${product}`, 20, 40);
    pdf.text(`Size: ${size}`, 20, 50);
    pdf.text(`Quantity: ${qty}`, 20, 60);
    pdf.text(`Total Paid: ₹${total}`, 20, 70);
    pdf.text("Status: Under Verification", 20, 85);

    pdf.save(`STRIDE-Invoice-${Date.now()}.pdf`);

    location.href = "thank-you.html";

  } catch (err) {
    alert("Submission failed. Please try again.");
    console.error(err);
  }
});





