import os
import re

# List of files to update (Group 2 - Layout 3)
files = [
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
]

# Root directory
root_dir = r"d:\Projects\turnworth"

# Placeholder templates
mobile_menu_placeholder = '    <div id="mobile-menu-placeholder"></div>'
header_placeholder = '    <div id="header-placeholder" data-layout="3"></div>'
footer_placeholder = '    <div id="footer-placeholder"></div>'

def update_file(file_path):
    print(f"Processing {file_path}...")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Regex for Mobile Menu
        # Matches <div class="global-menu-wrapper onepage-nav"> ... </div>
        # Be careful with greedy dot match. Using non-greedy and ensuring we catch the nested structure if possible,
        # or assuming indentation structure.
        # Since the structure is consistent: starts with the specific div, ends before "<!--===== Header Section" usually?
        # Or we can match indentation based closing div.
        
        # Strategy: Match the start tag and scanning for the specific end structure if consistent.
        # In files viewed, it ends before "<!--===== Header Section".
        menu_pattern = re.compile(r'<!--===== Mobilemenu\s+S T A R T =====-->\s*<div class="global-menu-wrapper onepage-nav">.*?</div>\s*(?=<!--===== Header Section)', re.DOTALL)
        
        # Check if match exists
        if not menu_pattern.search(content):
            print(f"  Warning: Mobile menu pattern not found in {file_path}")
        else:
            content = menu_pattern.sub(f'<!--===== Mobilemenu    S T A R T =====-->\n{mobile_menu_placeholder}\n\n    ', content)

        # Regex for Header
        # Matches <header class="global-header header-layout3"> ... </header>
        header_pattern = re.compile(r'<!--===== Header Section\s+S T A R T =====-->\s*<header class="global-header header-layout3">.*?</header>', re.DOTALL)
        
        if not header_pattern.search(content):
            print(f"  Warning: Header pattern not found in {file_path}")
        else:
             content = header_pattern.sub(f'<!--===== Header Section    S T A R T =====-->\n{header_placeholder}', content)

        # Regex for Footer
        # Matches <footer class="footer1 fix" ...> ... </footer>
        footer_pattern = re.compile(r'<!--===== Footer Section\s+S T A R T =====-->\s*<footer class="footer1 fix".*?</footer>', re.DOTALL)
        
        if not footer_pattern.search(content):
            print(f"  Warning: Footer pattern not found in {file_path}")
        else:
            content = footer_pattern.sub(f'<!--===== Footer Section    S T A R T =====-->\n{footer_placeholder}', content)

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  Updated {file_path}")

    except Exception as e:
        print(f"  Error processing {file_path}: {e}")

for file_name in files:
    full_path = os.path.join(root_dir, file_name)
    if os.path.exists(full_path):
        update_file(full_path)
    else:
        print(f"File not found: {full_path}")
