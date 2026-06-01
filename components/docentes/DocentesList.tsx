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

      {/* Lista de Docentes (Data Table) */}
      <div className="bg-white dark:bg-slate-900 border border-surface-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-overlay text-text-secondary font-semibold border-b border-surface-border uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 w-12 text-center">Perfil</th>
                <th className="px-6 py-4 w-full">Nombre Completo</th>
                <th className="px-6 py-4">Especialidad</th>
                <th className="px-6 py-4">Correo Electrónico</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {optimisticDocentes.map((docente) => (
                <tr key={docente.id} className="hover:bg-surface-raised transition-colors group">
                  <td className="px-6 py-4 text-center">
                    <div className="bg-slate-100 dark:bg-slate-800 w-10 h-10 rounded-full flex items-center justify-center text-slate-500 mx-auto shadow-sm border border-slate-200 dark:border-slate-700">
                      <Users size={20} />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <h3 className="font-semibold text-text-primary text-base">{docente.name}</h3>
                  </td>
                  <td className="px-6 py-4">
                    {docente.specialty ? (
                      <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                        <GraduationCap size={16} className="text-amber-500" />
                        {docente.specialty}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {docente.email ? (
                      <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                        <Mail size={16} className="text-slate-400" />
                        {docente.email}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(docente.id)} className="text-slate-400 hover:text-red-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-lg transition-all hover:bg-red-50 shadow-sm" title="Eliminar docente">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              
              {optimisticDocentes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-text-tertiary">
                    <Users size={48} className="mx-auto mb-4 opacity-20 text-slate-400" />
                    <p className="text-lg font-medium text-slate-600 dark:text-slate-400">Plana Docente Vacía</p>
                    <p className="mt-1">Registra a los profesores de tus cursos para mantener el directorio actualizado.</p>
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
