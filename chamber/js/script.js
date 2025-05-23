// script.js - Main JavaScript for Chamber of Commerce Website

// Get common DOM elements
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

// Mobile menu toggle functionality
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
    menuToggle.textContent = navLinks.classList.contains("show") ? "✕ Close" : "☰ Menu";
  });
}

// Directory page specific functionality
const directory = document.getElementById("directory");
const gridBtn = document.getElementById("grid");
const listBtn = document.getElementById("list");

// Only run directory-specific code if we're on the directory page
if (directory && gridBtn && listBtn) {
  // Grid/List view toggle functionality
  gridBtn.addEventListener("click", () => {
    directory.classList.add("grid");
    directory.classList.remove("list");
    
    // Update active button styling
    gridBtn.classList.add("active");
    listBtn.classList.remove("active");
    
    // Save preference to localStorage
    localStorage.setItem("viewPreference", "grid");
  });

  listBtn.addEventListener("click", () => {
    directory.classList.add("list");
    directory.classList.remove("grid");
    
    // Update active button styling
    listBtn.classList.add("active");
    gridBtn.classList.remove("active");
    
    // Save preference to localStorage
    localStorage.setItem("viewPreference", "list");
  });

  // Load view preference from localStorage (if available)
  window.addEventListener("DOMContentLoaded", () => {
    const viewPreference = localStorage.getItem("viewPreference");
    
    if (viewPreference === "list") {
      directory.classList.add("list");
      directory.classList.remove("grid");
      listBtn.classList.add("active");
      gridBtn.classList.remove("active");
    } else {
      // Default to grid view
      directory.classList.add("grid");
      directory.classList.remove("list");
      gridBtn.classList.add("active");
      listBtn.classList.remove("active");
    }
  });
}

// Set copyright year and last modified date
function setFooterInfo() {
  const yearElement = document.getElementById("year");
  const lastModifiedElement = document.getElementById("lastModified");
  
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  if (lastModifiedElement) {
    lastModifiedElement.textContent = `Last Modified: ${document.lastModified}`;
  }
}

// Active page highlighting in navigation
function setActiveNavigation() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  document.querySelectorAll("#nav-links a").forEach(link => {
    link.classList.remove("active");
    
    const linkHref = link.getAttribute("href");
    
    // Handle different ways pages might be referenced
    if (linkHref === currentPage || 
        (currentPage === '' && linkHref === 'index.html') ||
        (currentPage === 'index.html' && linkHref === 'index.html') ||
        linkHref.endsWith(currentPage)) {
      link.classList.add("active");
    }
  });
}

// Close mobile menu when clicking outside or on a link
document.addEventListener("click", (event) => {
  if (navLinks && navLinks.classList.contains("show")) {
    // If clicking outside the nav or on a nav link, close the menu
    if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
      navLinks.classList.remove("show");
      if (menuToggle) {
        menuToggle.textContent = "☰ Menu";
      }
    }
  }
});

// Close mobile menu when clicking on navigation links
if (navLinks) {
  navLinks.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
      navLinks.classList.remove("show");
      if (menuToggle) {
        menuToggle.textContent = "☰ Menu";
      }
    }
  });
}

// Initialize common functionality
document.addEventListener("DOMContentLoaded", () => {
  console.log("Main script loaded");
  
  // Set footer information
  setFooterInfo();
  
  // Set active navigation
  setActiveNavigation();
  
  // Add smooth scrolling to internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
});

// Utility function to show loading state
function showLoading(element, message = "Loading...") {
  if (element) {
    element.innerHTML = `<div class="loading">${message}</div>`;
  }
}

// Utility function to show error message
function showError(element, message) {
  if (element) {
    element.innerHTML = `<div class="error">${message}</div>`;
  }
}

// Export functions for other scripts to use
window.chamberUtils = {
  showLoading,
  showError,
  setActiveNavigation
};