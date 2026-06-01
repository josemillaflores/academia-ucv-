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
      <div className="bg-surface-raised border border-surface-border p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BookOpen size={20} className="text-brand-primary" />
          Añadir Nuevo Curso
        </h2>
        <form ref={formRef} action={handleAddCourse} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex flex-col gap-1 w-full md:w-auto flex-1">
            <label className="text-sm font-medium">Nombre</label>
            <input required name="name" className="border rounded-md px-3 py-2 bg-surface-base" placeholder="Ej: Inteligencia Artificial" />
          </div>
          <div className="flex flex-col gap-1 w-full md:w-auto">
            <label className="text-sm font-medium">Código</label>
            <input name="code" className="border rounded-md px-3 py-2 bg-surface-base" placeholder="Ej: IA-101" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Color</label>
            <input type="color" name="color" defaultValue="#1F4E79" className="h-10 w-14 rounded-md cursor-pointer" />
          </div>
          <button type="submit" disabled={isPending} className="bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-brand-hover transition-colors w-full md:w-auto">
            Guardar
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
