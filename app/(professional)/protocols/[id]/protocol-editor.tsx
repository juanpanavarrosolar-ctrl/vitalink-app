'use client';
import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Modal } from '@/components/ui/modal';
import { addProductToPlan, removeProductFromPlan, publishProtocol } from '@/lib/actions/protocols';
import type { BadgeColor } from '@/lib/types';

type Product = { id: string; name: string; brand: string; compound: string; dosage: string; price: number; stock_status: string };
type PlanItem = { id: string; quantity: number; instructions: string | null; frequency: string | null; duration_days: number | null; products: Product | null };
type Patient = { id: string; name: string; email: string | null; phone: string | null };
type Plan = {
  id: string; title: string; status: string; notes: string | null;
  duration_days: number | null; public_token: string; expires_at: string | null; created_at: string;
  patients: Patient | null;
  plan_items: PlanItem[];
};

const STATUS_COLOR: Record<string, BadgeColor> = {
  draft: 'slate', sent: 'blue', viewed: 'violet', accepted: 'emerald',
  purchased: 'emerald', expired: 'amber', cancelled: 'red',
};
const STATUS_LABEL: Record<string, string> = {
  draft: 'Borrador', sent: 'Enviado', viewed: 'Visto', accepted: 'Aceptado',
  purchased: 'Comprado', expired: 'Vencido', cancelled: 'Cancelado',
};

function formatCLP(n: number): string {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);
}

interface ProtocolEditorProps {
  plan: Plan;
  availableProducts: Product[];
}

