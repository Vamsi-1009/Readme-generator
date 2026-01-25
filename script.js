// 1. Universal Grammar & Sentence Refiner
function refineSentence(text) {
    if (!text) return "";
    let s = text.trim();
    
    // Auto-capitalize and fix basic "i" grammar
    s = s.charAt(0).toUpperCase() + s.slice(1);
    s = s.replace(/\bi\b/g, "I");
    
    // Replace informal phrases with professional documentation standards
    const polish = {
        "the project is for": "This platform facilitates",
        "to exchange": "the seamless exchange of",
        "by selling": "through a peer-to-peer marketplace for",
        "books on online": "literary resources via a digital interface",
        "different types of": "diverse categories of",
        "i made": "Architected",
        "it has": "Features include"
    };

    Object.keys(polish).forEach(key => {
        const regex = new RegExp(key, 'gi');
        s = s.replace(regex, polish[key]);
    });

    if (!s.endsWith('.')) s += ".";
    return s;
}

// 2. The Final Magic Engine
function updatePreview() {
    const rawInput = document.getElementById('magicText').value; // Matches the textarea ID in index.html
    const license = document.getElementById('license').value;
    const template = document.getElementById('templateChoice').value;

    if (!rawInput) {
        document.getElementById('preview').innerHTML = "<p style='color: #64748b;'>Waiting for your project idea...</p>";
        return;
    }

    // Process the single text input
    const refinedDesc = refineSentence(rawInput);
    const projectTitle = rawInput.split(' ').slice(0, 3).join(' ').toUpperCase();

    // Generate full content even from one sentence
    const markdown = `# ${projectTitle || 'PROJECT PREVIEW'}
![License](https://img.shields.io/badge/license-${license.replace(/ /g, "%20")}-blue?style=for-the-badge)

## 📖 Overview
${refinedDesc} This solution is engineered to enhance user accessibility and streamline community-driven resource sharing.

## ✨ Key Features
* **Intuitive Marketplace:** Optimized for easy discovery and listing of items.
* **Secure Exchange Protocols:** Ensuring safe transactions between verified users.
* **Categorized Database:** Organized by institution, department, and resource type.
* **Responsive Modern UI:** Seamless experience across all mobile and desktop devices.

## 🛠️ Technology Stack
* **Frontend:** Modern JavaScript Framework (React/Vue)
* **Styling:** Advanced CSS Logic / Tailwind
* **Backend:** Scalable Cloud Architecture
* **Deployment:** CI/CD via GitHub Actions

## 🚀 Installation & Usage
To initialize the project environment locally:
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

    // Render to the preview div
    document.getElementById('preview').innerHTML = marked.parse(markdown);
    window.currentMarkdown = markdown;
}

// 3. Essential Export Functions
function downloadReadme() {
    if (!window.currentMarkdown) return alert("Please type something first!");
    const blob = new Blob([window.currentMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
}

function copyToClipboard() {
    navigator.clipboard.writeText(window.currentMarkdown).then(() => {
        const btn = document.querySelector('.btn-copy');
        btn.innerText = "✅ Copied!";
        setTimeout(() => { btn.innerText = "Copy Markdown"; }, 2000);
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

// Load default state
window.onload = updatePreview;
