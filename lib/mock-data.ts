import type { Professional, Product, Patient, Protocol, Alert, TimelineDay, Finance, ActivityItem } from './types';

export const PROFESSIONAL: Professional = {
  id: 'pro-001', name: 'Dra. María Torres', firstName: 'María',
  specialty: 'Nutricionista Clínica', focus: 'Salud Metabólica Femenina',
  email: 'maria.torres@nutrilink.cl', phone: '+56 9 8765 4321',
  initials: 'MT', marginMode: 'transfer_to_patient', marginPct: 15,
  verified: true, collegeReg: 'CSN-4521',
};

export const PRODUCTS: Product[] = [
  { id: 'p01', sku: 'INO-4000-IN', name: 'Inositol Myo 4g', compound: 'Myo-Inositol', dosage: '4g', brand: 'Integra Naturals', category: 'metabolico', price: 15990, wholesalePrice: 9594, units: 120, perDay: '2g mañana + 2g noche', certifications: ['GMP', 'NSF'], inStock: true, stockQty: 45, stockDays: 90, evidenceLevel: 'high', conditions: ['SOP', 'Resistencia Insulínica', 'Fertilidad'], description: 'Myo-Inositol puro para regulación hormonal y sensibilidad insulínica.' },
  { id: 'p02', sku: 'MAG-400-NS', name: 'Magnesio Bisglicinato', compound: 'Magnesio Bisglicinato', dosage: '400mg', brand: 'NewScience', category: 'metabolico', price: 15990, wholesalePrice: 9594, units: 90, perDay: '1 cápsula antes de dormir', certifications: ['GMP'], inStock: true, stockQty: 62, stockDays: 90, evidenceLevel: 'high', conditions: ['Ansiedad', 'Sueño', 'SOP', 'Calambres'], description: 'Magnesio de alta biodisponibilidad, forma quelatada.' },
  { id: 'p03', sku: 'OMG-1000-NN', name: 'Omega-3 EPA/DHA', compound: 'Omega-3 (EPA 600 / DHA 400)', dosage: '1000mg', brand: 'Nordic Naturals', category: 'metabolico', price: 18990, wholesalePrice: 11394, units: 60, perDay: '1 cápsula con almuerzo', certifications: ['IFOS', 'GMP'], inStock: true, stockQty: 38, stockDays: 90, evidenceLevel: 'high', conditions: ['Inflamación', 'Cardiovascular', 'SOP'], description: 'Aceite de pescado ultra-purificado con certificación IFOS 5 estrellas.' },
  { id: 'p04', sku: 'VD3-2000-JR', name: 'Vitamina D3', compound: 'Colecalciferol', dosage: '2000 UI', brand: 'Jarrow Formulas', category: 'metabolico', price: 12990, wholesalePrice: 7794, units: 120, perDay: '1 cápsula con almuerzo', certifications: ['GMP', 'NSF'], inStock: true, stockQty: 71, stockDays: 90, evidenceLevel: 'high', conditions: ['Déficit Vitamínico', 'Inmunidad', 'Óseo'], description: 'Vitamina D3 para soporte inmunológico y óseo.' },
  { id: 'p05', sku: 'ZNC-30-TR', name: 'Zinc Picolinato', compound: 'Zinc Picolinato', dosage: '30mg', brand: 'Thorne Research', category: 'metabolico', price: 11990, wholesalePrice: 7194, units: 60, perDay: '1 cápsula con cena', certifications: ['GMP', 'NSF', 'TGA'], inStock: true, stockQty: 54, stockDays: 90, evidenceLevel: 'high', conditions: ['Inmunidad', 'Hormonal', 'Acné'], description: 'Zinc picolinato de alta absorción para soporte inmune y hormonal.' },
  { id: 'p06', sku: 'B12-1000-PE', name: 'Vitamina B12', compound: 'Metilcobalamina', dosage: '1000mcg', brand: 'Pure Encapsulations', category: 'metabolico', price: 14990, wholesalePrice: 8994, units: 90, perDay: '1 cápsula en ayunas', certifications: ['GMP', 'Hypoallergenic'], inStock: true, stockQty: 48, stockDays: 90, evidenceLevel: 'high', conditions: ['Déficit B12', 'Energía', 'Neurológico'], description: 'Metilcobalamina activa, forma biodisponible de vitamina B12.' },
  { id: 'p07', sku: 'PRO-50B-KL', name: 'Probiótico Multi-cepa', compound: 'Multi-cepa 50B CFU', dosage: '50B CFU', brand: 'Klaire Labs', category: 'digestivo', price: 22990, wholesalePrice: 13794, units: 30, perDay: '1 cápsula en ayunas', certifications: ['GMP'], inStock: true, stockQty: 25, stockDays: 45, evidenceLevel: 'moderate', conditions: ['Digestivo', 'Intestinal', 'Inmunidad'], description: 'Probiótico de amplio espectro con 12 cepas seleccionadas.' },
  { id: 'p08', sku: 'FE-25-SOL', name: 'Hierro Bisglicinato', compound: 'Hierro Bisglicinato', dosage: '25mg', brand: 'Solgar', category: 'femenino', price: 13990, wholesalePrice: 8394, units: 90, perDay: '1 cápsula con vitamina C', certifications: ['GMP', 'Kosher'], inStock: true, stockQty: 37, stockDays: 90, evidenceLevel: 'high', conditions: ['Anemia', 'Fatiga', 'Femenino'], description: 'Hierro quelado de alta tolerancia digestiva.' },
  { id: 'p09', sku: 'BRB-500-TR', name: 'Berberina HCl', compound: 'Berberina HCl', dosage: '500mg', brand: 'Thorne Research', category: 'metabolico', price: 21990, wholesalePrice: 13194, units: 60, perDay: '500mg x2 con comidas', certifications: ['GMP', 'NSF'], inStock: true, stockQty: 31, stockDays: 60, evidenceLevel: 'high', conditions: ['Resistencia Insulínica', 'Glucosa', 'Lípidos'], description: 'Berberina para soporte de metabolismo glucídico y lipídico.' },
  { id: 'p10', sku: 'CRM-200-NF', name: 'Cromo Picolinato', compound: 'Cromo Picolinato', dosage: '200mcg', brand: 'NOW Foods', category: 'metabolico', price: 8990, wholesalePrice: 5394, units: 120, perDay: '1 cápsula con desayuno', certifications: ['GMP'], inStock: true, stockQty: 83, stockDays: 90, evidenceLevel: 'moderate', conditions: ['Insulina', 'Glucosa', 'Antojos'], description: 'Cromo picolinato para soporte de sensibilidad insulínica.' },
  { id: 'p11', sku: 'NAC-600-LE', name: 'NAC', compound: 'N-Acetil Cisteína', dosage: '600mg', brand: 'Life Extension', category: 'metabolico', price: 16990, wholesalePrice: 10194, units: 60, perDay: '1 cápsula con desayuno', certifications: ['GMP'], inStock: true, stockQty: 42, stockDays: 60, evidenceLevel: 'moderate', conditions: ['Antioxidante', 'Hepático', 'SOP'], description: 'Precursor de glutatión para soporte antioxidante y hepático.' },
  { id: 'p12', sku: 'SEL-200-TR', name: 'Selenio', compound: 'Selenometionina', dosage: '200mcg', brand: 'Thorne Research', category: 'metabolico', price: 9990, wholesalePrice: 5994, units: 60, perDay: '1 cápsula con almuerzo', certifications: ['GMP', 'NSF'], inStock: true, stockQty: 55, stockDays: 90, evidenceLevel: 'high', conditions: ['Tiroides', 'Hipotiroidismo', 'Antioxidante'], description: 'Selenometionina orgánica para soporte tiroideo.' },
];

