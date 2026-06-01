'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCourse(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const id = formData.get('id') as string | null
  const name = formData.get('name') as string
  const code = formData.get('code') as string
  const color = formData.get('color') as string

  const courseData = {
    user_id: user.id,
    name,
    code: code || null,
    color: color || '#1F4E79'
  }

  let error;
  if (id) {
    const res = await supabase.from('courses').update(courseData).eq('id', id)
    error = res.error
  } else {
    const res = await supabase.from('courses').insert(courseData)
    error = res.error
  }

  if (error) throw new Error(error.message)
  revalidatePath('/courses')
  revalidatePath('/dashboard')
}

export async function deleteCourse(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('courses').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/courses')
}
