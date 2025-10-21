document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("build-form");
  const btn = document.getElementById("submitBtn");
  const emoji = document.getElementById("emoji");
  const feedback = document.getElementById("feedback");

  function sendMailto(subject, body, to) {
    const url = `mailto:${to}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    // open in new tab
    window.location.href = url;
  }

  function sendWhatsApp(phone, text) {
    // sanitize phone for wa.me
    const p = phone.replace(/[^0-9+]/g, "");
    const plain = p.replace(/^\+/, "");
    const url = `https://wa.me/${plain}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    btn.disabled = true;
    btn.textContent = "Submitting...";
    btn.appendChild(emoji);

    const fd = new FormData(form);
    const name = fd.get("name");
    const email = fd.get("email");
    const phone = fd.get("phone") || "+254796185828";
    const service = fd.get("service");
    const details = fd.get("details") || "";

    const subject = `NaivaCom project inquiry from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\n\nDetails:\n${details}`;

    // open mailto (client will handle sending)
    sendMailto("info@naivacom", subject + "\n\n" + body, "info@naivacom");

    // also open whatsapp summary
    const waText = `NaivaCom inquiry from ${name} (${email}) - ${service}. Details: ${details}`;
    sendWhatsApp(phone || "+254796185828", waText);

    // friendly feedback and reset button after short delay
    feedback.textContent = `Thank you, ${name}! You've taken a wonderful step — we will follow up shortly.`;
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = 'Submit project <span id="emoji">✅</span>';
      form.reset();
    }, 2200);
  });
});
