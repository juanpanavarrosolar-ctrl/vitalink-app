import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { formatCLP } from '@/lib/utils';
import { toggleProductStock, approveProductClaim, rejectProductClaim } from '@/lib/actions/admin';
import type { BadgeColor } from '@/lib/types';

const CLAIM_COLOR: Record<string, BadgeColor> = {
  approved: 'emerald', pending: 'amber', risky: 'red', rejected: 'red',
};
const CLAIM_LABEL: Record<string, string> = {
  approved: 'Aprobado', pending: 'En revisión', risky: 'Riesgoso', rejected: 'Rechazado',
};

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from('products')
    .select('id, name, brand, compound, format, price, stock_status, claim_review_status')
    .order('name');

  const pending = products?.filter(p => p.claim_review_status === 'pending').length ?? 0;

  return (
    <div style={{ padding: 'var(--sp-8)', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--sp-6)', animation: 'fadeInDown var(--duration-enter) var(--ease-out) both' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: '-0.02em' }}>Productos</h1>
          {pending > 0 && <Badge color="amber">{pending} en revisión</Badge>}
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
          {products?.length ?? 0} productos en el catálogo
        </p>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto', gap: 'var(--sp-3)', padding: 'var(--sp-3) var(--sp-5)', background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <span>Producto</span>
          <span>Precio</span>
          <span>Stock</span>
          <span>Claims</span>
          <span></span>
          <span>Acciones</span>
        </div>

        {(products ?? []).map((product, i) => (
          <div key={product.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto', gap: 'var(--sp-3)', padding: 'var(--sp-4) var(--sp-5)', borderBottom: i < (products?.length ?? 0) - 1 ? '1px solid var(--color-border-subtle)' : 'none', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{product.name}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                {product.compound}{product.format ? ` · ${product.format}` : ''} · {product.brand}
              </div>
            </div>
            <div style={{ fontSize: 'var(--text-sm)', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
              {formatCLP(product.price)}
            </div>
            <Badge color={product.stock_status === 'active' ? 'emerald' : 'red'}>
              {product.stock_status === 'active' ? 'En stock' : 'Sin stock'}
            </Badge>
            <Badge color={CLAIM_COLOR[product.claim_review_status] ?? 'slate'}>
              {CLAIM_LABEL[product.claim_review_status] ?? product.claim_review_status}
            </Badge>
            <div />
            <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
              <form action={toggleProductStock}>
                <input type="hidden" name="id" value={product.id} />
                <input type="hidden" name="status" value={product.stock_status} />
                <button type="submit" style={{ padding: '4px 8px', background: 'var(--color-surface)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {product.stock_status === 'active' ? 'Deshabilitar' : 'Habilitar'}
                </button>
              </form>
              {product.claim_review_status === 'pending' && (
                <>
                  <form action={approveProductClaim}>
                    <input type="hidden" name="id" value={product.id} />
                    <button type="submit" style={{ padding: '4px 8px', background: 'var(--emerald-500)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                      Aprobar
                    </button>
                  </form>
                  <form action={rejectProductClaim}>
                    <input type="hidden" name="id" value={product.id} />
                    <button type="submit" style={{ padding: '4px 8px', background: 'var(--red-50)', color: 'var(--red-700)', border: '1px solid var(--red-200)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                      Rechazar
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
