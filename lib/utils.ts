export function formatCLP(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions): string {
  return new Date(iso).toLocaleDateString('es-CL', opts ?? {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getFirstName(fullName: string): string {
  const titles = ['dra.', 'dr.', 'lic.', 'nut.', 'prof.'];
  const parts = fullName.split(' ');
  return parts.find(p => !titles.includes(p.toLowerCase())) ?? parts[0] ?? fullName;
}
