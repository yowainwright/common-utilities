import { getJsonData, updateMd } from './';
import { existsSync, readFileSync, appendFileSync, } from 'fs';

// Mocking fs and path modules
jest.mock('fs');
jest.mock('path');

describe('getJsonData', () => {
  it('should return formatted markdown text from package.json data', () => {
    // Setup
    existsSync.mockReturnValue(true);
    readFileSync.mockReturnValue(JSON.stringify({ name: 'Test Package', description: 'A test package' }));
    const logMock = { error: jest.fn() };

    // Execute
    const result = getJsonData('some/path', 'package.json', logMock);

    // Assert
    expect(result).toBe('### Test Package\n\nA test package\n\n');
  });

  // Add more tests for different scenarios...
});

describe('updateMd', () => {
  it('should append markdown text to an existing file', () => {
    // Setup
    existsSync.mockReturnValue(true);
    const appendFileSyncMock = appendFileSync.mockImplementation(() => { });
    const markdownText = '### Test Package\n\nA test package\n\n';
    const mdPath = 'README.md';
    const logMock = { error: jest.fn() };

    // Execute
    updateMd(markdownText, mdPath, logMock);

    // Assert
    expect(appendFileSyncMock).toHaveBeenCalledWith(mdPath, markdownText);
  });

  // Add more tests for different scenarios...
});
