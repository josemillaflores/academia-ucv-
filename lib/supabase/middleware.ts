import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: Al llamar getUser(), supabase/ssr refrescará automáticamente
  // el token si está a punto de caducar.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Rutas que pueden ser accedidas sin sesión
  const publicRoutes = ['/login', '/signup', '/forgot-password', '/auth/confirm']
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname)

  // Rutas exclusivas para invitados (si tienes sesión, te mandan al dashboard)
  const guestOnlyRoutes = ['/login', '/signup', '/forgot-password']
  const isGuestOnlyRoute = guestOnlyRoutes.includes(request.nextUrl.pathname)

  // Si no hay usuario y no estamos en una ruta pública, redirigimos a /login
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Si hay usuario y está en una ruta exclusiva de invitados, lo mandamos al dashboard
  if (user && isGuestOnlyRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
