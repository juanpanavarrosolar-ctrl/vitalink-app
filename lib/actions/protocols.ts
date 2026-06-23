'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { sendProtocolLink } from '@/lib/email';

async function getProfessionalId(supabase: Awaited<ReturnType<typeof createClient>>): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');

  const { data: pro, error } = await supabase
    .from('professionals')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (error || !pro) throw new Error('Perfil profesional no encontrado');
  return pro.id;
}

export async function createProtocol(formData: FormData) {
  const supabase = await createClient();
  const professionalId = await getProfessionalId(supabase);

  const title = formData.get('title') as string;
  const patientId = formData.get('patient_id') as string;
  const notes = formData.get('notes') as string | null;
  const durationDays = formData.get('duration_days') as string | null;

  if (!title?.trim()) return { error: 'El título es obligatorio' };
  if (!patientId) return { error: 'Selecciona un paciente' };

  const { data: plan, error } = await supabase
    .from('plans')
    .insert({
      professional_id: professionalId,
      patient_id: patientId,
      title: title.trim(),
      notes: notes?.trim() || null,
      duration_days: durationDays ? parseInt(durationDays) : 90,
      status: 'draft',
    })
    .select('id, public_token')
    .single();

  if (error || !plan) return { error: error?.message ?? 'Error al crear el protocolo' };

  revalidatePath('/protocols');
  return { success: true, planId: plan.id, token: plan.public_token };
}

export async function addProductToPlan(planId: string, formData: FormData) {
  const supabase = await createClient();
  await getProfessionalId(supabase);

  const productId = formData.get('product_id') as string;
  const quantity = parseInt(formData.get('quantity') as string ?? '1');
  const instructions = formData.get('instructions') as string | null;
  const frequency = formData.get('frequency') as string | null;
  const durationDays = parseInt(formData.get('duration_days') as string ?? '90');

  if (!productId) return { error: 'Selecciona un producto' };

  const { error } = await supabase.from('plan_items').insert({
    plan_id: planId,
    product_id: productId,
    quantity,
    instructions: instructions?.trim() || null,
    frequency: frequency?.trim() || null,
    duration_days: durationDays,
  });

  if (error) return { error: error.message };

  revalidatePath(`/protocols/${planId}`);
  return { success: true };
}

export async function removeProductFromPlan(itemId: string, planId: string) {
  const supabase = await createClient();
  await getProfessionalId(supabase);

  const { error } = await supabase.from('plan_items').delete().eq('id', itemId);
  if (error) return { error: error.message };

  revalidatePath(`/protocols/${planId}`);
  return { success: true };
}

export async function publishProtocol(planId: string) {
  const supabase = await createClient();
  await getProfessionalId(supabase);

  const { data: plan, error } = await supabase
    .from('plans')
    .update({ status: 'sent' })
    .eq('id', planId)
    .select('public_token, title, patients(name, email)')
    .single();

  if (error || !plan) return { error: error?.message ?? 'Error al publicar el protocolo' };

  revalidatePath(`/protocols/${planId}`);
  revalidatePath('/protocols');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';
  const patient = (plan.patients as any);
  if (patient?.email) {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: pro } = await supabase
      .from('professionals')
      .select('full_name')
      .eq('user_id', user?.id ?? '')
      .single();
    await sendProtocolLink({
      to: patient.email,
      patientName: patient.name ?? 'Paciente',
      professionalName: pro?.full_name ?? 'Tu nutricionista',
      protocolName: plan.title,
      link: `${appUrl}/p/${plan.public_token}`,
    });
  }

  return { success: true, token: plan.public_token };
}

export async function updateProtocolNotes(planId: string, notes: string) {
  const supabase = await createClient();
  await getProfessionalId(supabase);

  const { error } = await supabase
    .from('plans')
    .update({ notes: notes.trim() || null })
    .eq('id', planId);

  if (error) return { error: error.message };

  revalidatePath(`/protocols/${planId}`);
  return { success: true };
}

export async function deleteProtocol(planId: string) {
  const supabase = await createClient();
  await getProfessionalId(supabase);

  const { error } = await supabase.from('plans').delete().eq('id', planId);
  if (error) return { error: error.message };

  revalidatePath('/protocols');
  redirect('/protocols');
}
