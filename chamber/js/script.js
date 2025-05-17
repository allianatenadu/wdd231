const directory = document.getElementById("directory");
const gridBtn = document.getElementById("grid");
const listBtn = document.getElementById("list");
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

// Toggle menu for mobile view
menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
  menuToggle.textContent = navLinks.classList.contains("show") ? "✕ Close" : "☰ Menu";
});

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

// Set copyright year and last modified date
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = `Last Modified: ${document.lastModified}`;

// Active page highlighting in navigation
document.querySelectorAll("#nav-links a").forEach(link => {
  if (link.getAttribute("href") === "directory.html") {
    link.classList.add("active");
  }
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