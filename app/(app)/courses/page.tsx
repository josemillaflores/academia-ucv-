import { createClient } from '@/lib/supabase/server'
import { CourseList } from '@/components/courses/CourseList'

export default async function CoursesPage() {
  const supabase = await createClient()
  const { data: courses } = await supabase.from('courses').select('*').order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mis Cursos</h1>
      <CourseList initialCourses={courses || []} />
    </div>
  )
}
