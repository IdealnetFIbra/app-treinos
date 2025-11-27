"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

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
    console.log("🔍 [AuthContext] Verificando usuário salvo no localStorage");
    // Verificar se há usuário salvo no localStorage
    const savedUser = localStorage.getItem("fitstream_user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      console.log("✅ [AuthContext] Usuário encontrado no localStorage:", {
        id: parsedUser.id,
        name: parsedUser.name,
        email: parsedUser.email,
        unit: parsedUser.unit
      });
      setUser(parsedUser);
      setIsAuthenticated(true);
      // Definir cookie para o middleware
      document.cookie = "fitstream_auth=true; path=/; max-age=31536000"; // 1 ano
      console.log("🍪 [AuthContext] Cookie de autenticação definido");
    } else {
      console.log("❌ [AuthContext] Nenhum usuário encontrado no localStorage");
    }
  }, []);

  const login = async (email: string, password: string) => {
    console.log("🔐 [AuthContext] Iniciando login com e-mail:", email);
    // Simulação de login - em produção, fazer chamada à API
    const mockUser: User = {
      id: "1",
      name: "Usuário Teste",
      email,
      phone: "(86) 99999-9999",
      unit: "Simplifit — Zona Norte",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    };

    console.log("✅ [AuthContext] Login bem-sucedido. Dados do usuário:", {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      unit: mockUser.unit
    });

    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem("fitstream_user", JSON.stringify(mockUser));
    console.log("💾 [AuthContext] Usuário salvo no localStorage");
    
    // Definir cookie para o middleware
    document.cookie = "fitstream_auth=true; path=/; max-age=31536000"; // 1 ano
    console.log("🍪 [AuthContext] Cookie de autenticação definido");
    console.log("🚀 [AuthContext] Redirecionando para /comunidade");
    router.push("/comunidade");
  };

  const loginWithGoogle = async () => {
    console.log("🔐 [AuthContext] Iniciando login com Google");
    // Simulação de login com Google
    const mockUser: User = {
      id: Date.now().toString(),
      name: "Usuário Google",
      email: "usuario@gmail.com",
      phone: "(86) 99999-9999",
      unit: "Simplifit — Zona Norte",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    };

    console.log("✅ [AuthContext] Login com Google bem-sucedido. Dados do usuário:", {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      unit: mockUser.unit
    });

    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem("fitstream_user", JSON.stringify(mockUser));
    console.log("💾 [AuthContext] Usuário salvo no localStorage");
    
    // Definir cookie para o middleware
    document.cookie = "fitstream_auth=true; path=/; max-age=31536000"; // 1 ano
    console.log("🍪 [AuthContext] Cookie de autenticação definido");
    console.log("🚀 [AuthContext] Redirecionando para /comunidade");
    router.push("/comunidade");
  };

  const loginWithApple = async () => {
    console.log("🔐 [AuthContext] Iniciando login com Apple");
    // Simulação de login com Apple
    const mockUser: User = {
      id: Date.now().toString(),
      name: "Usuário Apple",
      email: "usuario@icloud.com",
      phone: "(86) 99999-9999",
      unit: "Simplifit — Zona Norte",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    };

    console.log("✅ [AuthContext] Login com Apple bem-sucedido. Dados do usuário:", {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      unit: mockUser.unit
    });

    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem("fitstream_user", JSON.stringify(mockUser));
    console.log("💾 [AuthContext] Usuário salvo no localStorage");
    
    // Definir cookie para o middleware
    document.cookie = "fitstream_auth=true; path=/; max-age=31536000"; // 1 ano
    console.log("🍪 [AuthContext] Cookie de autenticação definido");
    console.log("🚀 [AuthContext] Redirecionando para /comunidade");
    router.push("/comunidade");
  };

  const signup = async (data: SignupData) => {
    console.log("📝 [AuthContext] Iniciando cadastro com dados:", {
      name: data.name,
      email: data.email,
      phone: data.phone,
      unit: data.unit
    });
    
    // Simulação de cadastro - em produção, fazer chamada à API
    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      unit: data.unit,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    };

    console.log("✅ [AuthContext] Cadastro bem-sucedido. Dados do novo usuário:", {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      unit: newUser.unit
    });

    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem("fitstream_user", JSON.stringify(newUser));
    console.log("💾 [AuthContext] Novo usuário salvo no localStorage");
    
    // Definir cookie para o middleware
    document.cookie = "fitstream_auth=true; path=/; max-age=31536000"; // 1 ano
    console.log("🍪 [AuthContext] Cookie de autenticação definido");
    console.log("🚀 [AuthContext] Redirecionando para /comunidade");
    router.push("/comunidade");
  };

  const logout = () => {
    console.log("🚪 [AuthContext] Iniciando logout");
    console.log("👤 [AuthContext] Usuário antes do logout:", user?.name);
    
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("fitstream_user");
    console.log("🗑️ [AuthContext] Usuário removido do localStorage");
    
    // Remover cookie
    document.cookie = "fitstream_auth=; path=/; max-age=0";
    console.log("🍪 [AuthContext] Cookie de autenticação removido");
    console.log("🚀 [AuthContext] Redirecionando para /login");
    router.push("/login");
  };

  const updateUser = (data: Partial<User>) => {
    console.log("🔄 [AuthContext] Atualizando dados do usuário:", data);
    if (user) {
      const updatedUser = { ...user, ...data };
      console.log("✅ [AuthContext] Usuário atualizado:", {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        unit: updatedUser.unit
      });
      setUser(updatedUser);
      localStorage.setItem("fitstream_user", JSON.stringify(updatedUser));
      console.log("💾 [AuthContext] Usuário atualizado salvo no localStorage");
    } else {
      console.log("❌ [AuthContext] Tentativa de atualizar usuário sem estar logado");
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
