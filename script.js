document.addEventListener('DOMContentLoaded', () => {
    const previewArea = document.getElementById('previewArea');
    const descInput = document.getElementById('pDesc');
    const manualEditor = document.getElementById('manualEditor');
    const toggleEditBtn = document.getElementById('toggleEditBtn');
    
    let isEditing = false;
    let currentMarkdown = "";

    const templates = {
        web: "I am developing a modern web application for [purpose]. It allows users to [action 1] and [action 2] with a focus on responsive design.",
        python: "This is a Python-based data analysis tool designed to [action]. It processes [type of data] using advanced automation.",
        mobile: "I am building a cross-platform mobile app that helps users [action]. It features a clean interface for student needs."
    };

    window.applyTemplate = (type) => {
        descInput.value = templates[type];
        gsap.fromTo(descInput, { borderColor: "#22d3ee" }, { borderColor: "rgba(30, 41, 59, 0.5)", duration: 1 });
    };

    const refineText = (text) => {
        let refined = text;
        const corrections = {
            "exchanghe": "exchange", "wiull": "will", "evry": "every", "seel": "sell",
            "want to sell": "facilitates the sale of", "can sell": "enables users to sell",
            "i am making": "This project is", "it is for": "Designed specifically for"
        };
        Object.keys(corrections).forEach(key => {
            const regex = new RegExp(key, "gi");
            refined = refined.replace(regex, corrections[key]);
        });
        refined = refined.charAt(0).toUpperCase() + refined.slice(1);
        if (!refined.endsWith('.')) refined += '.';
        return refined;
    };

    const techMapper = {
        studentExchange: {
            title: "Academic Exchange Platform",
            stack: "Node.js, Socket.io, Firebase, Tailwind CSS",
            features: "Real-time Student Chat, Secure Book Listings, Search Filtering, Peer-to-Peer Pricing",
            install: "1. Clone repo\n2. npm install\n3. Set Firebase Keys\n4. npm start"
        },
        portfolio: {
            title: "Student Showcase Portfolio",
            stack: "HTML5, CSS3, JavaScript, AOS Animations",
            features: "Responsive Design, SEO Optimized, Clean UI, Project Gallery",
            install: "Open index.html with Live Server"
        }
    };

    const handleSmartGenerate = async () => {
        const userInput = descInput.value;
        if (userInput.length < 15) return alert("Please describe your project!");

        previewArea.innerHTML = `<div class='h-full flex flex-col items-center justify-center'><div class='w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin'></div></div>`;
        await new Promise(r => setTimeout(r, 1200)); 

        const polishedDescription = refineText(userInput);
        let selected = techMapper.portfolio;
        if (polishedDescription.toLowerCase().includes('sell') || polishedDescription.toLowerCase().includes('book')) {
            selected = techMapper.studentExchange;
        }

        currentMarkdown = `# ${selected.title}\n\n## 📝 About the Project\n${polishedDescription}\n\n## 🛠️ Technical Stack\n${selected.stack}\n\n## ✨ Key Features\n${selected.features}\n\n## 🚀 Installation\n\`\`\`bash\n${selected.install}\n\`\`\``;

        previewArea.innerHTML = marked.parse(currentMarkdown);
        manualEditor.value = currentMarkdown;
        document.getElementById('charCount').innerText = `${currentMarkdown.length} chars`;
    };

    toggleEditBtn.addEventListener('click', () => {
        isEditing = !isEditing;
        if (isEditing) {
            previewArea.classList.add('hidden');
            manualEditor.classList.remove('hidden');
            toggleEditBtn.innerText = "👁️ Preview Mode";
        } else {
            currentMarkdown = manualEditor.value;
            previewArea.innerHTML = marked.parse(currentMarkdown);
            previewArea.classList.remove('hidden');
            manualEditor.classList.add('hidden');
            toggleEditBtn.innerText = "✏️ Edit Mode";
        }
    });

    window.exportMD = () => {
        const content = isEditing ? manualEditor.value : currentMarkdown;
        const blob = new Blob([content], { type: 'text/markdown' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'README.md';
        a.click();
    };

    window.exportDOC = () => {
        const content = isEditing ? manualEditor.value : currentMarkdown;
        const html = "<html><body>" + marked.parse(content) + "</body></html>";
        const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'README.doc';
        a.click();
    };

    document.getElementById('exportPDFBtn').onclick = () => {
        const opt = { margin: 0.5, filename: 'README.pdf', jsPDF: { unit: 'in', format: 'letter' } };
        html2pdf().set(opt).from(previewArea).save();
    };

    document.getElementById('manualGenerateBtn').addEventListener('click', handleSmartGenerate);
    document.getElementById('resetBtn').addEventListener('click', () => {
        descInput.value = '';
        previewArea.innerHTML = `<div class='h-full flex flex-col items-center justify-center opacity-40 italic'><p>Waiting for project description...</p></div>`;
    });
});
