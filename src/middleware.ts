import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas públicas (não requerem autenticação)
const publicRoutes = [
  '/login',
  '/cadastro',
  '/esqueci-senha',
  '/',
  '/install'
];

// Rotas protegidas (requerem autenticação)
const protectedRoutes = [
  '/comunidade',
  '/programas',
  '/treinos',
  '/perfil',
  '/premium'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("🛡️ [Middleware] Verificando rota:", pathname);

  // Verificar se existe token de autenticação no cookie
  const hasAuth = request.cookies.get('fitstream_auth');
  const isAuthenticated = !!hasAuth;

  console.log("🔐 [Middleware] Status de autenticação:", {
    pathname,
    isAuthenticated
  });

  // Verificar se a rota é pública
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route));
  
  // Verificar se a rota é protegida
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  console.log("📍 [Middleware] Tipo de rota:", {
    pathname,
    isPublicRoute,
    isProtectedRoute
  });

  // REGRA 1: Se NÃO está autenticado e tenta acessar rota protegida -> redirecionar para /login
  if (!isAuthenticated && isProtectedRoute) {
    console.log("❌ [Middleware] Usuário não autenticado tentando acessar rota protegida. Redirecionando para /login");
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // REGRA 2: Se ESTÁ autenticado e tenta acessar /login ou /cadastro -> redirecionar para /comunidade
  if (isAuthenticated && (pathname === '/login' || pathname === '/cadastro')) {
    console.log("✅ [Middleware] Usuário já autenticado tentando acessar login/cadastro. Redirecionando para /comunidade");
    const comunidadeUrl = new URL('/comunidade', request.url);
    return NextResponse.redirect(comunidadeUrl);
  }

  // REGRA 3: Permitir acesso a rotas públicas sem autenticação
  if (isPublicRoute && !isAuthenticated) {
    console.log("✅ [Middleware] Permitindo acesso à rota pública sem autenticação:", pathname);
    return NextResponse.next();
  }

  // REGRA 4: Permitir acesso a rotas protegidas com autenticação
  if (isProtectedRoute && isAuthenticated) {
    console.log("✅ [Middleware] Usuário autenticado acessando rota protegida:", pathname);
    return NextResponse.next();
  }

  console.log("✅ [Middleware] Permitindo acesso à rota:", pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, icons, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|icon-|manifest.json|sw.js|lasy-bridge.js).*)',
  ],
};
