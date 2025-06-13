// UI Module for Experience Ghana website
// Handles modal dialogs, mobile menu, and user interface interactions
// Demonstrates DOM manipulation and accessibility features

/**
 * Show modal dialog
 * Demonstrates modal functionality with accessibility features
 * @param {Element} modal - Modal element to show
 */
export function showModal(modal) {
    if (!modal) {
        console.error('Modal element not provided');
        return;
    }
    
    // Show the modal
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    
    // Focus management for accessibility
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }
    
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
    
    // Add escape key listener
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            hideModal(modal);
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    
    document.addEventListener('keydown', escapeHandler);
    
    // Trap focus within modal
    trapFocus(modal);
    
    // Add animation class
    setTimeout(() => {
        modal.classList.add('modal-visible');
    }, 10);
}

/**
 * Hide modal dialog
 * Demonstrates proper modal cleanup and accessibility
 * @param {Element} modal - Modal element to hide
 */
export function hideModal(modal) {
    if (!modal) {
        console.error('Modal element not provided');
        return;
    }
    
    // Add closing animation
    modal.classList.remove('modal-visible');
    modal.classList.add('modal-closing');
    
    // Hide modal after animation
    setTimeout(() => {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        modal.classList.remove('modal-closing');
        
        // Restore body scrolling
        document.body.style.overflow = '';
        
        // Return focus to previously focused element
        const previouslyFocused = document.querySelector('[data-modal-trigger]');
        if (previouslyFocused) {
            previouslyFocused.focus();
            previouslyFocused.removeAttribute('data-modal-trigger');
        }
    }, 300);
}

/**
 * Toggle mobile navigation menu
 * Demonstrates responsive menu functionality
 * @param {Element} navMenu - Navigation menu element
 */
export function toggleMobileMenu(navMenu) {
    if (!navMenu) {
        console.error('Navigation menu element not provided');
        return;
    }
    
    const hamburger = document.getElementById('hamburger');
    const isActive = navMenu.classList.contains('active');
    
    if (isActive) {
        // Close menu
        navMenu.classList.remove('active');
        navMenu.setAttribute('aria-expanded', 'false');
        hamburger?.classList.remove('active');
        
        // Animate hamburger lines back
        animateHamburger(hamburger, false);
    } else {
        // Open menu
        navMenu.classList.add('active');
        navMenu.setAttribute('aria-expanded', 'true');
        hamburger?.classList.add('active');
        
        // Animate hamburger to X
        animateHamburger(hamburger, true);
    }
    
    // Update ARIA attributes for accessibility
    if (hamburger) {
        hamburger.setAttribute('aria-label', isActive ? 'Open menu' : 'Close menu');
    }
}

/**
 * Animate hamburger menu icon
 * Demonstrates CSS animation control via JavaScript
 * @param {Element} hamburger - Hamburger button element
 * @param {boolean} toX - Whether to animate to X shape
 */
function animateHamburger(hamburger, toX) {
    if (!hamburger) return;
    
    const lines = hamburger.querySelectorAll('.hamburger-line');
    
    if (toX) {
        // Transform to X
        lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        lines[1].style.opacity = '0';
        lines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        // Transform back to hamburger
        lines[0].style.transform = 'none';
        lines[1].style.opacity = '1';
        lines[2].style.transform = 'none';
    }
}

/**
 * Trap focus within modal for accessibility
 * @param {Element} modal - Modal element
 */
function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const trapHandler = (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                // Shift + Tab: moving backward
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab: moving forward
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    };
    
    modal.addEventListener('keydown', trapHandler);
    
    // Store handler to remove later
    modal._trapHandler = trapHandler;
}

/**
 * Create and show notification toast
 * Demonstrates dynamic element creation and styling
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, info, warning)
 * @param {number} duration - Display duration in milliseconds
 */
export function showNotification(message, type = 'info', duration = 5000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    // Set notification content using template literals
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close notification">×</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Position notification
    positionNotification(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('notification-visible');
    }, 10);
    
    // Add close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        hideNotification(notification);
    });
    
    // Auto-hide after duration
    setTimeout(() => {
        if (notification.parentNode) {
            hideNotification(notification);
        }
    }, duration);
    
    return notification;
}

/**
 * Hide notification with animation
 * @param {Element} notification - Notification element to hide
 */
function hideNotification(notification) {
    notification.classList.add('notification-hiding');
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

/**
 * Get appropriate icon for notification type
 * @param {string} type - Notification type
 * @returns {string} Icon emoji
 */
function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}

/**
 * Position notification on screen
 * @param {Element} notification - Notification element
 */
function positionNotification(notification) {
    const existingNotifications = document.querySelectorAll('.notification');
    const notificationHeight = 80; // Approximate height
    const spacing = 10;
    const topOffset = 20;
    
    const position = topOffset + (existingNotifications.length - 1) * (notificationHeight + spacing);
    notification.style.top = `${position}px`;
}

