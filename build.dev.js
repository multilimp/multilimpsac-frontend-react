const { execSync } = require('child_process');
const path = require('path');

console.log('Running custom build:dev script...');

try {
  // Run the equivalent of what would be the build:dev script
  execSync('vite build --mode development', {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
