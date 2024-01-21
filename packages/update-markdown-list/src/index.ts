import { fileURLToPath } from 'url';
import {
  statSync,
  existsSync,
  appendFileSync,
  readdirSync,
  writeFileSync,
  readFileSync
} from 'fs';
import { dirname, join } from 'path';

export type LoggerOptions = {
  file: string;
  isLogging?: boolean;
};

export const logger = ({ file, isLogging = false }: LoggerOptions) => ({
  debug: (msg: string, ...args: unknown[]) => {
    if (!isLogging) return;
    console.debug(`update-md-list:[${file}]: ${msg}`, ...args);
  },
  error: (msg: string, ...args: unknown[]) => {
    console.error(`update-md-list:[${file}]: ${msg}`, ...args);
  },
});

export const processPackages = (pkgsDir: string, md: string, jsonFile: string, isLogging = false) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const dirs = join(__dirname, pkgsDir);
  const mdPath = join(__dirname, md);

  const log = logger({ file: __filename, isLogging });

  if (!existsSync(dirs)) {
    log.error('Packages directory not found.');
    return;
  }

  if (!existsSync(mdPath)) {
    log.error('Markdown file not found.');
    return;
  }

  const packages = readdirSync(dirs);
  packages.forEach(pkg => updateText(mdPath, jsonFile, log, dirs, pkg));

  log.debug('README.md has been updated with package details.');
};

export const getJsonData = (packagePath: string, jsonFile: string, log: ReturnType<typeof logger>) => {
  const packageJsonPath = join(packagePath, jsonFile);
  if (!existsSync(packageJsonPath)) {
    log.error('package.json not found.', { packageJsonPath });
    return '';
  }

  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    const name = packageJson.name || 'Unnamed package';
    const description = packageJson.description || 'No description available';
    return `### ${name}\n\n${description}\n\n`;
  } catch (error) {
    log.error('Error reading package.json', { error });
    return '';
  }
};

export const updateText = (mdPath: string, jsonFile: string, log: ReturnType<typeof logger>, packagesDir: string, pkg: string) => {
  const path = join(packagesDir, pkg);
  if (!statSync(path).isDirectory()) {
    log.error('Not a directory.', { path });
    return;
  }
  const mdText = getJsonData(path, jsonFile, log);
  updateMd(mdText, mdPath, log);
};

export const updateMd = (markdownText: string, mdPath: string, log: ReturnType<typeof logger>) => {
  try {
    if (existsSync(mdPath)) {
      appendFileSync(mdPath, markdownText);
    } else {
      writeFileSync(mdPath, markdownText);
    }
  } catch (error) {
    log.error('Error updating Markdown file', { error });
  }
};
