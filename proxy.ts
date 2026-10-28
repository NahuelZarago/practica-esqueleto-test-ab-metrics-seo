import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { assignVariant } from '@/lib/experiment' // Importación corregida

export function proxy(request: NextRequest) {
  const response = NextResponse.next()
  const url = request.nextUrl

  if (url.searchParams.has('preview')) {
    return response
  }

  let visitorId = request.cookies.get('visitor_id')?.value
  if (!visitorId) {
    visitorId = crypto.randomUUID()
    response.cookies.set('visitor_id', visitorId, { 
      maxAge: 60 * 60 * 24 * 30, // 30 días
      httpOnly: true, 
      path: '/' 
    })
  }

  let variant = request.cookies.get('variant')?.value
  if (!variant) {
    variant = assignVariant(visitorId) // Llamada corregida
    response.cookies.set('variant', variant, { 
      maxAge: 60 * 60 * 24 * 30, 
      httpOnly: true, 
      path: '/' 
    })
  }

  const sessionCookie = request.cookies.get('session_30m')?.value
  if (!sessionCookie) {
    response.cookies.set('session_30m', 'active', { 
      maxAge: 60 * 30, // 30 minutos
      httpOnly: true, 
      path: '/' 
    })
    
    console.log(`[DB LOG] Impresión anotada para visitante ${visitorId}, variante ${variant}`)
  }

  return response
}

export const config = {
  matcher: ['/practica'],
}