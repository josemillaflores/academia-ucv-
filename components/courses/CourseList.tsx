'use client'

import { useOptimistic, useRef, useState, useTransition } from 'react'
import { createCourse, deleteCourse } from '@/app/actions/courses'
import { BookOpen, Trash2, Pencil, X } from 'lucide-react'

type Course = {
  id: string
  name: string
  code: string | null
  color: string
}

export function CourseList({ initialCourses }: { initialCourses: Course[] }) {
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

  const [optimisticCourses, addOptimisticCourse] = useOptimistic(
    initialCourses,
    (state: Course[], newCourse: Course | { id: string, delete: boolean }) => {
      if ('delete' in newCourse) {
        return state.filter(c => c.id !== newCourse.id)
      }
      
      const existingIndex = state.findIndex(c => c.id === (newCourse as Course).id)
      if (existingIndex >= 0) {
        const newState = [...state]
        newState[existingIndex] = newCourse as Course
        return newState
      }
      return [...state, newCourse as Course]
    }
  )

  async function handleAddOrUpdateCourse(formData: FormData) {
    const isUpdate = !!formData.get('id')
    const courseData = {
      id: isUpdate ? formData.get('id') as string : Math.random().toString(),
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      color: formData.get('color') as string || '#002D72',
    }
    
    startTransition(() => {
      addOptimisticCourse(courseData)
    })

    formRef.current?.reset()
    setEditingCourse(null)
    
    try {
      await createCourse(formData)
    } catch (e) {
      console.error(e)
    }
  }

  async function handleDelete(id: string) {
    if (editingCourse?.id === id) setEditingCourse(null)
    startTransition(() => {
      addOptimisticCourse({ id, delete: true })
    })
    try {
      await deleteCourse(id)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Nuevo Curso */}
      <div className="bg-surface-raised border border-surface-border p-6 rounded-2xl shadow-sm mb-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3 relative z-10 text-text-primary">
          <div className="bg-brand-primary/10 p-2 rounded-lg text-brand-primary">
            <BookOpen size={24} />
          </div>
          {editingCourse ? 'Editar Curso' : 'Añadir Nuevo Curso'}
        </h2>
        <form ref={formRef} action={handleAddOrUpdateCourse} className="flex flex-col lg:flex-row gap-5 items-start lg:items-end relative z-10">
          {editingCourse && <input type="hidden" name="id" value={editingCourse.id} />}
          <div className="flex flex-col gap-2 w-full lg:flex-1">
            <label className="text-sm font-semibold text-text-secondary">Nombre del Curso</label>
            <input required name="name" defaultValue={editingCourse?.name || ''} className="border border-surface-border rounded-lg px-4 py-3 bg-surface-base focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all outline-none w-full" placeholder="Ej: Inteligencia Artificial" />
          </div>
          <div className="flex flex-col gap-2 w-full lg:w-48">
            <label className="text-sm font-semibold text-text-secondary">Código (opcional)</label>
            <input name="code" defaultValue={editingCourse?.code || ''} className="border border-surface-border rounded-lg px-4 py-3 bg-surface-base focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all outline-none w-full" placeholder="Ej: IA-101" />
          </div>
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <label className="text-sm font-semibold text-text-secondary">Color</label>
            <input type="color" name="color" defaultValue={editingCourse?.color || '#002D72'} key={editingCourse ? editingCourse.id : 'new'} className="h-[50px] w-full sm:w-16 rounded-lg cursor-pointer border border-surface-border p-1 bg-surface-base" />
          </div>
          <div className="flex gap-2 w-full lg:w-auto mt-2 lg:mt-0">
            {editingCourse && (
              <button type="button" onClick={() => { setEditingCourse(null); formRef.current?.reset(); }} className="bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold px-4 py-3.5 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-all shadow-md">
                <X size={20} />
              </button>
            )}
            <button type="submit" disabled={isPending} className="bg-brand-primary text-white font-bold px-8 py-3.5 rounded-lg hover:bg-brand-hover hover:scale-[1.02] active:scale-95 transition-all shadow-md flex-1 lg:flex-none">
              {isPending ? 'Guardando...' : (editingCourse ? 'ACTUALIZAR' : 'GUARDAR CURSO')}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Cursos (Data Table) */}
      <div className="bg-white dark:bg-slate-900 border border-surface-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-overlay text-text-secondary font-semibold border-b border-surface-border uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Color</th>
                <th className="px-6 py-4">Código</th>
                <th className="px-6 py-4 w-full">Nombre del Curso</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {optimisticCourses.map((course) => (
                <tr key={course.id} className="hover:bg-surface-raised transition-colors group">
                  <td className="px-6 py-4">
                    <div className="w-6 h-6 rounded-md shadow-sm border border-slate-200 dark:border-slate-700" style={{ backgroundColor: course.color }}></div>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-500">{course.code || '-'}</td>
                  <td className="px-6 py-4 font-medium text-text-primary text-base">{course.name}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditingCourse(course)} className="text-slate-400 hover:text-brand-primary bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-lg transition-all hover:bg-brand-subtle dark:hover:bg-brand-hover/20 shadow-sm" title="Editar curso">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => handleDelete(course.id)} className="text-slate-400 hover:text-red-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-lg transition-all hover:bg-red-50 dark:hover:bg-red-950/30 shadow-sm" title="Eliminar curso">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {optimisticCourses.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-text-tertiary">
                    <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium text-slate-600 dark:text-slate-400">Sin cursos registrados</p>
                    <p className="mt-1">Crea tu primer curso usando el formulario de arriba.</p>
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
