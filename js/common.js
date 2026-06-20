/* ============================================================
   COMMON.JS — TechVerse
   Logic dùng chung cho toàn bộ website:
   - Đánh dấu active link trên navbar theo trang hiện tại
   - Scroll reveal (IntersectionObserver)
   - Hiệu ứng navbar khi cuộn (đậm nền hơn)
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

  /* ── Navbar đậm nền khi cuộn ── */
  const navbar = document.querySelector(".tv-navbar");
  if (navbar) {
    const onScroll = () => {
      navbar.style.background = window.scrollY > 12
        ? "rgba(9, 9, 11, .92)"
        : "rgba(9, 9, 11, .75)";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
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
