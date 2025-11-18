import { USE_MOCKS } from '../config/runtime';
import i18n from '../i18n';

export interface NotificationInfo {
  hasUnRead: boolean;
  items: UserNotification[];
  pagination?: {
    index: number;
    size: number;
    count: number;
    pages: number;
    hasPrevious: boolean;
    hasNext: boolean;
  };
}

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  createdDate: string;
  isRead: boolean;
  // Serileştirilmiş hedef bilgisi
  dataJson?: string;
}

export interface GetNotificationsResponse {
  items: UserNotification[];
  pagination: {
    index: number;
    size: number;
    count: number;
    pages: number;
    hasPrevious: boolean;
    hasNext: boolean;
  };
}

class NotificationService {
  private readonly API_BASE_URL = '/api/Notification';
  private getToken(): string | null {
    return localStorage.getItem('authToken') || localStorage.getItem('accessToken');
  }

  private buildHeaders(includeJson = true) {
    const headers: Record<string, string> = {};
    if (includeJson) headers['Content-Type'] = 'application/json';
    const token = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    headers['Accept-Language'] = i18n.language || 'en';
    return headers;
  }

  async getInfoFromAuth(): Promise<NotificationInfo> {
    if (USE_MOCKS) {
      const now = new Date().toISOString();
      return {
        hasUnRead: true,
        lastFive: [
          { id: 'n1', title: 'Yeni destek talebi', message: 'SR-1005 oluşturuldu', createdDate: now, isRead: false, dataJson: JSON.stringify({ TargetType: 'SupportRequest', TargetId: 'SR-1005' }) },
        ],
      };
    }
    const res = await fetch(`${this.API_BASE_URL}/FromAuth`, {
      headers: this.buildHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to fetch notification info: ${res.statusText}`);
    return res.json();
  }

  async getNotifications(pageIndex = 0, pageSize = 10): Promise<GetNotificationsResponse> {
    if (USE_MOCKS) {
      const items: UserNotification[] = Array.from({ length: pageSize }).map((_, i) => ({
        id: `mock-${pageIndex}-${i}`,
        title: 'Mock Bildirim',
        message: `Sayfa ${pageIndex} öğe ${i}`,
        createdDate: new Date().toISOString(),
        isRead: i % 3 === 0,
        dataJson: JSON.stringify({ TargetType: 'SupportRequest', TargetId: 'SR-1001' }),
      }));
      return {
        items,
        pagination: {
          index: pageIndex,
          size: pageSize,
          count: 42,
          pages: 5,
          hasPrevious: pageIndex > 0,
          hasNext: pageIndex < 4,
        },
      };
    }
    const res = await fetch(`${this.API_BASE_URL}?PageRequest.PageIndex=${pageIndex}&PageRequest.PageSize=${pageSize}`, {
      headers: this.buildHeaders(false),
    });
    if (!res.ok) throw new Error(`Failed to fetch notifications: ${res.statusText}`);
    return res.json();
  }

  async markAsRead(ids: string[]): Promise<void> {
    if (USE_MOCKS) return;
    const res = await fetch(`${this.API_BASE_URL}`, {
      method: 'PUT',
      headers: this.buildHeaders(),
      body: JSON.stringify({ Ids: ids }),
    });
    if (!res.ok) throw new Error(`Failed to mark notifications as read: ${res.statusText}`);
  }
}

export const notificationService = new NotificationService();


