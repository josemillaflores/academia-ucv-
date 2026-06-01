'use client'

import { useOptimistic, useRef, useTransition } from 'react'
import { createDocente, deleteDocente } from '@/app/actions/docentes'
import { Users, Trash2, Mail, GraduationCap } from 'lucide-react'

type Docente = {
  id: string
  name: string
  email: string | null
  specialty: string | null
}

export function DocentesList({ initialDocentes }: { initialDocentes: Docente[] }) {
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  const [optimisticDocentes, addOptimisticDocente] = useOptimistic(
    initialDocentes,
    (state: Docente[], newDocente: Docente | { id: string, delete: boolean }) => {
      if ('delete' in newDocente) {
        return state.filter(c => c.id !== newDocente.id)
      }
      return [...state, newDocente as Docente]
    }
  )

  async function handleAddDocente(formData: FormData) {
    const newDocente = {
      id: Math.random().toString(),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      specialty: formData.get('specialty') as string,
    }
    
    startTransition(() => {
      addOptimisticDocente(newDocente)
    })

    formRef.current?.reset()
    try {
      await createDocente(formData)
    } catch (e) {
      console.error(e)
    }
  }

  async function handleDelete(id: string) {
    startTransition(() => {
      addOptimisticDocente({ id, delete: true })
    })
    try {
      await deleteDocente(id)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Añadir Docente */}
      <div className="bg-surface-raised border border-surface-border p-6 rounded-2xl shadow-sm mb-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3 relative z-10 text-text-primary">
          <div className="bg-amber-500/10 p-2 rounded-lg text-amber-600">
            <Users size={24} />
          </div>
          Registrar Docente
        </h2>
        <form ref={formRef} action={handleAddDocente} className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end relative z-10">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-secondary">Nombre Completo</label>
            <input required name="name" className="border border-surface-border rounded-lg px-4 py-3 bg-surface-base focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all outline-none w-full" placeholder="Ej: Dra. María López" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-secondary">Correo Electrónico</label>
            <input type="email" name="email" className="border border-surface-border rounded-lg px-4 py-3 bg-surface-base focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all outline-none w-full" placeholder="Ej: mlopez@ucv.edu.pe" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-secondary">Especialidad</label>
            <input name="specialty" className="border border-surface-border rounded-lg px-4 py-3 bg-surface-base focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all outline-none w-full" placeholder="Ej: Metodología de Investigación" />
          </div>
          <div className="md:col-span-3 flex justify-end mt-2">
            <button type="submit" disabled={isPending} className="bg-brand-primary text-white font-bold px-8 py-3.5 rounded-lg hover:bg-brand-hover hover:scale-[1.02] active:scale-95 transition-all shadow-md w-full sm:w-auto">
              {isPending ? 'Guardando...' : 'GUARDAR DOCENTE'}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Docentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {optimisticDocentes.map((docente) => (
          <div key={docente.id} className="bg-surface-raised border border-surface-border p-5 rounded-xl shadow-sm flex flex-col justify-between hover:border-amber-500 transition-colors">
            <div className="flex items-start gap-4">
              <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full text-slate-500 flex-shrink-0">
                <Users size={24} />
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="font-semibold text-lg truncate text-text-primary" title={docente.name}>{docente.name}</h3>
                
                {docente.specialty && (
                  <span className="text-xs text-text-secondary flex items-center gap-1 mt-1 truncate">
                    <GraduationCap size={14} className="text-amber-500" />
                    {docente.specialty}
                  </span>
                )}
                
                {docente.email && (
                  <span className="text-xs text-text-secondary flex items-center gap-1 mt-1 truncate">
                    <Mail size={14} className="text-slate-400" />
                    {docente.email}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex justify-end mt-4 pt-3 border-t border-surface-border">
              <button onClick={() => handleDelete(docente.id)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 p-2 rounded-lg transition-colors" title="Eliminar docente">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        
        {optimisticDocentes.length === 0 && (
          <div className="col-span-full py-16 text-center text-text-tertiary flex flex-col items-center justify-center border-2 border-dashed border-surface-border rounded-xl">
            <Users size={48} className="mb-4 text-slate-300 dark:text-slate-700" />
            <p className="text-lg font-medium">Plana Docente Vacía</p>
            <p className="text-sm mt-1 max-w-sm">Registra a los profesores de tus cursos para mantener el directorio actualizado.</p>
          </div>
        )}
      </div>
    </div>
  )
}
