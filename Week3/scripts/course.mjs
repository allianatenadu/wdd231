const byuiCourse = {
            courseName: "WDD 330 - Web Frontend Development",
            courseCode: "WDD 330",
            sections: [
                {
                    sectionNum: 1,
                    roomNum: "STC 353",
                    enrolled: 26,
                    days: ["TTh"],
                    instructor: "Bro T"
                },
                {
                    sectionNum: 2,
                    roomNum: "STC 347",
                    enrolled: 28,
                    days: ["TTh"],
                    instructor: "Sis A"
                },
                {
                    sectionNum: 3,
                    roomNum: "STC 348",
                    enrolled: 25,
                    days: ["TTh"],
                    instructor: "Bro B"
                }
            ],
            changeEnrollment: function(sectionNum, enroll = true) {
                const sectionIndex = this.sections.findIndex(
                    section => section.sectionNum == sectionNum
                );
                if (sectionIndex >= 0) {
                    if (enroll) {
                        this.sections[sectionIndex].enrolled++;
                    } else {
                        this.sections[sectionIndex].enrolled--;
                    }
                }
            }
        };