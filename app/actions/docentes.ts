'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createDocente(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const specialty = formData.get('specialty') as string

  const { error } = await supabase.from('docentes').insert({
    user_id: user.id,
    name,
    email: email || null,
    specialty: specialty || null
  })

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
