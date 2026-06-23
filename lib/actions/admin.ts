'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== 'admin') throw new Error('No autorizado');
  return user;
}

export async function verifyProfessional(formData: FormData) {
  const supabase = await createClient();
  await requireAdmin(supabase);
  const id = formData.get('id') as string;
  await supabase.from('professionals').update({ verification_status: 'verified' }).eq('id', id);
  revalidatePath('/admin/profesionales');
}

export async function rejectProfessional(formData: FormData) {
  const supabase = await createClient();
  await requireAdmin(supabase);
  const id = formData.get('id') as string;
  await supabase.from('professionals').update({ verification_status: 'rejected' }).eq('id', id);
  revalidatePath('/admin/profesionales');
}

export async function toggleProductStock(formData: FormData) {
  const supabase = await createClient();
  await requireAdmin(supabase);
  const id = formData.get('id') as string;
  const currentStatus = formData.get('status') as string;
  const newStatus = currentStatus === 'active' ? 'out_of_stock' : 'active';
  await supabase.from('products').update({ stock_status: newStatus }).eq('id', id);
  revalidatePath('/admin/productos');
}

export async function approveProductClaim(formData: FormData) {
  const supabase = await createClient();
  await requireAdmin(supabase);
  const id = formData.get('id') as string;
  await supabase.from('products').update({ claim_review_status: 'approved' }).eq('id', id);
  revalidatePath('/admin/productos');
}

export async function rejectProductClaim(formData: FormData) {
  const supabase = await createClient();
  await requireAdmin(supabase);
  const id = formData.get('id') as string;
  await supabase.from('products').update({ claim_review_status: 'rejected' }).eq('id', id);
  revalidatePath('/admin/productos');
}
