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
      <div className="bg-surface-raised border border-surface-border p-4 md:p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckSquare size={20} className="text-brand-primary" />
          Nueva Tarea
        </h2>
        <form ref={formRef} action={handleAddTask} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="flex flex-col gap-1 lg:col-span-2">
            <label className="text-sm font-medium">Título</label>
            <input required name="title" className="border rounded-md px-3 py-2 bg-surface-base" placeholder="Ej: Entregar reporte" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Curso</label>
            <select name="course_id" className="border rounded-md px-3 py-2 bg-surface-base">
              <option value="none">Sin curso</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Prioridad</label>
            <select name="priority" className="border rounded-md px-3 py-2 bg-surface-base">
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 lg:col-span-2">
            <label className="text-sm font-medium">Descripción (opcional)</label>
            <input name="description" className="border rounded-md px-3 py-2 bg-surface-base" placeholder="Detalles extra..." />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Fecha límite</label>
            <input type="date" name="due_date" className="border rounded-md px-3 py-2 bg-surface-base" />
          </div>
          <button type="submit" disabled={isPending} className="bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-brand-hover transition-colors">
            Añadir Tarea
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

      {/* Lista de Tareas */}
      <div className="flex flex-col gap-3">
        {filteredTasks.length === 0 && (
          <div className="py-12 text-center text-text-tertiary">
            <CheckSquare size={48} className="mx-auto mb-4 opacity-20" />
            <p>No hay tareas que coincidan con los filtros.</p>
          </div>
        )}
        {filteredTasks.map((task) => {
          const course = courses.find(c => c.id === task.course_id)
          const priorityColors: Record<string, string> = {
            'baja': 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400',
            'media': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400',
            'alta': 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400'
          }
          const statusIcon = task.status === 'completada' ? <CheckCircle2 size={20} className="text-green-600" /> :
                             task.status === 'en_progreso' ? <Clock size={20} className="text-blue-600" /> :
                             <Circle size={20} className="text-slate-400" />

          return (
            <div key={task.id} className="bg-surface-raised border border-surface-border p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <button onClick={() => handleStatusChange(task.id, task.status)} className="mt-1 flex-shrink-0 cursor-pointer hover:scale-110 transition-transform">
                  {statusIcon}
                </button>
                <div className="flex-1">
                  <h3 className={`font-medium ${task.status === 'completada' ? 'line-through text-slate-400' : 'text-text-primary'}`}>
                    {task.title}
                  </h3>
                  {task.description && <p className="text-sm text-text-secondary mt-1">{task.description}</p>}
                  
                  <div className="flex flex-wrap gap-2 mt-3 items-center">
                    {course && (
                      <span className="text-xs px-2 py-1 rounded-md bg-surface-overlay flex items-center gap-1 border border-surface-border">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: course.color }}></div>
                        {course.name}
                      </span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded-md border font-medium ${priorityColors[task.priority]}`}>
                      {task.priority.toUpperCase()}
                    </span>
                    {task.due_date && (
                      <span className="text-xs px-2 py-1 rounded-md text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 flex items-center gap-1">
                        <AlertTriangle size={12} />
                        Vence: {task.due_date}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end border-t sm:border-t-0 pt-3 sm:pt-0 sm:pl-3 sm:border-l border-surface-border">
                <button onClick={() => handleDelete(task.id)} className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
