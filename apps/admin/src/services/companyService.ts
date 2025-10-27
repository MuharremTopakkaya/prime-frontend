// Company API Types
export interface Company {
  id: string;
  name: string;
  type: 'Owner' | 'Customer';
  taxNumber: string;
  industry: string;
  address: string;
  status: OperationalStatus;
  createdDate: string;
  updatedDate?: string;
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
      // MOCK DATA - Backend çalışmadığı için geçici test
      // const mockCompanies: Company[] = [
      //   {
      //     id: '1',
      //     name: 'Acme Corporation',
      //     type: 'Customer',
      //     taxNumber: '1234567890',
      //     industry: 'Technology',
      //     address: '123 Tech Street, Silicon Valley, CA',
      //     status: OperationalStatus.Active,
      //     createdDate: '2024-01-15T10:30:00Z',
      //     updatedDate: '2024-01-20T14:45:00Z'
      //   },
      //   {
      //     id: '2',
      //     name: 'Global Solutions Ltd',
      //     type: 'Customer',
      //     taxNumber: '0987654321',
      //     industry: 'Consulting',
      //     address: '456 Business Ave, New York, NY',
      //     status: OperationalStatus.Pending,
      //     createdDate: '2024-02-01T09:15:00Z',
      //     updatedDate: '2024-02-05T16:20:00Z'
      //   },
      //   {
      //     id: '3',
      //     name: 'Innovation Inc',
      //     type: 'Customer',
      //     taxNumber: '1122334455',
      //     industry: 'Manufacturing',
      //     address: '789 Industrial Blvd, Detroit, MI',
      //     status: OperationalStatus.Suspended,
      //     createdDate: '2024-01-10T08:00:00Z',
      //     updatedDate: '2024-01-25T11:30:00Z'
      //   },
      //   {
      //     id: '4',
      //     name: 'Digital Dynamics',
      //     type: 'Customer',
      //     taxNumber: '5566778899',
      //     industry: 'Software',
      //     address: '321 Digital Lane, Austin, TX',
      //     status: OperationalStatus.Inactive,
      //     createdDate: '2024-02-10T13:45:00Z',
      //     updatedDate: '2024-02-15T10:15:00Z'
      //   },
      //   {
      //     id: '5',
      //     name: 'Future Enterprises',
      //     type: 'Customer',
      //     taxNumber: '9988776655',
      //     industry: 'Finance',
      //     address: '654 Finance Plaza, Chicago, IL',
      //     status: OperationalStatus.Active,
      //     createdDate: '2024-01-05T12:00:00Z',
      //     updatedDate: '2024-01-30T15:45:00Z'
      //   }
      // ];

      // // Pagination simulation
      // const startIndex = pageIndex * pageSize;
      // const endIndex = startIndex + pageSize;
      // const paginatedCompanies = mockCompanies.slice(startIndex, endIndex);
      // 
      // const totalRecords = mockCompanies.length;
      // const totalPages = Math.ceil(totalRecords / pageSize);
      // 
      // return {
      //   items: paginatedCompanies,
      //   pagination: {
      //     index: pageIndex,
      //     size: pageSize,
      //     count: totalRecords,
      //     pages: totalPages,
      //     hasPrevious: pageIndex > 0,
      //     hasNext: pageIndex < totalPages - 1
      //   }
      // };

      // Gerçek API çağrısı (backend çalıştığında)
      const response = await fetch(
        `${this.API_BASE_URL}/Companies?PageIndex=${pageIndex}&PageSize=${pageSize}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getToken()}`,
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
          'Authorization': `Bearer ${this.getToken()}`,
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
