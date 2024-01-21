#!/usr/bin/env node
import { fileURLToPath } from 'url';
import { processPackages, logger } from './';

// Manual parsing of command-line arguments
let log;
const args = process.argv.slice(2);
const options = {
  pkgsDir: '',
  md: '',
  jsonFile: '',
  isLogging: false
};

args.forEach((arg, index) => {
  switch (arg) {
    case '--pkgsDir':
    case '-p':
      options.pkgsDir = args[index + 1];
      break;
    case '--md':
    case '-m':
      options.md = args[index + 1];
      break;
    case '--jsonFile':
    case '-j':
      options.jsonFile = args[index + 1];
      break;
    case '--isLogging':
    case '-l':
      options.isLogging = true;
      break;
  }
  const file = fileURLToPath(import.meta.url);
  log = logger({ file, isLogging: options.isLogging });
});

// Check if the 'process' command is provided
if (args.includes('process')) {
  const { pkgsDir, md, jsonFile, isLogging } = options;
  processPackages(pkgsDir, md, jsonFile, isLogging);
} else {
  log.error('Invalid command. Use "process" to start processing packages.');
}
