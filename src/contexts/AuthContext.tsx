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
          email: session.user.email
        });
        
        // Buscar dados completos do usuário na tabela profiles
        fetchUserProfile(session.user.id);
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
          email: session.user.email
        });
        fetchUserProfile(session.user.id);
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
        router.push('/login');
      }
    }

    // Se usuário ESTÁ logado
    if (isAuthenticated) {
      // Se tentar acessar /login ou /cadastro, redirecionar para /comunidade
      if (currentPath === '/login' || currentPath === '/cadastro') {
        console.log("🔄 [AuthContext] Usuário logado tentando acessar rota pública - Redirecionando para /comunidade");
        router.push('/comunidade');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const fetchUserProfile = async (userId: string) => {
    console.log("🔍 [AuthContext] Buscando perfil do usuário na tabela profiles:", userId);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId);

      console.log("📊 [Supabase Query] SELECT FROM profiles WHERE id =", userId);
      
      if (error) {
        console.error("❌ [AuthContext] Erro ao buscar perfil:", error.message);
        setIsLoading(false);
        return;
      }

      // Verificar se retornou dados
      if (data && data.length > 0) {
        const profileData = data[0]; // Pegar o primeiro registro
        
        console.log("✅ [AuthContext] Perfil encontrado:", {
          id: profileData.id,
          nome: profileData.nome,
          email: profileData.email,
          unidade: profileData.unidade
        });
        
        const userProfile: User = {
          id: profileData.id,
          name: profileData.nome || "",
          email: profileData.email || "",
          phone: profileData.celular || "",
          unit: profileData.unidade || "",
          avatar: profileData.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
          themeMode: profileData.theme_mode || "light",
        };

        setUser(userProfile);
        setIsAuthenticated(true);
        setIsLoading(false);
        document.cookie = "fitstream_auth=true; path=/; max-age=31536000";
        console.log("🍪 [AuthContext] Cookie de autenticação definido");
      } else {
        console.log("⚠️ [AuthContext] Nenhum perfil encontrado para o usuário:", userId);
        setIsLoading(false);
      }
    } catch (err) {
      console.error("❌ [AuthContext] Erro inesperado ao buscar perfil:", err);
      setIsLoading(false);
    }
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
          email: data.user.email
        });
        
        await fetchUserProfile(data.user.id);
        console.log("🚀 [AuthContext] Redirecionando para /comunidade");
        router.push("/comunidade");
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
          redirectTo: `${window.location.origin}/comunidade`,
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
          redirectTo: `${window.location.origin}/comunidade`,
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
      // Passo 1: Criar usuário no Supabase Auth
      console.log("🔐 [AuthContext] Passo 1: Criando usuário no Supabase Auth");
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
        email: authData.user.email
      });

      // Passo 2: Tentar criar registro na tabela profiles
      // Usar apenas os campos essenciais que sabemos que existem
      console.log("💾 [AuthContext] Passo 2: Tentando criar registro na tabela profiles");
      
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: authData.user.id,
            nome: data.name,
            email: data.email,
            celular: data.phone,
            unidade: data.unit
          }]);

        if (profileError) {
          console.error("⚠️ [AuthContext] Erro ao criar perfil (não crítico):", profileError.message);
          // NÃO retornar erro - o usuário foi criado no Auth, isso é o mais importante
          console.log("✅ [AuthContext] Continuando - usuário criado no Auth com sucesso");
        } else {
          console.log("✅ [AuthContext] Perfil criado com sucesso na tabela profiles");
        }
      } catch (profileErr) {
        console.error("⚠️ [AuthContext] Exceção ao criar perfil (não crítico):", profileErr);
        // Continuar mesmo com erro no perfil
      }

      // Retornar sucesso - usuário foi criado no Auth
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
    router.push("/login");
  };

  const updateUser = async (data: Partial<User>) => {
    console.log("🔄 [AuthContext] Atualizando dados do usuário");
    console.log("📝 [AuthContext] Dados a atualizar:", data);
    
    if (!user) {
      console.log("❌ [AuthContext] Tentativa de atualizar usuário sem estar logado");
      return;
    }

    try {
      // Mapear campos do User para campos da tabela profiles
      const profileData: any = {};
      if (data.name !== undefined) profileData.nome = data.name;
      if (data.email !== undefined) profileData.email = data.email;
      if (data.phone !== undefined) profileData.celular = data.phone;
      if (data.unit !== undefined) profileData.unidade = data.unit;
      if (data.avatar !== undefined) profileData.avatar = data.avatar;
      if (data.themeMode !== undefined) profileData.theme_mode = data.themeMode;

      const { data: updatedData, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id)
        .select();

      console.log("📊 [Supabase Query] UPDATE profiles WHERE id =", user.id);
      console.log("📝 [Supabase Query] Dados atualizados:", profileData);
      
      if (error) {
        console.error("❌ [AuthContext] Erro ao atualizar usuário:", error.message);
        throw error;
      }

      if (updatedData && updatedData.length > 0) {
        const updated = updatedData[0];
        console.log("✅ [AuthContext] Usuário atualizado com sucesso:", {
          id: updated.id,
          nome: updated.nome,
          email: updated.email
        });
        
        // Mapear de volta para o formato User
        const updatedUser: User = {
          ...user,
          name: updated.nome || user.name,
          email: updated.email || user.email,
          phone: updated.celular || user.phone,
          unit: updated.unidade || user.unit,
          avatar: updated.avatar || user.avatar,
          themeMode: updated.theme_mode || user.themeMode,
        };
        
        setUser(updatedUser);
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
