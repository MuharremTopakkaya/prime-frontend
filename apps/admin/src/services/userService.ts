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

export interface UpdateUserRequest {
  id: string;
  name: string;
  surname: string;
  email: string;
  password?: string;
}

class UserService {
  private readonly API_BASE_URL = 'http://localhost:5132/api';

  /**
   * Get token from localStorage
   */
  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Get users list with pagination
   */
  async getUsers(pageIndex: number = 0, pageSize: number = 10, companyId?: string): Promise<GetUsersResponse> {
    try {
      // MOCK DATA - Backend çalışmadığı için geçici test
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

      // Pagination simulation
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

      // Gerçek API çağrısı (backend çalıştığında)
      // const url = companyId 
      //   ? `${this.API_BASE_URL}/Users?PageIndex=${pageIndex}&PageSize=${pageSize}&companyId=${companyId}`
      //   : `${this.API_BASE_URL}/Users?PageIndex=${pageIndex}&PageSize=${pageSize}`;
      // 
      // const response = await fetch(url, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${this.getToken()}`,
      //   },
      // });

      // if (!response.ok) {
      //   throw new Error(`Failed to fetch users: ${response.statusText}`);
      // }

      // const data = await response.json();
      // return data;
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
      // MOCK DATA - Backend çalışmadığı için geçici test
      const updatedUser: User = {
        id: userData.id,
        name: userData.name,
        surname: userData.surname,
        email: userData.email,
        createdDate: '2024-01-15T10:30:00Z', // Mock created date
        updatedDate: new Date().toISOString()
      };
      
      return updatedUser;

      // Gerçek API çağrısı (backend çalıştığında)
      // const response = await fetch(`${this.API_BASE_URL}/Users`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${this.getToken()}`,
      //   },
      //   body: JSON.stringify(userData),
      // });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || `Failed to update user: ${response.statusText}`);
      // }

      // const data = await response.json();
      // return data;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/Users/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get user by ID error:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
