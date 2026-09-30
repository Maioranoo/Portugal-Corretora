const onlyDigits = (s: string) => s.replace(/\D/g, '');

function stripPrefixes(digits: string): string {
  let d = digits;
  if ((d.length === 12 || d.length === 13) && d.startsWith('55')) d = d.slice(2);
  if ((d.length === 11 || d.length === 12) && d.startsWith('0')) d = d.slice(1);
  return d;
}

export function normalizeBrPhone(input: string): string | null {
  const d = stripPrefixes(onlyDigits(input));
  if (d.length !== 10 && d.length !== 11) return null;
  if (!/^[1-9][1-9]/.test(d)) return null;
  if (d.length === 11 && d[2] !== '9') return null;
  return d;
}

export function formatBrPhone(digits: string): string {
  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  const split = rest.length === 9 ? 5 : 4;
  return `(${ddd}) ${rest.slice(0, split)}-${rest.slice(split)}`;
}

export function maskBrPhoneInput(raw: string): string {
  // Remove +55 e o 0 da operadora antes de cortar, para o código do país não virar DDD.
  const d = stripPrefixes(onlyDigits(raw)).slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  const ddd = d.slice(0, 2);
  const rest = d.slice(2);
  const split = rest.length > 8 ? 5 : 4;
  if (rest.length <= split) return `(${ddd}) ${rest}`;
  return `(${ddd}) ${rest.slice(0, split)}-${rest.slice(split)}`;
}
