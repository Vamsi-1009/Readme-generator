document.addEventListener('DOMContentLoaded', () => {
    const previewArea = document.getElementById('previewArea');
    const descInput = document.getElementById('pDesc');
    const manualEditor = document.getElementById('manualEditor');
    const toggleEditBtn = document.getElementById('toggleEditBtn');
    
    let isEditing = false;
    let currentMarkdown = "";

    // Template Selector Logic
    const templates = {
        web: "I am developing a modern web application for [purpose]. It allows users to [action 1] and [action 2] with a focus on responsive design and speed.",
        python: "This is a Python-based data analysis tool designed to [action]. It processes [type of data] and provides [output/result] using advanced automation.",
        mobile: "I am building a cross-platform mobile app that helps users [action]. It features a clean interface for [specific student or user need]."
    };

    window.applyTemplate = (type) => {
        descInput.value = templates[type];
        gsap.fromTo(descInput, 
            { borderColor: "#22d3ee", backgroundColor: "rgba(34, 211, 238, 0.1)" }, 
            { borderColor: "rgba(30, 41, 59, 0.5)", backgroundColor: "rgba(15, 23, 42, 0.6)", duration: 1 }
        );
    };

    // Grammar & Spelling Correction Engine
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

    // Technical Context Mapper
    const techMapper = {
        studentExchange: {
            title: "Academic Exchange Platform",
            stack: "Node.js, Socket.io, Firebase, Tailwind CSS",
            features: "Real-time Student Chat, Secure Book Listings, Search Filtering, Peer-to-Peer Pricing, SEO Optimized",
            install: "1. Clone repo\n2. npm install\n3. Set Firebase Keys\n4. npm start"
        },
        portfolio: {
            title: "Student Showcase Portfolio",
            stack: "HTML5, CSS3, JavaScript, AOS Animations",
            features: "Responsive Design, SEO Optimized, Clean UI, Project Gallery, High Performance",
            install: "Open index.html with Live Server"
        },
        pythonProject: {
            title: "Python Data Assistant",
            stack: "Python 3.10, Flask, Pandas, SQLite",
            features: "Automated Data Processing, Secure Backend, Local Storage, API Endpoints, Data Integrity",
            install: "pip install -r requirements.txt\npython app.py"
        }
    };

    // Main Analysis & Generation Logic
    const handleSmartGenerate = async () => {
        const userInput = descInput.value;
        if (userInput.length < 15) return alert("Please describe your project in more detail!");

        previewArea.innerHTML = `<div class='h-full flex flex-col items-center justify-center'><div class='w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4'></div><p class='text-xs font-bold tracking-[0.3em] animate-pulse text-cyan-400'>REFINING GRAMMAR & CONTEXT...</p></div>`;
        await new Promise(r => setTimeout(r, 1500)); 

        const polishedDescription = refineText(userInput);
        let selected = techMapper.portfolio;
        const lowText = polishedDescription.toLowerCase();
        
        if (lowText.includes('sell') || lowText.includes('book') || lowText.includes('student') || lowText.includes('college')) {
            selected = techMapper.studentExchange;
        } else if (lowText.includes('python') || lowText.includes('data') || lowText.includes('ai')) {
            selected = techMapper.pythonProject;
        }

        currentMarkdown = `# ${selected.title}\n\n## 📝 About the Project\n${polishedDescription}\n\n## 🛠️ Technical Stack\n${selected.stack.split(',').map(t => `\`${t.trim()}\``).join(' ')}\n\n## ✨ Key Features\n${selected.features.split(',').map(f => `* ${f.trim()}`).join('\n')}\n\n## 🚀 Installation & Setup\n\`\`\`bash\n${selected.install}\n\`\`\`\n\n---\n*Generated & Refined by Auto README AI*`;

        previewArea.innerHTML = marked.parse(currentMarkdown);
        manualEditor.value = currentMarkdown;
        document.getElementById('charCount').innerText = `${currentMarkdown.length} chars`;
        gsap.from("#previewArea", { opacity: 0, y: 30, duration: 0.8, ease: "power4.out" });
    };

    // Edit Toggle Logic
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

    // Final Export Suite
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
        const html = "<html><head><meta charset='utf-8'></head><body>" + marked.parse(content) + "</body></html>";
        const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'README.doc';
        a.click();
    };

    document.getElementById('exportPDFBtn').onclick = () => {
        const opt = { margin: 0.5, filename: 'README.pdf', image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'letter' } };
        html2pdf().set(opt).from(previewArea).save();
    };

    document.getElementById('manualGenerateBtn').addEventListener('click', handleSmartGenerate);
    document.getElementById('resetBtn').addEventListener('click', () => {
        descInput.value = '';
        previewArea.innerHTML = `<div class='h-full flex flex-col items-center justify-center text-slate-500 opacity-40 italic'><p>Waiting for project description...</p></div>`;
        document.getElementById('charCount').innerText = "0 chars";
    });
});
