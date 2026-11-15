import panelEnglish from './panel-en.json';
import servicesEnglish from './services-en.json';

/** Chrome's message format is shared by production catalogs and the test fallback. */
interface Message {
  message: string;
  description?: string;
  placeholders?: Record<string, { content: string; example?: string }>;
}
const english = { ...panelEnglish, ...servicesEnglish };
export type MessageKey = keyof typeof english;
export type Substitutions = Record<string, string | number>;
type PluralBase<K> = K extends `${infer Base}_other` ? Base : never;
export type PluralMessageKey = PluralBase<MessageKey>;

function nativeMessage(key: string, substitutions?: string[]): string {
  try {
    // The generated WXT overloads may describe an earlier assembled catalog.
    // Public callers are checked against the source fragments via MessageKey.
    const api = (typeof browser !== 'undefined' ? browser.i18n : undefined) as
      { getMessage: (name: string, substitutions?: string[]) => string } | undefined;
    return api?.getMessage(key, substitutions) || '';
  } catch {
    // Unit tests and the standalone preview harness have no extension context.
    return '';
  }
}

/** Use the resolved catalog locale, not an unsupported browser locale. */
export function getLocale(): string {
  return (nativeMessage('panelLocale') || panelEnglish.panelLocale.message).replaceAll('_', '-');
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(getLocale(), options).format(value);
}

function resolveMessage(key: MessageKey, substitutions: Substitutions, fallbackKey: MessageKey = key): string {
  const entry: Message = english[key];
  const values: string[] = [];
  const formatted = Object.fromEntries(Object.entries(substitutions).map(([name, value]) => [
    name.toLowerCase(), typeof value === 'number' ? formatNumber(value) : value,
  ]));
  for (const [name, placeholder] of Object.entries(entry.placeholders ?? {})) {
    const match = /^\$(\d+)$/.exec(placeholder.content);
    if (match) values[Number(match[1]) - 1] = formatted[name.toLowerCase()] ?? '';
  }
  const localized = nativeMessage(key, values.length ? Array.from(values, value => value ?? '') : undefined);
  if (localized) return localized;
  // One pass preserves literal dollar signs inside user-provided titles and URLs.
  const fallback: Message = english[fallbackKey];
  return fallback.message.replace(/\$\$|\$([a-zA-Z0-9_]+)\$/g, (token, name: string | undefined) => {
    if (token === '$$') return '$';
    const placeholder = fallback.placeholders?.[name!.toLowerCase()];
    return placeholder ? formatted[name!.toLowerCase()] ?? placeholder.content : token;
  });
}

export function t(key: MessageKey, substitutions: Substitutions = {}): string {
  return resolveMessage(key, substitutions);
}

export function plural(baseKey: PluralMessageKey, count: number, substitutions: Substitutions = {}): string {
  const category = new Intl.PluralRules(getLocale()).select(count);
  const selectedKey = `${baseKey}_${category}`;
  const key = selectedKey in english ? selectedKey : `${baseKey}_other`;
  const englishCategory = new Intl.PluralRules('en').select(count);
  const englishKey = `${baseKey}_${englishCategory}`;
  const fallbackKey = englishKey in english ? englishKey : `${baseKey}_other`;
  return resolveMessage(key as MessageKey, { ...substitutions, count }, fallbackKey as MessageKey);
}
