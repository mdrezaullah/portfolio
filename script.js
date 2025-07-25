// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    // Get references for the mobile theme toggle as well
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const mobileThemeIcon = document.getElementById('mobile-theme-icon');

    const body = document.body;

    const openContactModalBtn = document.getElementById('open-contact-modal');
    const contactModal = document.getElementById('contact-modal');
    const closeContactModalBtn = document.getElementById('close-contact-modal');
    const contactForm = contactModal.querySelector('form');

    // --- Custom Message Box Functionality (replaces alert/confirm) ---
    // This function creates a simple, non-blocking message box for user feedback.
    // It's designed to be responsive and non-intrusive on all devices.
    function showMessageBox(message, type = 'success', duration = 3000) {
        // Remove any existing message boxes to prevent stacking
        const existingMessageBox = document.getElementById('custom-message-box');
        if (existingMessageBox) {
            existingMessageBox.remove();
        }

        const messageBox = document.createElement('div');
        messageBox.id = 'custom-message-box';
        messageBox.textContent = message;

        // Apply basic styling for the message box
        messageBox.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            text-align: center;
            min-width: 250px; /* Ensure readability on small screens */
            max-width: 90%; /* Prevent overflow on very small screens */
        `;

        // Type-specific styling
        if (type === 'success') {
            messageBox.style.backgroundColor = '#4CAF50'; // Green
        } else if (type === 'error') {
            messageBox.style.backgroundColor = '#f44336'; // Red
        } else {
            messageBox.style.backgroundColor = '#2196F3'; // Blue (info)
        }

        document.body.appendChild(messageBox);

        // Animate in
        setTimeout(() => {
            messageBox.style.opacity = '1';
            messageBox.style.transform = 'translateX(-50%) translateY(0)';
        }, 10); // Small delay to allow CSS transition

        // Animate out and remove after duration
        setTimeout(() => {
            messageBox.style.opacity = '0';
            messageBox.style.transform = 'translateX(-50%) translateY(-20px)';
            messageBox.addEventListener('transitionend', () => {
                messageBox.remove();
            }, { once: true });
        }, duration);
    }

    // --- Theme Toggle Functionality ---
    // Function to set the theme based on the 'theme' parameter
    const setTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode'); // Ensure light-mode is removed
            // Update desktop theme icon
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
            // Update mobile theme icon
            if (mobileThemeIcon) {
                mobileThemeIcon.classList.remove('fa-moon');
                mobileThemeIcon.classList.add('fa-sun');
            }
            localStorage.setItem('theme', 'dark');
        } else { // theme === 'light'
            body.classList.add('light-mode');
            body.classList.remove('dark-mode'); // Ensure dark-mode is removed
            // Update desktop theme icon
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
            // Update mobile theme icon
            if (mobileThemeIcon) {
                mobileThemeIcon.classList.remove('fa-sun');
                mobileThemeIcon.classList.add('fa-moon');
            }
            localStorage.setItem('theme', 'light');
        }
    };

    // Initialize theme based on local storage or system preference on load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark'); // Default to dark if system preference is dark
    } else {
        setTheme('light'); // Default to light
    }

    // Event listener for desktop theme toggle button
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (body.classList.contains('dark-mode')) {
                setTheme('light');
            } else {
                setTheme('dark');
            }
        });
    }

    // Event listener for mobile theme toggle button
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', () => {
            if (body.classList.contains('dark-mode')) {
                setTheme('light');
            } else {
                setTheme('dark');
            }
        });
    }

    // --- Smooth Scrolling for Navigation Links ---
    // Ensures a smooth navigation experience on both desktop and mobile devices.
    document.querySelectorAll('nav a.nav-link, #mobile-menu a.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default anchor click behavior

            const targetId = this.getAttribute('href'); // Get the href attribute (e.g., "#about")
            const targetElement = document.querySelector(targetId); // Find the target element

            if (targetElement) {
                // Scroll smoothly to the target element
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start' // Align the top of the element with the top of the scroll area
                });

                // Close mobile menu after clicking a link (important for mobile UX)
                const mobileMenu = document.getElementById('mobile-menu');
                const mobileMenuButton = document.querySelector('nav button.md\\:hidden');
                if (mobileMenu && mobileMenuButton && mobileMenu.classList.contains('is-open')) {
                    mobileMenu.classList.remove('is-open');
                    mobileMenu.classList.add('-translate-x-full'); // Slide out
                    body.classList.remove('mobile-menu-open'); // Re-enable body scroll
                    mobileMenuButton.querySelector('i').classList.remove('fa-times');
                    mobileMenuButton.querySelector('i').classList.add('fa-bars');
                }
            }
        });
    });

    // --- Mobile Navigation Toggle ---
    // Handles opening and closing the mobile menu.
    const mobileMenuButton = document.querySelector('nav button.md\\:hidden');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('-translate-x-full'); // Tailwind class for sliding in/out
            mobileMenu.classList.toggle('is-open'); // Custom class for state management
            body.classList.toggle('mobile-menu-open'); // Add class to body to prevent scroll

            // Toggle icon between hamburger and close (X)
            mobileMenuButton.querySelector('i').classList.toggle('fa-bars');
            mobileMenuButton.querySelector('i').classList.toggle('fa-times');
        });
    }

    // --- Contact Modal Functionality ---
    // Handles opening, closing, and submitting the contact form modal.
    // Works well on both touch and click interfaces.
    if (openContactModalBtn) {
        openContactModalBtn.addEventListener('click', () => {
            contactModal.classList.add('is-visible');
            body.classList.add('modal-open'); // Optional: Add class to body to prevent scroll
        });
    }

    if (closeContactModalBtn) {
        closeContactModalBtn.addEventListener('click', () => {
            contactModal.classList.remove('is-visible');
            body.classList.remove('modal-open'); // Optional: Remove class to re-enable scroll
        });
    }

    // Close modal when clicking outside the content area (overlay)
    if (contactModal) {
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) { // Only close if clicking directly on the overlay
                contactModal.classList.remove('is-visible');
                body.classList.remove('modal-open');
            }
        });
    }

    // Handle form submission (placeholder for actual backend integration)
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent actual form submission to a server
            console.log('Form submitted!');
            const name = contactForm.querySelector('input[type="text"]').value;
            const email = contactForm.querySelector('input[type="email"]').value;
            const message = contactForm.querySelector('textarea').value;
            console.log({ name, email, message });

            // Use custom message box instead of alert() for better UX
            showMessageBox('Thank you for your message! I will get back to you soon.', 'success');

            contactForm.reset(); // Clear the form fields
            contactModal.classList.remove('is-visible'); // Close the modal
            body.classList.remove('modal-open'); // Re-enable body scroll
        });
    }

    // --- Section Animation on Scroll (Intersection Observer) ---
    // This provides a smooth "fade-in and slide-up" effect for sections as they enter the viewport.
    // This is inherently responsive as it reacts to the viewport's scroll.
    const animatedSections = document.querySelectorAll('.animated-section');

    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    }, observerOptions);

    animatedSections.forEach(section => {
        observer.observe(section);
    });

    // --- Hero Section Typing Effect (CSS driven) ---
    // The typing effect is primarily controlled by CSS animations (`typing` and `blink-caret`)
    // applied to the `.typing-container` span in your HTML and CSS.
    // The `animation-delay` in CSS ensures it starts after other hero elements.
    // No direct JavaScript manipulation of text is needed for this effect.
});
