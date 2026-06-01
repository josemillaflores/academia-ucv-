'use client'

import { logout } from '@/app/actions/auth'
import Link from 'next/link'

export function Sidebar() {
  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200 h-screen sticky top-0 flex flex-col p-4 dark:bg-slate-900 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-8 h-12">
        <span className="font-bold text-xl text-indigo-600 dark:text-indigo-400">🎓 AcademIA</span>
      </div>
      
      <nav className="flex flex-col gap-2 flex-1">
        <Link 
          href="/dashboard" 
          className="px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
        >
          Tablero
        </Link>
        <Link 
          href="/courses" 
          className="px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
        >
          Cursos
        </Link>
        <Link 
          href="/tasks" 
          className="px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
        >
          Tareas
        </Link>
      </nav>

      <div className="mt-auto border-t border-slate-200 dark:border-slate-800 pt-4">
        <button 
          onClick={() => logout()}
          className="w-full text-left px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
