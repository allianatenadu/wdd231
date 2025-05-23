// modules.mjs
import byuiCourse from './course.mjs';
import { setSectionSelection } from './sections.mjs';
import { setTitle, renderSections } from './output.mjs';

setTitle(byuiCourse);
        setSectionSelection(byuiCourse.sections);
        renderSections(byuiCourse.sections);

        // Event listeners
        document.querySelector("#enrollStudent").addEventListener("click", function () {
            const sectionNum = document.querySelector("#sectionNumber").value;
            if (sectionNum) {
                byuiCourse.changeEnrollment(sectionNum);
                renderSections(byuiCourse.sections);
            } else {
                alert("Please select a section first!");
            }
        });

        document.querySelector("#dropStudent").addEventListener("click", function () {
            const sectionNum = document.querySelector("#sectionNumber").value;
            if (sectionNum) {
                byuiCourse.changeEnrollment(sectionNum, false);
                renderSections(byuiCourse.sections);
            } else {
                alert("Please select a section first!");
            }
        });