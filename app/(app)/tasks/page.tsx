import { createClient } from '@/lib/supabase/server'
import { TaskList } from '@/components/tasks/TaskList'

export default async function TasksPage() {
  const supabase = await createClient()
  
  const [tasksRes, coursesRes] = await Promise.all([
    supabase.from('tasks').select('*').order('created_at', { ascending: false }),
    supabase.from('courses').select('*')
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-text-primary">Gestión de Tareas</h1>
      <TaskList initialTasks={tasksRes.data || []} courses={coursesRes.data || []} />
    </div>
  )
}
