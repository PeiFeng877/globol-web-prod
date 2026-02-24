const { execSync } = require('child_process');
execSync('npx tsc scripts/patch-faqs.ts --esModuleInterop --skipLibCheck --outDir scripts-out', { stdio: 'inherit' });
execSync('node scripts-out/patch-faqs.js', { stdio: 'inherit' });
