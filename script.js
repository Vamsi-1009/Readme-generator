// 1. Universal Grammar & Sentence Refiner with Tone Logic
function refineSentence(text, tone) {
    if (!text) return "";
    let s = text.trim();
    
    // Auto-capitalize and fix basic "i" grammar
    s = s.charAt(0).toUpperCase() + s.slice(1);
    s = s.replace(/\bi\b/g, "I");
    
    // Tone-based Prefixes
    let prefix = "";
    if (tone === "startup") {
        prefix = "Leveraging cutting-edge architecture, this project disrupts the status quo of ";
    } else if (tone === "academic") {
        prefix = "This technical implementation serves as a comprehensive study regarding ";
    } else {
        prefix = "An efficient and streamlined tool for ";
    }

    // Professional documentation standards replacements
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

    s = prefix + s.charAt(0).toLowerCase() + s.slice(1);
    if (!s.endsWith('.')) s += ".";
    return s;
}

// 2. GitHub Auto-Import Logic
async function importGitHubRepo() {
    const url = document.getElementById('repoUrl').value;
    if (!url.includes('github.com')) return alert("Please enter a valid GitHub URL");

    const pathParts = url.replace('https://github.com/', '').split('/');
    const user = pathParts[0];
    const repo = pathParts[1];

    try {
        const response = await fetch(`https://api.github.com/repos/${user}/${repo}`);
        const data = await response.json();
        
        // Auto-fill inputs
        document.getElementById('magicText').value = `A project called ${data.name}. ${data.description || ''}`;
        document.getElementById('githubUser').value = user;
        
        // Detect languages
        const langResponse = await fetch(`https://api.github.com/repos/${user}/${repo}/languages`);
        const langs = await langResponse.json();
        window.detectedLangs = Object.keys(langs).join(', ');

        updatePreview();
        alert("GitHub Repository Data Imported!");
    } catch (error) {
        alert("Error fetching repository data. Ensure the URL is correct and public.");
    }
}

// 3. UI Toggles
function toggleDarkMode() {
    const preview = document.getElementById('preview');
    preview.classList.toggle('theme-dark');
}

// 4. Core Magic Engine
function updatePreview() {
    const rawInput = document.getElementById('magicText').value;
    const license = document.getElementById('license').value;
    const template = document.getElementById('templateChoice').value;
    const tone = document.getElementById('projectTone').value;
    const githubUser = document.getElementById('githubUser').value;

    localStorage.setItem('readme_magic_draft', rawInput);

    if (!rawInput) {
        document.getElementById('preview').innerHTML = "<p style='color: #64748b;'>Waiting for your project idea...</p>";
        return;
    }

    const refinedDesc = refineSentence(rawInput, tone);
    const projectTitle = rawInput.split(' ').slice(0, 3).join(' ').toUpperCase();

    // Generate Shields.io Badges
    const badges = githubUser ? 
        `![Stars](https://img.shields.io/github/stars/${githubUser}/${projectTitle.toLowerCase().replace(/ /g, '-')}?style=for-the-badge) ` +
        `![Follow](https://img.shields.io/github/followers/${githubUser}?style=for-the-badge)` : "";

    let markdown = "";
    
    if (template === "pro") {
        markdown = `# ${projectTitle}
${badges}
![License](https://img.shields.io/badge/license-${license.replace(/ /g, "%20")}-blue?style=for-the-badge)

## 📖 Overview
${refinedDesc} This solution is engineered to enhance user accessibility and streamline community-driven resource sharing.

## ✨ Key Features
* **Intuitive Marketplace:** Optimized for easy discovery and listing of items.
* **Secure Exchange Protocols:** Ensuring safe transactions between verified users.
* **Categorized Database:** Organized by institution, department, and resource type.
* **Responsive Modern UI:** Seamless experience across all mobile and desktop devices.

## 🛠️ Technology Stack
* **Languages:** ${window.detectedLangs || 'JavaScript, HTML5, CSS3'}
* **Frameworks:** React/Vue (Detected)
* **Backend:** Scalable Cloud Architecture
* **Deployment:** CI/CD via GitHub Actions

## 🚀 Installation & Usage
\`\`\`bash
# Clone the repository
git clone https://github.com/${githubUser || 'user'}/${projectTitle.toLowerCase().replace(/ /g, "-")}.git

# Install dependencies
npm install

# Start development server
npm start
\`\`\`

## 📜 License
This software is distributed under the ${license} License.
`;
    } else {
        markdown = `# ${projectTitle}\n${badges}\n\n## Description\n${refinedDesc}\n\n## Quick Start\n\`\`\`bash\nnpm install && npm start\n\`\`\`\n\n## License\n${license}`;
    }

    document.getElementById('preview').innerHTML = marked.parse(markdown);
    window.currentMarkdown = markdown;
}

// 5. Utility & Export Functions
function downloadReadme() {
    if (!window.currentMarkdown) return alert("Please type something first!");
    const blob = new Blob([window.currentMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
}

function resetApp() {
    if(confirm("Clear everything and start a new project?")) {
        document.getElementById('magicText').value = "";
        document.getElementById('repoUrl').value = "";
        document.getElementById('githubUser').value = "";
        localStorage.removeItem('readme_magic_draft');
        window.detectedLangs = null;
        updatePreview();
    }
}

function copyHTML() {
    const htmlContent = document.getElementById('preview').innerHTML;
    navigator.clipboard.writeText(htmlContent).then(() => alert("HTML code copied!"));
}

function copyToClipboard() {
    if (!window.currentMarkdown) return;
    navigator.clipboard.writeText(window.currentMarkdown).then(() => {
        const btn = document.querySelector('.btn-copy');
        const originalText = btn.innerText;
        btn.innerText = "✅ Copied!";
        setTimeout(() => { btn.innerText = originalText; }, 2000);
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

// 6. Initialization on Load
window.onload = function() {
    const saved = localStorage.getItem('readme_magic_draft');
    if (saved) {
        document.getElementById('magicText').value = saved;
    }
    updatePreview();
};
