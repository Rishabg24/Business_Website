// ========================
// MOBILE NAVIGATION
// ========================

const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });
}

// ========================
// SCROLL ANIMATIONS
// ========================

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add background when scrolled
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    }

    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animations
document.querySelectorAll('.service-card, .work-item, .value-card, .process-step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ========================
// PORTFOLIO FILTERING
// ========================

const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Get filter value
        const filter = button.getAttribute('data-filter');

        // Filter gallery items
        galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');

            if (filter === 'all' || category === filter) {
                item.classList.remove('hidden');
                // Trigger animation
                setTimeout(() => {
                    item.style.animation = 'fadeIn 0.5s ease';
                }, 10);
            } else {
                item.classList.add('hidden');
            }
        });
    });
});

// ========================
// BOOKING FORM SUBMISSION
// ========================

const orderingForm = document.getElementById('orderingForm');

if (orderingForm) {
    orderingForm.addEventListener('submit', function(e) {
        // STEP 1: Stop the page from reloading
        e.preventDefault(); 
        
        // STEP 2: Visual feedback for the user
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending Request...';

        // STEP 3: Collect the data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        // STEP 4: Send to Google
        fetch('https://script.google.com/macros/s/AKfycbw1JsGmzztVUwmbsWReayFW3frmEhwmCjk6aBUQHSj74KBc2F_p0GKam5FxTuX08LwD/exec', {
            method: 'POST',
            mode: 'no-cors', // Important for Google Apps Script
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(() => {
            // STEP 5: Redirect to your Thank You page
            window.location.href = 'thank-you.html'; 
        })
        .catch(err => {
            console.error(err);
            alert('Something went wrong. Please try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Request a booking';
        });
    });
}

// Reset form function
function resetForm() {
    if (bookingForm && successMessage) {
        bookingForm.reset();
        bookingForm.style.display = 'block';
        successMessage.style.display = 'none';

        // Scroll to form
        bookingForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ========================
// SMOOTH SCROLLING
// ========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ========================
// COUNTER ANIMATION FOR STATS
// ========================

const statNumbers = document.querySelectorAll('.stat-number');

const animateCounter = (element, target, duration = 2000) => {
    const isNumeric = !isNaN(parseFloat(target));
    if (!isNumeric) return;

    const targetNum = parseFloat(target);
    const increment = targetNum / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < targetNum) {
            element.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const target = entry.target.textContent;
            entry.target.classList.add('animated');
            animateCounter(entry.target, target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => {
    statsObserver.observe(stat);
});

// ========================
// PARALLAX EFFECT (OPTIONAL)
// ========================

// window.addEventListener('scroll', () => {
//     const scrolled = window.pageYOffset;
//     const parallaxElements = document.querySelectorAll('.hero-image');

//     parallaxElements.forEach(el => {
//         const speed = 0.5;
//         el.style.transform = `translateY(${scrolled * speed}px)`;
//     });
// });

// ========================
// IMAGE LAZY LOADING
// ========================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================
// IMAGE CLICK & ZOOM MODAL
// ========================

const imageModal = document.createElement('div');
imageModal.className = 'image-modal';
imageModal.innerHTML = `
    <div class="image-modal-content">
        <button class="image-modal-close" aria-label="Close image preview">&times;</button>
        <img src="" alt="Expanded photo">
    </div>
`;
document.body.appendChild(imageModal);

const modalImage = imageModal.querySelector('img');
const modalClose = imageModal.querySelector('.image-modal-close');

const openModal = (src, alt) => {
    modalImage.src = src;
    modalImage.alt = alt || 'Expanded photo';
    imageModal.classList.add('visible');
};

const closeModal = () => {
    imageModal.classList.remove('visible');
    modalImage.src = '';
};

modalClose.addEventListener('click', closeModal);
imageModal.addEventListener('click', (event) => {
    if (event.target === imageModal) {
        closeModal();
    }
});

const galleryItemsAll = document.querySelectorAll('.gallery-item');
galleryItemsAll.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (!img) return;

        openModal(img.src, img.alt);
    });
});

// ========================
// SCROLL TO TOP BUTTON
// ========================

const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
`;
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: var(--color-accent);
    color: var(--color-bg);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollToTopBtn.addEventListener('mouseenter', () => {
    scrollToTopBtn.style.transform = 'scale(1.1)';
});

scrollToTopBtn.addEventListener('mouseleave', () => {
    scrollToTopBtn.style.transform = 'scale(1)';
});

// ========================
// FORM VALIDATION
// ========================

const formInputs = document.querySelectorAll('.booking-form input, .booking-form select, .booking-form textarea');

formInputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            input.style.borderColor = 'var(--color-accent)';
        } else {
            input.style.borderColor = 'var(--color-border)';
        }
    });

    input.addEventListener('focus', () => {
        input.style.borderColor = 'var(--color-accent)';
    });
});

// ========================
// LOADING ANIMATION
// ========================

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

console.log('FrameCapture Photography - Website Loaded Successfully');