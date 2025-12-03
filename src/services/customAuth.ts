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

// Store auth state change listeners
let authStateChangeListeners: ((session: CustomSession | null) => void)[] = [];

// Helper function to notify all listeners
const notifyAuthStateChange = (session: CustomSession | null) => {
  authStateChangeListeners.forEach(callback => {
    try {
      callback(session);
    } catch (error) {
      console.error('Error in auth state change callback:', error);
    }
  });
};

export const customAuth = {
  // Sign up new user - uses secure edge function for password hashing
  signUp: async (userData: {
    userId: string;
    password: string;
    fullName: string;
    userLoginId: string;
    roleType: 'Maker' | 'Checker' | 'Viewer' | 'All';
    productLinkage: string[];
  }) => {
    try {
      const { data, error } = await supabase.functions.invoke('authenticate-user', {
        body: {
          action: 'signup',
          userData: {
            userId: userData.userId,
            password: userData.password,
            fullName: userData.fullName,
            userLoginId: userData.userLoginId,
            roleType: userData.roleType,
            productLinkage: userData.productLinkage,
          },
        },
      });

      if (error) {
        console.error('Signup error:', error);
        return { user: null, error: error.message };
      }

      if (data?.error) {
        return { user: null, error: data.error };
      }

      return { user: data.user as CustomUser, error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { user: null, error: 'Failed to create account' };
    }
  },

  // Sign in user - uses secure edge function for password verification
  signIn: async (userId: string, password: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('authenticate-user', {
        body: {
          action: 'signin',
          userId,
          password,
        },
      });

      if (error) {
        return { session: null, error: 'Invalid credentials' };
      }

      if (data?.error) {
        return { session: null, error: data.error };
      }

      const user: CustomUser = {
        id: data.user.id,
        user_id: data.user.user_id,
        full_name: data.user.full_name,
        user_login_id: data.user.user_login_id,
        corporate_id: data.user.corporate_id,
        role_type: data.user.role_type,
        product_linkage: data.user.product_linkage,
        created_at: data.user.created_at,
        updated_at: data.user.updated_at,
      };

      const session: CustomSession = {
        user,
        access_token: data.session_token,
      };

      // Store session in localStorage
      localStorage.setItem('custom_session', JSON.stringify(session));

      // Immediately notify all listeners about the new session
      notifyAuthStateChange(session);

      return { session, error: null };
    } catch (error) {
      console.error('Signin error:', error);
      return { session: null, error: 'Failed to sign in' };
    }
  },

  // Verify session token - validates signature server-side
  verifySession: async (token: string): Promise<{ valid: boolean; userId?: string; dbId?: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke('authenticate-user', {
        body: {
          action: 'verify',
          password: token, // Token passed via password field
        },
      });

      if (error || data?.error || !data?.valid) {
        return { valid: false };
      }

      return { valid: true, userId: data.userId, dbId: data.dbId };
    } catch {
      return { valid: false };
    }
  },

  // Sign out user
  signOut: async () => {
    localStorage.removeItem('custom_session');
    
    // Immediately notify all listeners about sign out
    notifyAuthStateChange(null);
    
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

  // Session change listener (enhanced with immediate notifications)
  onAuthStateChange: (callback: (session: CustomSession | null) => void) => {
    // Add the callback to our listeners array
    authStateChangeListeners.push(callback);

    // Initial check
    const session = customAuth.getSession();
    callback(session);

    // Listen for storage changes (for cross-tab synchronization)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'custom_session') {
        const session = customAuth.getSession();
        callback(session);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return {
      unsubscribe: () => {
        // Remove the callback from our listeners array
        authStateChangeListeners = authStateChangeListeners.filter(cb => cb !== callback);
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  }
};
