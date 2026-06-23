/* ============================================================
   COMMON.JS — TechVerse
   Logic dùng chung cho toàn bộ website:
   - Đánh dấu active link trên navbar theo trang hiện tại
   - Scroll reveal (IntersectionObserver)
   - Hiệu ứng navbar khi cuộn (đậm nền hơn) — tự đổi màu theo
     theme hiện tại (dark/light) để không đè lên Light Mode.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ── Active nav link theo file hiện tại ── */
  const currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".tv-navbar .nav-link[data-page]").forEach(link => {
    if (link.dataset.page === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  /* ── Đóng menu mobile khi click 1 link (Bootstrap collapse) ── */
  const navCollapseEl = document.getElementById("tvNavCollapse");
  if (navCollapseEl && window.bootstrap) {
    const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navCollapseEl, { toggle: false });
    navCollapseEl.querySelectorAll(".nav-link, .btn-login").forEach(el => {
      el.addEventListener("click", () => {
        if (navCollapseEl.classList.contains("show")) bsCollapse.hide();
      });
    });
  }

  /* ── Navbar đậm nền khi cuộn ──
     Màu nền RGB đổi theo theme hiện tại (data-bs-theme trên <html>),
     không hard-code màu dark — tránh đè lên Light Mode khi người
     dùng đã chuyển sang chế độ sáng. */
  const navbar = document.querySelector(".tv-navbar");
  if (navbar) {
    const NAVBAR_BG = {
      dark: { base: "rgba(9, 9, 11, .75)", scrolled: "rgba(9, 9, 11, .92)" },
      light: { base: "rgba(255, 255, 255, .82)", scrolled: "rgba(255, 255, 255, .94)" }
    };

    const getCurrentTheme = () =>
      document.documentElement.getAttribute("data-bs-theme") === "light" ? "light" : "dark";

    const onScroll = () => {
      const palette = NAVBAR_BG[getCurrentTheme()];
      navbar.style.background = window.scrollY > 12 ? palette.scrolled : palette.base;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* Khi theme đổi (qua nút Dark/Light), cập nhật lại màu nền ngay,
       không chờ người dùng cuộn trang. */
    const themeObserver = new MutationObserver(onScroll);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-bs-theme"] });
  }

  /* ── Scroll reveal ── */
  const reveals = document.querySelectorAll("[data-reveal]");
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
  }
});