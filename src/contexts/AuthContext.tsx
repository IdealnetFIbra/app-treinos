"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  unit: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

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
        
        // Buscar dados completos do usuário na tabela users
        fetchUserProfile(session.user.id);
      } else {
        console.log("❌ [AuthContext] Nenhuma sessão ativa encontrada");
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
        document.cookie = "fitstream_auth=; path=/; max-age=0";
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    console.log("🔍 [AuthContext] Buscando perfil do usuário no Supabase:", userId);
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      console.log("📊 [Supabase Query] SELECT FROM users WHERE id =", userId);
      
      if (error) {
        console.error("❌ [AuthContext] Erro ao buscar perfil:", error.message);
        return;
      }

      if (data) {
        console.log("✅ [AuthContext] Perfil encontrado:", {
          id: data.id,
          name: data.name,
          email: data.email,
          unit: data.unit
        });
        
        const userProfile: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone || "",
          unit: data.unit || "",
          avatar: data.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
        };

        setUser(userProfile);
        setIsAuthenticated(true);
        document.cookie = "fitstream_auth=true; path=/; max-age=31536000";
        console.log("🍪 [AuthContext] Cookie de autenticação definido");
      }
    } catch (err) {
      console.error("❌ [AuthContext] Erro inesperado ao buscar perfil:", err);
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

  const signup = async (data: SignupData) => {
    console.log("📝 [AuthContext] Iniciando cadastro com Supabase Auth");
    console.log("📧 [AuthContext] Dados do cadastro:", {
      name: data.name,
      email: data.email,
      phone: data.phone,
      unit: data.unit
    });
    
    try {
      // 1. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
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
        throw authError;
      }

      if (!authData.user) {
        console.error("❌ [AuthContext] Usuário não foi criado");
        throw new Error("Falha ao criar usuário");
      }

      console.log("✅ [AuthContext] Usuário criado no Supabase Auth:", {
        id: authData.user.id,
        email: authData.user.email
      });

      // 2. Salvar dados completos na tabela users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            unit: data.unit,
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
          }
        ])
        .select()
        .single();

      console.log("📊 [Supabase Query] INSERT INTO users");
      console.log("📝 [Supabase Query] Dados inseridos:", {
        id: authData.user.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        unit: data.unit
      });
      
      if (userError) {
        console.error("❌ [AuthContext] Erro ao salvar perfil na tabela users:", userError.message);
        // Continuar mesmo com erro, pois o usuário foi criado no Auth
      } else {
        console.log("✅ [AuthContext] Perfil salvo na tabela users:", {
          id: userData.id,
          name: userData.name,
          email: userData.email
        });
      }

      // 3. Configurar estado do usuário
      const newUser: User = {
        id: authData.user.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        unit: data.unit,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
      };

      setUser(newUser);
      setIsAuthenticated(true);
      document.cookie = "fitstream_auth=true; path=/; max-age=31536000";
      console.log("🍪 [AuthContext] Cookie de autenticação definido");
      console.log("🚀 [AuthContext] Redirecionando para /comunidade");
      router.push("/comunidade");
    } catch (err) {
      console.error("❌ [AuthContext] Erro inesperado no cadastro:", err);
      throw err;
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
      const { data: updatedData, error } = await supabase
        .from('users')
        .update(data)
        .eq('id', user.id)
        .select()
        .single();

      console.log("📊 [Supabase Query] UPDATE users WHERE id =", user.id);
      console.log("📝 [Supabase Query] Dados atualizados:", data);
      
      if (error) {
        console.error("❌ [AuthContext] Erro ao atualizar usuário:", error.message);
        throw error;
      }

      if (updatedData) {
        console.log("✅ [AuthContext] Usuário atualizado com sucesso:", {
          id: updatedData.id,
          name: updatedData.name,
          email: updatedData.email
        });
        
        const updatedUser = { ...user, ...updatedData };
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
