import { fileURLToPath } from 'url';
import { statSync, existsSync, appendFileSync, readdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const packagesDir = join(__dirname, 'packages');
const readmePath = join(__dirname, 'README.md');

// Function to read package.json and return markdown text
const getPackageMarkdown = (packagePath) => {
  const packageJsonPath = join(packagePath, 'package.json');
  const hasPackageJson = existsSync(packageJsonPath);
  if (!hasPackageJson) return '';

  const packageJson = require(packageJsonPath);
  const name = packageJson.name || 'Unnamed package';
  const description = packageJson.description || 'No description available';
  return `### ${name}\n\n${description}\n\n`;
};

// Function to update the README.md file
const updateReadme = (markdownText) => {
  if (existsSync(readmePath)) {
    appendFileSync(readmePath, markdownText);
    return;
  }
  writeFileSync(readmePath, markdownText);
};

// Main function to process all packages
const processPackages = () => {
  if (!existsSync(packagesDir)) {
    console.error('Packages directory not found.');
    return;
  }

  const packages = readdirSync(packagesDir);
  packages.forEach((packageName) => {
    const packagePath = join(packagesDir, packageName);
    const isDirectory = statSync(packagePath).isDirectory();
    if (!isDirectory) return;
    const markdownText = getPackageMarkdown(packagePath);
    updateReadme(markdownText);
  });

  console.log('README.md has been updated with package details.');
};

processPackages();
