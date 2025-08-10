import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

interface AuthContextType {
  user: User | null;
  logout: () => Promise<void>;
  loading: boolean;
}

type AuthApi = {
  onAuthStateChanged: typeof onAuthStateChanged;
  signOut: typeof signOut;
  auth: typeof auth;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
  authApi?: AuthApi;
}> = ({ children, authApi }) => {
  const apiRef = useRef<AuthApi>(
    authApi ?? { onAuthStateChanged, signOut, auth }
  );

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { onAuthStateChanged: listen, auth } = apiRef.current;
    const unsubscribe = listen(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    const { signOut, auth } = apiRef.current;
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
