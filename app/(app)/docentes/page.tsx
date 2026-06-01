import { createClient } from '@/lib/supabase/server'
import { DocentesList } from '@/components/docentes/DocentesList'

export default async function DocentesPage() {
  const supabase = await createClient()
  const { data: docentes } = await supabase.from('docentes').select('*').order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-text-primary">Plana Docente</h1>
      <p className="text-text-secondary mb-8 text-lg">Directorio de profesores y tutores asignados a tus cursos.</p>
      
      <DocentesList initialDocentes={docentes || []} />
    </div>
  )
}
