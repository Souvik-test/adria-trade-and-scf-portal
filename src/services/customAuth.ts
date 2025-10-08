
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
      
      // Insert new user (password_hash is write-only)
      const { error: insertError } = await supabase
        .from('custom_users')
        .insert({
          user_id: userData.userId,
          password_hash: passwordHash,
          full_name: userData.fullName,
          user_login_id: userData.userLoginId,
          role_type: userData.roleType,
          product_linkage: userData.productLinkage,
          corporate_id: 'TC001'
        } as any);

      if (insertError) {
        console.error('Signup error:', insertError);
        return { user: null, error: insertError.message };
      }

      // Retrieve user profile securely (without password_hash)
      const { data: profileData, error: profileError } = await supabase
        .rpc('get_custom_user_profile', { input_user_id: userData.userId });

      if (profileError || !profileData || profileData.length === 0) {
        console.error('Profile retrieval error:', profileError);
        return { user: null, error: 'Failed to retrieve user profile' };
      }

      return { user: profileData[0] as CustomUser, error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { user: null, error: 'Failed to create account' };
    }
  },

  // Sign in user
  signIn: async (userId: string, password: string) => {
    try {
      // Use secure function to get user data for authentication
      const { data, error } = await supabase
        .rpc('authenticate_custom_user', { input_user_id: userId });

      if (error || !data || data.length === 0) {
        return { session: null, error: 'Invalid credentials' };
      }

      const userData = data[0];
      if (!verifyPassword(password, userData.password_hash)) {
        return { session: null, error: 'Invalid credentials' };
      }

      // Create session with properly mapped user data
      const user: CustomUser = {
        id: userData.id,
        user_id: userData.user_id,
        full_name: userData.full_name,
        user_login_id: userData.user_login_id,
        corporate_id: userData.corporate_id,
        role_type: userData.role_type,
        product_linkage: userData.product_linkage,
        created_at: userData.created_at,
        updated_at: userData.updated_at
      };

      const session: CustomSession = {
        user,
        access_token: btoa(JSON.stringify({ userId, timestamp: Date.now() }))
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
