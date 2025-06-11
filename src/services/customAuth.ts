
import { supabase } from '@/integrations/supabase/client';

export interface CustomUser {
  id: string;
  user_id: string;
  full_name: string;
  user_login_id: string;
  corporate_id: string;
  role_type: 'Maker' | 'Checker' | 'Viewer' | 'All';
  product_linkage: string[];
  created_at: string;
  updated_at: string;
}

export interface CustomSession {
  user: CustomUser;
  access_token: string;
}

// Simple password hashing (in production, use bcrypt or similar)
const hashPassword = (password: string): string => {
  // Simple hash for demo - in production use proper bcrypt
  return btoa(password + 'salt');
};

const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

export const customAuth = {
  // Sign up new user
  signUp: async (userData: {
    userId: string;
    password: string;
    fullName: string;
    userLoginId: string;
    roleType: 'Maker' | 'Checker' | 'Viewer' | 'All';
    productLinkage: string[];
  }) => {
    try {
      const passwordHash = hashPassword(userData.password);
      
      const { data, error } = await supabase
        .from('custom_users')
        .insert({
          user_id: userData.userId,
          password_hash: passwordHash,
          full_name: userData.fullName,
          user_login_id: userData.userLoginId,
          role_type: userData.roleType,
          product_linkage: userData.productLinkage,
          corporate_id: 'TC001'
        })
        .select()
        .single();

      if (error) {
        console.error('Signup error:', error);
        return { user: null, error: error.message };
      }

      return { user: data as CustomUser, error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { user: null, error: 'Failed to create account' };
    }
  },

  // Sign in user
  signIn: async (userId: string, password: string) => {
    try {
      const { data, error } = await supabase
        .from('custom_users')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        return { session: null, error: 'Invalid credentials' };
      }

      if (!verifyPassword(password, data.password_hash)) {
        return { session: null, error: 'Invalid credentials' };
      }

      // Create session
      const session: CustomSession = {
        user: data as CustomUser,
        access_token: btoa(JSON.stringify({ userId, timestamp: Date.now() }))
      };

      // Store session in localStorage
      localStorage.setItem('custom_session', JSON.stringify(session));

      return { session, error: null };
    } catch (error) {
      console.error('Signin error:', error);
      return { session: null, error: 'Failed to sign in' };
    }
  },

  // Sign out user
  signOut: async () => {
    localStorage.removeItem('custom_session');
    return { error: null };
  },

  // Get current session
  getSession: (): CustomSession | null => {
    try {
      const sessionData = localStorage.getItem('custom_session');
      if (!sessionData) return null;
      
      return JSON.parse(sessionData);
    } catch {
      return null;
    }
  },

  // Session change listener (simplified)
  onAuthStateChange: (callback: (session: CustomSession | null) => void) => {
    // Check for session changes
    const checkSession = () => {
      const session = customAuth.getSession();
      callback(session);
    };

    // Initial check
    checkSession();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'custom_session') {
        checkSession();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return {
      unsubscribe: () => {
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  }
};
