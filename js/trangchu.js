const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const reveals = document.querySelectorAll('[data-reveal]');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

// Heart toggle
document.querySelectorAll('.prod-heart').forEach(btn => {
    btn.addEventListener('click', () => {
        const icon = btn.querySelector('i');
        icon.classList.toggle('fa-regular');
        icon.classList.toggle('fa-solid');
    });
});

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');

    const icon = navToggle.querySelector('i');

    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
    } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    }
});
