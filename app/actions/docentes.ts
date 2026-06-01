'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createDocente(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const id = formData.get('id') as string | null
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const specialty = formData.get('specialty') as string

  const docenteData = {
    user_id: user.id,
    name,
    email: email || null,
    specialty: specialty || null
  }

  let error;
  if (id) {
    const res = await supabase.from('docentes').update(docenteData).eq('id', id)
    error = res.error
  } else {
    const res = await supabase.from('docentes').insert(docenteData)
    error = res.error
  }

  if (error) throw new Error(error.message)
  revalidatePath('/docentes')
  revalidatePath('/dashboard')
}

export async function deleteDocente(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('docentes').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/docentes')
  revalidatePath('/dashboard')
}
