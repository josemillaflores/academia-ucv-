import { Sidebar } from '@/components/Sidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-surface-base text-text-primary">
      <Sidebar />
      <main className="flex-1 w-full md:w-auto overflow-y-auto">
        <div className="mx-auto max-w-5xl p-4 md:p-8 w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
