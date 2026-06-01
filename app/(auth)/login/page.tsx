import { login } from '@/app/actions/auth'
import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams

  return (
    <div className="flex-1 flex w-full flex-col sm:flex-row items-center justify-center min-h-screen bg-[var(--color-surface-overlay)]">
      
      {/* Left decorative side (hidden on small screens) */}
      <div className="hidden sm:flex flex-1 flex-col justify-center items-center bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] text-white p-12 h-screen">
        <GraduationCap className="h-24 w-24 mb-8 text-white opacity-90" />
        <h1 className="text-5xl font-bold mb-4 text-center tracking-tight">AcademIA</h1>
        <p className="text-lg text-center opacity-80 max-w-sm">
          Plataforma de gestión académica para el futuro de la educación.
        </p>
      </div>

      {/* Right side form */}
      <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center items-center h-screen bg-[var(--color-surface-base)] relative">
        <div className="w-full max-w-sm">
          
          <div className="flex flex-col items-center sm:items-start mb-8">
            <GraduationCap className="h-12 w-12 mb-4 text-[var(--color-brand-primary)] sm:hidden" />
            <h2 className="text-3xl font-semibold text-[var(--color-text-primary)]">Bienvenido de vuelta</h2>
            <p className="text-[var(--color-text-tertiary)] mt-2 text-sm">Ingresa a tu cuenta para continuar</p>
          </div>

          <form className="animate-in flex-1 flex flex-col w-full justify-center gap-4 text-foreground" action={login}>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--color-text-secondary)]" htmlFor="email">
                Correo Electrónico
              </label>
              <input
                id="email"
                className="rounded-lg px-4 py-3 bg-[var(--color-surface-base)] border border-[var(--color-surface-border)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent transition-all"
                name="email"
                placeholder="tu@correo.com"
                required
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--color-text-secondary)]" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                className="rounded-lg px-4 py-3 bg-[var(--color-surface-base)] border border-[var(--color-surface-border)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent transition-all"
                type="password"
                name="password"
                placeholder="••••••••"
                required
              />
              <div className="flex justify-end mt-1">
                <Link href="/forgot-password" className="text-sm text-[var(--color-brand-primary)] hover:underline font-medium">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <button className="bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] transition-colors rounded-lg px-4 py-3 text-white font-medium mt-2">
              Ingresar
            </button>
            
            {message && (
              <p className="mt-4 p-4 bg-[var(--color-surface-overlay)] border border-[var(--color-brand-primary)] text-[var(--color-text-primary)] rounded-lg text-center text-sm font-medium">
                {message}
              </p>
            )}

            <div className="mt-6 text-center text-sm text-[var(--color-text-tertiary)]">
              ¿No tienes cuenta?{' '}
              <Link href="/signup" className="text-[var(--color-brand-primary)] hover:underline font-medium">
                Regístrate aquí
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
