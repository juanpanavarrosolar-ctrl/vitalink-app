export type ProductCategory = 'metabolico' | 'femenino' | 'digestivo' | 'deportivo';
export type EvidenceLevel = 'high' | 'moderate' | 'limited';
export type PatientStatus = 'active' | 'risk' | 'paused' | 'inactive';
export type ProtocolStatus = 'active' | 'risk' | 'paused' | 'expired' | 'draft';
export type ItemStatus = 'active' | 'warning' | 'expired';
export type AlertType = 'warning' | 'danger' | 'info' | 'success';
export type BadgeColor = 'blue' | 'emerald' | 'amber' | 'red' | 'violet' | 'slate';

export interface Professional {
  id: string;
  name: string;
  firstName?: string;
  specialty?: string;
  focus?: string;
  email: string;
  phone?: string;
  initials?: string;
  collegeReg?: string;
  verified: boolean;
  marginMode: 'transfer_to_patient' | 'absorb';
  marginPct: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  compound?: string;
  dosage?: string;
  brand?: string;
  category: ProductCategory;
  price: number;
  wholesalePrice?: number;
  units?: number;
  perDay?: string;
  certifications: string[];
  inStock: boolean;
  stockQty: number;
  stockDays?: number;
  evidenceLevel: EvidenceLevel;
  conditions: string[];
  description?: string;
}

export interface Patient {
  id: string;
  professionalId: string;
  name: string;
  email?: string;
  phone?: string;
  age?: number;
  condition?: string;
  status: PatientStatus;
  adherence: number;
  healthScore: number;
  monthsActive: number;
  totalSpent: number;
  since?: string;
  lastOrder?: string;
  lastContact?: string;
}

export interface ProtocolItem {
  id: string;
  product: Product;
  qty: number;
  instruction?: string;
  days?: number;
  status: ItemStatus;
  daysLeft: number;
}

export interface Protocol {
  id: string;
  patient: Patient;
  name: string;
  status: ProtocolStatus;
  healthScore: number;
  shortToken: string;
  items: ProtocolItem[];
  subscription: boolean;
  monthlyValue: number;
  totalGenerated: number;
  renewalDate?: string;
  renewalDays?: number;
  lastPurchase?: string;
  createdAt: string;
}

export interface Alert {
  id: string;
  type: AlertType;
  icon: string;
  text: string;
  time?: string;
  patient?: Patient;
  actionLabel?: string;
}

export interface TimelineEvent {
  icon: string;
  color: string;
  text: string;
  detail?: string;
}

export interface TimelineDay {
  date: string;
  events: TimelineEvent[];
}

export interface FinanceMetric {
  value: number;
  change?: number;
  trend?: 'up' | 'down';
}

export interface Finance {
  mrr: FinanceMetric;
  gmv: FinanceMetric;
  commissions: FinanceMetric;
  totalGenerated: FinanceMetric;
  ltvAvg: number;
  subscribed: number;
  reorderRate: number;
  projectedNext: {
    renewals: number;
    renewalValue: number;
    newProtocols: number;
    newValue: number;
    total: number;
  };
  monthlyData: number[];
  monthLabels: string[];
}

export interface ActivityItem {
  type: string;
  patient: string;
  text: string;
  time: string;
  icon: string;
}
