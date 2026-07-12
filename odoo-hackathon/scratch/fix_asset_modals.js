const fs = require('fs');
const path = require('path');

const files = [
  'components/assets/AssetFormModal.tsx',
  'components/assets/AssetDetailsModal.tsx',
  'components/assets/DeleteConfirmModal.tsx'
];

const replacements = {
  'bg-bg-base': 'bg-background',
  'bg-bg-surface': 'bg-surface',
  'bg-bg-surface-alt': 'bg-surface-hover/30',
  'bg-bg-surface-hover': 'bg-surface-hover',
  'text-text-primary': 'text-foreground',
  'text-text-secondary': 'text-muted-foreground', // wait, org page uses text-muted
  'text-text-muted': 'text-muted',
  'border-border-base': 'border-border',
  'border-border-strong': 'border-border',
  'border-border-focus': 'border-primary',
  'bg-bg-inverted': 'bg-btn-bg hover:bg-btn-hover text-btn-text shadow-sm',
  'text-text-inverted': '', // removed from above
  'bg-danger-base': 'bg-rose-600',
  'bg-danger-hover': 'bg-rose-700',
  'text-danger-base': 'text-rose-500',
};

files.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  let content = fs.readFileSync(fullPath, 'utf8');
  
  for (const [key, value] of Object.entries(replacements)) {
    content = content.split(key).join(value);
  }
  
  // Specific fix for text-text-secondary to text-muted
  content = content.split('text-muted-foreground').join('text-muted');
  
  fs.writeFileSync(fullPath, content);
  console.log(`Updated ${file}`);
});
