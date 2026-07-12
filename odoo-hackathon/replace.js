const fs = require('fs');
const path = require('path');

const replacements = [
  // Backgrounds
  { regex: /bg-\[#0F0F0F\]/g, replacement: 'bg-bg-base' },
  { regex: /bg-\[#141414\]/g, replacement: 'bg-bg-surface' },
  { regex: /bg-\[#1A1A1A\]/g, replacement: 'bg-bg-surface-alt' },
  { regex: /bg-\[#111\]/g, replacement: 'bg-bg-surface-alt' },
  { regex: /bg-\[#2A2A2A\]/g, replacement: 'bg-bg-surface-hover' },
  { regex: /bg-\[#222\]/g, replacement: 'bg-bg-surface-hover' },
  { regex: /bg-\[#333\]/g, replacement: 'bg-border-strong' },

  // Borders
  { regex: /border-\[#222\]/g, replacement: 'border-border-base' },
  { regex: /border-\[#333\]/g, replacement: 'border-border-strong' },
  { regex: /border-\[#2A2A2A\]/g, replacement: 'border-border-base' },
  { regex: /border-\[#444\]/g, replacement: 'border-border-focus' },
  { regex: /border-\[#555\]/g, replacement: 'border-border-focus' },

  // Text
  { regex: /text-\[#f5f5f5\]/g, replacement: 'text-text-primary' },
  { regex: /text-\[#888\]/g, replacement: 'text-text-secondary' },
  { regex: /text-\[#666\]/g, replacement: 'text-text-muted' },
  { regex: /text-\[#a3a3a3\]/g, replacement: 'text-text-secondary' },
  { regex: /text-\[#0F0F0F\]/g, replacement: 'text-text-inverted' },

  // Inverted Backgrounds
  { regex: /bg-\[#f5f5f5\]/g, replacement: 'bg-bg-inverted' },

  // Hovers
  { regex: /hover:bg-\[#e5e5e5\]/g, replacement: 'hover:opacity-90' },
  { regex: /hover:bg-\[#1A1A1A\]/g, replacement: 'hover:bg-bg-surface-hover' },
  { regex: /hover:bg-\[#1a1a1a\]/g, replacement: 'hover:bg-bg-surface-hover' },
  { regex: /hover:bg-\[#222\]/g, replacement: 'hover:bg-bg-surface-hover' },
  { regex: /hover:bg-\[#333\]/g, replacement: 'hover:bg-border-strong' },
  { regex: /hover:bg-\[#2a1a1a\]/g, replacement: 'hover:bg-bg-surface-hover' },

  { regex: /hover:border-\[#333\]/g, replacement: 'hover:border-border-strong' },
  { regex: /hover:border-\[#444\]/g, replacement: 'hover:border-border-focus' },
  { regex: /hover:border-\[#555\]/g, replacement: 'hover:border-border-focus' },

  { regex: /hover:text-\[#f5f5f5\]/g, replacement: 'hover:text-text-primary' },
  { regex: /hover:text-\[#888\]/g, replacement: 'hover:text-text-secondary' },

  // Focus
  { regex: /focus:border-\[#444\]/g, replacement: 'focus:border-border-focus' },
  { regex: /focus:border-\[#555\]/g, replacement: 'focus:border-border-focus' }
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = [
  ...walk('./app/(main)/organization'),
  ...walk('./app/(main)/allocation'),
  ...walk('./app/(main)/booking'),
  ...walk('./app/(main)/assets'),
  ...walk('./components/booking'),
  ...walk('./components/assets')
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  // Also add transition-colors duration-300 to standard containers if they lack it
  if (content.includes('className="min-h-full bg-bg-base') && !content.includes('transition-colors')) {
    content = content.replace(/className="min-h-full bg-bg-base([^"]*)"/, 'className="min-h-full bg-bg-base$1 transition-colors duration-300"');
    changed = true;
  }

  replacements.forEach(({ regex, replacement }) => {
    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
