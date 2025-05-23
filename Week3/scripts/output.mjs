 function setTitle(course) {
            const titleElement = document.querySelector("#courseTitle");
            titleElement.textContent = `${course.courseCode}: ${course.courseName}`;
        }

        function renderSections(sections) {
            const sectionsDisplay = document.querySelector("#sectionsDisplay");
            sectionsDisplay.innerHTML = "";
            
            sections.forEach(section => {
                const sectionDiv = document.createElement("div");
                sectionDiv.className = "section-item";
                sectionDiv.innerHTML = `
                    <div class="section-info">
                        <div class="section-number">Section ${section.sectionNum}</div>
                        <div>Instructor: ${section.instructor}</div>
                        <div>Room: ${section.roomNum}</div>
                        <div>Days: ${section.days.join(", ")}</div>
                    </div>
                    <div class="enrollment-count">${section.enrolled} enrolled</div>
                `;
                sectionsDisplay.appendChild(sectionDiv);
            });
        }