import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const role = user?.user_metadata?.role as string | undefined

  const professionalPaths = ['/dashboard', '/protocols', '/patients', '/catalog', '/finance', '/settings']
  const isProfPath = professionalPaths.some(p => pathname.startsWith(p))
  const isAdminPath = pathname.startsWith('/admin')
  const isPatientPath = pathname.startsWith('/patient')
  const isProtected = isProfPath || isAdminPath || isPatientPath

  function redirectTo(path: string) {
    const url = request.nextUrl.clone()
    url.pathname = path
    return NextResponse.redirect(url)
  }

  function portalFor(r: string | undefined) {
    if (r === 'admin') return '/admin/dashboard'
    if (r === 'patient') return '/patient/dashboard'
    return '/dashboard'
  }

  if (!user && isProtected) return redirectTo('/login')

  if (user) {
    if (isProfPath && role !== 'professional') return redirectTo(portalFor(role))
    if (isAdminPath && role !== 'admin') return redirectTo(portalFor(role))
    if (isPatientPath && role !== 'patient') return redirectTo(portalFor(role))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
