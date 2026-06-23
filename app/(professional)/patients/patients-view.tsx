'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Modal } from '@/components/ui/modal';
import { CreatePatientForm } from '@/components/patients/create-patient-form';

type Patient = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  birth_year: number | null;
  consent_status: string;
  created_at: string;
};

const CONSENT_COLOR: Record<string, 'emerald' | 'amber' | 'slate'> = {
  accepted: 'emerald',
  pending: 'amber',
  declined: 'slate',
};
const CONSENT_LABEL: Record<string, string> = {
  accepted: 'Activo',
  pending: 'Pendiente',
  declined: 'Inactivo',
};

function formatAge(birthYear: number | null): string {
  if (!birthYear) return '—';
  return `${new Date().getFullYear() - birthYear} años`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface PatientsViewProps {
  patients: Patient[];
}

export function PatientsView({ patients }: PatientsViewProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div style={{ padding: 'var(--sp-8)', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-8)', animation: 'fadeInDown var(--duration-enter) var(--ease-out) both' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: '-0.02em' }}>Pacientes</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 4 }}>
            {patients.length} paciente{patients.length !== 1 ? 's' : ''} registrado{patients.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button icon="plus" onClick={() => setModalOpen(true)}>Agregar paciente</Button>
      </div>

      {patients.length === 0 ? (
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--sp-12)', textAlign: 'center' }}>
          <Icon name="users" size={40} style={{ color: 'var(--color-text-tertiary)', margin: '0 auto var(--sp-4)' }} />
          <div style={{ fontWeight: 600, marginBottom: 8 }}>No tienes pacientes aún</div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--sp-4)' }}>
            Agrega tu primer paciente para comenzar a crear protocolos.
          </p>
          <Button icon="plus" onClick={() => setModalOpen(true)}>Agregar primer paciente</Button>
        </div>
      ) : (
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', animation: 'fadeInDown var(--duration-enter) var(--ease-out) 60ms both' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 'var(--sp-4)', padding: 'var(--sp-3) var(--sp-5)', background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <span>Paciente</span>
            <span>Contacto</span>
            <span>Estado</span>
            <span>Desde</span>
            <span>Acciones</span>
          </div>

          {patients.map((patient, i) => (
            <div key={patient.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 'var(--sp-4)', padding: 'var(--sp-4) var(--sp-5)', borderBottom: i < patients.length - 1 ? '1px solid var(--color-border-subtle)' : 'none', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={patient.name} size={36} />
                <div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{patient.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{formatAge(patient.birth_year)}</div>
                </div>
              </div>
              <div>
                {patient.email && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{patient.email}</div>}
                {patient.phone && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{patient.phone}</div>}
                {!patient.email && !patient.phone && <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>—</span>}
              </div>
              <Badge color={CONSENT_COLOR[patient.consent_status] ?? 'slate'} dot>
                {CONSENT_LABEL[patient.consent_status] ?? patient.consent_status}
              </Badge>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                {formatDate(patient.created_at)}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link href={`/protocols?patient=${patient.id}`} style={{ padding: '6px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'var(--color-text)' }} title="Ver protocolos">
                  <Icon name="fileText" size={14} />
                </Link>
                {patient.phone && (
                  <a href={`https://wa.me/${patient.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ padding: '6px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'var(--color-text)' }} title="WhatsApp">
                    <Icon name="phone" size={14} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Agregar paciente">
        <CreatePatientForm onSuccess={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
}