const p = PRODUCTS;

export const PATIENTS: Patient[] = [
  { id: 'pat-001', professionalId: 'pro-001', name: 'Camila Soto', age: 28, condition: 'SOP + Resistencia Insulínica', phone: '+56 9 1234 5678', email: 'camila.soto@gmail.com', status: 'active', adherence: 91, healthScore: 94, monthsActive: 4, lastOrder: '2026-06-01', lastContact: 'Hace 2 días', totalSpent: 152000, since: '12 Mar 2025' },
  { id: 'pat-002', professionalId: 'pro-001', name: 'Valentina Torres', age: 34, condition: 'Hipotiroidismo', phone: '+56 9 2345 6789', email: 'vale.torres@gmail.com', status: 'active', adherence: 85, healthScore: 71, monthsActive: 3, lastOrder: '2026-05-20', lastContact: 'Hace 5 días', totalSpent: 114000, since: '15 Abr 2025' },
  { id: 'pat-003', professionalId: 'pro-001', name: 'Francisca Muñoz', age: 31, condition: 'Resistencia Insulínica', phone: '+56 9 3456 7890', email: 'fran.munoz@gmail.com', status: 'active', adherence: 78, healthScore: 62, monthsActive: 5, lastOrder: '2026-06-01', lastContact: 'Hace 3 días', totalSpent: 190000, since: '08 Feb 2025' },
  { id: 'pat-004', professionalId: 'pro-001', name: 'Ana García', age: 38, condition: 'SOP', phone: '+56 9 4567 8901', email: 'ana.garcia@gmail.com', status: 'risk', adherence: 42, healthScore: 35, monthsActive: 2, lastOrder: '2026-05-01', lastContact: 'Hace 32 días', totalSpent: 76000, since: '01 Abr 2025' },
  { id: 'pat-005', professionalId: 'pro-001', name: 'Catalina Reyes', age: 29, condition: 'Déficit Vitamínico', phone: '+56 9 5678 9012', email: 'cata.reyes@gmail.com', status: 'active', adherence: 95, healthScore: 88, monthsActive: 6, lastOrder: '2026-05-31', lastContact: 'Hace 1 día', totalSpent: 228000, since: '10 Dic 2024' },
  { id: 'pat-006', professionalId: 'pro-001', name: 'Sofía Contreras', age: 33, condition: 'SOP + RI', phone: '+56 9 6789 0123', email: 'sofia.c@gmail.com', status: 'active', adherence: 88, healthScore: 82, monthsActive: 2, lastOrder: '2026-05-25', lastContact: 'Hace 4 días', totalSpent: 76000, since: '20 Abr 2025' },
  { id: 'pat-007', professionalId: 'pro-001', name: 'Isidora Vega', age: 27, condition: 'Hipotiroidismo', phone: '+56 9 7890 1234', email: 'isi.vega@gmail.com', status: 'paused', adherence: 45, healthScore: 38, monthsActive: 1, lastOrder: '2026-04-15', lastContact: 'Hace 45 días', totalSpent: 38000, since: '15 Mar 2025' },
  { id: 'pat-008', professionalId: 'pro-001', name: 'José Pérez', age: 40, condition: 'Resistencia Insulínica', phone: '+56 9 8901 2345', email: 'jose.perez@gmail.com', status: 'risk', adherence: 48, healthScore: 42, monthsActive: 3, lastOrder: '2026-05-05', lastContact: 'Hace 28 días', totalSpent: 114000, since: '12 Mar 2025' },
];

