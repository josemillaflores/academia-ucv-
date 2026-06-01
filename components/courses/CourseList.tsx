'use client'

import { useOptimistic, useRef, useTransition } from 'react'
import { createCourse, deleteCourse } from '@/app/actions/courses'
import { BookOpen, Trash2 } from 'lucide-react'

type Course = {
  id: string
  name: string
  code: string | null
  color: string
}

export function CourseList({ initialCourses }: { initialCourses: Course[] }) {
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  const [optimisticCourses, addOptimisticCourse] = useOptimistic(
    initialCourses,
    (state: Course[], newCourse: Course | { id: string, delete: boolean }) => {
      if ('delete' in newCourse) {
        return state.filter(c => c.id !== newCourse.id)
      }
      return [...state, newCourse as Course]
    }
  )

  async function handleAddCourse(formData: FormData) {
    const newCourse = {
      id: Math.random().toString(), // fake ID for optimistic UI
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      color: formData.get('color') as string || '#1F4E79',
    }
    
    startTransition(() => {
      addOptimisticCourse(newCourse)
    })

    formRef.current?.reset()
    try {
      await createCourse(formData)
    } catch (e) {
      console.error(e)
      // ideally add sonner toast here for error
    }
  }

  async function handleDelete(id: string) {
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
          Añadir Nuevo Curso
        </h2>
        <form ref={formRef} action={handleAddCourse} className="flex flex-col lg:flex-row gap-5 items-start lg:items-end relative z-10">
          <div className="flex flex-col gap-2 w-full lg:flex-1">
            <label className="text-sm font-semibold text-text-secondary">Nombre del Curso</label>
            <input required name="name" className="border border-surface-border rounded-lg px-4 py-3 bg-surface-base focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all outline-none w-full" placeholder="Ej: Inteligencia Artificial" />
          </div>
          <div className="flex flex-col gap-2 w-full lg:w-48">
            <label className="text-sm font-semibold text-text-secondary">Código (opcional)</label>
            <input name="code" className="border border-surface-border rounded-lg px-4 py-3 bg-surface-base focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all outline-none w-full" placeholder="Ej: IA-101" />
          </div>
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <label className="text-sm font-semibold text-text-secondary">Color</label>
            <input type="color" name="color" defaultValue="#002D72" className="h-[50px] w-full sm:w-16 rounded-lg cursor-pointer border border-surface-border p-1 bg-surface-base" />
          </div>
          <button type="submit" disabled={isPending} className="bg-brand-primary text-white font-bold px-8 py-3.5 rounded-lg hover:bg-brand-hover hover:scale-[1.02] active:scale-95 transition-all shadow-md w-full lg:w-auto mt-2 lg:mt-0">
            {isPending ? 'Guardando...' : 'GUARDAR CURSO'}
          </button>
        </form>
      </div>

      {/* Lista de Cursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {optimisticCourses.map((course) => (
          <div key={course.id} className="bg-surface-raised border border-surface-border p-4 rounded-lg shadow-sm flex flex-col justify-between h-32">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="font-semibold truncate pr-2" title={course.name}>{course.name}</h3>
                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: course.color }}></div>
              </div>
              <p className="text-sm text-text-secondary mt-1 font-mono">{course.code || 'Sin código'}</p>
            </div>
            
            <div className="flex justify-end mt-4">
              <button onClick={() => handleDelete(course.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1" title="Eliminar curso">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {optimisticCourses.length === 0 && (
          <div className="col-span-full py-12 text-center text-text-tertiary flex flex-col items-center justify-center border-2 border-dashed border-surface-border rounded-lg">
            <BookOpen size={48} className="mb-4 opacity-20" />
            <p>Aún no tienes cursos.</p>
            <p className="text-sm mt-1">Crea tu primer curso arriba para empezar.</p>
          </div>
        )}
      </div>
    </div>
  )
}
