import { resetPassword } from '@/app/actions/auth'
import Link from 'next/link'
import { KeyRound, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="flex-1 flex w-full flex-col sm:flex-row items-center justify-center min-h-screen bg-[var(--color-surface-overlay)]">
      
      {/* Right side form, centered here */}
      <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center items-center h-screen bg-[var(--color-surface-base)] relative rounded-2xl sm:h-auto sm:py-16 sm:shadow-2xl">
        <div className="w-full max-w-sm">
          
          <div className="flex flex-col items-center sm:items-start mb-8">
            <KeyRound className="h-12 w-12 mb-4 text-[var(--color-brand-primary)]" />
            <h2 className="text-3xl font-semibold text-[var(--color-text-primary)]">Recuperar contraseña</h2>
            <p className="text-[var(--color-text-tertiary)] mt-2 text-sm">Ingresa tu correo y te enviaremos un enlace</p>
          </div>

          <form className="animate-in flex-1 flex flex-col w-full justify-center gap-4 text-foreground" action={resetPassword}>
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

            <button className="bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] transition-colors rounded-lg px-4 py-3 text-white font-medium mt-4">
              Enviar enlace de recuperación
            </button>
            
            {searchParams?.message && (
              <p className="mt-4 p-4 bg-[var(--color-surface-overlay)] border border-[var(--color-brand-primary)] text-[var(--color-text-primary)] rounded-lg text-center text-sm font-medium">
                {searchParams.message}
              </p>
            )}

            <div className="mt-6 text-center text-sm text-[var(--color-text-tertiary)] flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <Link href="/login" className="text-[var(--color-brand-primary)] hover:underline font-medium">
                Volver a inicio de sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
