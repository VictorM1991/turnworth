const fs = require('fs');
const path = require('path');

// List of files to update (Group 2 - Layout 3)
const files = [
    "about.html",
    "blog.html",
    "blog2.html",
    "blog-details.html",
    "cart.html",
    "checkout.html",
    "course-details.html",
    "courses.html",
    "courses-list.html",
    "event.html",
    "event-details.html",
    "faq.html",
    "instractor.html",
    "shop.html",
    "shop-details.html",
    "top-mentors.html",
    "wishlist.html"
];

const rootDir = process.cwd(); // Assume running from root

const mobileMenuPlaceholder = '    <div id="mobile-menu-placeholder"></div>';
const headerPlaceholder = '    <div id="header-placeholder" data-layout="3"></div>';
const footerPlaceholder = '    <div id="footer-placeholder"></div>';

async function updateFile(fileName) {
    const filePath = path.join(rootDir, fileName);
    console.log(`Processing ${fileName}...`);

    try {
        if (!fs.existsSync(filePath)) {
            console.log(`File not found: ${filePath}`);
            return;
        }

        let content = fs.readFileSync(filePath, 'utf-8');

        // Regex for Mobile Menu
        // Matches <div class="global-menu-wrapper onepage-nav"> ... </div>
        // Assuming consistent structure ending before header
        const menuRegex = /<!--===== Mobilemenu\s+S T A R T =====-->\s*<div class="global-menu-wrapper onepage-nav">[\s\S]*?<\/div>\s*(?=<!--===== Header Section)/;
        
        if (!menuRegex.test(content)) {
            console.log(`  Warning: Mobile menu pattern not found in ${fileName}`);
        } else {
            content = content.replace(menuRegex, `<!--===== Mobilemenu    S T A R T =====-->\n${mobileMenuPlaceholder}\n\n    `);
        }

        // Regex for Header
        const headerRegex = /<!--===== Header Section\s+S T A R T =====-->\s*<header class="global-header header-layout3">[\s\S]*?<\/header>/;
        
        if (!headerRegex.test(content)) {
            console.log(`  Warning: Header pattern not found in ${fileName}`);
        } else {
            content = content.replace(headerRegex, `<!--===== Header Section    S T A R T =====-->\n${headerPlaceholder}`);
        }

        // Regex for Footer
        const footerRegex = /<!--===== Footer Section\s+S T A R T =====-->\s*<footer class="footer1 fix"[\s\S]*?<\/footer>/;
        
        if (!footerRegex.test(content)) {
            console.log(`  Warning: Footer pattern not found in ${fileName}`);
        } else {
            content = content.replace(footerRegex, `<!--===== Footer Section    S T A R T =====-->\n${footerPlaceholder}`);
        }

        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`  Updated ${fileName}`);

    } catch (e) {
        console.log(`  Error processing ${fileName}: ${e.message}`);
    }
}

files.forEach(file => updateFile(file));
