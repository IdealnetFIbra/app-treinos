"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  unit: string;
  avatar: string;
  themeMode?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  signup: (data: SignupData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  unit: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Rotas públicas (não exigem login)
const PUBLIC_ROUTES = ['/login', '/cadastro', '/esqueci-senha', '/auth/callback'];

// Rotas protegidas (exigem login)
const PROTECTED_ROUTES = ['/comunidade', '/programas', '/treinos', '/perfil', '/premium'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("🔍 [AuthContext] Verificando sessão do Supabase");
    
    // Verificar sessão atual do Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("📊 [AuthContext] Sessão do Supabase:", session ? "Ativa" : "Inativa");
      
      if (session?.user) {
        console.log("✅ [AuthContext] Usuário autenticado encontrado:", {
          id: session.user.id,
          email: session.user.email,
          emailConfirmed: session.user.email_confirmed_at ? "Sim" : "Não"
        });
        
        // Carregar dados do usuário diretamente do Auth
        loadUserFromAuth(session.user);
      } else {
        console.log("❌ [AuthContext] Nenhuma sessão ativa encontrada");
        setIsLoading(false);
      }
    });

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("🔄 [AuthContext] Mudança no estado de autenticação:", _event);
      
      if (session?.user) {
        console.log("✅ [AuthContext] Novo usuário autenticado:", {
          id: session.user.id,
          email: session.user.email,
          emailConfirmed: session.user.email_confirmed_at ? "Sim" : "Não"
        });
        loadUserFromAuth(session.user);
      } else {
        console.log("❌ [AuthContext] Usuário desconectado");
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        document.cookie = "fitstream_auth=; path=/; max-age=0";
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Guard de rotas - executar após carregar autenticação
  useEffect(() => {
    if (isLoading) return; // Aguardar carregar autenticação

    const currentPath = pathname || '/';
    console.log("🛡️ [AuthContext] Guard de rotas - Caminho atual:", currentPath);
    console.log("🛡️ [AuthContext] Usuário autenticado:", isAuthenticated);

    // Se usuário NÃO está logado
    if (!isAuthenticated) {
      // Permitir acesso apenas a rotas públicas
      const isPublicRoute = PUBLIC_ROUTES.some(route => currentPath.startsWith(route));
      
      if (!isPublicRoute && currentPath !== '/') {
        console.log("🚫 [AuthContext] Rota protegida sem autenticação - Redirecionando para /login");
        router.replace('/login');
      }
    }

    // Se usuário ESTÁ logado
    if (isAuthenticated) {
      // Se tentar acessar /login ou /cadastro, redirecionar para /comunidade
      if (currentPath === '/login' || currentPath === '/cadastro') {
        console.log("🔄 [AuthContext] Usuário logado tentando acessar rota pública - Redirecionando para /comunidade");
        router.replace('/comunidade');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const loadUserFromAuth = (authUser: any) => {
    console.log("📥 [AuthContext] Carregando dados do usuário do Supabase Auth");
    console.log("📊 [AuthContext] user_metadata:", authUser.user_metadata);
    
    const userProfile: User = {
      id: authUser.id,
      name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || "Usuário",
      email: authUser.email || "",
      phone: authUser.user_metadata?.phone || "",
      unit: authUser.user_metadata?.unit || "",
      avatar: authUser.user_metadata?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
      themeMode: authUser.user_metadata?.themeMode || "light",
    };

    console.log("✅ [AuthContext] Usuário carregado:", {
      id: userProfile.id,
      name: userProfile.name,
      email: userProfile.email,
      unit: userProfile.unit
    });

    setUser(userProfile);
    setIsAuthenticated(true);
    setIsLoading(false);
    document.cookie = "fitstream_auth=true; path=/; max-age=31536000";
    console.log("🍪 [AuthContext] Cookie de autenticação definido");
  };

  const login = async (email: string, password: string) => {
    console.log("🔐 [AuthContext] Iniciando login com Supabase Auth");
    console.log("📧 [AuthContext] E-mail:", email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("📊 [Supabase Auth] signInWithPassword");
      
      if (error) {
        console.error("❌ [AuthContext] Erro no login:", error.message);
        throw error;
      }

      if (data.user) {
        console.log("✅ [AuthContext] Login bem-sucedido:", {
          id: data.user.id,
          email: data.user.email,
          emailConfirmed: data.user.email_confirmed_at ? "Sim" : "Não"
        });
        
        // Verificar se o email foi confirmado
        if (!data.user.email_confirmed_at) {
          console.warn("⚠️ [AuthContext] E-mail não confirmado");
          throw new Error("Email not confirmed");
        }
        
        loadUserFromAuth(data.user);
        console.log("🚀 [AuthContext] Redirecionando para /comunidade");
        router.replace("/comunidade");
      }
    } catch (err) {
      console.error("❌ [AuthContext] Erro inesperado no login:", err);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    console.log("🔐 [AuthContext] Iniciando login com Google via Supabase");
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      console.log("📊 [Supabase Auth] signInWithOAuth - provider: google");
      
      if (error) {
        console.error("❌ [AuthContext] Erro no login com Google:", error.message);
        throw error;
      }

      console.log("✅ [AuthContext] Redirecionamento para Google iniciado");
    } catch (err) {
      console.error("❌ [AuthContext] Erro inesperado no login com Google:", err);
      throw err;
    }
  };

  const loginWithApple = async () => {
    console.log("🔐 [AuthContext] Iniciando login com Apple via Supabase");
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      console.log("📊 [Supabase Auth] signInWithOAuth - provider: apple");
      
      if (error) {
        console.error("❌ [AuthContext] Erro no login com Apple:", error.message);
        throw error;
      }

      console.log("✅ [AuthContext] Redirecionamento para Apple iniciado");
    } catch (err) {
      console.error("❌ [AuthContext] Erro inesperado no login com Apple:", err);
      throw err;
    }
  };

  const signup = async (data: SignupData): Promise<{ success: boolean; message: string }> => {
    console.log("📝 [AuthContext] Iniciando cadastro com Supabase Auth");
    console.log("📧 [AuthContext] Dados do cadastro:", {
      name: data.name,
      email: data.email,
      phone: data.phone,
      unit: data.unit
    });
    
    try {
      // Criar usuário no Supabase Auth com user_metadata
      console.log("🔐 [AuthContext] Criando usuário no Supabase Auth");
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name: data.name,
            phone: data.phone,
            unit: data.unit,
          }
        }
      });

      console.log("📊 [Supabase Auth] signUp");
      
      if (authError) {
        console.error("❌ [AuthContext] Erro ao criar usuário no Auth:", authError.message);
        return {
          success: false,
          message: authError.message === "User already registered" 
            ? "Este e-mail já está cadastrado" 
            : "Erro ao criar conta. Tente novamente."
        };
      }

      if (!authData.user) {
        console.error("❌ [AuthContext] Usuário não foi criado");
        return {
          success: false,
          message: "Falha ao criar usuário. Tente novamente."
        };
      }

      console.log("✅ [AuthContext] Usuário criado no Supabase Auth:", {
        id: authData.user.id,
        email: authData.user.email,
        metadata: authData.user.user_metadata
      });

      console.log("✅ [AuthContext] Cadastro concluído - aguardando confirmação de email");
      return {
        success: true,
        message: "Cadastro realizado com sucesso! Verifique seu e-mail para confirmar sua conta."
      };
    } catch (err) {
      console.error("❌ [AuthContext] Erro inesperado no cadastro:", err);
      return {
        success: false,
        message: "Erro inesperado ao criar conta. Tente novamente."
      };
    }
  };

  const logout = async () => {
    console.log("🚪 [AuthContext] Iniciando logout");
    console.log("👤 [AuthContext] Usuário antes do logout:", user?.name);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      console.log("📊 [Supabase Auth] signOut");
      
      if (error) {
        console.error("❌ [AuthContext] Erro ao fazer logout:", error.message);
      } else {
        console.log("✅ [AuthContext] Logout realizado com sucesso");
      }
    } catch (err) {
      console.error("❌ [AuthContext] Erro inesperado no logout:", err);
    }
    
    setUser(null);
    setIsAuthenticated(false);
    document.cookie = "fitstream_auth=; path=/; max-age=0";
    console.log("🍪 [AuthContext] Cookie de autenticação removido");
    console.log("🚀 [AuthContext] Redirecionando para /login");
    router.replace("/login");
  };

  const updateUser = async (data: Partial<User>) => {
    console.log("🔄 [AuthContext] Atualizando dados do usuário");
    console.log("📝 [AuthContext] Dados a atualizar:", data);
    
    if (!user) {
      console.log("❌ [AuthContext] Tentativa de atualizar usuário sem estar logado");
      return;
    }

    try {
      // Atualizar user_metadata no Supabase Auth
      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.phone !== undefined) updateData.phone = data.phone;
      if (data.unit !== undefined) updateData.unit = data.unit;
      if (data.avatar !== undefined) updateData.avatar = data.avatar;
      if (data.themeMode !== undefined) updateData.themeMode = data.themeMode;

      const { data: updatedData, error } = await supabase.auth.updateUser({
        data: updateData
      });

      console.log("📊 [Supabase Auth] updateUser");
      console.log("📝 [Supabase Auth] Dados atualizados:", updateData);
      
      if (error) {
        console.error("❌ [AuthContext] Erro ao atualizar usuário:", error.message);
        throw error;
      }

      if (updatedData.user) {
        console.log("✅ [AuthContext] Usuário atualizado com sucesso");
        loadUserFromAuth(updatedData.user);
      }
    } catch (err) {
      console.error("❌ [AuthContext] Erro inesperado ao atualizar usuário:", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated,
      isLoading,
      login, 
      loginWithGoogle,
      loginWithApple,
      signup, 
      logout, 
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
