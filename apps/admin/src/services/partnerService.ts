export interface Partner {
  id: string;
  name: string;
  apiKey: string;
  createdDate: string;
  updatedDate: string;
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

export interface GetPartnersResponse {
  items: Partner[];
  pagination: PaginationResponse;
}

export interface CreatePartnerRequest {
  name: string;
  apiKey: string;
}

export interface UpdatePartnerRequest {
  id: string;
  name: string;
  apiKey?: string;
}

class PartnerService {
  private readonly API_BASE_URL = 'http://localhost:5132/api';

  /**
   * Get token from localStorage
   */
  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Get partners list with pagination
   */
  async getPartners(pageIndex: number = 0, pageSize: number = 12): Promise<GetPartnersResponse> {
    try {
      // MOCK DATA - Backend çalışmadığı için geçici test
      // const mockPartners: Partner[] = [
      //   {
      //     id: '1',
      //     name: 'TechCorp Solutions',
      //     apiKey: 'tc_sk_1234567890abcdef1234567890abcdef',
      //     createdDate: '2024-01-15T10:30:00Z',
      //     updatedDate: '2024-01-20T14:45:00Z'
      //   },
      //   {
      //     id: '2',
      //     name: 'Digital Innovations Ltd',
      //     apiKey: 'di_live_abcdef1234567890abcdef1234567890',
      //     createdDate: '2024-02-01T09:15:00Z',
      //     updatedDate: '2024-02-05T16:20:00Z'
      //   },
      //   {
      //     id: '3',
      //     name: 'Cloud Services Inc',
      //     apiKey: 'cs_prod_9876543210fedcba9876543210fedcba',
      //     createdDate: '2024-01-10T08:00:00Z',
      //     updatedDate: '2024-01-25T11:30:00Z'
      //   },
      //   {
      //     id: '4',
      //     name: 'API Gateway Corp',
      //     apiKey: 'ag_test_5555555555aaaaaa5555555555aaaaaa',
      //     createdDate: '2024-02-10T13:45:00Z',
      //     updatedDate: '2024-02-15T10:15:00Z'
      //   },
      //   {
      //     id: '5',
      //     name: 'Data Analytics Pro',
      //     apiKey: 'da_demo_1111111111bbbbbb1111111111bbbbbb',
      //     createdDate: '2024-01-05T12:00:00Z',
      //     updatedDate: '2024-01-30T15:45:00Z'
      //   },
      //   {
      //     id: '6',
      //     name: 'Mobile Apps Co',
      //     apiKey: 'ma_dev_2222222222cccccc2222222222cccccc',
      //     createdDate: '2024-02-20T11:20:00Z',
      //     updatedDate: '2024-02-25T09:10:00Z'
      //   }
      // ];

      // // Pagination simulation
      // const startIndex = pageIndex * pageSize;
      // const endIndex = startIndex + pageSize;
      // const paginatedPartners = mockPartners.slice(startIndex, endIndex);
      // 
      // const totalRecords = mockPartners.length;
      // const totalPages = Math.ceil(totalRecords / pageSize);
      // 
      // return {
      //   items: paginatedPartners,
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
        `${this.API_BASE_URL}/Partners?PageIndex=${pageIndex}&PageSize=${pageSize}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getToken()}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch partners: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get partners error:', error);
      throw error;
    }
  }

  /**
   * Create new partner
   */
  async createPartner(partnerData: CreatePartnerRequest): Promise<Partner> {
    try {
      // MOCK DATA - Backend çalışmadığı için geçici test
      // const newPartner: Partner = {
      //   id: Date.now().toString(),
      //   name: partnerData.name,
      //   apiKey: partnerData.apiKey,
      //   createdDate: new Date().toISOString(),
      //   updatedDate: new Date().toISOString()
      // };
      // 
      // return newPartner;

      // Gerçek API çağrısı (backend çalıştığında)
      const response = await fetch(`${this.API_BASE_URL}/Partners`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify(partnerData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create partner: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Create partner error:', error);
      throw error;
    }
  }

  /**
   * Update partner
   */
  async updatePartner(partnerData: UpdatePartnerRequest): Promise<Partner> {
    try {
      // MOCK DATA - Backend çalışmadığı için geçici test
      // const updatedPartner: Partner = {
      //   id: partnerData.id,
      //   name: partnerData.name,
      //   apiKey: partnerData.apiKey || 'updated_api_key',
      //   createdDate: '2024-01-01T00:00:00Z', // Mock created date
      //   updatedDate: new Date().toISOString()
      // };
      // 
      // return updatedPartner;

      // Gerçek API çağrısı (backend çalıştığında)
      const response = await fetch(`${this.API_BASE_URL}/Partners`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify(partnerData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update partner: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update partner error:', error);
      throw error;
    }
  }

  /**
   * Get partner by ID
   */
  async getPartnerById(id: string): Promise<Partner> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/Partners/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch partner: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get partner by ID error:', error);
      throw error;
    }
  }

  /**
   * Delete partner
   */
  async deletePartner(id: string): Promise<void> {
    try {
      // MOCK DATA - Backend çalışmadığı için geçici test
      // Mock silme işlemi - gerçekte hiçbir şey yapmaz
      // console.log(`Mock delete partner with ID: ${id}`);
      // return;

      // Gerçek API çağrısı (backend çalıştığında)
      const response = await fetch(`${this.API_BASE_URL}/Partners/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete partner: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Delete partner error:', error);
      throw error;
    }
  }
}

export const partnerService = new PartnerService();

