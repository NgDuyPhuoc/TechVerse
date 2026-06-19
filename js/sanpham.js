/* ============================================================
   SANPHAM.JS — Engine trang Sản phẩm
   Phụ thuộc: products-data.js (mảng PRODUCTS, ALL_BRANDS)
   Cấu trúc:
     1. State trung tâm
     2. Helpers (format tiền, render sao, escape html...)
     3. Build sidebar động (brand checkbox)
     4. Bộ lọc: category / brand / price / search
     5. Sắp xếp
     6. Render grid + skeleton + empty state
     7. Modal chi tiết sản phẩm
     8. Toast thông báo
     9. Yêu thích (localStorage)
     10. Bind sự kiện + khởi chạy
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ============================================================
       1. STATE TRUNG TÂM
    ============================================================ */
    const state = {
        category: "all",
        brands: new Set(),          // rỗng = tất cả thương hiệu
        minPrice: 0,
        maxPrice: 120000000,
        search: "",
        sort: "default",
        view: "grid",
        visibleCount: 12             // số sản phẩm hiển thị (load more)
    };

    const PAGE_SIZE = 12;

    /* Map slug category -> tên hiển thị tiếng Việt */
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
            html += i <= rating
                ? "★"
                : `<span style="color:var(--muted)">★</span>`;
        }
        return html;
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    function badgeLabel(badge) {
        if (badge === "new") return { text: "Mới", cls: "badge-new" };
        if (badge === "sale") return { text: "Giảm giá", cls: "badge-sale" };
        if (badge === "hot") return { text: "Hot", cls: "badge-hot" };
        return null;
    }

    /* ============================================================
       3. BUILD SIDEBAR ĐỘNG
    ============================================================ */
    function buildCategoryCounts() {
        document.querySelectorAll("#cat-filter .filter-item").forEach(item => {
            const cat = item.dataset.cat;
            const count = cat === "all"
                ? PRODUCTS.length
                : PRODUCTS.filter(p => p.category === cat).length;
            const countEl = item.querySelector(".filter-count");
            if (countEl) countEl.textContent = count;
        });
    }

    function buildBrandList() {
        const wrap = document.querySelector(".brand-list");
        if (!wrap) return;
        wrap.innerHTML = ALL_BRANDS.map(brand => {
            const count = PRODUCTS.filter(p => p.brand === brand).length;
            const id = "brand-" + brand.toLowerCase().replace(/\s+/g, "-");
            return `
                <label class="brand-check">
                    <input type="checkbox" data-brand="${escapeHtml(brand)}" id="${id}" />
                    <div class="checkmark"></div>
                    <span class="brand-label">${escapeHtml(brand)} <span style="opacity:.6">(${count})</span></span>
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

        bindBrandListScrollFade();
    }

    /* Ẩn gradient fade báo hiệu "còn thương hiệu phía dưới" khi đã cuộn tới cuối */
    function bindBrandListScrollFade() {
        const list = document.querySelector(".brand-list");
        const outerWrap = document.querySelector(".brand-list-wrap");
        if (!list || !outerWrap) return;

        function update() {
            const atEnd = list.scrollHeight - list.scrollTop - list.clientHeight < 4;
            outerWrap.classList.toggle("scrolled-end", atEnd || list.scrollHeight <= list.clientHeight);
        }

        list.addEventListener("scroll", update);
        update();
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
            case "price-asc":
                sorted.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                sorted.sort((a, b) => b.price - a.price);
                break;
            case "name-asc":
                sorted.sort((a, b) => a.name.localeCompare(b.name, "vi"));
                break;
            case "name-desc":
                sorted.sort((a, b) => b.name.localeCompare(a.name, "vi"));
                break;
            case "rating":
                sorted.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
                break;
            default:
                // Mặc định: giữ thứ tự gốc nhưng đẩy "new/hot" lên trước nhẹ
                break;
        }
        return sorted;
    }

    /* ============================================================
       6. RENDER GRID
    ============================================================ */
    function buildCardHtml(p) {
        const badge = badgeLabel(p.badge);
        const liked = localStorage.getItem(`liked-${p.id}`) === "true";

        return `
            <div class="prod-card" data-reveal data-id="${p.id}">
                ${badge ? `<div class="prod-badge ${badge.cls}">${badge.text}</div>` : ""}
                <div class="prod-img-wrap">
                    <div style="width:100%;height:100%;background:${p.gradient};display:flex;align-items:center;justify-content:center;font-size:3.5rem;">
                        ${p.emoji}
                    </div>
                    <div class="prod-actions">
                        <button class="qa-btn qa-detail"><i class="fa-solid fa-eye"></i> Xem nhanh</button>
                        <button class="qa-btn icon-only"><i class="fa-solid fa-cart-plus"></i></button>
                    </div>
                </div>
                <div class="prod-body">
                    <div class="prod-cat">${CATEGORY_LABEL[p.category] || p.category}</div>
                    <div class="prod-brand">${escapeHtml(p.brand)}</div>
                    <h5>${escapeHtml(p.name)}</h5>
                    <p>${escapeHtml(p.desc)}</p>
                    <div class="prod-rating">
                        <span class="stars">${renderStars(p.rating)}</span>
                        <span>(${p.reviews} đánh giá)</span>
                    </div>
                    <div class="prod-footer">
                        <div class="prod-price">
                            <span class="price-main">${formatPrice(p.price)}</span>
                            ${p.oldPrice ? `<span class="price-old">${formatPrice(p.oldPrice)}</span>` : ""}
                        </div>
                        <button class="prod-heart ${liked ? "liked" : ""}" data-id="${p.id}">
                            <i class="fa-${liked ? "solid" : "regular"} fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function buildEmptyStateHtml() {
        return `
            <div class="empty-state">
                <div class="empty-icon"><i class="fa-solid fa-magnifying-glass-minus"></i></div>
                <h4>Không tìm thấy sản phẩm phù hợp</h4>
                <p>Hãy thử điều chỉnh bộ lọc, mở rộng khoảng giá hoặc xóa bớt từ khóa tìm kiếm.</p>
                <button id="empty-reset-btn"><i class="fa-solid fa-rotate-left" style="margin-right:6px"></i>Xóa tất cả bộ lọc</button>
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
        const metaCount = document.querySelector(".meta-count");
        if (metaCount) {
            metaCount.innerHTML = `Hiển thị <span>${shown}</span> / <span>${total}</span> sản phẩm`;
        }
        const progressLabel = document.querySelector(".progress-label");
        if (progressLabel) {
            progressLabel.textContent = `Đang hiển thị ${shown} / ${total} sản phẩm`;
        }
        const progressFill = document.querySelector(".progress-fill");
        if (progressFill) {
            const pct = total === 0 ? 0 : Math.min(100, Math.round((shown / total) * 100));
            progressFill.style.width = pct + "%";
        }
    }

    function updateLoadMoreVisibility(total, shown) {
        const wrap = document.querySelector(".load-more-wrap");
        if (!wrap) return;
        wrap.style.display = shown >= total ? "none" : "block";
    }

    /* ============================================================
       7. MODAL CHI TIẾT SẢN PHẨM
    ============================================================ */
    function ensureModalInDom() {
        if (document.getElementById("productModal")) return;
        const modalHtml = `
        <div class="modal fade" id="productModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content tv-modal">
                    <div class="modal-header">
                        <h5 class="modal-title" id="productModalTitle">Chi tiết sản phẩm</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="productModalBody"></div>
                    <div class="modal-footer">
                        <button type="button" class="modal-cta-close" data-bs-dismiss="modal">Đóng</button>
                        <button type="button" class="modal-cta-buy" id="modalBuyBtn">
                            <i class="fa-solid fa-bag-shopping" style="margin-right:6px"></i>Thêm vào giỏ
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML("beforeend", modalHtml);
    }

    function openProductModal(productId) {
        const p = PRODUCTS.find(x => x.id === Number(productId));
        if (!p) return;

        ensureModalInDom();

        document.getElementById("productModalTitle").textContent = p.name;

        const badge = badgeLabel(p.badge);
        const specsRows = Object.entries(p.specs).map(([k, v]) => `
            <tr><td>${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>
        `).join("");

        document.getElementById("productModalBody").innerHTML = `
            <div class="modal-img-box" style="background:${p.gradient}">
                ${badge ? `<div class="modal-badge ${badge.cls}">${badge.text}</div>` : ""}
                ${p.emoji}
            </div>
            <div class="modal-meta-row">
                <span class="modal-meta-pill"><i class="fa-solid fa-tag" style="margin-right:6px"></i>${escapeHtml(p.brand)}</span>
                <span class="modal-meta-pill"><i class="fa-solid fa-layer-group" style="margin-right:6px"></i>${CATEGORY_LABEL[p.category]}</span>
                <span class="modal-meta-pill"><i class="fa-solid fa-star" style="margin-right:6px"></i>${p.rating}.0 (${p.reviews} đánh giá)</span>
            </div>
            <div class="modal-price-block">
                <span class="modal-price-main">${formatPrice(p.price)}</span>
                ${p.oldPrice ? `<span class="modal-price-old">${formatPrice(p.oldPrice)}</span>` : ""}
            </div>
            <p class="modal-desc">${escapeHtml(p.desc)}</p>
            <table class="spec-table">${specsRows}</table>
        `;

        document.getElementById("modalBuyBtn").onclick = () => showToast(`Đã thêm "${p.name}" vào giỏ hàng`);

        const modalEl = document.getElementById("productModal");
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
    }

    /* ============================================================
       8. TOAST
    ============================================================ */
    function showToast(message) {
        let toast = document.querySelector(".tv-toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.className = "tv-toast";
            toast.innerHTML = `<i class="fa-solid fa-circle-check"></i><span class="tv-toast-msg"></span>`;
            document.body.appendChild(toast);
        }
        toast.querySelector(".tv-toast-msg").textContent = message;
        toast.classList.add("show");
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => toast.classList.remove("show"), 2400);
    }

    /* ============================================================
       9. YÊU THÍCH (localStorage theo id sản phẩm, không theo index)
    ============================================================ */
    function toggleLike(id, btn) {
        const liked = btn.classList.toggle("liked");
        const icon = btn.querySelector("i");
        icon.classList.toggle("fa-regular", !liked);
        icon.classList.toggle("fa-solid", liked);
        localStorage.setItem(`liked-${id}`, liked);
        if (liked) showToast("Đã thêm vào yêu thích");
    }

    /* ============================================================
       10. BIND SỰ KIỆN
    ============================================================ */
    function bindCardEvents() {
        document.querySelectorAll(".prod-heart").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                toggleLike(btn.dataset.id, btn);
            });
        });

        document.querySelectorAll(".qa-detail").forEach(btn => {
            btn.addEventListener("click", () => {
                const card = btn.closest(".prod-card");
                openProductModal(card.dataset.id);
            });
        });

        document.querySelectorAll(".prod-card").forEach(card => {
            card.addEventListener("click", (e) => {
                if (e.target.closest(".prod-heart") || e.target.closest(".qa-btn")) return;
                openProductModal(card.dataset.id);
            });

            /* Tilt effect giữ nguyên từ bản gốc */
            card.addEventListener("mousemove", e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateY = (x - rect.width / 2) / 25;
                const rotateX = -(y - rect.height / 2) / 25;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });
            card.addEventListener("mouseleave", () => {
                card.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
            });
        });
    }

    function observeReveals() {
        const reveals = document.querySelectorAll("[data-reveal]");
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                } else {
                    entry.target.classList.remove("visible");
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
            item.classList.add("is-btn");
            item.setAttribute("role", "button");
            item.addEventListener("click", () => {
                document.querySelectorAll("#cat-filter .filter-item").forEach(i => i.classList.remove("active"));
                item.classList.add("active");
                state.category = item.dataset.cat;
                state.visibleCount = PAGE_SIZE;
                renderAll();
            });
        });
    }

    /* ── Price filter (2 input + nút Lọc + quick tags) ── */
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

    /* ── Search (navbar + sidebar nếu có), realtime ── */
    function bindSearch() {
        const inputs = document.querySelectorAll('.nav-search input[type="search"], #sidebar-search-input');
        inputs.forEach(input => {
            input.addEventListener("input", () => {
                state.search = input.value;
                // đồng bộ giá trị giữa các ô tìm kiếm (navbar & sidebar)
                inputs.forEach(other => { if (other !== input) other.value = input.value; });
                state.visibleCount = PAGE_SIZE;
                renderAll();
            });
        });
    }

    /* ── Sort ── */
    function bindSort() {
        const select = document.querySelector(".sort-select");
        if (!select) return;
        select.innerHTML = `
            <option value="default">Nổi bật nhất</option>
            <option value="price-asc">Giá: Thấp → Cao</option>
            <option value="price-desc">Giá: Cao → Thấp</option>
            <option value="name-asc">Tên A-Z</option>
            <option value="name-desc">Tên Z-A</option>
            <option value="rating">Đánh giá cao</option>
        `;
        select.addEventListener("change", () => {
            state.sort = select.value;
            renderAll();
        });
    }

    /* ── View toggle (grid/list) giữ nguyên hành vi gốc ── */
    function bindViewToggle() {
        const grid = document.getElementById("product-grid");
        document.querySelectorAll(".view-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".view-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                if (!grid) return;
                grid.classList.toggle("list-view", !!btn.querySelector(".fa-list"));
            });
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

        document.querySelectorAll(".brand-list input[type=checkbox]").forEach(cb => cb.checked = false);

        const minInput = document.getElementById("price-min-input");
        const maxInput = document.getElementById("price-max-input");
        if (minInput) minInput.value = "";
        if (maxInput) maxInput.value = "";
        document.querySelectorAll(".price-quick-tag").forEach(t => t.classList.remove("active"));

        document.querySelectorAll('.nav-search input[type="search"], #sidebar-search-input').forEach(i => i.value = "");

        const sortSelect = document.querySelector(".sort-select");
        if (sortSelect) sortSelect.value = "default";

        renderAll();
    }

    function bindResetButton() {
        document.querySelector(".reset-btn")?.addEventListener("click", resetAllFilters);
    }

    /* ── Active filter tags (hiển thị các bộ lọc đang áp dụng) ── */
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
            wrap.innerHTML = `<span style="font-size:.83rem;color:var(--muted)">Chưa áp dụng bộ lọc nào</span>`;
            return;
        }

        wrap.innerHTML = tags.map((t, idx) => `
            <span class="active-filter-tag" data-tag-idx="${idx}">${escapeHtml(t.label)} <i class="fa-solid fa-xmark"></i></span>
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

    /* Đồng bộ lại UI sidebar khi tag bị xóa từ topbar */
    function syncSidebarUiWithState() {
        document.querySelectorAll("#cat-filter .filter-item").forEach(i => i.classList.remove("active"));
        document.querySelector(`#cat-filter .filter-item[data-cat="${state.category}"]`)?.classList.add("active");

        document.querySelectorAll(".brand-list input[type=checkbox]").forEach(cb => {
            cb.checked = state.brands.has(cb.dataset.brand);
        });

        if (state.minPrice === 0 && state.maxPrice === 120000000) {
            const minInput = document.getElementById("price-min-input");
            const maxInput = document.getElementById("price-max-input");
            if (minInput) minInput.value = "";
            if (maxInput) maxInput.value = "";
        }

        document.querySelectorAll('.nav-search input[type="search"], #sidebar-search-input').forEach(i => i.value = state.search);
    }

    /* ── Load more ── */
    function bindLoadMore() {
        document.querySelector(".load-more-btn")?.addEventListener("click", () => {
            state.visibleCount += PAGE_SIZE;
            renderGrid();
        });
    }

    /* ── Mobile filter drawer toggle ── */
    function bindMobileFilterToggle() {
        const btn = document.querySelector(".mobile-filter-toggle");
        const sidebar = document.querySelector(".sidebar");
        btn?.addEventListener("click", () => {
            sidebar.classList.toggle("mobile-open");
            const icon = btn.querySelector("i");
            const isOpen = sidebar.classList.contains("mobile-open");
            btn.innerHTML = isOpen
                ? `<i class="fa-solid fa-xmark"></i> Đóng bộ lọc`
                : `<i class="fa-solid fa-filter"></i> Bộ lọc & Tìm kiếm`;
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
        bindViewToggle();
        bindResetButton();
        bindLoadMore();
        bindMobileFilterToggle();
        renderAll();
    }

    init();
});
