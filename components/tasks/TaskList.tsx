'use client'

import { useOptimistic, useRef, useState, useTransition } from 'react'
import { createTask, deleteTask, updateTaskStatus } from '@/app/actions/tasks'
import { CheckSquare, Trash2, Clock, CheckCircle2, Circle, AlertTriangle } from 'lucide-react'

type Task = {
  id: string
  title: string
  description: string | null
  priority: string
  status: string
  due_date: string | null
  course_id: string | null
}

type Course = {
  id: string
  name: string
  color: string
}

export function TaskList({ initialTasks, courses }: { initialTasks: Task[], courses: Course[] }) {
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)
  
  // Filtros locales
  const [filterCourse, setFilterCourse] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const [optimisticTasks, setOptimisticTasks] = useOptimistic(
    initialTasks,
    (state: Task[], action:
      | { type: 'add'; payload: Task }
      | { type: 'delete'; payload: { id: string } }
      | { type: 'update_status'; payload: { id: string; status: string } }
    ) => {
      switch (action.type) {
        case 'add':
          return [...state, action.payload];
        case 'delete':
          return state.filter(t => t.id !== action.payload.id);
        case 'update_status':
          return state.map(t => t.id === action.payload.id ? { ...t, status: action.payload.status } : t);
        default:
          return state;
      }
    }

  )

  const filteredTasks = optimisticTasks.filter(task => {
    if (filterCourse !== 'all' && task.course_id !== filterCourse) return false
    if (filterStatus !== 'all' && task.status !== filterStatus) return false
    return true
  })

  async function handleAddTask(formData: FormData) {
    const newTask = {
      id: Math.random().toString(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      course_id: formData.get('course_id') as string,
      priority: formData.get('priority') as string,
      due_date: formData.get('due_date') as string,
      status: 'pendiente'
    }
    
    startTransition(() => {
      setOptimisticTasks({ type: 'add', payload: newTask })
    })

    formRef.current?.reset()
    try {
      await createTask(formData)
    } catch (e) {
      console.error(e)
    }
  }

  async function handleDelete(id: string) {
    startTransition(() => {
      setOptimisticTasks({ type: 'delete', payload: { id } })
    })
    try {
      await deleteTask(id)
    } catch (e) {
      console.error(e)
    }
  }

  async function handleStatusChange(id: string, currentStatus: string) {
    const nextStatusMap: Record<string, string> = {
      'pendiente': 'en_progreso',
      'en_progreso': 'completada',
      'completada': 'pendiente'
    }
    const newStatus = nextStatusMap[currentStatus]
    
    startTransition(() => {
      setOptimisticTasks({ type: 'update_status', payload: { id, status: newStatus } })
    })
    try {
      await updateTaskStatus(id, newStatus)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Añadir Tarea */}
      <div className="bg-surface-raised border border-surface-border p-6 rounded-2xl shadow-sm mb-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3 relative z-10 text-text-primary">
          <div className="bg-brand-primary/10 p-2 rounded-lg text-brand-primary">
            <CheckSquare size={24} />
          </div>
          Añadir Nueva Tarea
        </h2>
        <form ref={formRef} action={handleAddTask} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-end relative z-10">
          <div className="flex flex-col gap-2 lg:col-span-2">
            <label className="text-sm font-semibold text-text-secondary">Título de la Tarea</label>
            <input required name="title" className="border border-surface-border rounded-lg px-4 py-3 bg-surface-base focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all outline-none w-full" placeholder="Ej: Entregar reporte final" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-secondary">Curso</label>
            <select name="course_id" className="border border-surface-border rounded-lg px-4 py-3 bg-surface-base focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none w-full">
              <option value="none">Sin curso (General)</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-secondary">Prioridad</label>
            <select name="priority" className="border border-surface-border rounded-lg px-4 py-3 bg-surface-base focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none w-full">
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>
          <div className="flex flex-col gap-2 lg:col-span-2">
            <label className="text-sm font-semibold text-text-secondary">Descripción (opcional)</label>
            <input name="description" className="border border-surface-border rounded-lg px-4 py-3 bg-surface-base focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none w-full" placeholder="Detalles extra, enlaces, notas..." />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-secondary">Fecha Límite</label>
            <input type="date" name="due_date" className="border border-surface-border rounded-lg px-4 py-3 bg-surface-base focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none w-full" />
          </div>
          <button type="submit" disabled={isPending} className="bg-brand-primary text-white font-bold px-8 py-3.5 rounded-lg hover:bg-brand-hover hover:scale-[1.02] active:scale-95 transition-all shadow-md w-full mt-2 lg:mt-0">
            {isPending ? 'Guardando...' : 'GUARDAR TAREA'}
          </button>
        </form>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 items-center bg-surface-base p-4 rounded-md border border-surface-border">
        <span className="text-sm font-medium text-slate-500">Filtros:</span>
        <select value={filterCourse} onChange={e => setFilterCourse(e.target.value)} className="border rounded-md px-2 py-1 text-sm bg-surface-base">
          <option value="all">Todos los cursos</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border rounded-md px-2 py-1 text-sm bg-surface-base">
          <option value="all">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="en_progreso">En Progreso</option>
          <option value="completada">Completadas</option>
        </select>
      </div>

      {/* Lista de Tareas (Data Table) */}
      <div className="bg-white dark:bg-slate-900 border border-surface-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-overlay text-text-secondary font-semibold border-b border-surface-border uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 w-16 text-center">Estado</th>
                <th className="px-6 py-4 w-full">Título de Tarea</th>
                <th className="px-6 py-4">Curso</th>
                <th className="px-6 py-4">Vencimiento</th>
                <th className="px-6 py-4 text-center">Prioridad</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filteredTasks.map((task) => {
                const course = courses.find(c => c.id === task.course_id)
                const priorityColors: Record<string, string> = {
                  'baja': 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400',
                  'media': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400',
                  'alta': 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400'
                }
                const statusIcon = task.status === 'completada' ? <CheckCircle2 size={22} className="text-green-600 mx-auto" /> :
                                   task.status === 'en_progreso' ? <Clock size={22} className="text-blue-600 mx-auto" /> :
                                   <Circle size={22} className="text-slate-400 mx-auto" />

                return (
                  <tr key={task.id} className="hover:bg-surface-raised transition-colors group">
                    <td className="px-6 py-4 text-center align-middle">
                      <button onClick={() => handleStatusChange(task.id, task.status)} className="cursor-pointer hover:scale-110 transition-transform">
                        {statusIcon}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <h3 className={`font-semibold text-base ${task.status === 'completada' ? 'line-through text-slate-400' : 'text-text-primary'}`}>
                        {task.title}
                      </h3>
                      {task.description && <p className="text-sm text-text-secondary mt-1 truncate max-w-md" title={task.description}>{task.description}</p>}
                    </td>
                    <td className="px-6 py-4">
                      {course ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: course.color }}></div>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{course.name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {task.due_date ? (
                        <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                          <AlertTriangle size={14} className={new Date(task.due_date) < new Date() && task.status !== 'completada' ? "text-red-500" : "text-amber-500"} />
                          {task.due_date}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs px-3 py-1.5 rounded-md border font-bold uppercase tracking-wider ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(task.id)} className="text-slate-400 hover:text-red-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-lg transition-all hover:bg-red-50 shadow-sm" title="Eliminar tarea">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                )
              })}
              
              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-text-tertiary">
                    <CheckSquare size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium text-slate-600 dark:text-slate-400">No hay tareas</p>
                    <p className="mt-1">No se encontraron tareas que coincidan con los filtros actuales.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
