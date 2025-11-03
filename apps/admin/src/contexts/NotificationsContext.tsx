import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { notificationService, NotificationInfo, UserNotification, GetNotificationsResponse } from '../services/notificationService';

interface NotificationsContextType {
  hasUnread: boolean;
  lastFive: UserNotification[];
  refreshInfo: () => Promise<void>;
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
      setLastFive(info.lastFive || []);
    } catch (e) {
      // sessizce yut: bildirim yoksa kritik değil
    }
  }, []);

  useEffect(() => {
    refreshInfo();
  }, [refreshInfo]);

  return (
    <NotificationsContext.Provider value={{ hasUnread, lastFive, refreshInfo }}>
      {children}
    </NotificationsContext.Provider>
  );
};


