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

class SupportRequestService {
  private readonly API_BASE_URL = 'http://localhost:5132/api';

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


