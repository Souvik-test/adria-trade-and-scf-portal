
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Archive, Clock, ExternalLink } from 'lucide-react';

interface Notification {
  id: string;
  transactionRef: string;
  message: string;
  timestamp: string;
  isArchived: boolean;
  transactionType: string;
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      transactionRef: 'LC001234',
      message: 'Letter of Credit amendment request received',
      timestamp: '2024-01-15 10:30 AM',
      isArchived: false,
      transactionType: 'Letter of Credit'
    },
    {
      id: '2',
      transactionRef: 'BG005678',
      message: 'Bank Guarantee issuance completed',
      timestamp: '2024-01-14 02:15 PM',
      isArchived: false,
      transactionType: 'Bank Guarantee'
    },
    {
      id: '3',
      transactionRef: 'LC001122',
      message: 'Documents received for LC processing',
      timestamp: '2024-01-13 11:45 AM',
      isArchived: false,
      transactionType: 'Letter of Credit'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');

  const handleNotificationClick = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId 
        ? { ...notif, isArchived: true }
        : notif
    ));
    // Here you would route to the specific transaction
    console.log('Routing to transaction:', notificationId);
  };

  const handleArchive = (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId 
        ? { ...notif, isArchived: true }
        : notif
    ));
  };

  const activeNotifications = notifications.filter(n => !n.isArchived);
  const archivedNotifications = notifications.filter(n => n.isArchived);

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
            variant={activeTab === 'active' ? 'default' : 'outline'}
            onClick={() => setActiveTab('active')}
            className="flex-1"
          >
            Active ({activeNotifications.length})
          </Button>
          <Button
            variant={activeTab === 'archived' ? 'default' : 'outline'}
            onClick={() => setActiveTab('archived')}
            className="flex-1"
          >
            Archived ({archivedNotifications.length})
          </Button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {(activeTab === 'active' ? activeNotifications : archivedNotifications).map((notification) => (
            <div
              key={notification.id}
              className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              onClick={() => handleNotificationClick(notification.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {notification.transactionType}
                    </Badge>
                    <button className="text-corporate-blue hover:underline font-medium text-sm flex items-center gap-1">
                      {notification.transactionRef}
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    {notification.timestamp}
                  </div>
                </div>
                {activeTab === 'active' && (
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
          
          {(activeTab === 'active' ? activeNotifications : archivedNotifications).length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No {activeTab} notifications
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsPanel;
