const BRAND_DOMAIN_PATTERN = /\bWerkCV\.nl\b/g;

export function normalizeBrandCopy(value: string): string {
  return value.replace(BRAND_DOMAIN_PATTERN, "WerkCV");
}
