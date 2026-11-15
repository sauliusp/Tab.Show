import { readFile, writeFile, mkdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const merged = {};
for (const part of ['panel', 'services', 'pages']) {
  const messages = JSON.parse(await readFile(new URL(`src/i18n/${part}-en.json`, root), 'utf8'));
  for (const [key, value] of Object.entries(messages)) {
    if (Object.hasOwn(merged, key)) throw new Error(`Duplicate message: ${key}`);
    merged[key] = value;
  }
}
const target = new URL('public/_locales/en/', root);
await mkdir(target, { recursive: true });
await writeFile(new URL('messages.json', target), `${JSON.stringify(merged, null, 2)}\n`);
console.log(`Synced ${Object.keys(merged).length} English messages.`);