const pt = PATIENTS;

export const PROTOCOLS: Protocol[] = [
  { id: 'prot-001', name: 'Protocolo SOP Integral', patient: pt[0], items: [
    { id: 'pi-1', product: p[0], qty: 1, instruction: '2g mañana + 2g noche', days: 90, status: 'active', daysLeft: 42 },
    { id: 'pi-2', product: p[1], qty: 1, instruction: '1 cápsula antes de dormir', days: 90, status: 'active', daysLeft: 42 },
    { id: 'pi-3', product: p[3], qty: 1, instruction: '1 cápsula con almuerzo', days: 90, status: 'warning', daysLeft: 12 },
    { id: 'pi-4', product: p[2], qty: 1, instruction: '1 cápsula con almuerzo', days: 90, status: 'active', daysLeft: 42 },
  ], status: 'active', healthScore: 94, createdAt: '12 Mar 2025', shortToken: 'sop-001', subscription: true, monthlyValue: 63960, totalGenerated: 255840, renewalDate: '12 Jul 2025', renewalDays: 8, lastPurchase: 'Hace 3 días' },
  { id: 'prot-002', name: 'Protocolo Tiroides', patient: pt[1], items: [
    { id: 'pi-5', product: p[5], qty: 1, instruction: '1 cápsula en ayunas', days: 90, status: 'active', daysLeft: 35 },
    { id: 'pi-6', product: p[4], qty: 1, instruction: '1 cápsula con cena', days: 90, status: 'active', daysLeft: 35 },
    { id: 'pi-7', product: p[11], qty: 1, instruction: '1 cápsula con almuerzo', days: 90, status: 'active', daysLeft: 35 },
  ], status: 'active', healthScore: 71, createdAt: '15 Abr 2025', shortToken: 'tir-002', subscription: true, monthlyValue: 36970, totalGenerated: 110910, renewalDate: '15 Jul 2025', renewalDays: 11, lastPurchase: 'Hace 15 días' },
  { id: 'prot-003', name: 'Protocolo RI Avanzado', patient: pt[2], items: [
    { id: 'pi-8', product: p[8], qty: 1, instruction: '500mg x2 con comidas', days: 90, status: 'active', daysLeft: 28 },
    { id: 'pi-9', product: p[9], qty: 1, instruction: '1 cápsula con desayuno', days: 90, status: 'active', daysLeft: 28 },
    { id: 'pi-10', product: p[1], qty: 1, instruction: '1 cápsula antes de dormir', days: 90, status: 'active', daysLeft: 28 },
    { id: 'pi-11', product: p[10], qty: 1, instruction: '1 cápsula con desayuno', days: 90, status: 'warning', daysLeft: 14 },
  ], status: 'active', healthScore: 62, createdAt: '08 Feb 2025', shortToken: 'ri-003', subscription: true, monthlyValue: 63960, totalGenerated: 319800, renewalDate: '08 Jul 2025', renewalDays: 4, lastPurchase: 'Hace 10 días' },
  { id: 'prot-004', name: 'Protocolo SOP Básico', patient: pt[3], items: [
    { id: 'pi-12', product: p[0], qty: 1, instruction: '2g mañana + 2g noche', days: 90, status: 'expired', daysLeft: 0 },
    { id: 'pi-13', product: p[2], qty: 1, instruction: '1 cápsula con almuerzo', days: 90, status: 'expired', daysLeft: 0 },
  ], status: 'risk', healthScore: 35, createdAt: '01 Abr 2025', shortToken: 'sop-004', subscription: false, monthlyValue: 34980, totalGenerated: 69960, renewalDate: 'Vencido', renewalDays: -5, lastPurchase: 'Hace 32 días' },
  { id: 'prot-005', name: 'Protocolo Vitamínico', patient: pt[4], items: [
    { id: 'pi-14', product: p[3], qty: 1, instruction: '1 cápsula con almuerzo', days: 120, status: 'active', daysLeft: 55 },
    { id: 'pi-15', product: p[5], qty: 1, instruction: '1 cápsula en ayunas', days: 120, status: 'active', daysLeft: 55 },
    { id: 'pi-16', product: p[7], qty: 1, instruction: '1 cápsula con vitamina C', days: 90, status: 'active', daysLeft: 30 },
  ], status: 'active', healthScore: 88, createdAt: '10 Dic 2024', shortToken: 'dv-005', subscription: true, monthlyValue: 41970, totalGenerated: 251820, renewalDate: '10 Jul 2025', renewalDays: 6, lastPurchase: 'Hace 1 día' },
];

