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
orderForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const file = screenshotInput.files[0];
  if (!file) {
    alert("Please upload payment screenshot");
    return;
  }

  payBtn.disabled = true;
  spinner.style.display = "block";

  const reader = new FileReader();

  reader.onload = async () => {
    const base64 = reader.result.split(",")[1];

    const payload = {
      name: orderForm.name.value,
      email: orderForm.email.value,
      phone: orderForm.phone.value,
      address: orderForm.address.value,
      product,
      amount: total,
      quantity: qty,
      size,
      screenshotBase64: base64
    };

    await fetch(
      "https://script.google.com/macros/s/AKfycbzqP_iQzYNC68RFfSLHHPqWJv3GLjbEQmWP8rkG97Pp6zxR-R65or2JUuSk0QR6TD3x/exec",
      {
        method: "POST",
        body: JSON.stringify(payload)
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
  };

  reader.readAsDataURL(file);
});

