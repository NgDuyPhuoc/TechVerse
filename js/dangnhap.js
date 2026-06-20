/* ============================================================
   DANGNHAP.JS — Giả lập đăng nhập (demo, không có backend thật)
   Lưu trạng thái đăng nhập + thông tin cơ bản vào localStorage:
     - tv_logged_in: "true" | (không tồn tại)
     - tv_user_email: email người dùng nhập
     - tv_remember_me: "true" | "false"
   Validate cơ bản: email hợp lệ, mật khẩu >= 6 ký tự.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const rememberMe = document.getElementById("rememberMe");
  const submitBtn = document.getElementById("loginSubmitBtn");
  const loginAlert = document.getElementById("loginAlert");
  const togglePasswordBtn = document.getElementById("togglePassword");

  const toastEl = document.getElementById("loginToast");
  const toastBody = document.getElementById("loginToastBody");
  const toast = (toastEl && window.bootstrap) ? new bootstrap.Toast(toastEl) : null;

  function showToast(message, iconClass = "bi-check-circle-fill text-success") {
    if (!toast) return;
    toastEl.querySelector(".toast-header i").className = `${iconClass} me-2`;
    toastBody.textContent = message;
    toast.show();
  }

  /* ── Khôi phục trạng thái đã đăng nhập trước đó (ghi nhớ) ── */
  (function restoreSession() {
    const remembered = localStorage.getItem("tv_remember_me") === "true";
    const savedEmail = localStorage.getItem("tv_user_email");
    if (remembered && savedEmail) {
      emailInput.value = savedEmail;
      rememberMe.checked = true;
    }
    if (localStorage.getItem("tv_logged_in") === "true" && savedEmail) {
      loginAlert.classList.remove("d-none");
      loginAlert.innerHTML = `<i class="bi bi-check-circle me-2"></i>Bạn đang đăng nhập với <strong>${escapeHtml(savedEmail)}</strong>.`;
    }
  })();

  function escapeHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ── Hiện / ẩn mật khẩu ── */
  togglePasswordBtn?.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    togglePasswordBtn.querySelector("i").className = isPassword ? "bi bi-eye-slash" : "bi bi-eye";
  });

  /* ── Submit đăng nhập (giả lập) ── */
  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    let valid = true;

    if (!emailInput.value || !emailInput.checkValidity()) {
      emailInput.classList.add("is-invalid");
      emailError.classList.remove("d-none");
      valid = false;
    } else {
      emailInput.classList.remove("is-invalid");
      emailError.classList.add("d-none");
    }

    if (!passwordInput.value || passwordInput.value.length < 6) {
      passwordInput.classList.add("is-invalid");
      passwordError.classList.remove("d-none");
      valid = false;
    } else {
      passwordInput.classList.remove("is-invalid");
      passwordError.classList.add("d-none");
    }

    if (!valid) return;

    /* Trạng thái loading nhẹ trên nút để mô phỏng xử lý */
    const originalHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status"></span>Đang đăng nhập...`;

    setTimeout(() => {
      localStorage.setItem("tv_logged_in", "true");
      localStorage.setItem("tv_user_email", emailInput.value.trim());
      localStorage.setItem("tv_remember_me", rememberMe.checked ? "true" : "false");

      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHtml;

      loginAlert.classList.remove("d-none");
      loginAlert.innerHTML = `<i class="bi bi-check-circle me-2"></i>Đăng nhập thành công với <strong>${escapeHtml(emailInput.value.trim())}</strong>.`;

      showToast("Đăng nhập thành công! Chào mừng bạn trở lại TechVerse.");
    }, 700);
  });

  /* ── Modal Quên mật khẩu ── */
  document.getElementById("forgotSendBtn")?.addEventListener("click", () => {
    const modalEl = document.getElementById("forgotModal");
    bootstrap.Modal.getInstance(modalEl)?.hide();
    showToast("Đã gửi liên kết khôi phục (demo) — vui lòng kiểm tra email.", "bi-envelope-check-fill text-primary");
  });

  /* ── Modal Đăng ký tài khoản ── */
  document.getElementById("registerSendBtn")?.addEventListener("click", () => {
    const modalEl = document.getElementById("registerModal");
    bootstrap.Modal.getInstance(modalEl)?.hide();
    showToast("Đã ghi nhận! TechVerse sẽ thông báo khi mở đăng ký.", "bi-envelope-check-fill text-primary");
  });

});
