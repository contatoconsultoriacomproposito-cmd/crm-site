// src/app/proxy.ts (ou na raiz, conforme sua estrutura)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // 1. Ignorar arquivos estáticos e API
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Rewrite para a pasta dinâmica
  // Isso fará o Next.js procurar o arquivo em app/site/[host]/page.tsx
  return NextResponse.rewrite(new URL(`/site/${hostname}${url.pathname}`, request.url));
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};