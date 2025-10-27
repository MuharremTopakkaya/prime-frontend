// Company API Types
export interface Company {
  id: string;
  name: string;
  type: CompanyType;
  taxNumber: string;
  industry: string;
  address: string;
  status: OperationalStatus;
  createdDate: string;
  updatedDate?: string;
}

export enum CompanyType {
  Owner = 1,
  Customer = 2
}

export enum OperationalStatus {
  Active = 1,
  Inactive = 2,
  Suspended = 3,
  Pending = 4
}

export interface CreateCompanyRequest {
  name: string;
  taxNumber: string;
  industry: string;
  address: string;
  status: OperationalStatus;
}

export interface UpdateCompanyRequest {
  id: string;
  name: string;
  taxNumber: string;
  industry: string;
  address: string;
  status: OperationalStatus;
}

export interface PaginationRequest {
  pageIndex: number;
  pageSize: number;
}

export interface PaginationResponse {
  index: number;
  size: number;
  count: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface GetCompaniesResponse {
  items: Company[];
  pagination: PaginationResponse;
}

class CompanyService {
  private readonly API_BASE_URL = 'http://localhost:5132/api';

  /**
   * Get companies list with pagination
   */
  async getCompanies(pageIndex: number = 0, pageSize: number = 10): Promise<GetCompaniesResponse> {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/Companies?PageIndex=${pageIndex}&PageSize=${pageSize}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch companies: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get companies error:', error);
      throw error;
    }
  }

  /**
   * Create new company
   */
  async createCompany(companyData: CreateCompanyRequest): Promise<Company> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/Companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify(companyData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create company: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Create company error:', error);
      throw error;
    }
  }

  /**
   * Update company
   */
  async updateCompany(companyData: UpdateCompanyRequest): Promise<Company> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/Companies`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify(companyData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update company: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update company error:', error);
      throw error;
    }
  }

  /**
   * Get company by ID
   */
  async getCompanyById(id: string): Promise<Company> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/Companies/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch company: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get company error:', error);
      throw error;
    }
  }

  /**
   * Get authentication token from localStorage
   */
  private getToken(): string {
    const token = localStorage.getItem('authToken');
    return token || '';
  }

  /**
   * Get status display text
   */
  getStatusText(status: OperationalStatus): string {
    switch (status) {
      case OperationalStatus.Active:
        return 'Active';
      case OperationalStatus.Inactive:
        return 'Inactive';
      case OperationalStatus.Suspended:
        return 'Suspended';
      case OperationalStatus.Pending:
        return 'Pending';
      default:
        return 'Unknown';
    }
  }

  /**
   * Get status color for UI
   */
  getStatusColor(status: OperationalStatus): string {
    switch (status) {
      case OperationalStatus.Active:
        return 'green';
      case OperationalStatus.Inactive:
        return 'gray';
      case OperationalStatus.Suspended:
        return 'red';
      case OperationalStatus.Pending:
        return 'yellow';
      default:
        return 'gray';
    }
  }
}

export const companyService = new CompanyService();
