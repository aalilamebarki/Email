/**
 * address.ts
 * توليد عنوان بريد إلكتروني عشوائي فريد ومشفر لكل زائر
 * مع توليد رمز سري قوي (Secret Access Token) لمنع الوصول غير المصرح به
 */

export interface GeneratedAddress {
  address: string;
  localPart: string;
  domain: string;
  token: string;
}

/**
 * توليد رمز أمان سري عشوائي مشفر (CSPRNG)
 */
export function generateSecretToken(): string {
  return crypto.randomUUID();
}

/**
 * توليد عنوان بريد عشوائي فريد مرتبط برمز أمان خاص
 */
export function generateRandomAddress(domain: string = 'freetemp.email'): GeneratedAddress {
  // توليد معرف UUID عشوائي مشفر وحذف علامات الواصلة
  const cleanHex = crypto.randomUUID().replace(/-/g, '');
  // أخذ أول 10 خانات hex لعنوان نظيف وسلس
  const localPart = cleanHex.slice(0, 10).toLowerCase();
  const cleanDomain = domain.trim().replace(/^@/, '').toLowerCase();
  const token = generateSecretToken();
  
  return {
    address: `${localPart}@${cleanDomain}`,
    localPart,
    domain: cleanDomain,
    token,
  };
}