export function ProtocolEditor({ plan, availableProducts }: ProtocolEditorProps) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();
  const [publishPending, setPublishPending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [addingProduct, setAddingProduct] = useState<Product | null>(null);

  const subtotal = plan.plan_items.reduce((s, item) => s + (item.products?.price ?? 0) * item.quantity, 0);
  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const patientLink = `${appUrl}/p/${plan.public_token}`;

  const filteredProducts = availableProducts.filter(p =>
    !plan.plan_items.some(i => i.products?.id === p.id) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
     p.compound.toLowerCase().includes(search.toLowerCase()) ||
     p.brand.toLowerCase().includes(search.toLowerCase()))
  );

  function handleRemove(itemId: string) {
    startTransition(async () => {
      await removeProductFromPlan(itemId, plan.id);
    });
  }

  async function handlePublish() {
    setPublishPending(true);
    const result = await publishProtocol(plan.id);
    setPublishPending(false);
    if (result?.error) alert(result.error);
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(patientLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleAddProduct(formData: FormData) {
    startTransition(async () => {
      await addProductToPlan(plan.id, formData);
      setAddModalOpen(false);
      setAddingProduct(null);
      setSearch('');
    });
  }

  return (
    <div style={{ padding: 'var(--sp-8)', maxWidth: 1000, margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--sp-6)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
        <Link href="/protocols" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Protocolos</Link>
        <Icon name="chevronRight" size={14} />
        <span style={{ color: 'var(--color-text)', fontWeight: 600 }}>{plan.title}</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--sp-6)', animation: 'fadeInDown var(--duration-enter) var(--ease-out) both' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>{plan.title}</h1>
            <Badge color={STATUS_COLOR[plan.status] ?? 'slate'} dot>{STATUS_LABEL[plan.status] ?? plan.status}</Badge>
          </div>
          {plan.patients && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar name={plan.patients.name} size={24} />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{plan.patients.name}</span>
              {plan.patients.email && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>· {plan.patients.email}</span>}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
          <Button
            variant="secondary"
            icon={copied ? 'check' : 'link'}
            onClick={handleCopyLink}
          >
            {copied ? 'Copiado' : 'Copiar link'}
          </Button>
          {plan.status === 'draft' && (
            <Button
              icon="mail"
              loading={publishPending}
              onClick={handlePublish}
            >
              Publicar y enviar
            </Button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'var(--sp-6)' }}>
        {/* Products list */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-4)' }}>
            <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>Suplementos ({plan.plan_items.length})</h2>
            <Button variant="secondary" size="sm" icon="plus" onClick={() => setAddModalOpen(true)}>
              Agregar suplemento
            </Button>
          </div>

          {plan.plan_items.length === 0 ? (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--sp-8)', textAlign: 'center' }}>
              <Icon name="package" size={32} style={{ color: 'var(--color-text-tertiary)', margin: '0 auto var(--sp-3)' }} />
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Sin suplementos aún</div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--sp-4)' }}>
                Agrega los suplementos que componen este protocolo.
              </p>
              <Button variant="secondary" size="sm" icon="plus" onClick={() => setAddModalOpen(true)}>Agregar suplemento</Button>
            </div>
          ) : (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              {plan.plan_items.map((item, i) => (
                <div key={item.id} style={{ display: 'flex', gap: 'var(--sp-4)', padding: 'var(--sp-4) var(--sp-5)', borderBottom: i < plan.plan_items.length - 1 ? '1px solid var(--color-border-subtle)' : 'none', alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name="capsule" size={20} style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>{item.products?.name}</span>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{formatCLP(item.products?.price ?? 0)}</span>
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                      {item.products?.compound} · {item.products?.dosage} · {item.products?.brand}
                    </div>
                    {item.instructions && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>
                        <Icon name="clock" size={12} />
                        <strong>{item.instructions}</strong>
                      </div>
                    )}
                    {item.duration_days && (
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 2 }}>
                        {item.duration_days} días · Cantidad: {item.quantity}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    disabled={isPending}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', padding: 4, display: 'flex', alignItems: 'center', borderRadius: 'var(--radius-sm)' }}
                    title="Quitar del protocolo"
                  >
                    <Icon name="x" size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          {/* Summary */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--sp-5)' }}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 'var(--sp-4)' }}>Resumen</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 'var(--text-sm)' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal paciente</span>
              <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{formatCLP(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 'var(--text-sm)' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Duración</span>
              <span style={{ fontWeight: 600 }}>{plan.duration_days ?? 90} días</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Productos</span>
              <span style={{ fontWeight: 600 }}>{plan.plan_items.length}</span>
            </div>
          </div>

          {/* Patient link */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--sp-5)' }}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 'var(--sp-3)' }}>Link del paciente</h3>
            <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', padding: 'var(--sp-3)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', wordBreak: 'break-all', marginBottom: 'var(--sp-3)' }}>
              /p/{plan.public_token.slice(0, 12)}...
            </div>
            <Button variant="secondary" size="sm" icon={copied ? 'check' : 'copy'} style={{ width: '100%', justifyContent: 'center' }} onClick={handleCopyLink}>
              {copied ? 'Copiado!' : 'Copiar link'}
            </Button>
          </div>

          {/* Notes */}
          {plan.notes && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--sp-5)' }}>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 'var(--sp-3)' }}>Notas</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{plan.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Add product modal */}
      <Modal open={addModalOpen} onClose={() => { setAddModalOpen(false); setAddingProduct(null); setSearch(''); }} title="Agregar suplemento" maxWidth={540}>
        {addingProduct ? (
          <form action={handleAddProduct}>
            <input type="hidden" name="product_id" value={addingProduct.id} />
            <div style={{ background: 'var(--color-primary-light)', borderRadius: 'var(--radius-md)', padding: 'var(--sp-3) var(--sp-4)', marginBottom: 'var(--sp-4)' }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)' }}>{addingProduct.name}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)' }}>{addingProduct.compound} · {addingProduct.dosage} · {formatCLP(addingProduct.price)}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--sp-2)' }}>Instrucciones de consumo</label>
                <input name="instructions" placeholder="Ej: 1 cápsula antes de dormir" style={{ width: '100%', padding: 'var(--sp-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: 'var(--text-sm)', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--sp-2)' }}>Cantidad</label>
                  <input name="quantity" type="number" defaultValue="1" min="1" style={{ width: '100%', padding: 'var(--sp-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: 'var(--text-sm)', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--sp-2)' }}>Días</label>
                  <input name="duration_days" type="number" defaultValue={plan.duration_days ?? 90} min="1" style={{ width: '100%', padding: 'var(--sp-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: 'var(--text-sm)', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--sp-3)', justifyContent: 'flex-end' }}>
                <Button type="button" variant="secondary" onClick={() => setAddingProduct(null)}>Atrás</Button>
                <Button type="submit" loading={isPending} icon="plus">Agregar</Button>
              </div>
            </div>
          </form>
        ) : (
          <div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre, compuesto o marca..."
              autoFocus
              style={{ width: '100%', padding: 'var(--sp-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: 'var(--text-sm)', fontFamily: 'inherit', marginBottom: 'var(--sp-3)', boxSizing: 'border-box' }}
            />
            <div style={{ maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {filteredProducts.length === 0 ? (
                <div style={{ padding: 'var(--sp-4)', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                  {availableProducts.length === 0 ? 'No hay productos en el catálogo' : 'Sin resultados para tu búsqueda'}
                </div>
              ) : (
                filteredProducts.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setAddingProduct(p)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: 'var(--sp-3) var(--sp-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-bg)', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <div>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{p.compound} · {p.dosage} · {p.brand}</div>
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary)', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{formatCLP(p.price)}</div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
