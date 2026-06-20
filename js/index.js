/* ============================================================
   INDEX.JS — Logic riêng cho trang chủ
   - Form newsletter: validate email, hiện Bootstrap Toast,
     không reload trang, tự ẩn sau 5s (xử lý qua data-bs-delay).
   - Nút yêu thích (heart) trên card sản phẩm nổi bật.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ── Newsletter form → Bootstrap Toast ── */
  const form = document.getElementById("newsletterForm");
  const emailInput = document.getElementById("newsletterEmail");
  const toastEl = document.getElementById("newsletterToast");

  if (form && toastEl && window.bootstrap) {
    const toast = new bootstrap.Toast(toastEl);

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!emailInput.value || !emailInput.checkValidity()) {
        emailInput.classList.add("is-invalid");
        emailInput.focus();
        return;
      }

      emailInput.classList.remove("is-invalid");
      toast.show();
      form.reset();
    });

    emailInput.addEventListener("input", () => {
      emailInput.classList.remove("is-invalid");
    });
  }

  /* ── Toggle yêu thích trên card sản phẩm nổi bật ── */
  document.querySelectorAll(".prod-heart").forEach(btn => {
    btn.addEventListener("click", () => {
      const icon = btn.querySelector("i");
      const liked = btn.classList.toggle("liked");
      icon.classList.toggle("bi-heart", !liked);
      icon.classList.toggle("bi-heart-fill", liked);
    });
  });

});
