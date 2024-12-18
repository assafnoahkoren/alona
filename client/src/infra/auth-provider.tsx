import { createContext, FC, PropsWithChildren, useContext, useState } from 'react';

interface Auth {
  user?: User;
  isAuthenticated: boolean;
  setUser: (user: User | undefined) => void;
  logout: () => void;
}

const AuthContext = createContext<Auth>({} as Auth);

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | undefined>(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : undefined;
  });

  const logout = () => {
    setUser(undefined);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export type User = { id: string; email: string; isAdmin: boolean };
