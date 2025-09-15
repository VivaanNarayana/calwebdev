// Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu after clicking a link
            navLinks.classList.remove('active');
        }
    });
});

// Form submission handling
const contactForm = document.getElementById('contact-form');
const submitBtn = contactForm.querySelector('.submit-btn');
const submitText = contactForm.querySelector('.submit-text');
const submitSpinner = contactForm.querySelector('.submit-spinner');
const formSuccess = document.getElementById('form-success');
const formError = document.getElementById('form-error');

// Email validation function
function isValidEmail(email) {
    // More comprehensive email validation
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if (!emailRegex.test(email)) {
        return false;
    }

    // Check email length
    if (email.length > 254) {
        return false;
    }

    // Check local part and domain length
    const [localPart, domain] = email.split('@');
    if (localPart.length > 64 || domain.length > 255) {
        return false;
    }

    return true;
}

// Show form message
function showFormMessage(isSuccess, message) {
    formSuccess.style.display = 'none';
    formError.style.display = 'none';
    
    if (isSuccess) {
        formSuccess.textContent = message;
        formSuccess.style.display = 'block';
    } else {
        formError.textContent = message;
        formError.style.display = 'block';
    }

    // Hide message after 5 seconds
    setTimeout(() => {
        if (isSuccess) {
            formSuccess.style.display = 'none';
        } else {
            formError.style.display = 'none';
        }
    }, 5000);
}

// Real-time email validation
const emailInput = document.getElementById('email');
emailInput.addEventListener('input', (e) => {
    const email = e.target.value;
    if (email && !isValidEmail(email)) {
        emailInput.setCustomValidity('Please enter a valid email address');
        emailInput.reportValidity();
    } else {
        emailInput.setCustomValidity('');
    }
});

// Form submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Validate required fields
    if (!data.name || !data.email || !data.message) {
        showFormMessage(false, 'Please fill in all required fields');
        return;
    }
    
    // Validate email
    if (!isValidEmail(data.email)) {
        showFormMessage(false, 'Please enter a valid email address');
        emailInput.focus();
        return;
    }

    // Validate message length
    if (data.message.length < 10) {
        showFormMessage(false, 'Message must be at least 10 characters long');
        return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitText.style.display = 'none';
    submitSpinner.style.display = 'inline-block';

    try {
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        const result = await response.json();

        if (response.ok) {
            showFormMessage(true, 'Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        } else {
            throw new Error(result.message || 'Form submission failed');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showFormMessage(false, 'Something went wrong. Please try again later.');
    } finally {
        // Reset loading state
        submitBtn.disabled = false;
        submitText.style.display = 'inline-block';
        submitSpinner.style.display = 'none';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-out');
    observer.observe(section);
});

// Add scroll-based navbar styling
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    if (currentScroll > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'var(--background)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});
