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
const spinner = document.getElementById("spinner");
const payBtn = document.getElementById("payBtn");

/* ===== URL PARAMS ===== */
const params = new URLSearchParams(window.location.search);

const product = params.get("name") || "Product";
const price = Number(params.get("price") || 0);
const qty = Number(params.get("qty") || 1);
const size = params.get("size") || "-";

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

/* ===== SUBMIT ===== */
orderForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fd = new FormData(orderForm);

  fd.append("product", product);
  fd.append("size", size);
  fd.append("quantity", qty);
  fd.append("amount", total);
  fd.append("transactionId", orderForm.transactionId.value);

  payBtn.disabled = true;
  spinner.style.display = "block";

  try {
    await fetch(
      "https://script.google.com/macros/s/AKfycbzqP_iQzYNC68RFfSLHHPqWJv3GLjbEQmWP8rkG97Pp6zxR-R65or2JUuSk0QR6TD3x/exec",
      {
        method: "POST",
        body: fd,
        mode: "no-cors"
      }
    );

    // Invoice
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.text("STRIDE - Payment Invoice", 20, 20);

    pdf.setFontSize(12);
    pdf.text(`Product: ${product}`, 20, 40);
    pdf.text(`Size: ${size}`, 20, 50);
    pdf.text(`Quantity: ${qty}`, 20, 60);
    pdf.text(`Total Paid: ₹${total}`, 20, 70);
    pdf.text(`Transaction ID: ${orderForm.transactionId.value}`, 20, 80);
    pdf.text("Status: Under Verification", 20, 95);

    pdf.save(`STRIDE-Invoice-${Date.now()}.pdf`);

    location.href = "thank-you.html";

  } catch (err) {
    alert("Payment submission failed. Try again.");
    console.error(err);
  }
});



