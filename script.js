// Function to update the preview in real-time
function updatePreview() {
    const title = document.getElementById('title').value || 'Project Title';
    const desc = document.getElementById('description').value || 'Provide a project description...';
    const features = document.getElementById('features').value;
    const tech = document.getElementById('tech').value;
    const install = document.getElementById('install').value || 'npm install';
    const license = document.getElementById('license').value;
    const template = document.getElementById('templateChoice').value;

    let markdown = "";

    if (template === "basic") {
        markdown = `# ${title}\n\n## Description\n${desc}\n\n## Installation\n\`\`\`bash\n${install}\n\`\`\`\n\n## License\n${license}`;
    } else {
        // Professional Template
        const featureList = features ? features.split('\n').map(f => `* ${f}`).join('\n') : '* Feature 1\n* Feature 2';
        const techList = tech ? tech.split(',').map(t => `\n- ${t.trim()}`).join('') : 'List of technologies';

        markdown = `# ${title}
![License](https://img.shields.io/badge/license-${license.replace(/ /g, "%20")}-blue)

## 📖 Description
${desc}

## ✨ Features
${featureList}

## 🛠️ Tech Stack
${techList}

## 🚀 Installation
To get started, run:
\`\`\`bash
${install}
\`\`\`

## 📜 License
This project is licensed under the ${license} License.
`;
    }

    // Convert Markdown to HTML
    document.getElementById('preview').innerHTML = marked.parse(markdown);
    
    // Global variable to store the raw markdown for downloading
    window.currentMarkdown = markdown;
}

// Download as README.md
function downloadReadme() {
    const blob = new Blob([window.currentMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
}

// Copy to Clipboard
function copyToClipboard() {
    navigator.clipboard.writeText(window.currentMarkdown).then(() => {
        alert("Markdown copied to clipboard!");
    });
}

// Export as PDF
function exportPDF() {
    const element = document.getElementById('preview');
    const opt = {
        margin: 0.5,
        filename: 'README.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}

// Initialize preview on load
updatePreview();
