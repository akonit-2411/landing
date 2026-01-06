/**
 * LandingPro - Main JavaScript
 * Калькулятор стоимости, анимации, мобильное меню
 */

document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // Calculator Logic
    // ============================================
    const calculator = {
        basePrice: 5000,
        totalElement: document.getElementById('totalPrice'),
        
        init() {
            this.bindEvents();
            this.calculate();
        },
        
        bindEvents() {
            // Radio buttons for sections
            const radios = document.querySelectorAll('input[name="sections"]');
            radios.forEach(radio => {
                radio.addEventListener('change', () => this.calculate());
            });
            
            // Checkboxes for options
            const checkboxes = document.querySelectorAll('.calc-checkbox input');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => this.calculate());
            });
        },
        
        calculate() {
            let total = this.basePrice;
            
            // Add sections price
            const selectedSection = document.querySelector('input[name="sections"]:checked');
            if (selectedSection) {
                total += parseInt(selectedSection.value) || 0;
            }
            
            // Add options prices
            const checkboxes = document.querySelectorAll('.calc-checkbox input:checked');
            checkboxes.forEach(checkbox => {
                total += parseInt(checkbox.value) || 0;
            });
            
            // Animate price change
            this.animatePrice(total);
        },
        
        animatePrice(newPrice) {
            const currentPrice = parseInt(this.totalElement.textContent.replace(/\s/g, '')) || 0;
            const difference = newPrice - currentPrice;
            const steps = 20;
            const stepValue = difference / steps;
            let step = 0;
            
            const animate = () => {
                step++;
                const value = Math.round(currentPrice + (stepValue * step));
                this.totalElement.textContent = this.formatPrice(value);
                
                if (step < steps) {
                    requestAnimationFrame(animate);
                } else {
                    this.totalElement.textContent = this.formatPrice(newPrice);
                }
            };
            
            requestAnimationFrame(animate);
        },
        
        formatPrice(price) {
            return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        }
    };
    
    // Initialize calculator
    calculator.init();
    
    // ============================================
    // Mobile Menu
    // ============================================
    const mobileMenu = {
        burger: document.querySelector('.burger'),
        menu: document.querySelector('.mobile-menu'),
        links: document.querySelectorAll('.mobile-nav-list a'),
        
        init() {
            if (!this.burger || !this.menu) return;
            
            this.burger.addEventListener('click', () => this.toggle());
            
            this.links.forEach(link => {
                link.addEventListener('click', () => this.close());
            });
            
            // Close on click outside
            document.addEventListener('click', (e) => {
                if (!this.burger.contains(e.target) && !this.menu.contains(e.target)) {
                    this.close();
                }
            });
        },
        
        toggle() {
            this.burger.classList.toggle('active');
            this.menu.classList.toggle('active');
            document.body.style.overflow = this.menu.classList.contains('active') ? 'hidden' : '';
        },
        
        close() {
            this.burger.classList.remove('active');
            this.menu.classList.remove('active');
            document.body.style.overflow = '';
        }
    };
    
    mobileMenu.init();
    
    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    const smoothScroll = {
        init() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = anchor.getAttribute('href');
                    
                    if (targetId === '#') return;
                    
                    const target = document.querySelector(targetId);
                    if (target) {
                        const headerOffset = 80;
                        const elementPosition = target.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }
    };
    
    smoothScroll.init();
    
    // ============================================
    // Scroll Animations (Intersection Observer)
    // ============================================
    const scrollAnimations = {
        init() {
            // Animate hero elements on load
            setTimeout(() => {
                document.querySelectorAll('.hero .animate-fade-in').forEach(el => {
                    el.classList.add('visible');
                });
            }, 100);
            
            // Animate other elements on scroll
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            
            // Observe cards and sections
            const animateElements = document.querySelectorAll(
                '.advantage-card, .portfolio-card, .contact-card, .about-wrapper, .calculator-wrapper'
            );
            
            animateElements.forEach((el, index) => {
                el.classList.add('animate-fade-in');
                el.style.transitionDelay = `${index * 0.1}s`;
                observer.observe(el);
            });
        }
    };
    
    scrollAnimations.init();
    
    // ============================================
    // Header Scroll Effect
    // ============================================
    const headerScroll = {
        header: document.querySelector('.header'),
        
        init() {
            if (!this.header) return;
            
            let lastScroll = 0;
            
            window.addEventListener('scroll', () => {
                const currentScroll = window.pageYOffset;
                
                // Add shadow on scroll
                if (currentScroll > 10) {
                    this.header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                } else {
                    this.header.style.boxShadow = 'none';
                }
                
                lastScroll = currentScroll;
            });
        }
    };
    
    headerScroll.init();
    
    // ============================================
    // Form Validation & Submit
    // ============================================
    const contactForm = {
        form: document.querySelector('.contacts-form form'),
        
        init() {
            if (!this.form) return;
            
            this.form.addEventListener('submit', (e) => {
                const inputs = this.form.querySelectorAll('input[required], textarea[required]');
                let isValid = true;
                
                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.style.borderColor = '#FF6B35';
                    } else {
                        input.style.borderColor = '';
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                    alert('Пожалуйста, заполните все обязательные поля');
                }
            });
            
            // Remove error styling on input
            this.form.querySelectorAll('input, textarea').forEach(input => {
                input.addEventListener('input', () => {
                    input.style.borderColor = '';
                });
            });
        }
    };
    
    contactForm.init();
    
    // ============================================
    // Cursor Blink Animation (Hero Code Block)
    // ============================================
    const cursor = document.querySelector('.code-cursor');
    if (cursor) {
        // Already handled by CSS animation
    }
    
    // ============================================
    // Add calculated price to form (optional)
    // ============================================
    const addPriceToForm = {
        init() {
            const form = document.querySelector('.contacts-form form');
            const priceDisplay = document.getElementById('totalPrice');
            
            if (form && priceDisplay) {
                form.addEventListener('submit', () => {
                    // Create hidden input with calculated price
                    let hiddenInput = form.querySelector('input[name="calculated_price"]');
                    if (!hiddenInput) {
                        hiddenInput = document.createElement('input');
                        hiddenInput.type = 'hidden';
                        hiddenInput.name = 'calculated_price';
                        form.appendChild(hiddenInput);
                    }
                    hiddenInput.value = priceDisplay.textContent + ' ₽';
                });
            }
        }
    };
    
    addPriceToForm.init();
    
    console.log('🚀 LandingPro website loaded successfully!');
});
