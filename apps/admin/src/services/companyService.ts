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
      // MOCK DATA - Temporary test while backend is not running
      console.log('Using MOCK DATA for companies');
      const mockCompanies: Company[] = [
        {
          id: '1',
          name: 'TechCorp Solutions',
          taxNumber: '1234567890',
          industry: 'Technology',
          address: '123 Tech Street, Silicon Valley, CA 94000',
          status: 1, // Active
          type: 1, // Owner
          createdDate: '2024-01-15T10:30:00Z',
          updatedDate: '2024-01-20T14:45:00Z'
        },
        {
          id: '2',
          name: 'Digital Innovations Ltd',
          taxNumber: '0987654321',
          industry: 'Software Development',
          address: '456 Innovation Ave, Austin, TX 78701',
          status: 1, // Active
          type: 2, // Customer
          createdDate: '2024-02-01T09:15:00Z',
          updatedDate: '2024-02-05T16:20:00Z'
        },
        {
          id: '3',
          name: 'Cloud Services Inc',
          taxNumber: '1122334455',
          industry: 'Cloud Computing',
          address: '789 Cloud Blvd, Seattle, WA 98101',
          status: 2, // Inactive
          type: 2, // Customer
          createdDate: '2024-01-10T08:00:00Z',
          updatedDate: '2024-01-25T11:30:00Z'
        },
        {
          id: '4',
          name: 'Data Analytics Pro',
          taxNumber: '5566778899',
          industry: 'Data Science',
          address: '321 Data Drive, Boston, MA 02101',
          status: 1, // Active
          type: 2, // Customer
          createdDate: '2024-01-05T12:00:00Z',
          updatedDate: '2024-01-30T15:45:00Z'
        },
        {
          id: '5',
          name: 'Mobile Apps Co',
          taxNumber: '9988776655',
          industry: 'Mobile Development',
          address: '654 Mobile Lane, San Francisco, CA 94102',
          status: 3, // Suspended
          type: 2, // Customer
          createdDate: '2024-02-20T11:20:00Z',
          updatedDate: '2024-02-25T09:10:00Z'
        }
      ];

      // Pagination simulation
      const startIndex = pageIndex * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedCompanies = mockCompanies.slice(startIndex, endIndex);
      
      const totalRecords = mockCompanies.length;
      const totalPages = Math.ceil(totalRecords / pageSize);
      
      return {
        items: paginatedCompanies,
        pagination: {
          index: pageIndex,
          size: pageSize,
          count: totalRecords,
          pages: totalPages,
          hasPrevious: pageIndex > 0,
          hasNext: pageIndex < totalPages - 1
        }
      };

      // Gerçek API çağrısı (backend çalıştığında)
      // const response = await fetch(
      //   `${this.API_BASE_URL}/Companies?PageIndex=${pageIndex}&PageSize=${pageSize}`,
      //   {
      //     method: 'GET',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //     },
      //   }
      // );

      // if (!response.ok) {
      //   throw new Error(`Failed to fetch companies: ${response.statusText}`);
      // }

      // const data = await response.json();
      // return data;
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
      // MOCK DATA - Temporary test while backend is not running
      const mockCompanies: Company[] = [
        {
          id: '1',
          name: 'TechCorp Solutions',
          taxNumber: '1234567890',
          industry: 'Technology',
          address: '123 Tech Street, Silicon Valley, CA 94000',
          status: 1, // Active
          type: 1, // Owner
          createdDate: '2024-01-15T10:30:00Z',
          updatedDate: '2024-01-20T14:45:00Z'
        },
        {
          id: '2',
          name: 'Digital Innovations Ltd',
          taxNumber: '0987654321',
          industry: 'Software Development',
          address: '456 Innovation Ave, Austin, TX 78701',
          status: 1, // Active
          type: 2, // Customer
          createdDate: '2024-02-01T09:15:00Z',
          updatedDate: '2024-02-05T16:20:00Z'
        },
        {
          id: '3',
          name: 'Cloud Services Inc',
          taxNumber: '1122334455',
          industry: 'Cloud Computing',
          address: '789 Cloud Blvd, Seattle, WA 98101',
          status: 2, // Inactive
          type: 2, // Customer
          createdDate: '2024-01-10T08:00:00Z',
          updatedDate: '2024-01-25T11:30:00Z'
        }
      ];

      const company = mockCompanies.find(c => c.id === id);
      if (!company) {
        throw new Error('Company not found');
      }
      
      return company;

      // Gerçek API çağrısı (backend çalıştığında)
      // const response = await fetch(`${this.API_BASE_URL}/Companies/${id}`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //   },
      // });

      // if (!response.ok) {
      //   throw new Error(`Failed to fetch company: ${response.statusText}`);
      // }

      // const data = await response.json();
      // return data;
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
