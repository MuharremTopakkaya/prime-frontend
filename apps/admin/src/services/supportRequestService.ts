import {
  CreateSupportRequestRequest,
  GetListResponse,
  PageRequest,
  SupportRequestDetailDto,
  SupportRequestListItemDto,
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
}

export const supportRequestService = new SupportRequestService();


