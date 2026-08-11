import {
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";
import type { User } from "firebase/auth";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../services/config";

import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  loginWithGithub,
  logoutUser,
} from "../auth/auth.service";

import { AuthContext } from "./AuthContext";

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setIsLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const value = {
    user,

    isAuthenticated: user !== null,

    isLoading,

    loginWithEmail,

    registerWithEmail,

    loginWithGoogle,

    loginWithGithub,

    logout: logoutUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};