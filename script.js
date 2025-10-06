// Theme Management
class ThemeManager {
  constructor() {
    // Check if user has manually set a theme
    const savedTheme = localStorage.getItem('theme');
    const manualOverride = localStorage.getItem('themeManualOverride');

    if (manualOverride === 'true' && savedTheme) {
      this.theme = savedTheme;
    } else {
      // Auto-detect based on time of day
      this.theme = this.getThemeByTime();
    }

    this.init();
  }

  getThemeByTime() {
    const hour = new Date().getHours();
    // Light theme from 6 AM to 6 PM, dark theme otherwise
    return (hour >= 6 && hour < 18) ? 'light' : 'dark';
  }

  init() {
    this.applyTheme(this.theme);
    this.bindEvents();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.theme = theme;
  }

  toggleTheme() {
    const newTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    // Mark that user manually changed the theme
    localStorage.setItem('themeManualOverride', 'true');
  }

  bindEvents() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }
}

// Mobile Menu Management
class MobileMenu {
  constructor() {
    this.isOpen = false;
    this.init();
  }

  init() {
    this.bindEvents();
  }

  toggle() {
    this.isOpen = !this.isOpen;
    const nav = document.querySelector('.nav');
    const toggle = document.getElementById('mobileMenuToggle');

    if (this.isOpen) {
      nav.classList.add('mobile-menu-open');
      toggle.classList.add('active');
    } else {
      nav.classList.remove('mobile-menu-open');
      toggle.classList.remove('active');
    }
  }

  bindEvents() {
    const toggle = document.getElementById('mobileMenuToggle');
    if (toggle) {
      toggle.addEventListener('click', () => this.toggle());
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && !e.target.closest('.nav')) {
        this.toggle();
      }
    });
  }
}

// Removed PlatformTabs class since we no longer have platform tabs in the design

// Smooth Scrolling for Navigation Links
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
}

// Intersection Observer for Animations
class ScrollAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.createObserver();
  }

  createObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, options);

    // Observe elements that should animate in
    const animateElements = document.querySelectorAll('.product-card, .industry-item, .section-header');
    animateElements.forEach(el => {
      el.classList.add('animate-on-scroll');
      this.observer.observe(el);
    });
  }
}

// Contact Form Management
class ContactForm {
   constructor() {
      this.form = document.getElementById('contactForm');
      this.submitButton = this.form.querySelector('button[type="submit"]');
      this.originalButtonText = this.submitButton.textContent;
      this.init();
   }

   init() {
      if (this.form) {
         this.bindEvents();
      }
   }

   bindEvents() {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
   }

   async handleSubmit(e) {
      e.preventDefault();

      // Validate form
      if (!this.validateForm()) {
         return;
      }

      // Show loading state
      this.setLoadingState(true);

      try {
         // EmailJS credentials
         const serviceID = 'service_7s7i8yb';
         const templateID = 'template_dlhw1r9';
         const publicKey = '9J22faj7OjuC08UsG';

         // Prepare form data for EmailJS
         const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            company: document.getElementById('company').value || 'Not provided',
            message: document.getElementById('message').value
         };

         // Send email using EmailJS
         console.log('Sending email with data:', formData);
         const response = await emailjs.send(serviceID, templateID, formData, publicKey);
         console.log('EmailJS response:', response);

         this.showSuccessMessage();
         this.form.reset();
      } catch (error) {
         console.error('Form submission error:', error);
         console.error('Error details:', error.text || error.message);
         this.showErrorMessage();
      } finally {
         this.setLoadingState(false);
      }
   }

   validateForm() {
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      // Clear previous errors
      this.clearErrors();

      let isValid = true;

      // Validate name
      if (!name) {
         this.showFieldError('name', 'Name is required');
         isValid = false;
      }

      // Validate email
      if (!email) {
         this.showFieldError('email', 'Email is required');
         isValid = false;
      } else if (!this.isValidEmail(email)) {
         this.showFieldError('email', 'Please enter a valid email address');
         isValid = false;
      }

      // Validate message
      if (!message) {
         this.showFieldError('message', 'Message is required');
         isValid = false;
      }

      return isValid;
   }

   isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
   }

   showFieldError(fieldId, message) {
      const field = document.getElementById(fieldId);
      const formGroup = field.closest('.form-group');

      // Remove existing error
      const existingError = formGroup.querySelector('.field-error');
      if (existingError) {
         existingError.remove();
      }

      // Add error class to field
      field.classList.add('error');

      // Create and insert error message
      const errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      errorElement.textContent = message;
      errorElement.style.color = 'var(--accent-primary)';
      errorElement.style.fontSize = '0.75rem';
      errorElement.style.marginTop = '0.25rem';

      formGroup.appendChild(errorElement);
   }

   clearErrors() {
      // Remove error classes from all fields
      const fields = this.form.querySelectorAll('input, textarea');
      fields.forEach(field => field.classList.remove('error'));

      // Remove all error messages
      const errorMessages = this.form.querySelectorAll('.field-error');
      errorMessages.forEach(error => error.remove());
   }

   setLoadingState(loading) {
      if (loading) {
         this.submitButton.disabled = true;
         this.submitButton.textContent = 'Sending...';
         this.submitButton.style.opacity = '0.7';
      } else {
         this.submitButton.disabled = false;
         this.submitButton.textContent = this.originalButtonText;
         this.submitButton.style.opacity = '1';
      }
   }

   showSuccessMessage() {
      this.showMessage('Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
   }

   showErrorMessage() {
      this.showMessage('Sorry, there was an error sending your message. Please try again or contact us directly at info@softorize.com.', 'error');
   }

   showMessage(text, type) {
      // Remove existing message
      const existingMessage = document.querySelector('.form-message');
      if (existingMessage) {
         existingMessage.remove();
      }

      // Create message element
      const messageElement = document.createElement('div');
      messageElement.className = `form-message form-message-${type}`;
      messageElement.textContent = text;
      messageElement.style.cssText = `
         padding: 1rem;
         border-radius: 0.5rem;
         margin-top: 1rem;
         font-size: 0.875rem;
         ${type === 'success'
            ? 'background-color: rgba(40, 202, 66, 0.1); color: #28ca42; border: 1px solid rgba(40, 202, 66, 0.3);'
            : 'background-color: rgba(255, 107, 53, 0.1); color: var(--accent-primary); border: 1px solid rgba(255, 107, 53, 0.3);'
         }
      `;

      // Insert after form
      this.form.appendChild(messageElement);

      // Auto-remove after 5 seconds
      setTimeout(() => {
         if (messageElement.parentNode) {
            messageElement.remove();
         }
      }, 5000);
   }
}

// Performance Monitoring
class PerformanceMonitor {
   constructor() {
      this.init();
   }

   init() {
      if ('performance' in window) {
         window.addEventListener('load', () => {
            setTimeout(() => {
               const perfData = performance.getEntriesByType('navigation')[0];
               console.log(`Page load time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
            }, 0);
         });
      }
   }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
   // Initialize all components
   new ThemeManager();
   new MobileMenu();
   new SmoothScroll();
   new ScrollAnimations();
   new ContactForm();
   new PerformanceMonitor();

   // Add loading animation
   document.body.classList.add('loaded');

   console.log('Softorize website initialized successfully!');
});