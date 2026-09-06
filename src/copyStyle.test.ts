import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const EM_DASH = String.fromCodePoint(0x2014);
const TEXT_EXTENSIONS = new Set([
  '.css', '.html', '.js', '.json', '.md', '.mjs', '.py', '.toml', '.ts', '.tsx', '.txt', '.yaml', '.yml',
]);
const SKIPPED_DIRECTORIES = new Set([
  '.git', '.output', '.vinext', '.wxt', 'dist', 'node_modules',
]);
// Check shipped product copy, not archived video-production material or vendored tools.
const PRODUCT_COPY_DIRECTORIES = ['src', 'entrypoints', 'public', 'website/app'];

function findEmDashFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    if (entry.isDirectory()) {
      return SKIPPED_DIRECTORIES.has(entry.name) ? [] : findEmDashFiles(join(directory, entry.name));
    }
    if (!entry.isFile() || !TEXT_EXTENSIONS.has(extname(entry.name))) return [];
    const path = join(directory, entry.name);
    return readFileSync(path, 'utf8').includes(EM_DASH) ? [path.slice(ROOT.length + 1)] : [];
  });
}

describe('project copy style', () => {
  it('uses the colon-based extension name and keeps product copy free of em dashes', () => {
    expect(readFileSync(join(ROOT, 'wxt.config.ts'), 'utf8')).toContain("name: 'TabShow: Live Tab Preview'");
    expect(PRODUCT_COPY_DIRECTORIES.flatMap(directory => findEmDashFiles(join(ROOT, directory)))).toEqual([]);
  });

  it('keeps the 2.2 release version synchronized across package and update metadata', () => {
    const packageJson = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')) as { version: string };
    const packageLock = JSON.parse(readFileSync(join(ROOT, 'package-lock.json'), 'utf8')) as {
      version: string;
      packages: Record<string, { version?: string }>;
    };
    const wxtConfig = readFileSync(join(ROOT, 'wxt.config.ts'), 'utf8');
    const whatsNew = readFileSync(join(ROOT, 'public/pages/whats-new/index.html'), 'utf8');
    const websitePackage = JSON.parse(readFileSync(join(ROOT, 'website/package.json'), 'utf8')) as { version: string };
    const websiteLock = JSON.parse(readFileSync(join(ROOT, 'website/package-lock.json'), 'utf8')) as {
      version: string;
      packages: Record<string, { version?: string }>;
    };

    expect(packageJson.version).toBe('2.2.0');
    expect(packageLock.version).toBe(packageJson.version);
    expect(packageLock.packages['']?.version).toBe(packageJson.version);
    expect(wxtConfig).toContain(`version: '${packageJson.version}'`);
    const updateDocument = new DOMParser().parseFromString(whatsNew, 'text/html');
    expect(updateDocument.querySelector('.status-update')?.textContent).toBe('Version 2.2');
    expect(updateDocument.title).toContain('TabShow 2.2');
    expect(websitePackage.version).toBe(packageJson.version);
    expect(websiteLock.version).toBe(packageJson.version);
    expect(websiteLock.packages['']?.version).toBe(packageJson.version);
  });
});
