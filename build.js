const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const TEMPLATE_PATH = path.join(ROOT_DIR, 'src', 'template.html');
const OUTPUT_PATH = path.join(ROOT_DIR, 'index.html');

function build() {
    const startTime = Date.now();
    console.log('[BUILD] Starting portfolio build...');

    if (!fs.existsSync(TEMPLATE_PATH)) {
        console.error(`[ERROR] Template not found at: ${TEMPLATE_PATH}`);
        process.exit(1);
    }

    let template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

    const includeRegex = /<!--\s*include:\s*([^\s]+)\s*-->/g;

    let matchCount = 0;
    const finalHtml = template.replace(includeRegex, (match, relPath) => {
        const fullPath = path.isAbsolute(relPath) ? relPath : path.join(ROOT_DIR, relPath);
        if (fs.existsSync(fullPath)) {
            matchCount++;
            const sectionContent = fs.readFileSync(fullPath, 'utf8');
            return sectionContent.trim();
        } else {
            console.warn(`[WARNING] Included file not found: ${fullPath}`);
            return match;
        }
    });

    fs.writeFileSync(OUTPUT_PATH, finalHtml, 'utf8');
    const elapsed = Date.now() - startTime;
    const sizeKb = (Buffer.byteLength(finalHtml, 'utf8') / 1024).toFixed(2);

    console.log(`[SUCCESS] Compiled ${matchCount} sections into index.html (${sizeKb} KB) in ${elapsed}ms.`);
}

build();

module.exports = build;
