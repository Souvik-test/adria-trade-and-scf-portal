
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserAsync } from './database';

// Fetch user notifications
export const fetchNotifications = async () => {
  const user = await getCurrentUserAsync();
  if (!user) throw new Error('User not authenticated');
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    throw error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string) => {
  const user = await getCurrentUserAsync();
  if (!user) throw new Error('User not authenticated');
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('user_id', user.id);
    if (error) throw error;
  } catch (error) {
    throw error;
  }
};
