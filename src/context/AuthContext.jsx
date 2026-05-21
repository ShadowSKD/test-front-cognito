import { createContext, useEffect, useContext, useState } from 'react';
import { getCurrentUser, fetchAuthSession, signOut } from 'aws-amplify/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    setIsLoading(true);
    try {
      const authUser = await getCurrentUser();
      const session = await fetchAuthSession();
      
      const idPayload = session.tokens?.idToken?.payload || {};
      const accessPayload = session.tokens?.accessToken?.payload || {};
      
      const groups = accessPayload['cognito:groups'] || idPayload['cognito:groups'] || [];
      
      let userRole = 'CUSTOMER';
      if (groups.includes('Admins')) {
        userRole = 'ADMIN';
      } else if (idPayload['custom:role']) {
        userRole = idPayload['custom:role'];
      }

      const mappedUser = {
        id: authUser.userId,
        username: authUser.username,
        email: idPayload.email,
        name: idPayload.name || idPayload.given_name || idPayload.email || 'User',
        role: userRole
      };

      setUser(mappedUser);
      setIsAuthenticated(true);
      setError(null);
      
      if (session.tokens?.idToken) {
        localStorage.setItem('token', session.tokens.idToken.toString());
      } else if (session.tokens?.accessToken) {
        localStorage.setItem('token', session.tokens.accessToken.toString());
      }
      localStorage.setItem('user', JSON.stringify(mappedUser));

    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    await checkUser();
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } catch (err) {
      console.error('Error signing out: ', err);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      loading: isLoading,
      isLoading,
      isAuthenticated,
      error,
      checkUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
