import {
  CreateSupportRequestRequest,
  GetListResponse,
  PageRequest,
  SupportRequestDetailDto,
  SupportRequestListItemDto,
  SupportRequestAdminListItemDto,
  SupportRequestAdminDetailDto,
  SupportRequestListFilters,
  UpdateSupportRequestRequest,
  CreateSupportRequestCommentRequest,
  UpdateSupportRequestCommentRequest,
} from '../types/supportRequests';
import { USE_MOCKS } from '../config/runtime';

class SupportRequestService {
  private readonly API_BASE_URL = '/api';
  private readonly USE_MOCKS = USE_MOCKS; // Merkezi env bayrağı

  // Basit mock veri seti
  private readonly MOCK_ITEMS: SupportRequestAdminListItemDto[] = [
    {
      id: 'SR-1001',
      subject: 'Invoice integration error',
      description: 'Special case throws 500 error',
      resolveDescription: '',
      status: 1,
      priority: 3,
      company: { id: 'c-1', name: 'TechCorp' },
      createdUser: { id: 'u-1', name: 'Ali', surname: 'Demir' },
      assignedTo: { id: 'u-10', name: 'Ayşe', surname: 'Kaya' },
      resolvedDate: null,
      closedDate: null,
      createdDate: '2025-10-25T09:30:00Z',
      updatedDate: '2025-10-25T10:00:00Z',
    },
    {
      id: 'SR-1002',
      subject: 'Password reset email is not sent',
      description: 'Possible SMTP rate limit',
      resolveDescription: '',
      status: 2,
      priority: 2,
      company: { id: 'c-2', name: 'InnoSoft' },
      createdUser: { id: 'u-2', name: 'Mehmet', surname: 'Yıldız' },
      assignedTo: { id: 'u-11', name: 'Can', surname: 'Acar' },
      resolvedDate: null,
      closedDate: null,
      createdDate: '2025-10-26T08:00:00Z',
      updatedDate: '2025-10-26T12:45:00Z',
    },
    {
      id: 'SR-1003',
      subject: 'UI language selection not persisted',
      description: 'localStorage key mismatch',
      resolveDescription: 'Key name corrected',
      status: 3,
      priority: 1,
      company: { id: 'c-1', name: 'TechCorp' },
      createdUser: { id: 'u-3', name: 'Zeynep', surname: 'Koç' },
      assignedTo: { id: 'u-10', name: 'Ayşe', surname: 'Kaya' },
      resolvedDate: '2025-10-27T09:15:00Z',
      closedDate: null,
      createdDate: '2025-10-27T07:15:00Z',
      updatedDate: '2025-10-27T09:20:00Z',
    },
  ];

  private paginate<T>(items: T[], pageIndex = 0, pageSize = 10): GetListResponse<T> {
    const start = pageIndex * pageSize;
    const paged = items.slice(start, start + pageSize);
    const pages = Math.max(1, Math.ceil(items.length / pageSize));
    return {
      items: paged,
      pagination: {
        index: pageIndex,
        size: pageSize,
        count: items.length,
        pages,
        hasPrevious: pageIndex > 0,
        hasNext: pageIndex < pages - 1,
      },
    };
  }

  private getMockListForAdmin(pageIndex = 0, pageSize = 10, filters?: SupportRequestListFilters): GetListResponse<SupportRequestAdminListItemDto> {
    let list = this.MOCK_ITEMS;
    if (filters?.companyId) list = list.filter(i => i.company.id === filters.companyId);
    if (filters?.priority) list = list.filter(i => i.priority === filters.priority);
    if (filters?.status) list = list.filter(i => i.status === filters.status);
    if (filters?.assignedTo) list = list.filter(i => (i.assignedTo?.id || '') === filters.assignedTo);
    return this.paginate(list, pageIndex, pageSize);
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }

