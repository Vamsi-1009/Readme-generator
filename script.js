/**
 * 1. Universal Grammar & Sentence Refiner
 * Polishes raw input and applies tone-based professional prefixes.
 */
function refineSentence(text, tone) {
    if (!text) return "";
    let s = text.trim();
    
    // Basic cleanup: capitalize first letter and fix "i"
    s = s.charAt(0).toUpperCase() + s.slice(1);
    s = s.replace(/\bi\b/g, "I");
    
    // Tone-based professional prefixes
    let prefix = "";
    if (tone === "startup") {
        prefix = "Leveraging cutting-edge architecture, this project disrupts the status quo of ";
    } else if (tone === "academic") {
        prefix = "This technical implementation serves as a comprehensive study regarding ";
    } else {
        prefix = "An efficient and streamlined tool for ";
    }

    // Professional documentation vocabulary mapping
    const polish = {
        "the project is for": "facilitating",
        "to exchange": "the seamless exchange of",
        "by selling": "through a peer-to-peer marketplace for",
        "books on online": "literary resources via a digital interface",
        "different types of": "diverse categories of",
        "i made": "Architected",
        "it has": "Features include",
        "easy to use": "Intuitive",
        "thanks for looking": "Contributions and feedback are welcome!"
    };

    Object.keys(polish).forEach(key => {
        const regex = new RegExp(key, 'gi');
        s = s.replace(regex, polish[key]);
    });

    // Merge prefix with polished text
    s = prefix + s.charAt(0).toLowerCase() + s.slice(1);
    if (!s.endsWith('.')) s += ".";
    return s;
}

/**
 * 2. Tab System Logic
 * Manages switching between the 'Wizard' (Source) and 'Editor' (Configuration) views.
 */
function switchTab(tabName) {
    // Hide all tab content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    // Deactivate all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // Show selected content and activate button
    document.getElementById(`${tabName}-view`).classList.add('active');
    event.currentTarget.classList.add('active');
}

/**
 * 3. GitHub Auto-Import Logic
 * Fetches repository metadata and languages using the GitHub API.
 */
async function importGitHubRepo() {
    const repoPath = document.getElementById('repoUrl').value; // Expected format: user/repo
    if (!repoPath || !repoPath.includes('/')) return alert("Enter valid 'user/repo'");

    try {
        const response = await fetch(`https://api.github.com/repos/${repoPath}`);
        const data = await response.json();
        
        if (data.message === "Not Found") throw new Error("Repo not found");

        // Auto-fill Description
        document.getElementById('magicText').value = data.description || `A project named ${data.name}`;
        
        // Auto-detect languages
        const langResponse = await fetch(`https://api.github.com/repos/${repoPath}/languages`);
        const langs = await langResponse.json();
        window.detectedLangs = Object.keys(langs).join(', ');

        updatePreview();
        alert("GitHub Repository Data Imported!");
    } catch (error) {
        alert("Error: " + error.message);
    }
}


/**
 * Export DOC Function
 * Converts the preview HTML into a Microsoft Word (.doc) file.
 */
async function exportDOC() {
    const content = document.getElementById('preview').innerHTML;
    if (!content || content.includes("Waiting for your project")) {
        return alert("Please generate content first!");
    }

    // Prepare the HTML with basic styling for Word
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
            "xmlns:w='urn:schemas-microsoft-com:office:word' "+
            "xmlns='http://www.w3.org/TR/REC-html40'>"+
            "<head><meta charset='utf-8'><title>Export DOC</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + content + footer;
    
    // Create a Blob and trigger download
    const blob = new Blob(['\ufeff', sourceHTML], {
        type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Documentation.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}




/**
 * 4. UI Customization
 */
function toggleDarkMode() {
    const preview = document.getElementById('preview');
    const btn = document.querySelector('.toggle-light');
    
    preview.classList.toggle('theme-dark');
    preview.classList.toggle('theme-light');
    
    btn.innerText = preview.classList.contains('theme-dark') ? "🌙 DARK" : "☀️ LIGHT";
}

/**
 * 5. Core Content Generation Engine
 * Aggregates all inputs and renders the Markdown output.
 */
function updatePreview() {
    const rawInput = document.getElementById('magicText').value;
    const license = document.getElementById('license').value;
    const tone = document.getElementById('projectTone').value;

    // Save draft to local storage
    localStorage.setItem('readme_magic_draft', rawInput);

    if (!rawInput) {
        document.getElementById('preview').innerHTML = "<div class='placeholder'>Waiting for your project idea...</div>";
        return;
    }

    const refinedDesc = refineSentence(rawInput, tone);
    const projectTitle = rawInput.split(' ').slice(0, 3).join(' ').toUpperCase();

    // Standard Professional Markdown Template
    const markdown = `# ${projectTitle}
![License](https://img.shields.io/badge/license-${license.replace(/ /g, "%20")}-blue?style=for-the-badge)

## 📖 Overview
${refinedDesc}

## ✨ Key Features
* **Intuitive User Interface:** Optimized for a seamless user experience.
* **Automated Documentation:** Built using the Auto README Generator logic.
* **Scalable Architecture:** Designed for future-proof deployments.

## 🛠️ Technology Stack
* **Languages:** ${window.detectedLangs || 'JavaScript, HTML5, CSS3'}
* **Style:** Advanced CSS3 (Neon/Glassmorphism)
* **API:** Integration with GitHub REST API

## 🚀 Installation & Usage
\`\`\`bash
# Clone the repository
git clone https://github.com/user/${projectTitle.toLowerCase().replace(/ /g, "-")}.git

# Install dependencies
npm install

# Start development server
npm start
\`\`\`

## 📜 License
This software is distributed under the ${license} License.
`;

    document.getElementById('preview').innerHTML = marked.parse(markdown);
    window.currentMarkdown = markdown;
}

/**
 * 6. Export and Utility Functions
 */
function downloadReadme() {
    if (!window.currentMarkdown) return alert("Generate content first!");
    const blob = new Blob([window.currentMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
}

function resetApp() {
    if(confirm("Start a new project?")) {
        document.getElementById('magicText').value = "";
        document.getElementById('repoUrl').value = "";
        localStorage.removeItem('readme_magic_draft');
        window.detectedLangs = null;
        updatePreview();
    }
}

function copyToClipboard() {
    if (!window.currentMarkdown) return;
    navigator.clipboard.writeText(window.currentMarkdown).then(() => {
        const btn = document.querySelector('.btn-secondary');
        btn.innerText = "✅ COPIED";
        setTimeout(() => { btn.innerText = "COPY MD"; }, 2000);
    });
}

function exportPDF() {
    const element = document.getElementById('preview');
    const opt = {
        margin: 0.5,
        filename: 'Documentation.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}

/**
 * 7. Load State on Init
 */
window.onload = function() {
    const saved = localStorage.getItem('readme_magic_draft');
    if (saved) {
        document.getElementById('magicText').value = saved;
    }
    updatePreview();
};
