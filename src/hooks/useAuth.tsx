
import { useState, useEffect, createContext, useContext } from 'react';
import { customAuth, CustomUser, CustomSession } from '@/services/customAuth';

interface AuthContextType {
  user: CustomUser | null;
  session: CustomSession | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [session, setSession] = useState<CustomSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Immediately check for existing session
    const existingSession = customAuth.getSession();
    console.log('Checking existing session:', existingSession);
    
    if (existingSession) {
      setSession(existingSession);
      setUser(existingSession.user);
      setLoading(false);
    } else {
      setLoading(false);
    }

    // Set up auth state listener for future changes
    const { unsubscribe } = customAuth.onAuthStateChange((newSession) => {
      console.log('Auth state changed:', newSession);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOut = async () => {
    console.log('Signing out user...');
    try {
      await customAuth.signOut();
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