export const ALERTS: Alert[] = [
  { id: 'a1', type: 'warning', icon: 'clock', text: 'Camila Soto — Vitamina D3 termina en 12 días', time: 'Hace 1h', patient: pt[0], actionLabel: 'Enviar recordatorio' },
  { id: 'a2', type: 'danger', icon: 'x', text: 'José Pérez — sin compras hace 28 días', time: 'Hace 3h', patient: pt[7], actionLabel: 'Ver protocolo' },
  { id: 'a3', type: 'danger', icon: 'x', text: 'Ana García — suscripción cancelada ayer', time: 'Ayer', patient: pt[3], actionLabel: 'Contactar' },
  { id: 'a4', type: 'warning', icon: 'trendUp', text: 'Protocolo SOP #4 — adherencia cayó 20%', time: 'Ayer', patient: pt[3], actionLabel: 'Revisar' },
  { id: 'a5', type: 'info', icon: 'sparkles', text: 'IA: Isidora Vega tiene 72% de probabilidad de abandono', time: 'Hace 2 días', patient: pt[6], actionLabel: 'Ver análisis' },
  { id: 'a6', type: 'success', icon: 'check', text: 'Catalina Reyes completó 6 meses de tratamiento', time: 'Hace 2 días', patient: pt[4], actionLabel: 'Felicitar' },
];

