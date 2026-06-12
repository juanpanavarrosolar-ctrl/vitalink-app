import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { PRODUCTS, formatCLP } from '@/lib/mock-data';
import type { BadgeColor } from '@/lib/types';

const EVIDENCE_COLOR: Record<string, BadgeColor> = { high: 'emerald', moderate: 'amber', limited: 'red' };
const EVIDENCE_LABEL: Record<string, string> = { high: 'Alta evidencia', moderate: 'Moderada', limited: 'Limitada' };
const CATEGORY_LABEL: Record<string, string> = { metabolico: 'Metabólico', femenino: 'Femenino', digestivo: 'Digestivo', deportivo: 'Deportivo' };

export default function CatalogPage() {
  return (
    <div style={{ padding: 'var(--sp-8)', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-8)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: '-0.02em' }}>Catálogo</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 4 }}>{PRODUCTS.length} productos disponibles</p>
        </div>
        <Button icon="plus">Agregar producto</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-4)' }}>
        {PRODUCTS.map(product => (
          <div key={product.id} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', padding: 'var(--sp-5)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 2 }}>{product.name}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{product.compound} · {product.dosage}</div>
              </div>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="capsule" size={18} style={{ color: 'var(--color-primary)' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Badge color={EVIDENCE_COLOR[product.evidenceLevel]}>{EVIDENCE_LABEL[product.evidenceLevel]}</Badge>
              <Badge color="blue">{CATEGORY_LABEL[product.category]}</Badge>
            </div>

            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="clock" size={12} />
              {product.perDay}
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {product.certifications.map(cert => (
                <span key={cert} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 'var(--radius-xs)', background: 'var(--slate-100)', color: 'var(--slate-600)', fontWeight: 600 }}>{cert}</span>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 'var(--sp-2)', borderTop: '1px solid var(--color-border-subtle)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>{formatCLP(product.price)}</div>
                {product.wholesalePrice && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Costo: {formatCLP(product.wholesalePrice)}</div>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 'var(--text-xs)', color: product.inStock ? 'var(--color-success)' : 'var(--color-error)', fontWeight: 600 }}>
                  {product.inStock ? `${product.stockQty} en stock` : 'Sin stock'}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{product.brand}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
