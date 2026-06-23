import { createClient } from '@/lib/supabase/server';
import { CatalogView } from './catalog-view';

export default async function CatalogPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from('products')
    .select('id, name, brand, compound, format, dosage, unit_count, price, stock_status, claim_review_status, description_safe')
    .eq('stock_status', 'active')
    .order('name');

  return <CatalogView products={products ?? []} />;
}
