// Add active class to current navigation item
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a');
    const currentLocation = window.location.href;
    
    navLinks.forEach(link => {
      if (link.href === currentLocation) {
        link.classList.add('active');
      }
      
      // Add hover effect animation
      link.addEventListener('mouseenter', () => {
        link.style.transition = 'all 0.3s';
      });
      
      link.addEventListener('mouseleave', () => {
        link.style.transition = 'all 0.3s';
      });
    });
  });