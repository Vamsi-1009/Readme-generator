document.addEventListener('DOMContentLoaded', () => {
    // 1. Entrance Animations
    gsap.from(".header-anim", { y: -50, opacity: 0, duration: 1, ease: "power4.out" });
    gsap.from(".side-pane-left", { x: -100, opacity: 0, duration: 1.2, delay: 0.2, ease: "power3.out" });
    gsap.from(".side-pane-right", { x: 100, opacity: 0, duration: 1.2, delay: 0.4, ease: "power3.out" });

    // 2. Form Logic
    const inputs = ['pTitle', 'pDesc', 'pTech'];
    const previewArea = document.getElementById('previewArea');

    const updatePreview = () => {
        const title = document.getElementById('pTitle').value || 'Project Title';
        const desc = document.getElementById('pDesc').value || 'Enter a description...';
        const tech = document.getElementById('pTech').value.split(',').map(t => `* ${t.trim()}`).join('\n');

        const markdown = `
# ${title}

## 📝 Description
${desc}

## 🛠️ Tech Stack
${tech || '* No tech stack listed'}

## 🚀 Installation
\`\`\`bash
git clone https://github.com/user/project.git
npm install
\`\`\`
        `;

        previewArea.innerHTML = marked.parse(markdown);
        document.getElementById('charCount').innerText = `${markdown.length} characters`;
    };

    // Add event listeners to all inputs for real-time update
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', updatePreview);
    });

    // Initial call
    updatePreview();
});