/**
 * Create loading spinner
 * Demonstrates dynamic UI element creation
 * @param {string} containerId - Container element ID
 * @param {string} message - Loading message
 */
export function showLoadingSpinner(containerId, message = 'Loading...') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID "${containerId}" not found`);
        return;
    }
    
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.innerHTML = `
        <div class="spinner-animation"></div>
        <p class="spinner-message">${message}</p>
    `;
    
    container.appendChild(spinner);
    return spinner;
}

/**
 * Hide loading spinner
 * @param {Element|string} spinnerOrContainerId - Spinner element or container ID
 */
export function hideLoadingSpinner(spinnerOrContainerId) {
    let spinner;
    
    if (typeof spinnerOrContainerId === 'string') {
        const container = document.getElementById(spinnerOrContainerId);
        spinner = container?.querySelector('.loading-spinner');
    } else {
        spinner = spinnerOrContainerId;
    }
    
    if (spinner && spinner.parentNode) {
        spinner.parentNode.removeChild(spinner);
    }
}

/**
 * Create confirmation dialog
 * Demonstrates custom dialog creation with promises
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {string} confirmText - Confirm button text
 * @param {string} cancelText - Cancel button text
 * @returns {Promise<boolean>} Promise resolving to user choice
 */
export function showConfirmDialog(title, message, confirmText = 'Confirm', cancelText = 'Cancel') {
    return new Promise((resolve) => {
        // Create dialog element
        const dialog = document.createElement('div');
        dialog.className = 'modal confirmation-dialog';
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-labelledby', 'dialog-title');
        dialog.setAttribute('aria-describedby', 'dialog-message');
        
        dialog.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="dialog-title">${title}</h2>
                </div>
                <div class="modal-body">
                    <p id="dialog-message">${message}</p>
                    <div class="dialog-actions">
                        <button class="btn-secondary cancel-btn">${cancelText}</button>
                        <button class="btn-primary confirm-btn">${confirmText}</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        showModal(dialog);
        
        // Add event listeners
        const confirmBtn = dialog.querySelector('.confirm-btn');
        const cancelBtn = dialog.querySelector('.cancel-btn');
        
        const cleanup = () => {
            hideModal(dialog);
            setTimeout(() => {
                if (dialog.parentNode) {
                    dialog.parentNode.removeChild(dialog);
                }
            }, 300);
        };
        
        confirmBtn.addEventListener('click', () => {
            cleanup();
            resolve(true);
        });
        
        cancelBtn.addEventListener('click', () => {
            cleanup();
            resolve(false);
        });
        
        // Close on escape
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                cleanup();
                resolve(false);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        
        document.addEventListener('keydown', escapeHandler);
    });
}

/**
 * Smooth scroll to element
 * Demonstrates smooth scrolling with animation
 * @param {Element|string} targetElement - Target element or selector
 * @param {number} offset - Offset from top in pixels
 */
export function smoothScrollTo(targetElement, offset = 0) {
    let target;
    
    if (typeof targetElement === 'string') {
        target = document.querySelector(targetElement);
    } else {
        target = targetElement;
    }
    
    if (!target) {
        console.warn('Target element not found for smooth scroll');
        return;
    }
    
    const targetPosition = target.offsetTop - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let startTime = null;
    
    function animateScroll(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Easing function for smooth animation
        const ease = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        
        window.scrollTo(0, startPosition + distance * ease(progress));
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animateScroll);
        }
    }
    
    requestAnimationFrame(animateScroll);
}

/**
 * Update page loading state
 * Demonstrates loading state management
 * @param {boolean} isLoading - Whether page is loading
 */
export function updateLoadingState(isLoading) {
    const body = document.body;
    
    if (isLoading) {
        body.classList.add('loading');
        body.style.cursor = 'wait';
    } else {
        body.classList.remove('loading');
        body.style.cursor = '';
    }
}

/**
 * Handle responsive image loading
 * Demonstrates lazy loading implementation
 * @param {Element} img - Image element
 */
export function handleLazyLoading(img) {
    if (!img) return;
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const image = entry.target;
                const src = image.dataset.src;
                
                if (src) {
                    image.src = src;
                    image.classList.remove('lazy');
                    image.classList.add('loaded');
                }
                
                observer.unobserve(image);
            }
        });
    });
    
    imageObserver.observe(img);
}

/**
 * Initialize UI components
 * Sets up common UI functionality
 */
export function initializeUI() {
    // Set up lazy loading for images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(handleLazyLoading);
    
    // Set up click-outside handlers for dropdowns
    document.addEventListener('click', (e) => {
        const openDropdowns = document.querySelectorAll('.dropdown.active');
        openDropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    });
    
    console.log('UI components initialized');
}