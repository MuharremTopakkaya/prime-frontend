export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
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

export interface GetUsersResponse {
  items: User[];
  pagination: PaginationResponse;
}

export interface UserClaim {
  id: number;
  name: string;
  description: string;
  isRequired: boolean;
  isAssigned: boolean;
}

export interface UserClaimsGroup {
  group: string;
  claims: UserClaim[];
}

export interface UpdateUserRequest {
  id: string;
  companyId: string;
  name: string;
  surname: string;
  email: string;
  password?: string;
}

export interface CreateUserRequest {
  companyId: string;
  name: string;
  surname: string;
  email: string;
  password: string;
}

export interface UpdateUserClaimsRequest {
  userId: string;
  claimIds: number[];
}

import { USE_MOCKS } from '../config/runtime';

class UserService {
  private readonly API_BASE_URL = '/api';
  private readonly USE_MOCKS = USE_MOCKS;

  /**
   * Get token from localStorage
   */
  private getToken(): string | null {
    return localStorage.getItem('authToken') || localStorage.getItem('accessToken');
  }

  /**
   * Get users list with pagination
   */
  async getUsers(pageIndex: number = 0, pageSize: number = 10, companyId?: string): Promise<GetUsersResponse> {
    try {
      if (this.USE_MOCKS) {
        const mockUsers: User[] = [
        {
          id: '1',
          name: 'John',
          surname: 'Doe',
          email: 'john.doe@techcorp.com',
          createdDate: '2024-01-15T10:30:00Z',
          updatedDate: '2024-01-20T14:45:00Z'
        },
        {
          id: '2',
          name: 'Jane',
          surname: 'Smith',
          email: 'jane.smith@techcorp.com',
          createdDate: '2024-01-16T09:15:00Z',
          updatedDate: '2024-01-21T16:20:00Z'
        },
        {
          id: '3',
          name: 'Mike',
          surname: 'Johnson',
          email: 'mike.johnson@techcorp.com',
          createdDate: '2024-01-17T08:00:00Z',
          updatedDate: '2024-01-22T11:30:00Z'
        },
        {
          id: '4',
          name: 'Sarah',
          surname: 'Wilson',
          email: 'sarah.wilson@techcorp.com',
          createdDate: '2024-01-18T13:45:00Z',
          updatedDate: '2024-01-23T10:15:00Z'
        },
        {
          id: '5',
          name: 'David',
          surname: 'Brown',
          email: 'david.brown@techcorp.com',
          createdDate: '2024-01-19T12:00:00Z',
          updatedDate: '2024-01-24T15:45:00Z'
        }
        ];
        const startIndex = pageIndex * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedUsers = mockUsers.slice(startIndex, endIndex);
        const totalRecords = mockUsers.length;
        const totalPages = Math.ceil(totalRecords / pageSize);
        return {
          items: paginatedUsers,
          pagination: {
            index: pageIndex,
            size: pageSize,
            count: totalRecords,
            pages: totalPages,
            hasPrevious: pageIndex > 0,
            hasNext: pageIndex < totalPages - 1
          }
        };
      }

      const url = companyId
        ? `${this.API_BASE_URL}/Users?PageIndex=${pageIndex}&PageSize=${pageSize}&companyId=${companyId}`
        : `${this.API_BASE_URL}/Users?PageIndex=${pageIndex}&PageSize=${pageSize}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  }

  /**
   * Update user
   */
  async updateUser(userData: UpdateUserRequest): Promise<User> {
    try {
      if (this.USE_MOCKS) {
        return {
          id: userData.id,
          name: userData.name,
          surname: userData.surname,
          email: userData.email,
          createdDate: '2024-01-15T10:30:00Z',
          updatedDate: new Date().toISOString()
        };
      }
      const response = await fetch(`${this.API_BASE_URL}/Users`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update user: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  /**
   * Create user
   */
  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      if (this.USE_MOCKS) {
        return {
          id: `mock-${Date.now()}`,
          name: userData.name,
          surname: userData.surname,
          email: userData.email,
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString(),
        };
      }

      const response = await fetch(`${this.API_BASE_URL}/Users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create user: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  }

  async getUserClaims(userId: string): Promise<UserClaimsGroup[]> {
    try {
      if (this.USE_MOCKS) {
        // MOCK DATA - Different profiles for testing
        const mockProfiles = {
          'admin-user': [
            {
              group: 'FullControl',
              claims: [
                {
                  id: 1,
                  name: 'FullControl',
                  description: 'Tüm sistemi eksiksiz kullanabilirsiniz. Bu yetki sadece Prime şirketi için geçerlidir.',
                  isRequired: false,
                  isAssigned: true,
                },
              ],
            },
          ],
          'customer-user': [
            // Düz müşteri: Companies/Partners için hiçbir claim verilmez
            {
              group: 'Company',
              claims: []
            },
            {
              group: 'Partner',
              claims: []
            }
          ],
          'mock-user-id': [
            {
              group: 'FullControl',
              claims: [
                {
                  id: 1,
                  name: 'FullControl',
                  description: 'Tüm sistemi eksiksiz kullanabilirsiniz. Bu yetki sadece Prime şirketi için geçerlidir.',
                  isRequired: false,
                  isAssigned: false,
                },
              ],
            },
            {
              group: 'Company',
              claims: [
                {
                  id: 4,
                  name: 'Companies.Admin',
                  description: 'Şirket ile ilgili tüm işlemleri yapabilir',
                  isRequired: false,
                  isAssigned: true,
                },
                {
                  id: 5,
                  name: 'Companies.Read',
                  description: 'Şirket bilgilerini görüntüleyebilir',
                  isRequired: true,
                  isAssigned: true,
                },
                {
                  id: 6,
                  name: 'Companies.Create',
                  description: 'Yeni şirket oluşturabilir',
                  isRequired: false,
                  isAssigned: false,
                },
                {
                  id: 7,
                  name: 'Companies.Update',
                  description: 'Şirket bilgilerini güncelleyebilir',
                  isRequired: false,
                  isAssigned: true,
                },
              ],
            },
            {
              group: 'User',
              claims: [
                {
                  id: 8,
                  name: 'Users.Admin',
                  description: 'Kullanıcılar ile ilgili tüm işlemleri yapabilir',
                  isRequired: false,
                  isAssigned: false,
                },
                {
                  id: 9,
                  name: 'Users.Read',
                  description: 'Kullanıcı bilgilerini görüntüleyebilir',
                  isRequired: true,
                  isAssigned: true,
                },
                {
                  id: 10,
                  name: 'Users.Create',
                  description: 'Yeni kullanıcı oluşturabilir',
                  isRequired: false,
                  isAssigned: false,
                },
                {
                  id: 11,
                  name: 'Users.Update',
                  description: 'Kullanıcı bilgilerini güncelleyebilir',
                  isRequired: false,
                  isAssigned: true,
                },
              ],
            },
            {
              group: 'Partner',
              claims: [ 
                {
                  id: 12,
                  name: 'Partners.Admin',
                  description: 'İş ortakları ile ilgili tüm işlemleri yapabilir',
                  isRequired: false,
                  isAssigned: false,
                },
                {
                  id: 13,
                  name: 'Partners.Read',
                  description: 'İş ortağı bilgilerini görüntüleyebilir',
                  isRequired: true,
                  isAssigned: true,
                },
                {
                  id: 14,
                  name: 'Partners.Create',
                  description: 'Yeni iş ortağı oluşturabilir',
                  isRequired: false,
                  isAssigned: false,
                },
                {
                  id: 15,
                  name: 'Partners.Update',
                  description: 'İş ortağı bilgilerini güncelleyebilir',
                  isRequired: false,
                  isAssigned: false,
                },
              ],
            },
          ],
        };

        const profileKey = userId in mockProfiles ? userId : 'mock-user-id';
        const mockUserClaims = (mockProfiles as any)[profileKey as keyof typeof mockProfiles];
        const sortedGroups = mockUserClaims.sort((a: any, b: any) => {
          if (a.group === 'FullControl') return -1;
          if (b.group === 'FullControl') return 1;
          return a.group.localeCompare(b.group);
        });
        return sortedGroups as unknown as UserClaimsGroup[];
      }

      const response = await fetch(`${this.API_BASE_URL}/UserOperationClaims/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch user claims: ${response.statusText}`);
      }
      const data: UserClaimsGroup[] = await response.json();
      const sortedGroups = data.sort((a, b) => {
        if (a.group === 'FullControl') return -1;
        if (b.group === 'FullControl') return 1;
        return a.group.localeCompare(b.group);
      });
      return sortedGroups;
    } catch (error) {
      console.error('Get user claims error:', error);
      throw error;
    }
  }

  /**
   * Get user claims from auth (reads user from JWT)
   */
  async getUserClaimsFromAuth(): Promise<UserClaimsGroup[]> {
    try {
      if (this.USE_MOCKS) {
        // Mock akışında varsayılan kullanıcı profilini döndür
        return this.getUserClaims('mock-user-id');
      }

      const response = await fetch(`${this.API_BASE_URL}/UserOperationClaims/GetFromAuth`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch user claims: ${response.statusText}`);
      }
      const data: UserClaimsGroup[] = await response.json();
      const sortedGroups = data.sort((a, b) => {
        if (a.group === 'FullControl') return -1;
        if (b.group === 'FullControl') return 1;
        return a.group.localeCompare(b.group);
      });
      return sortedGroups;
    } catch (error) {
      console.error('Get user claims (from auth) error:', error);
      throw error;
    }
  }

  async updateUserClaims(request: UpdateUserClaimsRequest): Promise<void> {
    try {
      if (this.USE_MOCKS) {
        console.log('✅ Mock update user claims:', request);
        return;
      }
      const response = await fetch(`${this.API_BASE_URL}/UserOperationClaims`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        throw new Error(`Failed to update user claims: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Update user claims error:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
