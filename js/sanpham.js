document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       SCROLL REVEAL
    ========================= */
    const reveals = document.querySelectorAll("[data-reveal]");

    const observer = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            const delay =
                (entry.target.dataset.revealDelay || 0) * 100;

            if (entry.isIntersecting) {

                setTimeout(() => {
                    entry.target.classList.add("visible");
                }, delay);

            } else {

                entry.target.classList.remove("visible");
            }
        });

    }, {
        threshold: 0.08
    });

    reveals.forEach(item => observer.observe(item));


    /* =========================
       HEART TOGGLE + SAVE
    ========================= */
    document.querySelectorAll(".prod-heart").forEach((btn, index) => {

        const icon = btn.querySelector("i");

        if (localStorage.getItem(`liked-${index}`) === "true") {
            btn.classList.add("liked");
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");
        }

        btn.addEventListener("click", () => {

            btn.classList.toggle("liked");

            icon.classList.toggle("fa-regular");
            icon.classList.toggle("fa-solid");

            localStorage.setItem(
                `liked-${index}`,
                btn.classList.contains("liked")
            );
        });
    });


    /* =========================
       CATEGORY ACTIVE
    ========================= */
    document
        .querySelectorAll("#cat-filter .filter-item")
        .forEach(item => {

            item.addEventListener("click", () => {

                document
                    .querySelectorAll("#cat-filter .filter-item")
                    .forEach(i => i.classList.remove("active"));

                item.classList.add("active");
            });
        });


    /* =========================
       GRID / LIST VIEW
    ========================= */
    const grid = document.getElementById("product-grid");

    document.querySelectorAll(".view-btn").forEach(btn => {

        btn.addEventListener("click", () => {

            document
                .querySelectorAll(".view-btn")
                .forEach(b => b.classList.remove("active"));

            btn.classList.add("active");

            if (!grid) return;

            if (btn.querySelector(".fa-list")) {
                grid.classList.add("list-view");
            } else {
                grid.classList.remove("list-view");
            }
        });
    });


    /* =========================
       REMOVE FILTER TAG
    ========================= */
    document
        .querySelectorAll(".active-filter-tag")
        .forEach(tag => {

            tag.addEventListener("click", () => {
                tag.remove();
            });
        });


    /* =========================
       PRICE RANGE
    ========================= */
    const range = document.getElementById("price-range");
    const display = document.getElementById("price-display");

    if (range && display) {

        const updatePrice = () => {

            const value = Number(range.value);

            const price = Math.round(value * 700000);

            display.textContent =
                price.toLocaleString("vi-VN") + "đ";

            range.style.background =
                `linear-gradient(
                    to right,
                    var(--accent) ${value}%,
                    rgba(255,255,255,.1) ${value}%
                )`;
        };

        updatePrice();

        range.addEventListener("input", updatePrice);
    }

    /* =========================
       QUICK VIEW
    ========================= */
    document.querySelectorAll(".qa-btn").forEach(btn => {

        if (!btn.querySelector(".fa-eye")) return;

        btn.addEventListener("click", () => {

            const card = btn.closest(".prod-card");

            const name =
                card.querySelector("h5").textContent;

            alert("Xem nhanh sản phẩm:\n\n" + name);
        });
    });


    /* =========================
       CARD TILT EFFECT
    ========================= */
    document.querySelectorAll(".prod-card").forEach(card => {

        card.addEventListener("mousemove", e => {

            const rect = card.getBoundingClientRect();

            const x =
                e.clientX - rect.left;

            const y =
                e.clientY - rect.top;

            const rotateY =
                (x - rect.width / 2) / 25;

            const rotateX =
                -(y - rect.height / 2) / 25;

            card.style.transform =
                `perspective(1000px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateY(-8px)`;
        });

        card.addEventListener("mouseleave", () => {

            card.style.transform =
                "perspective(1000px) rotateX(0) rotateY(0)";
        });
    });

});