export const TIMELINE: TimelineDay[] = [
  { date: 'Hoy', events: [{ icon: 'clock', color: 'amber', text: 'Vitamina D próxima a terminar', detail: 'Camila Soto — 12 días restantes' }] },
  { date: '1 Jun 2025', events: [
    { icon: 'cart', color: 'emerald', text: 'Compra completada — $63.960', detail: 'Camila Soto — 4 suplementos — Webpay' },
    { icon: 'package', color: 'blue', text: 'Despacho confirmado', detail: 'Estimado: 2 días hábiles' },
  ]},
  { date: '28 May 2025', events: [{ icon: 'send', color: 'blue', text: 'Recordatorio enviado', detail: 'WhatsApp automático de renovación' }] },
];

export const FINANCE: Finance = {
  mrr: { value: 312000, change: 12, trend: 'up' },
  gmv: { value: 487000, change: 18, trend: 'up' },
  commissions: { value: 73050, change: 15, trend: 'up' },
  totalGenerated: { value: 1847000, trend: 'up' },
  ltvAvg: 152000,
  subscribed: 18,
  reorderRate: 67,
  projectedNext: { renewals: 7, renewalValue: 266000, newProtocols: 3, newValue: 90000, total: 356000 },
  monthlyData: [120000, 180000, 215000, 248000, 278000, 312000],
  monthLabels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
};

export const ACTIVITY_FEED: ActivityItem[] = [
  { type: 'purchase', patient: 'Camila Soto', text: 'completó su compra — $63.960', time: 'Hace 2 horas', icon: 'cart' },
  { type: 'subscription', patient: 'Francisca Muñoz', text: 'renovó su suscripción mensual', time: 'Hace 5 horas', icon: 'refresh' },
  { type: 'milestone', patient: 'Catalina Reyes', text: 'completó 6 meses de tratamiento', time: 'Hace 8 horas', icon: 'star' },
  { type: 'view', patient: 'Ana García', text: 'vio su protocolo (pendiente de compra)', time: 'Ayer', icon: 'eye' },
];

export function formatCLP(amount: number): string {
  return '$' + Math.round(amount).toLocaleString('es-CL');
}

export function hsColor(score: number): string {
  return score >= 75 ? 'emerald' : score >= 45 ? 'amber' : 'red';
}
