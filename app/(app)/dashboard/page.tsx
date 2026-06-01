import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { LayoutDashboard, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [tasksRes, coursesRes] = await Promise.all([
    supabase.from('tasks').select('*'),
    supabase.from('courses').select('id')
  ])

  const tasks = tasksRes.data || []
  const completedCount = tasks.filter(t => t.status === 'completada').length
  const totalCount = tasks.length
  
  // próximas a vencer (ejemplo simple: pendientes y con fecha)
  const pendingTasks = tasks.filter(t => t.status !== 'completada' && t.due_date)
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 5)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
        <LayoutDashboard className="text-brand-primary" />
        Tablero de {user?.email?.split('@')[0]}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-raised p-6 rounded-xl border border-surface-border shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-2">Total Tareas</span>
          <span className="text-4xl font-bold text-text-primary font-mono">{totalCount}</span>
        </div>
        
        <div className="bg-surface-raised p-6 rounded-xl border border-surface-border shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-2">Completadas</span>
          <span className="text-4xl font-bold text-green-600 font-mono flex items-center gap-2">
            {completedCount} <CheckCircle2 size={28} />
          </span>
        </div>

        <div className="bg-surface-raised p-6 rounded-xl border border-surface-border shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-2">Cursos Activos</span>
          <span className="text-4xl font-bold text-brand-primary font-mono">{coursesRes.data?.length || 0}</span>
        </div>
      </div>

      <h2 className="text-xl font-bold text-text-primary mt-6 border-b border-surface-border pb-2">
        Próximas entregas
      </h2>
      
      <div className="flex flex-col gap-3">
        {pendingTasks.length === 0 ? (
          <div className="p-8 text-center text-text-tertiary bg-surface-raised rounded-lg border border-surface-border">
            No tienes tareas urgentes próximas a vencer. ¡Buen trabajo!
          </div>
        ) : (
          pendingTasks.map(task => (
            <Link key={task.id} href="/tasks" className="bg-surface-raised border border-surface-border p-4 rounded-lg shadow-sm flex items-center justify-between hover:border-brand-primary transition-colors">
              <div className="flex items-center gap-3">
                <Clock className="text-amber-500" size={20} />
                <div>
                  <h3 className="font-medium text-text-primary">{task.title}</h3>
                  <span className="text-xs text-text-secondary flex items-center gap-1 mt-1">
                    <AlertTriangle size={12} />
                    Vence: {task.due_date}
                  </span>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-md border font-medium uppercase ${
                task.priority === 'alta' ? 'bg-red-100 text-red-700 border-red-200' : 
                task.priority === 'media' ? 'bg-amber-100 text-amber-700 border-amber-200' : 
                'bg-green-100 text-green-700 border-green-200'
              }`}>
                {task.priority}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