  async getListForCustomer(pageIndex = 0, pageSize = 10): Promise<GetListResponse<SupportRequestListItemDto>> {
    const url = `${this.API_BASE_URL}/SupportRequests/GetListForCustomer?PageIndex=${pageIndex}&PageSize=${pageSize}`;
    const res = await fetch(url, { headers: this.getAuthHeaders() });
    if (!res.ok) throw new Error(`Failed to fetch support requests: ${res.status}`);
    return res.json();
  }

  async createSupportRequest(payload: CreateSupportRequestRequest): Promise<void> {
    const url = `${this.API_BASE_URL}/SupportRequests`;
    const res = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Failed to create support request: ${res.status}`);
  }

  async getByIdForCustomer(id: string): Promise<SupportRequestDetailDto> {
    const url = `${this.API_BASE_URL}/SupportRequests/GetByIdForCustomer/${id}`;
    const res = await fetch(url, { headers: this.getAuthHeaders() });
    if (!res.ok) throw new Error(`Failed to fetch support request: ${res.status}`);
    return res.json();
  }

  async deleteSupportRequest(id: string): Promise<void> {
    const url = `${this.API_BASE_URL}/SupportRequests/${id}`;
    const res = await fetch(url, { method: 'DELETE', headers: this.getAuthHeaders() });
    if (!res.ok) throw new Error(`Failed to delete support request: ${res.status}`);
  }

  // Admin methods
  async getListForAdmin(pageIndex = 0, pageSize = 10, filters?: SupportRequestListFilters): Promise<GetListResponse<SupportRequestAdminListItemDto>> {
    const params = new URLSearchParams({
      PageIndex: String(pageIndex),
      PageSize: String(pageSize),
    });
    if (filters?.companyId) params.append('CompanyId', filters.companyId);
    if (filters?.priority) params.append('Priority', String(filters.priority));
    if (filters?.status) params.append('Status', String(filters.status));
    if (filters?.assignedTo) params.append('AssignedTo', filters.assignedTo);

    if (this.USE_MOCKS) {
      return Promise.resolve(this.getMockListForAdmin(pageIndex, pageSize, filters));
    }

    const url = `${this.API_BASE_URL}/SupportRequests?${params.toString()}`;
    const res = await fetch(url, { headers: this.getAuthHeaders() });
    if (!res.ok) throw new Error(`Failed to fetch support requests: ${res.status}`);
    return res.json();
  }

  async getByIdForAdmin(id: string): Promise<SupportRequestAdminDetailDto> {
    const url = `${this.API_BASE_URL}/SupportRequests/${id}`;
    const res = await fetch(url, { headers: this.getAuthHeaders() });
    if (!res.ok) throw new Error(`Failed to fetch support request: ${res.status}`);
    return res.json();
  }

  async updateSupportRequest(payload: UpdateSupportRequestRequest): Promise<void> {
    const url = `${this.API_BASE_URL}/SupportRequests`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Update failed' }));
      throw new Error(err.message || `Failed to update support request: ${res.status}`);
    }
  }

  async createComment(payload: CreateSupportRequestCommentRequest): Promise<void> {
    const url = `${this.API_BASE_URL}/SupportRequestComments`;
    const res = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Create comment failed' }));
      throw new Error(err.message || `Failed to create comment: ${res.status}`);
    }
  }

  async updateComment(payload: UpdateSupportRequestCommentRequest): Promise<void> {
    const url = `${this.API_BASE_URL}/SupportRequestComments`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Update comment failed' }));
      throw new Error(err.message || `Failed to update comment: ${res.status}`);
    }
  }

  async deleteComment(id: string): Promise<void> {
    const url = `${this.API_BASE_URL}/SupportRequestComments/${id}`;
    const res = await fetch(url, { method: 'DELETE', headers: this.getAuthHeaders() });
    if (!res.ok) throw new Error(`Failed to delete comment: ${res.status}`);
  }
}

export const supportRequestService = new SupportRequestService();


