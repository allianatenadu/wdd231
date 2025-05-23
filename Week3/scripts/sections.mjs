function setSectionSelection(sections) {
            const sectionSelect = document.querySelector("#sectionNumber");
            sectionSelect.innerHTML = '<option value="">Choose a section...</option>';
            
            sections.forEach(section => {
                const option = document.createElement("option");
                option.value = section.sectionNum;
                option.textContent = `Section ${section.sectionNum} - ${section.instructor} (${section.roomNum})`;
                sectionSelect.appendChild(option);
            });
        }