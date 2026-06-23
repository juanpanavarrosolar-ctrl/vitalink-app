'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

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

export async function createPatient(formData: FormData) {
  const supabase = await createClient();
  const professionalId = await getProfessionalId(supabase);

  const name = formData.get('name') as string;
  const email = formData.get('email') as string | null;
  const phone = formData.get('phone') as string | null;
  const birthYear = formData.get('birth_year') as string | null;

  if (!name?.trim()) return { error: 'El nombre es obligatorio' };

  const { error } = await supabase.from('patients').insert({
    professional_id: professionalId,
    name: name.trim(),
    email: email?.trim() || null,
    phone: phone?.trim() || null,
    birth_year: birthYear ? parseInt(birthYear) : null,
  });

  if (error) return { error: error.message };

  revalidatePath('/patients');
  return { success: true };
}

export async function updatePatient(id: string, formData: FormData) {
  const supabase = await createClient();
  await getProfessionalId(supabase);

  const name = formData.get('name') as string;
  const email = formData.get('email') as string | null;
  const phone = formData.get('phone') as string | null;

  if (!name?.trim()) return { error: 'El nombre es obligatorio' };

  const { error } = await supabase
    .from('patients')
    .update({
      name: name.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
    })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/patients');
  return { success: true };
}

export async function deletePatient(id: string) {
  const supabase = await createClient();
  await getProfessionalId(supabase);

  const { error } = await supabase.from('patients').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/patients');
  return { success: true };
}
