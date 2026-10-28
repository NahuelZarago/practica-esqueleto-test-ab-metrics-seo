'use server'

import { cookies } from 'next/headers';

// Renombramos la función a recordConversion para que encaje con el esqueleto
export async function recordConversion() {
  const cookieStore = await cookies();
  const visitorId = cookieStore.get('visitor_id')?.value;
  const variant = cookieStore.get('variant')?.value;
  const hasConverted = cookieStore.get('converted')?.value;

  // Solo suma 1 vez por visitante
  if (visitorId && variant && !hasConverted) {
    // 1. Acá iría tu insert a la Base de Datos (ej: PostgreSQL)
    console.log(`[DB LOG] Conversión registrada para ${visitorId} en variante ${variant}`);
    
    // 2. Marcar en la cookie que este visitante ya convirtió
    cookieStore.set('converted', 'true', {
      maxAge: 60 * 60 * 24 * 30, // 30 días
      httpOnly: true,
      path: '/'
    });
  }
}