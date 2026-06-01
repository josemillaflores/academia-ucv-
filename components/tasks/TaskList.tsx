'use client'

import { useOptimistic, useRef, useState, useTransition } from 'react'
import { createTask, deleteTask, updateTaskStatus } from '@/app/actions/tasks'
import { CheckSquare, Circle, CheckCircle2, Clock, Trash2, AlertTriangle, Pencil, X } from 'lucide-react'

type Course = {
  id: string
  name: string
  color: string
}

type Task = {
  id: string
  title: string
  description: string | null
  course_id: string | null
  priority: string
  status: string
  due_date: string | null
}

export function TaskList({ initialTasks, courses }: { initialTasks: Task[], courses: Course[] }) {
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)
  const [filter, setFilter] = useState('todas')
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const [optimisticTasks, setOptimisticTask] = useOptimistic(
    initialTasks,
    (state: Task[], action: { type: 'add' | 'delete' | 'status' | 'update', payload: any }) => {
      switch (action.type) {
        case 'add':
          return [...state, action.payload]
        case 'delete':
          return state.filter(t => t.id !== action.payload)
        case 'status':
          return state.map(t => t.id === action.payload.id ? { ...t, status: action.payload.status } : t)
        case 'update':
          return state.map(t => t.id === action.payload.id ? action.payload : t)
        default:
          return state
      }
    }
  )

  async function handleAddOrUpdateTask(formData: FormData) {
    const isUpdate = !!formData.get('id')
    const taskData = {
      id: isUpdate ? formData.get('id') as string : Math.random().toString(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      course_id: formData.get('course_id') as string,
      priority: formData.get('priority') as string,
      status: isUpdate && editingTask ? editingTask.status : 'pendiente',
      due_date: formData.get('due_date') as string,
    }
    
    startTransition(() => {
      if (isUpdate) {
        setOptimisticTask({ type: 'update', payload: taskData })
      } else {
        setOptimisticTask({ type: 'add', payload: taskData })
      }
    })

    formRef.current?.reset()
    setEditingTask(null)
    
    try {
      await createTask(formData)
    } catch (e) {
      console.error(e)
    }
  }

  async function handleDelete(id: string) {
    if (editingTask?.id === id) setEditingTask(null)
    startTransition(() => {
      setOptimisticTask({ type: 'delete', payload: id })
    })
    try {
      await deleteTask(id)
    } catch (e) {
      console.error(e)
    }
  }

  async function handleStatusChange(id: string, currentStatus: string) {
    const nextStatus = currentStatus === 'pendiente' ? 'en_progreso' : 
                       currentStatus === 'en_progreso' ? 'completada' : 'pendiente'
    
    startTransition(() => {
      setOptimisticTask({ type: 'status', payload: { id, status: nextStatus } })
    })
    try {
      await updateTaskStatus(id, nextStatus)
    } catch (e) {
      console.error(e)
    }
  }

  const filteredTasks = optimisticTasks.filter(task => {
    if (filter === 'pendientes') return task.status !== 'completada'
    if (filter === 'completadas') return task.status === 'completada'
    return true
  }).sort((a, b) => {
    if (a.status === 'completada' && b.status !== 'completada') return 1
    if (a.status !== 'completada' && b.status === 'completada') return -1
    return 0
  })

  return (
    <div className="flex flex-col gap-8">
      {/* Añadir / Editar Tarea */}
      <div className="bg-surface-raised border border-surface-border p-6 rounded-2xl shadow-sm mb-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3 relative z-10 text-text-primary">
          <div className="bg-brand-primary/10 p-2 rounded-lg text-brand-primary">
            <CheckSquare size={24} />
          </div>
          {editingTask ? 'Editar Tarea' : 'Añadir Nueva Tarea'}
        </h2>
        <form ref={formRef} action={handleAddOrUpdateTask} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-end relative z-10">
          {editingTask && <input type="hidden" name="id" value={editingTask.id} />}
          <div className="flex flex-col gap-2 lg:col-span-2">
            <label className="text-sm font-semibold text-text-secondary">Título de la Tarea</label>
            <input required name="title" defaultValue={editingTask?.title || ''} className="border border-surface-border rounded-lg px-4 py-3 bg-surface-base focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all outline-none w-full" placeholder="Ej: Entregar reporte final" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-secondary">Curso</label>
            <select name="course_id" defaultValue={editingTask?.course_id || 'none'} key={editingTask ? editingTask.id : 'new-course'} className="border border-surface-border rounded-lg px-4 py-3 bg-surface-base focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none w-full">
              <option value="none">Sin curso (General)</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-secondary">Prioridad</label>
            <select name="priority" defaultValue={editingTask?.priority || 'media'} key={editingTask ? editingTask.id : 'new-prio'} className="border border-surface-border rounded-lg px-4 py-3 bg-surface-base focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none w-full">
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>
          <div className="flex flex-col gap-2 lg:col-span-2">
            <label className="text-sm font-semibold text-text-secondary">Descripción (opcional)</label>
            <input name="description" defaultValue={editingTask?.description || ''} className="border border-surface-border rounded-lg px-4 py-3 bg-surface-base focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none w-full" placeholder="Detalles extra, enlaces, notas..." />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-secondary">Fecha Límite</label>
            <input type="date" name="due_date" defaultValue={editingTask?.due_date || ''} className="border border-surface-border rounded-lg px-4 py-3 bg-surface-base focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none w-full" />
          </div>
          <div className="flex gap-2 w-full mt-2 lg:mt-0">
            {editingTask && (
              <button type="button" onClick={() => { setEditingTask(null); formRef.current?.reset(); }} className="bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold px-4 py-3.5 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-all shadow-md">
                <X size={20} />
              </button>
            )}
            <button type="submit" disabled={isPending} className="bg-brand-primary text-white font-bold px-8 py-3.5 rounded-lg hover:bg-brand-hover hover:scale-[1.02] active:scale-95 transition-all shadow-md flex-1 lg:flex-none">
              {isPending ? 'Guardando...' : (editingTask ? 'ACTUALIZAR' : 'GUARDAR TAREA')}
            </button>
          </div>
        </form>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        <button onClick={() => setFilter('todas')} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'todas' ? 'bg-brand-primary text-white' : 'bg-surface-raised text-text-secondary hover:bg-surface-border'}`}>
          Todas
        </button>
        <button onClick={() => setFilter('pendientes')} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'pendientes' ? 'bg-brand-primary text-white' : 'bg-surface-raised text-text-secondary hover:bg-surface-border'}`}>
          Pendientes
        </button>
        <button onClick={() => setFilter('completadas')} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'completadas' ? 'bg-brand-primary text-white' : 'bg-surface-raised text-text-secondary hover:bg-surface-border'}`}>
          Completadas
        </button>
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
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingTask(task)} className="text-slate-400 hover:text-brand-primary bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-lg transition-all hover:bg-brand-subtle dark:hover:bg-brand-hover/20 shadow-sm" title="Editar tarea">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => handleDelete(task.id)} className="text-slate-400 hover:text-red-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-lg transition-all hover:bg-red-50 dark:hover:bg-red-950/30 shadow-sm" title="Eliminar tarea">
                          <Trash2 size={18} />
                        </button>
                      </div>
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
