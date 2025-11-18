import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { notificationService, NotificationInfo, UserNotification, GetNotificationsResponse } from '../services/notificationService';

interface NotificationsContextType {
  hasUnread: boolean;
  lastFive: UserNotification[];
  refreshInfo: () => Promise<void>;
  markAllRead: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const useNotifications = (): NotificationsContextType => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
};

export const NotificationsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [hasUnread, setHasUnread] = useState(false);
  const [lastFive, setLastFive] = useState<UserNotification[]>([]);

  const refreshInfo = useCallback(async () => {
    try {
      const info = await notificationService.getInfoFromAuth();
      setHasUnread(info.hasUnRead);
      setLastFive(info.items || []);
    } catch (e) {
      // sessizce yut: bildirim yoksa kritik değil
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      const unreadIds = lastFive.filter(n => !n.isRead).map(n => n.id);
      if (unreadIds.length) await notificationService.markAsRead(unreadIds);
      await refreshInfo();
    } catch {
      // ignore
    }
  }, [lastFive, refreshInfo]);

  useEffect(() => {
    refreshInfo();
  }, [refreshInfo]);

  return (
    <NotificationsContext.Provider value={{ hasUnread, lastFive, refreshInfo, markAllRead }}>
      {children}
    </NotificationsContext.Provider>
  );
};


