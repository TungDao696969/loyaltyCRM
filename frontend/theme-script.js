const fs = require('fs');
const path = require('path');

const files = [
  'src/app/(dashboard)/stores/page.tsx',
  'src/app/(dashboard)/customers/page.tsx'
];

const replaceMap = {
  'text-white': 'text-slate-900',
  'text-zinc-400': 'text-slate-500',
  'text-zinc-500': 'text-slate-500',
  'text-zinc-300': 'text-slate-700',
  'border-white/10': 'border-slate-200',
  'border-white/5': 'border-slate-100',
  'bg-white/5': 'bg-white',
  'bg-zinc-950/95': 'bg-white',
  'bg-black/50': 'bg-slate-50',
  'hover:bg-white/5': 'hover:bg-slate-50',
  'text-blue-400': 'text-slate-700',
  'bg-blue-500/5': 'bg-slate-50',
  'hover:bg-blue-500/10': 'hover:bg-slate-100',
  'bg-zinc-900': 'bg-white',
  'shadow-indigo-500/10': 'shadow-slate-200/50',
  'shadow-rose-500/10': 'shadow-slate-200/50',
  'bg-white text-black': 'bg-indigo-600 text-white',
  'hover:bg-zinc-200': 'hover:bg-indigo-700'
};

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  for (const [dark, light] of Object.entries(replaceMap)) {
    content = content.split(dark).join(light);
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});
