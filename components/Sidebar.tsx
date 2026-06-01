'use client'

import { useState } from 'react'
import { logout } from '@/app/actions/auth'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LayoutDashboard, BookOpen, CheckSquare, LogOut, Users } from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: 'Tablero', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Cursos', href: '/courses', icon: BookOpen },
    { name: 'Tareas', href: '/tasks', icon: CheckSquare },
    { name: 'Docentes', href: '/docentes', icon: Users },
  ]

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2 mb-8 h-12 px-2">
        <span className="font-bold text-xl text-brand-primary dark:text-brand-primary">🎓 AcademIA</span>
      </div>
      
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link 
              key={item.href}
              href={item.href} 
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive 
                  ? 'bg-brand-subtle text-brand-primary font-medium dark:bg-brand-primary/10 dark:text-brand-primary' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              <Icon size={20} strokeWidth={1.5} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto border-t border-slate-200 dark:border-slate-800 pt-4">
        <button 
          onClick={() => logout()}
          className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors"
        >
          <LogOut size={20} strokeWidth={1.5} />
          Cerrar sesión
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-20">
        <span className="font-bold text-xl text-brand-primary dark:text-brand-primary">🎓 AcademIA</span>
        <button onClick={() => setIsOpen(true)} className="p-2 -mr-2 text-slate-600 dark:text-slate-300">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar (Mobile Drawer & Desktop Fixed) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-surface-raised border-r border-surface-border flex flex-col p-4 
        transition-transform duration-300 ease-in-out md:translate-x-0 md:sticky md:top-0 md:h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsOpen(false)} 
          className="md:hidden absolute top-4 right-4 p-2 text-slate-500 hover:bg-slate-100 rounded-md dark:hover:bg-slate-800"
        >
          <X size={20} />
        </button>
        
        <SidebarContent />
      </aside>
    </>
  )
}
