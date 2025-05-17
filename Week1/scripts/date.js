// Date and time information for footer
document.addEventListener('DOMContentLoaded', () => {
    // Set current year
    const currentYear = new Date().getFullYear();
    const yearElement = document.querySelector('footer p:first-child');
    yearElement.innerHTML = yearElement.innerHTML.replace('2025', currentYear);
    
    // Set last modified date
    const lastModified = document.getElementById('lastModified');
    const formattedDate = formatLastModified(document.lastModified);
    lastModified.textContent = `Last Update: ${formattedDate}`;
  });
  
  function formatLastModified(dateString) {
    const date = new Date(dateString);
    
    // Format: MM/DD/YYYY HH:MM:SS
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
  }