/**
 * i18n Key Validator
 *
 * Detects:
 * - Keys present in one locale file but missing in another
 * - Duplicate keys in JSON source (JSON parsers silently overwrite, this catches it)
 *
 * Usage (Node.js script):
 *   npx tsx src/lib/i18n-validator.ts
 */

// ─────────────────────────────────────────────
// Duplicate key detection via raw string parse
// ─────────────────────────────────────────────

export function findDuplicateKeys(jsonString: string, path = ''): string[] {
  const duplicates: string[] = [];
  const keyRegex = /"([^"\\]*(\\.[^"\\]*)*)"\s*:/g;
  const seen = new Set<string>();
  let match: RegExpExecArray | null;
  let depth = 0;
  const keyStack: string[] = [];

  for (let i = 0; i < jsonString.length; i++) {
    const char = jsonString[i];
    if (char === '{') {
      depth++;
      keyStack.push('');
      seen.clear();
    } else if (char === '}') {
      depth--;
      keyStack.pop();
    }
  }

  // Simple flat key duplicate check
  const flatSeen = new Set<string>();
  while ((match = keyRegex.exec(jsonString)) !== null) {
    const key = match[1];
    const fullKey = path ? `${path}.${key}` : key;
    if (flatSeen.has(key)) {
      duplicates.push(fullKey);
    }
    flatSeen.add(key);
  }

  return duplicates;
}

// ─────────────────────────────────────────────
// Flat key extractor
// ─────────────────────────────────────────────

export function flattenKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = [];
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...flattenKeys(value as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

// ─────────────────────────────────────────────
// Cross-locale consistency check
// ─────────────────────────────────────────────

export function compareLocales(
  base: Record<string, unknown>,
  target: Record<string, unknown>,
  baseLocale: string,
  targetLocale: string
): { missingInTarget: string[]; extraInTarget: string[] } {
  const baseKeys = new Set(flattenKeys(base));
  const targetKeys = new Set(flattenKeys(target));

  const missingInTarget = [...baseKeys].filter((k) => !targetKeys.has(k));
  const extraInTarget = [...targetKeys].filter((k) => !baseKeys.has(k));

  if (missingInTarget.length > 0) {
    console.warn(
      `[i18n] Keys in ${baseLocale} missing from ${targetLocale}:`,
      missingInTarget
    );
  }
  if (extraInTarget.length > 0) {
    console.warn(
      `[i18n] Keys in ${targetLocale} not in ${baseLocale}:`,
      extraInTarget
    );
  }

  return { missingInTarget, extraInTarget };
}

// ─────────────────────────────────────────────
// Dev-mode runtime check (call in layout or _app)
// ─────────────────────────────────────────────

export async function validateI18nKeysInDev() {
  if (process.env.NODE_ENV !== 'development') return;

  try {
    const [uz, ru] = await Promise.all([
      import('../../messages/uz.json'),
      import('../../messages/ru.json'),
    ]);

    const { missingInTarget, extraInTarget } = compareLocales(
      uz.default as Record<string, unknown>,
      ru.default as Record<string, unknown>,
      'uz',
      'ru'
    );

    if (missingInTarget.length === 0 && extraInTarget.length === 0) {
      console.info('[i18n] ✓ All locale keys are in sync');
    }
  } catch (e) {
    console.error('[i18n] Validation failed:', e);
  }
}
