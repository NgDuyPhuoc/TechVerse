/* ============================================================
   SANPHAM.JS — Engine trang Sản phẩm (bản Bootstrap)
   Phụ thuộc: products-data.js (mảng PRODUCTS, ALL_BRANDS)
   Đã loại bỏ hoàn toàn: giỏ hàng, "Thêm vào giỏ", "Mua ngay".
   Card sản phẩm chỉ còn: ảnh, tên, giá, mô tả ngắn, nút "Xem chi tiết".
   Layout: Bootstrap Grid — col-12 / col-md-6 / col-lg-3
   (tự nhiên cho ra 1 / 2 / 4 sản phẩm mỗi hàng).
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ============================================================
       1. STATE TRUNG TÂM
    ============================================================ */
    const state = {
        category: "all",
        brands: new Set(),
        minPrice: 0,
        maxPrice: 120000000,
        search: "",
        sort: "default",
        visibleCount: 12
    };

    const PAGE_SIZE = 12;

    const CATEGORY_LABEL = {
        all: "Tất cả",
        laptop: "Laptop",
        phone: "Điện thoại",
        audio: "Âm thanh",
        watch: "Đồng hồ thông minh",
        accessory: "Phụ kiện"
    };

    /* ============================================================
       2. HELPERS
    ============================================================ */
    function formatPrice(value) {
        if (!value) return "Liên hệ";
        return value.toLocaleString("vi-VN") + "đ";
    }

    function renderStars(rating) {
        let html = "";
        for (let i = 1; i <= 5; i++) {
            html += i <= rating ? `<i class="bi bi-star-fill"></i>` : `<i class="bi bi-star"></i>`;
        }
        return html;
    }

    function escapeHtml(str) {
        return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function badgeLabel(badge) {
        if (badge === "new") return { text: "Mới", cls: "tv-badge-new" };
        if (badge === "sale") return { text: "Giảm giá", cls: "tv-badge-sale" };
        if (badge === "hot") return { text: "Hot", cls: "tv-badge-hot" };
        return null;
    }

    /* ============================================================
       3. SIDEBAR ĐỘNG
    ============================================================ */
    function buildCategoryCounts() {
        document.querySelectorAll("#cat-filter .filter-item").forEach(item => {
            const cat = item.dataset.cat;
            const count = cat === "all" ? PRODUCTS.length : PRODUCTS.filter(p => p.category === cat).length;
            const countEl = item.querySelector(".filter-count");
            if (countEl) countEl.textContent = count;
        });
    }

    function buildBrandList() {
        const wrap = document.getElementById("brand-list");
        if (!wrap) return;
        wrap.innerHTML = ALL_BRANDS.map(brand => {
            const count = PRODUCTS.filter(p => p.brand === brand).length;
            const id = "brand-" + brand.toLowerCase().replace(/\s+/g, "-");
            return `
                <label class="brand-check-label" for="${id}">
                    <input type="checkbox" class="form-check-input m-0" data-brand="${escapeHtml(brand)}" id="${id}">
                    <span>${escapeHtml(brand)} <span class="opacity-50">(${count})</span></span>
                </label>
            `;
        }).join("");

        wrap.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.addEventListener("change", () => {
                const brand = cb.dataset.brand;
                if (cb.checked) state.brands.add(brand);
                else state.brands.delete(brand);
                state.visibleCount = PAGE_SIZE;
                renderAll();
            });
        });
    }

    /* ============================================================
       4. LỌC DỮ LIỆU
    ============================================================ */
    function getFilteredProducts() {
        const keyword = state.search.trim().toLowerCase();
        return PRODUCTS.filter(p => {
            if (state.category !== "all" && p.category !== state.category) return false;
            if (state.brands.size > 0 && !state.brands.has(p.brand)) return false;
            if (p.price < state.minPrice || p.price > state.maxPrice) return false;
            if (keyword) {
                const haystack = (p.name + " " + p.brand).toLowerCase();
                if (!haystack.includes(keyword)) return false;
            }
            return true;
        });
    }

    /* ============================================================
       5. SẮP XẾP
    ============================================================ */
    function sortProducts(list) {
        const sorted = [...list];
        switch (state.sort) {
            case "price-asc": sorted.sort((a, b) => a.price - b.price); break;
            case "price-desc": sorted.sort((a, b) => b.price - a.price); break;
            case "name-asc": sorted.sort((a, b) => a.name.localeCompare(b.name, "vi")); break;
            case "name-desc": sorted.sort((a, b) => b.name.localeCompare(a.name, "vi")); break;
            case "rating": sorted.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews); break;
            default: break;
        }
        return sorted;
    }

    /* ============================================================
       6. RENDER GRID (Bootstrap card — chỉ ảnh/tên/giá/mô tả/Xem chi tiết)
    ============================================================ */
    function buildCardHtml(p) {
        const badge = badgeLabel(p.badge);
        return `
            <div class="col-12 col-md-6 col-lg-3" data-reveal>
                <div class="tv-card tv-card-hover sp-card h-100">
                    <div class="sp-card-img-wrap tv-hover-img-zoom">
                        ${badge ? `<span class="tv-badge ${badge.cls} sp-card-badge">${badge.text}</span>` : ""}
                        <img src="${p.image}" alt="${escapeHtml(p.name)}" class="tv-img-cover" loading="lazy" style="border-radius:var(--tv-r-md) var(--tv-r-md) 0 0;">
                    </div>
                    <div class="sp-card-body">
                        <div class="d-flex align-items-center justify-content-between mb-1">
                            <span class="sp-card-cat">${CATEGORY_LABEL[p.category] || p.category}</span>
                            <span class="sp-card-brand">${escapeHtml(p.brand)}</span>
                        </div>
                        <h3 class="sp-card-title mb-1">${escapeHtml(p.name)}</h3>
                        <p class="sp-card-desc mb-2">${escapeHtml(p.desc)}</p>
                        <div class="sp-rating d-flex align-items-center gap-1 mb-3">
                            ${renderStars(p.rating)}
                            <span class="text-muted-tv small ms-1">(${p.reviews})</span>
                        </div>
                        <div class="d-flex align-items-end justify-content-between mt-auto pt-2 border-top border-tv">
                            <div>
                                <div class="sp-card-price-main tv-gradient-text">${formatPrice(p.price)}</div>
                                ${p.oldPrice ? `<div class="sp-card-price-old">${formatPrice(p.oldPrice)}</div>` : ""}
                            </div>
                            <button class="btn btn-tv-outline btn-sm qa-detail" data-id="${p.id}">
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function buildEmptyStateHtml() {
        return `
            <div class="col-12 sp-empty-state">
                <i class="bi bi-search d-block mb-3"></i>
                <h5 class="mb-2">Không tìm thấy sản phẩm phù hợp</h5>
                <p class="small mb-3">Hãy thử điều chỉnh bộ lọc, mở rộng khoảng giá hoặc xóa bớt từ khóa tìm kiếm.</p>
                <button class="btn btn-tv-primary btn-sm" id="empty-reset-btn">
                    <i class="bi bi-arrow-counterclockwise me-1"></i>Xóa tất cả bộ lọc
                </button>
            </div>
        `;
    }

    function renderGrid() {
        const grid = document.getElementById("product-grid");
        if (!grid) return;

        const filtered = sortProducts(getFilteredProducts());
        const visible = filtered.slice(0, state.visibleCount);

        if (filtered.length === 0) {
            grid.innerHTML = buildEmptyStateHtml();
            document.getElementById("empty-reset-btn")?.addEventListener("click", resetAllFilters);
        } else {
            grid.innerHTML = visible.map(buildCardHtml).join("");
        }

        updateResultMeta(filtered.length, visible.length);
        updateLoadMoreVisibility(filtered.length, visible.length);
        bindCardEvents();
        observeReveals();
    }

    function updateResultMeta(total, shown) {
        const resultCount = document.querySelector(".result-count");
        if (resultCount) resultCount.textContent = `Hiển thị ${shown} / ${total} sản phẩm`;

        const progressLabel = document.querySelector(".progress-label");
        if (progressLabel) progressLabel.textContent = `Đang hiển thị ${shown} / ${total} sản phẩm`;

        const progressFill = document.querySelector(".progress-fill");
        if (progressFill) {
            const pct = total === 0 ? 0 : Math.min(100, Math.round((shown / total) * 100));
            progressFill.style.width = pct + "%";
            progressFill.setAttribute("aria-valuenow", pct);
        }
    }

    function updateLoadMoreVisibility(total, shown) {
        const btn = document.querySelector(".load-more-btn");
        if (!btn) return;
        const wrap = btn.closest("div.text-center");
        if (wrap) wrap.style.display = shown >= total ? "none" : "block";
    }

    /* ============================================================
       7. MODAL CHI TIẾT SẢN PHẨM (Bootstrap Modal, không có CTA mua)
    ============================================================ */
    function openProductModal(productId) {
        const p = PRODUCTS.find(x => x.id === Number(productId));
        if (!p) return;

        document.getElementById("productModalTitle").textContent = p.name;

        const badge = badgeLabel(p.badge);
        const specsRows = Object.entries(p.specs).map(([k, v]) => `
            <tr><td>${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>
        `).join("");

        document.getElementById("productModalBody").innerHTML = `
            <div class="modal-img-box">
                ${badge ? `<span class="tv-badge ${badge.cls} position-absolute" style="top:14px;left:14px;z-index:2;">${badge.text}</span>` : ""}
                <img src="${p.image}" alt="${escapeHtml(p.name)}" class="tv-img-cover">
            </div>
            <div class="d-flex flex-wrap gap-2 mb-3">
                <span class="meta-badge"><i class="bi bi-tag me-1"></i>${escapeHtml(p.brand)}</span>
                <span class="meta-badge"><i class="bi bi-layers me-1"></i>${CATEGORY_LABEL[p.category]}</span>
                <span class="meta-badge"><i class="bi bi-star-fill me-1"></i>${p.rating}.0 (${p.reviews} đánh giá)</span>
            </div>
            <div class="d-flex align-items-baseline gap-3 mb-3">
                <span class="fs-3 fw-bold tv-gradient-text">${formatPrice(p.price)}</span>
                ${p.oldPrice ? `<span class="text-muted-tv text-decoration-line-through">${formatPrice(p.oldPrice)}</span>` : ""}
            </div>
            <p class="text-muted-tv mb-4">${escapeHtml(p.desc)}</p>
            <table class="spec-table">${specsRows}</table>
        `;

        const modalEl = document.getElementById("productModal");
        bootstrap.Modal.getOrCreateInstance(modalEl).show();
    }

    /* ============================================================
       8. BIND SỰ KIỆN
    ============================================================ */
    function bindCardEvents() {
        document.querySelectorAll(".qa-detail").forEach(btn => {
            btn.addEventListener("click", () => openProductModal(btn.dataset.id));
        });
    }

    function observeReveals() {
        const reveals = document.querySelectorAll("#product-grid [data-reveal]");
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });
        reveals.forEach(item => observer.observe(item));
    }

    function renderAll() {
        renderGrid();
        renderActiveFilterTags();
    }

    /* ── Category filter ── */
    function bindCategoryFilter() {
        document.querySelectorAll("#cat-filter .filter-item").forEach(item => {
            item.addEventListener("click", () => {
                document.querySelectorAll("#cat-filter .filter-item").forEach(i => i.classList.remove("active"));
                item.classList.add("active");
                state.category = item.dataset.cat;
                state.visibleCount = PAGE_SIZE;
                renderAll();
            });
        });
    }

    /* ── Price filter ── */
    function bindPriceFilter() {
        const minInput = document.getElementById("price-min-input");
        const maxInput = document.getElementById("price-max-input");
        const applyBtn = document.getElementById("price-apply-btn");

        function apply() {
            const min = Number(minInput.value) || 0;
            const max = Number(maxInput.value) || 120000000;
            state.minPrice = Math.min(min, max);
            state.maxPrice = Math.max(min, max);
            state.visibleCount = PAGE_SIZE;
            document.querySelectorAll(".price-quick-tag").forEach(t => t.classList.remove("active"));
            renderAll();
        }

        applyBtn?.addEventListener("click", apply);
        [minInput, maxInput].forEach(inp => {
            inp?.addEventListener("keydown", (e) => { if (e.key === "Enter") apply(); });
        });

        document.querySelectorAll(".price-quick-tag").forEach(tag => {
            tag.addEventListener("click", () => {
                document.querySelectorAll(".price-quick-tag").forEach(t => t.classList.remove("active"));
                tag.classList.add("active");
                const min = Number(tag.dataset.min);
                const max = Number(tag.dataset.max);
                minInput.value = min;
                maxInput.value = max;
                state.minPrice = min;
                state.maxPrice = max;
                state.visibleCount = PAGE_SIZE;
                renderAll();
            });
        });
    }

    /* ── Search (sidebar) ── */
    function bindSearch() {
        const input = document.getElementById("sidebar-search-input");
        input?.addEventListener("input", () => {
            state.search = input.value;
            state.visibleCount = PAGE_SIZE;
            renderAll();
        });
    }

    /* ── Sort ── */
    function bindSort() {
        const select = document.querySelector(".sort-select");
        select?.addEventListener("change", () => {
            state.sort = select.value;
            renderAll();
        });
    }

    /* ── Reset filters ── */
    function resetAllFilters() {
        state.category = "all";
        state.brands.clear();
        state.minPrice = 0;
        state.maxPrice = 120000000;
        state.search = "";
        state.sort = "default";
        state.visibleCount = PAGE_SIZE;

        document.querySelectorAll("#cat-filter .filter-item").forEach(i => i.classList.remove("active"));
        document.querySelector('#cat-filter .filter-item[data-cat="all"]')?.classList.add("active");

        document.querySelectorAll("#brand-list input[type=checkbox]").forEach(cb => cb.checked = false);

        const minInput = document.getElementById("price-min-input");
        const maxInput = document.getElementById("price-max-input");
        if (minInput) minInput.value = "";
        if (maxInput) maxInput.value = "";
        document.querySelectorAll(".price-quick-tag").forEach(t => t.classList.remove("active"));

        const searchInput = document.getElementById("sidebar-search-input");
        if (searchInput) searchInput.value = "";

        const sortSelect = document.querySelector(".sort-select");
        if (sortSelect) sortSelect.value = "default";

        renderAll();
    }

    function bindResetButton() {
        document.querySelector(".reset-btn")?.addEventListener("click", resetAllFilters);
    }

    /* ── Active filter tags ── */
    function renderActiveFilterTags() {
        const wrap = document.querySelector(".topbar-left");
        if (!wrap) return;

        const tags = [];
        if (state.category !== "all") {
            tags.push({ label: CATEGORY_LABEL[state.category], onRemove: () => { state.category = "all"; } });
        }
        state.brands.forEach(brand => {
            tags.push({ label: brand, onRemove: () => { state.brands.delete(brand); } });
        });
        if (state.minPrice > 0 || state.maxPrice < 120000000) {
            tags.push({
                label: `${formatPrice(state.minPrice)} - ${formatPrice(state.maxPrice)}`,
                onRemove: () => { state.minPrice = 0; state.maxPrice = 120000000; }
            });
        }
        if (state.search.trim()) {
            tags.push({ label: `"${state.search.trim()}"`, onRemove: () => { state.search = ""; } });
        }

        if (tags.length === 0) {
            wrap.innerHTML = `<span class="small text-muted-tv">Chưa áp dụng bộ lọc nào</span>`;
            return;
        }

        wrap.innerHTML = tags.map((t, idx) => `
            <span class="active-filter-tag" data-tag-idx="${idx}">${escapeHtml(t.label)} <i class="bi bi-x"></i></span>
        `).join("");

        wrap.querySelectorAll(".active-filter-tag").forEach((el, idx) => {
            el.addEventListener("click", () => {
                tags[idx].onRemove();
                syncSidebarUiWithState();
                state.visibleCount = PAGE_SIZE;
                renderAll();
            });
        });
    }

    function syncSidebarUiWithState() {
        document.querySelectorAll("#cat-filter .filter-item").forEach(i => i.classList.remove("active"));
        document.querySelector(`#cat-filter .filter-item[data-cat="${state.category}"]`)?.classList.add("active");

        document.querySelectorAll("#brand-list input[type=checkbox]").forEach(cb => {
            cb.checked = state.brands.has(cb.dataset.brand);
        });

        if (state.minPrice === 0 && state.maxPrice === 120000000) {
            const minInput = document.getElementById("price-min-input");
            const maxInput = document.getElementById("price-max-input");
            if (minInput) minInput.value = "";
            if (maxInput) maxInput.value = "";
        }

        const searchInput = document.getElementById("sidebar-search-input");
        if (searchInput) searchInput.value = state.search;
    }

    /* ── Load more ── */
    function bindLoadMore() {
        document.querySelector(".load-more-btn")?.addEventListener("click", () => {
            state.visibleCount += PAGE_SIZE;
            renderGrid();
        });
    }

    /* ============================================================
       KHỞI CHẠY
    ============================================================ */
    function init() {
        buildCategoryCounts();
        buildBrandList();
        bindCategoryFilter();
        bindPriceFilter();
        bindSearch();
        bindSort();
        bindResetButton();
        bindLoadMore();
        renderAll();
    }

    init();
});
