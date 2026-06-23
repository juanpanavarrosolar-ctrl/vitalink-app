'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Modal } from '@/components/ui/modal';
import { CreateProtocolForm } from '@/components/protocols/create-protocol-form';
import type { BadgeColor } from '@/lib/types';

type Plan = {
  id: string;
  title: string;
  status: string;
  duration_days: number | null;
  public_token: string;
  expires_at: string | null;
  created_at: string;
  patients: { id: string; name: string } | null;
};

type Patient = { id: string; name: string; email: string | null };

const STATUS_COLOR: Record<string, BadgeColor> = {
  draft: 'slate',
  sent: 'blue',
  viewed: 'violet',
  accepted: 'emerald',
  purchased: 'emerald',
  expired: 'amber',
  cancelled: 'red',
};
const STATUS_LABEL: Record<string, string> = {
  draft: 'Borrador',
  sent: 'Enviado',
  viewed: 'Visto',
  accepted: 'Aceptado',
  purchased: 'Comprado',
  expired: 'Vencido',
  cancelled: 'Cancelado',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });
}

function copyLink(token: string) {
  const url = `${window.location.origin}/p/${token}`;
  navigator.clipboard.writeText(url).catch(() => {});
}

interface ProtocolsViewProps {
  plans: Plan[];
  patients: Patient[];
}

export function ProtocolsView({ plans, patients }: ProtocolsViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  function handleCopy(token: string) {
    copyLink(token);
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div style={{ padding: 'var(--sp-8)', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-8)', animation: 'fadeInDown var(--duration-enter) var(--ease-out) both' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: '-0.02em' }}>Protocolos</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 4 }}>
            {plans.length} protocolo{plans.length !== 1 ? 's' : ''} en total
          </p>
        </div>
        <Button icon="plus" onClick={() => setModalOpen(true)}>Nuevo protocolo</Button>
      </div>

      {plans.length === 0 ? (
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--sp-12)', textAlign: 'center' }}>
          <Icon name="fileText" size={40} style={{ color: 'var(--color-text-tertiary)', margin: '0 auto var(--sp-4)' }} />
          <div style={{ fontWeight: 600, marginBottom: 8 }}>No tienes protocolos aún</div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--sp-4)' }}>
            Crea tu primer protocolo de suplementación para un paciente.
          </p>
          <Button icon="plus" onClick={() => setModalOpen(true)}>Crear primer protocolo</Button>
        </div>
      ) : (
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', animation: 'fadeInDown var(--duration-enter) var(--ease-out) 60ms both' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr auto', gap: 'var(--sp-4)', padding: 'var(--sp-3) var(--sp-5)', background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <span>Protocolo / Paciente</span>
            <span>Estado</span>
            <span>Duración</span>
            <span>Creado</span>
            <span>Acciones</span>
          </div>

          {plans.map((plan, i) => (
            <div key={plan.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr auto', gap: 'var(--sp-4)', padding: 'var(--sp-4) var(--sp-5)', borderBottom: i < plans.length - 1 ? '1px solid var(--color-border-subtle)' : 'none', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={plan.patients?.name ?? '?'} size={36} />
                <div>
                  <Link href={`/protocols/${plan.id}`} style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)', textDecoration: 'none' }}>
                    {plan.title}
                  </Link>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                    {plan.patients?.name ?? 'Sin paciente'}
                  </div>
                </div>
              </div>
              <Badge color={STATUS_COLOR[plan.status] ?? 'slate'} dot>
                {STATUS_LABEL[plan.status] ?? plan.status}
              </Badge>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                {plan.duration_days ? `${plan.duration_days} días` : '—'}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                {formatDate(plan.created_at)}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link
                  href={`/protocols/${plan.id}`}
                  style={{ padding: '6px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'var(--color-text)' }}
                  title="Ver / editar"
                >
                  <Icon name="eye" size={14} />
                </Link>
                <button
                  onClick={() => handleCopy(plan.public_token)}
                  style={{ padding: '6px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: copied === plan.public_token ? 'var(--color-primary-light)' : 'var(--color-surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', color: copied === plan.public_token ? 'var(--color-primary)' : 'var(--color-text)' }}
                  title="Copiar link del paciente"
                >
                  <Icon name={copied === plan.public_token ? 'check' : 'link'} size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo protocolo" maxWidth={520}>
        <CreateProtocolForm patients={patients} onSuccess={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
}
