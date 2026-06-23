/* ============================================================
   THEME-TOGGLE.JS — TechVerse
   Xử lý chuyển đổi Dark Mode / Light Mode.
   - Đọc lựa chọn đã lưu trong localStorage (key: "tv-theme").
   - Mặc định: "dark" (giữ nguyên giao diện gốc khi chưa từng chọn).
   - Áp dụng theme bằng cách set thuộc tính data-bs-theme trên <html>
     và <body> (Bootstrap + CSS hiện tại đều style theo data-bs-theme
     trên <body>, nên ta đồng bộ luôn ở <html> để CSS biến áp dụng
     toàn cục ngay từ đầu, không chờ body load).
   - Không phụ thuộc DOMContentLoaded cho phần áp dụng theme ban đầu
     để tránh hiện tượng "nhấp nháy" (FOUC) khi tải trang.
   ============================================================ */

(function () {
  const STORAGE_KEY = "tv-theme";

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* localStorage không khả dụng — bỏ qua, vẫn áp dụng theme trong session */
    }
  }

  function applyTheme(theme, options = {}) {
    const isInteractive = options.interactive === true;

    if (isInteractive) {
      document.documentElement.classList.add("theme-switching");
    }

    document.documentElement.setAttribute("data-bs-theme", theme);
    if (document.body) document.body.setAttribute("data-bs-theme", theme);

    document.querySelectorAll(".tv-navbar").forEach(el => {
      el.setAttribute("data-bs-theme", theme);
    });

    document.querySelectorAll(".theme-toggle-btn").forEach(btn => {
      btn.classList.toggle("is-light", theme === "light");
      btn.setAttribute("aria-checked", theme === "light" ? "true" : "false");
      btn.setAttribute(
        "aria-label",
        theme === "light" ? "Chuyển sang chế độ tối" : "Chuyển sang chế độ sáng"
      );
    });

    if (isInteractive) {
      window.clearTimeout(window.__tvThemeSwitchTimer);
      window.__tvThemeSwitchTimer = window.setTimeout(() => {
        document.documentElement.classList.remove("theme-switching");
      }, 420);
    }
  }

  /* Áp dụng theme ngay lập tức (chạy đồng bộ, trước khi render) */
  const initialTheme = getStoredTheme() === "light" ? "light" : "dark";
  applyTheme(initialTheme);

  /* Khi DOM sẵn sàng: gắn sự kiện cho nút toggle + đồng bộ trạng thái nút */
  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(document.documentElement.getAttribute("data-bs-theme") || initialTheme);

    document.querySelectorAll(".theme-toggle-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-bs-theme") === "light" ? "light" : "dark";
        const next = current === "light" ? "dark" : "light";
        applyTheme(next, { interactive: true });
        setStoredTheme(next);
      });
    });
  });
})();
