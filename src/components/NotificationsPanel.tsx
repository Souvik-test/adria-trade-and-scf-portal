
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Archive, Clock, ExternalLink } from 'lucide-react';
import { fetchNotifications, markNotificationAsRead } from '@/services/database';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  transaction_ref: string;
  message: string;
  timestamp: string;
  is_read: boolean;
  transaction_type: string;
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'unread' | 'read'>('unread');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      try {
        await markNotificationAsRead(notification.id);
        setNotifications(prev => prev.map(notif => 
          notif.id === notification.id 
            ? { ...notif, is_read: true }
            : notif
        ));
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
    
    // Here you would route to the specific transaction
    console.log('Routing to transaction:', notification.transaction_ref);
  };

  const handleArchive = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev => prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, is_read: true }
          : notif
      ));
    } catch (error) {
      console.error('Error archiving notification:', error);
      toast({
        title: "Error",
        description: "Failed to archive notification",
        variant: "destructive"
      });
    }
  };

  const unreadNotifications = notifications.filter(n => !n.is_read);
  const readNotifications = notifications.filter(n => n.is_read);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white">
            Trade Finance Notifications
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-2 mb-4">
          <Button
            variant={activeTab === 'unread' ? 'default' : 'outline'}
            onClick={() => setActiveTab('unread')}
            className="flex-1"
          >
            Unread ({unreadNotifications.length})
          </Button>
          <Button
            variant={activeTab === 'read' ? 'default' : 'outline'}
            onClick={() => setActiveTab('read')}
            className="flex-1"
          >
            Read ({readNotifications.length})
          </Button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Loading notifications...
            </div>
          ) : (
            <>
              {(activeTab === 'unread' ? unreadNotifications : readNotifications).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                    !notification.is_read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {notification.transaction_type}
                        </Badge>
                        <button className="text-corporate-blue hover:underline font-medium text-sm flex items-center gap-1">
                          {notification.transaction_ref}
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        {formatTimestamp(notification.timestamp)}
                      </div>
                    </div>
                    {activeTab === 'unread' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleArchive(notification.id, e)}
                        className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <Archive className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              {(activeTab === 'unread' ? unreadNotifications : readNotifications).length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No {activeTab} notifications
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsPanel;
