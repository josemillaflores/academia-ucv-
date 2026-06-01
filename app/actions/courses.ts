'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCourse(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const code = formData.get('code') as string
  const color = formData.get('color') as string || '#1F4E79'

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('courses').insert({
    user_id: user.id,
    name,
    code,
    color
  })

  if (error) throw new Error(error.message)
  revalidatePath('/courses')
}

export async function deleteCourse(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('courses').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/courses')
}
