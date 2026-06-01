import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { LayoutDashboard, CheckCircle2, Clock, AlertTriangle, Plus, BookOpen, CheckSquare, Users } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [tasksRes, coursesRes, docentesRes] = await Promise.all([
    supabase.from('tasks').select('*'),
    supabase.from('courses').select('id'),
    supabase.from('docentes').select('id')
  ])

  const tasks = tasksRes.data || []
  const completedCount = tasks.filter(t => t.status === 'completada').length
  const totalCount = tasks.length
  
  // próximas a vencer (ejemplo simple: pendientes y con fecha)
  const pendingTasks = tasks.filter(t => t.status !== 'completada' && t.due_date)
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 5)

  return (
    <div className="flex flex-col gap-8">
      {/* Header Premium */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        <h1 className="text-3xl font-bold flex items-center gap-3 relative z-10">
          <LayoutDashboard className="text-white opacity-90" size={32} />
          Bienvenido, {user?.email?.split('@')[0]}
        </h1>
        <p className="text-brand-subtle mt-2 relative z-10 text-lg">Aquí tienes el resumen de tu actividad académica.</p>
      </div>

      {/* Tarjetas Estadísticas (Glassmorphism inspired) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-raised p-6 rounded-xl border border-surface-border shadow-sm flex flex-col justify-center relative overflow-hidden group hover:border-brand-primary transition-colors">
          <div className="absolute right-[-10%] top-[-10%] w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          <span className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-1 flex items-center gap-2">
            <CheckSquare size={16} /> Total Tareas
          </span>
          <span className="text-4xl font-bold text-text-primary">{totalCount}</span>
        </div>
        
        <div className="bg-surface-raised p-6 rounded-xl border border-surface-border shadow-sm flex flex-col justify-center relative overflow-hidden group hover:border-green-500 transition-colors">
          <div className="absolute right-[-10%] top-[-10%] w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          <span className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-1 flex items-center gap-2">
            <CheckCircle2 size={16} /> Completadas
          </span>
          <span className="text-4xl font-bold text-green-600">{completedCount}</span>
        </div>

        <div className="bg-surface-raised p-6 rounded-xl border border-surface-border shadow-sm flex flex-col justify-center relative overflow-hidden group hover:border-brand-secondary transition-colors">
          <div className="absolute right-[-10%] top-[-10%] w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          <span className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-1 flex items-center gap-2">
            <BookOpen size={16} /> Cursos
          </span>
          <span className="text-4xl font-bold text-brand-secondary">{coursesRes.data?.length || 0}</span>
        </div>

        <div className="bg-surface-raised p-6 rounded-xl border border-surface-border shadow-sm flex flex-col justify-center relative overflow-hidden group hover:border-amber-500 transition-colors">
          <div className="absolute right-[-10%] top-[-10%] w-24 h-24 bg-amber-100 dark:bg-amber-900/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          <span className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-1 flex items-center gap-2">
            <Users size={16} /> Docentes
          </span>
          <span className="text-4xl font-bold text-amber-500">{docentesRes.data?.length || 0}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Acciones Rápidas */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-text-primary border-b border-surface-border pb-2">
            Acciones Rápidas
          </h2>
          <Link href="/tasks" className="flex items-center justify-between bg-brand-primary text-white p-4 rounded-xl shadow-md hover:bg-brand-hover hover:scale-[1.02] transition-all">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg"><CheckSquare size={20} /></div>
              <span className="font-semibold">Añadir Tarea</span>
            </div>
            <Plus size={20} />
          </Link>
          <Link href="/courses" className="flex items-center justify-between bg-brand-secondary text-white p-4 rounded-xl shadow-md hover:opacity-90 hover:scale-[1.02] transition-all">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg"><BookOpen size={20} /></div>
              <span className="font-semibold">Nuevo Curso</span>
            </div>
            <Plus size={20} />
          </Link>
          <Link href="/docentes" className="flex items-center justify-between bg-slate-800 text-white p-4 rounded-xl shadow-md hover:bg-slate-700 hover:scale-[1.02] transition-all dark:bg-slate-700 dark:hover:bg-slate-600">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg"><Users size={20} /></div>
              <span className="font-semibold">Añadir Docente</span>
            </div>
            <Plus size={20} />
          </Link>
        </div>

        {/* Próximas entregas */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-text-primary border-b border-surface-border pb-2">
            Próximas entregas
          </h2>
          
          <div className="flex flex-col gap-3">
            {pendingTasks.length === 0 ? (
              <div className="p-8 text-center text-text-tertiary bg-surface-raised rounded-xl border border-surface-border shadow-sm flex flex-col items-center justify-center">
                <CheckCircle2 size={48} className="mb-4 text-green-500 opacity-50" />
                <p className="text-lg font-medium">¡Al día!</p>
                <p className="text-sm">No tienes tareas urgentes próximas a vencer.</p>
              </div>
            ) : (
              pendingTasks.map(task => (
                <Link key={task.id} href="/tasks" className="bg-white dark:bg-slate-900 border border-surface-border p-4 rounded-xl shadow-sm flex items-center justify-between hover:border-brand-primary hover:shadow-md transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 dark:bg-slate-800 text-slate-500 p-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 group-hover:scale-105 group-hover:text-brand-primary group-hover:bg-brand-subtle transition-all">
                      <Clock size={20} />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-bold text-text-primary text-base">{task.title}</h3>
                      <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5 font-medium">
                        <AlertTriangle size={14} className={new Date(task.due_date!) < new Date() ? "text-red-500" : "text-amber-500"} />
                        Vence: {task.due_date}
                      </span>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide flex items-center gap-1 ${
                    task.priority === 'alta' ? 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30' : 
                    task.priority === 'media' ? 'bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30' : 
                    'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      task.priority === 'alta' ? 'bg-red-500' : 
                      task.priority === 'media' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}></span>
                    {task.priority}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
