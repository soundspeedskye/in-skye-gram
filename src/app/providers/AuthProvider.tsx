import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/shared/api/supabase";
import type { User } from "@supabase/supabase-js";
import PATHS from "@/app/routing/path";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (id: string, password: string) => Promise<void>;
  signup: (
    id: string,
    password: string,
    username: string,
    fullName: string
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Supabase 세션 확인
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          console.error("Session check error:", error);
          setIsAuthenticated(false);
          setUser(null);
        } else if (session?.user) {
          setIsAuthenticated(true);
          setUser(session.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Session check failed:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Supabase auth 상태 변화 리스너 설정
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      if (session?.user) {
        setIsAuthenticated(true);
        setUser(session.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // 인증 상태에 따른 리다이렉트
    if (!loading) {
      if (!isAuthenticated) {
        // 인증되지 않은 상태에서 로그인/회원가입 페이지가 아니면 로그인 페이지로 이동
        if (
          location.pathname !== PATHS.SIGN_IN &&
          location.pathname !== PATHS.SIGN_UP
        ) {
          navigate(PATHS.SIGN_IN);
        }
      } else {
        // 인증된 상태에서 로그인/회원가입 페이지에 있으면 홈으로 이동
        if (
          location.pathname === PATHS.SIGN_IN ||
          location.pathname === PATHS.SIGN_UP
        ) {
          navigate(PATHS.HOME);
        }
      }
    }
  }, [isAuthenticated, loading, location.pathname, navigate]);

  const login = async (id: string, password: string) => {
    try {
      setLoading(true);
      console.log("Login attempt:", { id });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: id, // id를 email로 사용 (Supabase는 email 필드를 요구하므로)
        password,
      });

      if (error) {
        console.error("Login failed:", error);
        throw error;
      }

      if (data.user) {
        setIsAuthenticated(true);
        setUser(data.user);
        console.log("Login successful, navigating to HOME");
        navigate(PATHS.HOME);
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    id: string,
    password: string,
    username: string,
    fullName: string
  ) => {
    try {
      setLoading(true);
      console.log("Signup attempt:", { id, username, fullName });

      const { data, error } = await supabase.auth.signUp({
        email: id, // id를 email로 사용 (Supabase는 email 필드를 요구하므로)
        password,
        options: {
          data: {
            username: username,
            full_name: fullName,
          },
        },
      });

      if (error) {
        console.error("Signup failed:", error);
        throw error;
      }

      if (data.user) {
        console.log("Signup successful:", data.user);
        // 회원가입 성공 후 로그인 페이지로 리다이렉트 (이메일 확인 필요할 수 있음)
        navigate(PATHS.SIGN_IN);
      }
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUser(null);
      navigate(PATHS.SIGN_IN);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, signup, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
