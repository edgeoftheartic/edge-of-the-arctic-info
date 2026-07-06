// Edge of the Arctic & Beyond — shared behaviour

// Mobile navigation
const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");
if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", mainNav.classList.contains("open"));
  });
}

// Web3Forms submission: progressive enhancement over normal POST.
// Shows an inline success message instead of leaving the page.
document.querySelectorAll("form[data-web3forms]").forEach((form) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const original = button.textContent;
    button.disabled = true;
    button.textContent = "Sending…";

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await res.json();
      if (data.success) {
        form.innerHTML =
          '<div style="text-align:center;padding:30px 10px">' +
          '<h3 style="margin-bottom:10px">Thank you — message received.</h3>' +
          "<p>We reply personally to every enquiry, usually within 24 hours.</p>" +
          "</div>";
      } else {
        throw new Error(data.message || "Submission failed");
      }
    } catch (err) {
      button.disabled = false;
      button.textContent = original;
      alert("Sorry, something went wrong sending the form. Please email us directly at nik@edgeofthearctic.travel");
    }
  });
});

// Stripe deposit checkout: buttons with data-checkout call the
// Cloudflare Pages Function which creates a Stripe Checkout Session.
document.querySelectorAll("[data-checkout]").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    const original = btn.textContent;
    btn.textContent = "Opening secure checkout…";
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: btn.dataset.checkout,
          departure: btn.dataset.departure || "",
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "No checkout URL returned");
      }
    } catch (err) {
      btn.textContent = original;
      // Stripe not configured yet — fall back to the enquiry form.
      window.location.href = "/book/?journey=" + encodeURIComponent(btn.dataset.checkout || "");
    }
  });
});

// Tour catalogue filter chips (on /tours/) — instant, in-place, all cards stay in DOM for SEO
document.querySelectorAll("[data-tour-filter]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.tourFilter;
    document.querySelectorAll("[data-tour-filter]").forEach((b) =>
      b.classList.toggle("is-active", b === btn)
    );
    let shown = 0;
    document.querySelectorAll(".tour-card").forEach((card) => {
      const tags = (card.dataset.tags || "").split(" ");
      const match = filter === "all" || tags.includes(filter);
      card.style.display = match ? "" : "none";
      if (match) shown++;
    });
    const empty = document.querySelector(".filter-empty");
    if (empty) empty.hidden = shown > 0;
  });
});
