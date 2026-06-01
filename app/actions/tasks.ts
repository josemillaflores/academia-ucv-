'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTask(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const id = formData.get('id') as string | null
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const priority = formData.get('priority') as string
  const due_date = formData.get('due_date') as string
  const course_id_str = formData.get('course_id') as string
  const course_id = course_id_str === 'none' ? null : course_id_str

  const taskData = {
    user_id: user.id,
    title,
    description: description || null,
    priority: priority || 'media',
    due_date: due_date || null,
    course_id: course_id || null,
  }

  let error;
  if (id) {
    const res = await supabase.from('tasks').update(taskData).eq('id', id)
    error = res.error
  } else {
    const res = await supabase.from('tasks').insert(taskData)
    error = res.error
  }

  if (error) throw new Error(error.message)
  revalidatePath('/tasks')
  revalidatePath('/dashboard')
}

export async function updateTaskStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('tasks').update({ status }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/tasks')
  revalidatePath('/dashboard')
}

export async function deleteTask(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/tasks')
  revalidatePath('/dashboard')
}
