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

  const transactionId = orderForm.transactionId.value.trim();
  if (!transactionId) {
    alert("Please enter UPI Transaction ID (UTR)");
    return;
  }

  payBtn.disabled = true;
  spinner.style.display = "block";

  const payload = {
    name: orderForm.name.value,
    email: orderForm.email.value,
    phone: orderForm.phone.value,
    address: orderForm.address.value,
    product,
    amount: total,
    quantity: qty,
    size,
    transactionId
  };

  try {
    await fetch(
      "https://script.google.com/macros/s/AKfycbxwMk6JeJwveXvkFKeJLzJd3fpBT6tvlaYxtKaxLU1VrjcIUODamlBnzHd_dIkWT1-q/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    pdf.text(`Transaction ID: ${transactionId}`, 20, 80);
    pdf.text("Status: Under Verification", 20, 95);

    pdf.save(`STRIDE-Invoice-${Date.now()}.pdf`);

    window.location.href = "thank-you.html";

  } catch (error) {
    console.error(error);
    alert("Payment submission failed. Try again.");
    payBtn.disabled = false;
    spinner.style.display = "none";
  }
});

