'use client';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { formatCLP } from '@/lib/utils';
import type { BadgeColor } from '@/lib/types';

type Product = {
  id: string;
  name: string;
  brand: string;
  compound: string;
  format: string | null;
  dosage: string | null;
  unit_count: number | null;
  price: number;
  wholesale_cost: number | null;
  stock_status: string;
  claim_review_status: string;
  description_safe: string | null;
};

const CLAIM_COLOR: Record<string, BadgeColor> = {
  approved: 'emerald',
  pending: 'amber',
  risky: 'red',
  rejected: 'red',
};
const CLAIM_LABEL: Record<string, string> = {
  approved: 'Aprobado',
  pending: 'En revisión',
  risky: 'Claims riesgosos',
  rejected: 'Rechazado',
};

interface CatalogViewProps {
  products: Product[];
}

export function CatalogView({ products }: CatalogViewProps) {
  const [search, setSearch] = useState('');

  const filtered = products.filter(p =>
    !search ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.compound.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase()) ||
    (p.description_safe ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 'var(--sp-8)', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-6)', animation: 'fadeInDown var(--duration-enter) var(--ease-out) both' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: '-0.02em' }}>Catálogo</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 4 }}>
            {filtered.length} de {products.length} productos disponibles
          </p>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 'var(--sp-6)' }}>
        <Icon name="search" size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre, compuesto o marca..."
          style={{
            width: '100%', padding: 'var(--sp-3) var(--sp-4) var(--sp-3) 40px',
            borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
            background: 'var(--color-surface)', color: 'var(--color-text)',
            fontSize: 'var(--text-sm)', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {products.length === 0 ? (
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--sp-12)', textAlign: 'center' }}>
          <Icon name="package" size={40} style={{ color: 'var(--color-text-tertiary)', margin: '0 auto var(--sp-4)' }} />
          <div style={{ fontWeight: 600 }}>El catálogo está vacío</div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: 8 }}>
            El equipo NutriLink está cargando los productos. Vuelve pronto.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-4)', animation: 'fadeInDown var(--duration-enter) var(--ease-out) 60ms both' }}>
          {filtered.map(product => (
            <div
              key={product.id}
              style={{
                background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)',
                padding: 'var(--sp-5)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 2 }}>{product.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                    {product.compound}{product.dosage ? ` · ${product.dosage}` : ''}
                  </div>
                </div>
                <div style={{
                  width: 36, height: 36, borderRadius: 'var(--radius-md)',
                  background: 'var(--color-primary-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon name="capsule" size={18} style={{ color: 'var(--color-primary)' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <Badge color={CLAIM_COLOR[product.claim_review_status] ?? 'slate'}>
                  {CLAIM_LABEL[product.claim_review_status] ?? product.claim_review_status}
                </Badge>
                {product.format && (
                  <Badge color="blue">{product.format}</Badge>
                )}
              </div>

              {product.description_safe && (
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {product.description_safe}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 'var(--sp-2)', borderTop: '1px solid var(--color-border-subtle)', marginTop: 'auto' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-base)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{formatCLP(product.price)}</div>
                  {product.unit_count && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{product.unit_count} unidades</div>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)', fontWeight: 600 }}>En stock</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{product.brand}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
