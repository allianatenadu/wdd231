// Course data and filtering functionality
document.addEventListener('DOMContentLoaded', () => {
    // Course data
    const courses = [
      { code: "CSE 110", name: "Programming Building Blocks", credits: 3, completed: true },
      { code: "WDD 130", name: "Web Fundamentals", credits: 3, completed: true },
      { code: "CSE 111", name: "Programming with Functions", credits: 3, completed: true },
      { code: "CSE 210", name: "Programming with Classes", credits: 3, completed: false },
      { code: "WDD 131", name: "Advanced Web Development", credits: 3, completed: false },
      { code: "WDD 231", name: "Front-end Development I", credits: 3, completed: false }
    ];
  
    // Set active button
    const buttons = document.querySelectorAll('#course-buttons button');
    buttons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        buttons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
      });
    });
  
    // Initialize with all courses
    renderCourses(courses);
  
    // Add to global scope for button access
    window.filterCourses = function(type) {
      let filteredCourses;
  
      if (type === "cse") {
        filteredCourses = courses.filter(course => course.code.startsWith("CSE"));
      } else if (type === "wdd") {
        filteredCourses = courses.filter(course => course.code.startsWith("WDD"));
      } else {
        filteredCourses = courses;
      }
  
      renderCourses(filteredCourses);
    };
  });
  
  function renderCourses(courseList) {
    const container = document.getElementById("course-container");
    container.innerHTML = "";
  
    courseList.forEach(course => {
      const card = document.createElement("div");
      card.className = course.completed ? "course-card completed" : "course-card";
      
      card.innerHTML = `
        <h4>${course.code}</h4>
        <p>${course.name}</p>
        <p>${course.credits} Credits</p>
      `;
      
      // Add hover animation
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
      });
      
      container.appendChild(card);
    });
  }