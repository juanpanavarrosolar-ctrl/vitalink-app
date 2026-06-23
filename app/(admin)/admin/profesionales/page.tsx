import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { formatDate } from '@/lib/utils';
import { verifyProfessional, rejectProfessional } from '@/lib/actions/admin';
import type { BadgeColor } from '@/lib/types';

const STATUS_COLOR: Record<string, BadgeColor> = {
  pending: 'amber', verified: 'emerald', rejected: 'red', suspended: 'slate',
};
const STATUS_LABEL: Record<string, string> = {
  pending: 'Pendiente', verified: 'Verificado', rejected: 'Rechazado', suspended: 'Suspendido',
};

export default async function AdminProfessionalsPage() {
  const supabase = await createClient();

  const { data: professionals } = await supabase
    .from('professionals')
    .select('id, full_name, profession, specialty, license_number, verification_status, created_at, users(email)')
    .order('created_at', { ascending: false });

  const pending = professionals?.filter(p => p.verification_status === 'pending').length ?? 0;

  return (
    <div style={{ padding: 'var(--sp-8)', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--sp-6)', animation: 'fadeInDown var(--duration-enter) var(--ease-out) both' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: '-0.02em' }}>Profesionales</h1>
          {pending > 0 && <Badge color="amber">{pending} pendientes</Badge>}
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
          {professionals?.length ?? 0} profesionales registrados
        </p>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr auto', gap: 'var(--sp-4)', padding: 'var(--sp-3) var(--sp-5)', background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <span>Profesional</span>
          <span>Especialidad</span>
          <span>Registrado</span>
          <span>Estado</span>
          <span>Acciones</span>
        </div>

        {(professionals ?? []).map((pro, i) => (
          <div key={pro.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr auto', gap: 'var(--sp-4)', padding: 'var(--sp-4) var(--sp-5)', borderBottom: i < (professionals?.length ?? 0) - 1 ? '1px solid var(--color-border-subtle)' : 'none', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{pro.full_name}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                {(pro.users as any)?.email ?? '—'}
              </div>
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              {pro.specialty ?? pro.profession ?? '—'}
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              {formatDate(pro.created_at)}
            </div>
            <Badge color={STATUS_COLOR[pro.verification_status] ?? 'slate'}>
              {STATUS_LABEL[pro.verification_status] ?? pro.verification_status}
            </Badge>
            <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
              {pro.verification_status === 'pending' && (
                <>
                  <form action={verifyProfessional}>
                    <input type="hidden" name="id" value={pro.id} />
                    <button type="submit" style={{ padding: '4px 10px', background: 'var(--emerald-500)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                      Verificar
                    </button>
                  </form>
                  <form action={rejectProfessional}>
                    <input type="hidden" name="id" value={pro.id} />
                    <button type="submit" style={{ padding: '4px 10px', background: 'var(--red-50)', color: 'var(--red-700)', border: '1px solid var(--red-200)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                      Rechazar
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        ))}

        {(professionals ?? []).length === 0 && (
          <div style={{ padding: 'var(--sp-10)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            <Icon name="users" size={28} style={{ margin: '0 auto var(--sp-3)', color: 'var(--color-text-tertiary)' }} />
            No hay profesionales registrados.
          </div>
        )}
      </div>
    </div>
  );
}
