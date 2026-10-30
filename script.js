
document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // GET HTML ELEMENTS
    // =====================================

    const form = document.getElementById("resumeForm");
    const preview = document.getElementById("resumePreview");
    const templateSelect = document.getElementById("templateSelect");
    const languageSelect = document.getElementById("languageSelect");

    const sampleButton = document.getElementById("sampleButton");
    const clearButton = document.getElementById("clearButton");
    const printButton = document.getElementById("printButton");
    const downloadButton = document.getElementById("downloadButton");

    const fresherCheckbox = document.getElementById("isFresher");
    const experienceFields = document.getElementById("experienceFields");

    const toast = document.getElementById("toast");

    let currentLanguage = "en";

    // =====================================
    // TRANSLATIONS
    // =====================================

    const translations = {
        en: {
            summary: "Professional Summary",
            education: "Education",
            skills: "Skills",
            experience: "Work Experience",
            projects: "Projects",
            certifications: "Certifications & Courses",
            interests: "Hobbies & Interests",
            fresher: "Fresher",
            noSkills: "No skills added.",
            sample: "Sample information loaded!",
            cleared: "Form cleared successfully!",
            generated: "Resume generated successfully!",
            nameRequired: "Please enter your full name.",
            print: "Choose Save as PDF in the print window.",
            home: "Home",
            features: "Features",
            create: "Create Resume",
            templates: "Templates",
            preview: "Preview",
            build: "Build My Resume",
            navHome: "Home",
            navFeatures: "Features",
            navCreate: "Create Resume",
            navTemplates: "Templates",
            navPreview: "Preview"
        },

        mr: {
            summary: "व्यावसायिक परिचय",
            education: "शिक्षण",
            skills: "कौशल्ये",
            experience: "कामाचा अनुभव",
            projects: "प्रकल्प",
            certifications: "प्रमाणपत्रे आणि कोर्सेस",
            interests: "छंद आणि आवडी",
            fresher: "नवीन उमेदवार",
            noSkills: "कौशल्ये जोडलेली नाहीत.",
            sample: "नमुना माहिती भरली आहे!",
            cleared: "फॉर्म रिकामा केला आहे!",
            generated: "रेझ्युमे तयार झाला आहे!",
            nameRequired: "कृपया तुमचे पूर्ण नाव लिहा.",
            print: "प्रिंट विंडोमध्ये Save as PDF निवडा.",
            home: "मुख्यपृष्ठ",
            features: "वैशिष्ट्ये",
            create: "रेझ्युमे तयार करा",
            templates: "टेम्पलेट्स",
            preview: "पूर्वावलोकन",
            build: "रेझ्युमे तयार करा",
            navHome: "मुख्यपृष्ठ",
            navFeatures: "वैशिष्ट्ये",
            navCreate: "रेझ्युमे तयार करा",
            navTemplates: "टेम्पलेट्स",
            navPreview: "पूर्वावलोकन"
        },

        hi: {
            summary: "व्यावसायिक परिचय",
            education: "शिक्षा",
            skills: "कौशल",
            experience: "कार्य अनुभव",
            projects: "प्रोजेक्ट",
            certifications: "प्रमाणपत्र और कोर्स",
            interests: "शौक और रुचियां",
            fresher: "नया उम्मीदवार",
            noSkills: "अभी कोई कौशल नहीं जोड़ा गया है।",
            sample: "नमूना जानकारी भर दी गई है!",
            cleared: "फॉर्म साफ़ कर दिया गया है!",
            generated: "रिज्यूमे तैयार हो गया है!",
            nameRequired: "कृपया अपना पूरा नाम दर्ज करें।",
            print: "प्रिंट विंडो में Save as PDF चुनें।",
            home: "होम",
            features: "विशेषताएं",
            create: "रिज्यूमे बनाएं",
            templates: "टेम्पलेट",
            preview: "पूर्वावलोकन",
            build: "रिज्यूमे बनाएं",
            navHome: "होम",
            navFeatures: "विशेषताएं",
            navCreate: "रिज्यूमे बनाएं",
            navTemplates: "टेम्पलेट",
            navPreview: "पूर्वावलोकन"
        }
    };

    function translate(key) {
        return translations[currentLanguage]?.[key] ||
               translations.en[key] ||
               key;
    }

    // =====================================
    // TOAST MESSAGE
    // =====================================

    let toastTimer;

    function showToast(message) {
        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2600);
    }

    // =====================================
    // SAFE HTML OUTPUT
    // =====================================

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, character => {
            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            };

            return entities[character];
        });
    }

    function paragraph(value) {
        if (!value) return "";

        return `<p>${escapeHTML(value).replace(/\n/g, "<br>")}</p>`;
    }

    function createSection(title, content) {
        if (!content) return "";

        return `
            <section class="resume-section">
                <h3>${escapeHTML(title)}</h3>
                <div>${content}</div>
            </section>
        `;
    }

    // =====================================
    // GET FORM DATA
    // =====================================

    function getValue(id) {
        const element = document.getElementById(id);
        return element ? element.value.trim() : "";
    }

    function getSelectedSkills() {
        const selected = Array.from(
            document.querySelectorAll('input[name="skills"]:checked')
        ).map(item => item.value.trim());

        const custom = getValue("customSkills")
            .split(",")
            .map(item => item.trim())
            .filter(Boolean);

        return [...new Set([...selected, ...custom])];
    }

    function getFormData() {
        return {
            name: getValue("fullName"),
            phone: getValue("phone"),
            email: getValue("email"),
            location: getValue("location"),
            languages: getValue("languages"),

            education: getValue("education"),
            institution: getValue("institution"),
            passingYear: getValue("passingYear"),
            grade: getValue("grade"),

            skills: getSelectedSkills(),

            isFresher: fresherCheckbox?.checked || false,

            jobTitle: getValue("jobTitle"),
            workplace: getValue("workplace"),
            experienceDetails: getValue("experienceDetails"),

            projects: getValue("projects"),
            certifications: getValue("certifications"),
            hobbies: getValue("hobbies"),
            jobRole: getValue("jobRole"),
            objective: getValue("objective")
        };
    }

    // =====================================
    // TEMPLATE SELECTOR
    // =====================================

    function applyTemplate() {
        const template = templateSelect?.value || "classic";

        const classes = [
            "classic-template",
            "modern-template",
            "simple-template",
            "executive-template",
            "creative-template",
            "compact-template"
        ];

        preview.classList.remove(...classes);
        preview.classList.add(template + "-template");
    }

    if (templateSelect) {
        templateSelect.addEventListener("change", applyTemplate);
    }

    // =====================================
    // FRESHER CHECKBOX
    // =====================================

    function updateExperienceFields() {
        if (!fresherCheckbox || !experienceFields) return;

        const isFresher = fresherCheckbox.checked;

        experienceFields.style.display = isFresher ? "none" : "block";

        experienceFields.querySelectorAll("input, textarea, select")
            .forEach(field => {
                field.disabled = isFresher;
            });
    }

    if (fresherCheckbox) {
        fresherCheckbox.addEventListener(
            "change",
            updateExperienceFields
        );
    }

    // =====================================
    // GENERATE RESUME
    // =====================================

    function generateResume() {
        const data = getFormData();

        if (!data.name) {
            showToast(translate("nameRequired"));
            document.getElementById("fullName")?.focus();
            return false;
        }

        const contactDetails = [
            data.phone,
            data.email,
            data.location,
            data.languages
        ].filter(Boolean);

        const contactHTML = contactDetails
            .map(item => `<span>${escapeHTML(item)}</span>`)
            .join(" &nbsp; | &nbsp; ");

        const educationHTML = [
            data.education,
            data.institution,
            data.passingYear ? "Passing Year: " + data.passingYear : "",
            data.grade
        ]
        .filter(Boolean)
        .map(paragraph)
        .join("");

        const skillsHTML = data.skills.length
            ? `<ul class="resume-skills">
                ${data.skills.map(skill =>
                    `<li>${escapeHTML(skill)}</li>`
                ).join("")}
               </ul>`
            : paragraph(translate("noSkills"));

        let experienceHTML = "";

        if (data.isFresher) {
            experienceHTML = paragraph(translate("fresher"));
        } else {
            experienceHTML = [
                data.jobTitle,
                data.workplace,
                data.experienceDetails
            ]
            .filter(Boolean)
            .map(paragraph)
            .join("");
        }

        const roleHTML = data.jobRole
            ? `<p class="resume-role">${escapeHTML(data.jobRole)}</p>`
            : "";

        const objectiveHTML = paragraph(data.objective);
        const projectsHTML = paragraph(data.projects);
        const certificationsHTML = paragraph(data.certifications);
        const interestsHTML = paragraph(data.hobbies);

        preview.innerHTML = `
            <div class="resume-document">

                <header class="resume-header">
                    <h1>${escapeHTML(data.name)}</h1>
                    ${roleHTML}
                    <div class="resume-contact">
                        ${contactHTML}
                    </div>
                </header>

                ${createSection(
                    translate("summary"),
                    objectiveHTML
                )}

                ${createSection(
                    translate("education"),
                    educationHTML
                )}

                ${createSection(
                    translate("skills"),
                    skillsHTML
                )}

                ${createSection(
                    translate("experience"),
                    experienceHTML
                )}

                ${createSection(
                    translate("projects"),
                    projectsHTML
                )}

                ${createSection(
                    translate("certifications"),
                    certificationsHTML
                )}

                ${createSection(
                    translate("interests"),
                    interestsHTML
                )}

            </div>
        `;

        applyTemplate();

        const status = document.getElementById("previewStatus");

        if (status) {
            status.textContent = translate("generated");
        }

        showToast(translate("generated"));

        return true;
    }

    // =====================================
    // FORM SUBMISSION
    // =====================================

    form.addEventListener("submit", event => {
        event.preventDefault();

        if (generateResume()) {
            document.getElementById("preview")?.scrollIntoView({
                behavior: "smooth"
            });
        }
    });

    // =====================================
    // SAMPLE DATA
    // =====================================

    function loadSampleData() {
        const sample = {
            fullName: "Rahul Patil",
            phone: "9876543210",
            email: "rahul.patil@example.com",
            location: "Nashik, Maharashtra",
            languages: "English, Hindi, Marathi",

            education: "Diploma in Computer Engineering",
            institution: "Government Polytechnic",
            passingYear: "2026",
            grade: "85%",

            customSkills: "Communication, Problem Solving",

            jobTitle: "Python Intern",
            workplace: "ABC Technologies",
            experienceDetails:
                "Completed practical training in Python programming and basic software development.",

            projects:
                "Digital Resume Builder - Developed a responsive website using HTML, CSS and JavaScript.",

            certifications:
                "Python Programming - Internship Training",

            hobbies: "Reading, Technology, Learning New Skills",

            jobRole: "Junior Computer Operator",

            objective:
                "Motivated fresher seeking an opportunity to apply technical knowledge, improve professional skills and contribute to an organization."
        };

        Object.entries(sample).forEach(([id, value]) => {
            const element = document.getElementById(id);

            if (element) {
                element.value = value;
            }
        });

        document.querySelectorAll('input[name="skills"]')
            .forEach(skill => {
                skill.checked = [
                    "MS Word",
                    "Python",
                    "Communication",
                    "Problem Solving"
                ].includes(skill.value);
            });

        if (fresherCheckbox) {
            fresherCheckbox.checked = false;
            updateExperienceFields();
        }

        generateResume();
        showToast(translate("sample"));
    }

    sampleButton.addEventListener("click", loadSampleData);

    // =====================================
    // CLEAR FORM
    // =====================================

    function clearResume() {
        form.reset();

        updateExperienceFields();

        preview.innerHTML = `
            <div class="empty-preview">
                <div class="empty-icon">📄</div>
                <h2>Your Resume Will Appear Here</h2>
                <p>Complete the form and click Generate Resume to see your professional resume.</p>
                <a href="#builder" class="primary-button">
                    Start Creating →
                </a>
            </div>
        `;

        const status = document.getElementById("previewStatus");

        if (status) {
            status.textContent = "Your resume will appear here.";
        }

        applyTemplate();
        showToast(translate("cleared"));
    }

    clearButton.addEventListener("click", clearResume);

    // =====================================
    // PRINT AND SAVE AS PDF
    // =====================================

    function printResume() {
        if (!preview.querySelector(".resume-document")) {
            if (!generateResume()) return;
        }

        showToast(translate("print"));

        window.print();
    }

    printButton.addEventListener("click", printResume);
    downloadButton.addEventListener("click", printResume);

    // =====================================
    // RESPONSIVE NAVIGATION
    // =====================================

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const navItems = document.querySelectorAll(".nav-link");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("show");

            menuToggle.textContent = isOpen ? "✕" : "☰";
            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });
    }

    navItems.forEach(link => {
        link.addEventListener("click", () => {
            navItems.forEach(item => {
                item.classList.remove("active");
            });

            link.classList.add("active");

            navLinks?.classList.remove("show");

            if (menuToggle) {
                menuToggle.textContent = "☰";
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    });

    // Highlight active navigation section
    const sections = document.querySelectorAll(
        "#home, #features, #builder, #templates, #preview"
    );

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                navItems.forEach(link => {
                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === "#" + entry.target.id
                    );
                });
            });
        }, {
            rootMargin: "-20% 0px -65% 0px"
        });

        sections.forEach(section => observer.observe(section));
    }

    // =====================================
    // LANGUAGE SELECTOR
    // =====================================

    function updateLanguage() {
        currentLanguage = languageSelect.value || "en";

        const navTranslationKeys = [
            "navHome",
            "navFeatures",
            "navCreate",
            "navTemplates",
            "navPreview"
        ];

        navItems.forEach((link, index) => {
            const key = navTranslationKeys[index];

            if (key) {
                link.textContent = translate(key);
            }
        });

        const navButton = document.querySelector(".nav-button");

        if (navButton) {
            navButton.textContent = translate("build") + " →";
        }

        // Regenerate preview in selected language.
        if (preview.querySelector(".resume-document")) {
            generateResume();
        }
    }

    if (languageSelect) {
        languageSelect.addEventListener("change", updateLanguage);
    }

    // =====================================
    // INITIAL PAGE SETTINGS
    // =====================================

    applyTemplate();
    updateExperienceFields();

});
