export interface UserProfile {
  id: string;
  name: string;
  surname: string;
  email: string;
  company: {
    id: string;
    name: string;
  };
  createdDate: string;
}

export interface UpdateProfileRequest {
  name: string;
  surname: string;
  email: string;
}

export interface ChangePasswordRequest {
  name: string;
  surname: string;
  email: string;
  password: string;
  newPassword: string;
}

export interface UpdateProfileResponse {
  id: string;
  name: string;
  surname: string;
  email: string;
  accessToken: string;
}

class UserProfileService {
  private baseUrl = '/api/Users';

  async getUserProfile(): Promise<UserProfile> {
    try {
      // MOCK DATA - Backend çalışmadığı için geçici test
      console.log('Loading mock user profile...');
      const mockProfile: UserProfile = {
        id: '1234567890',
        name: 'John',
        surname: 'Doe',
        email: 'test@gmail.com',
        company: {
          id: 'company-123',
          name: 'Acme Corporation'
        },
        createdDate: '2024-01-15T10:30:00Z'
      };
      console.log('Mock profile loaded:', mockProfile);
      return mockProfile;
      
      // Actual API call (backend çalıştığında)
      // const response = await fetch(`${this.baseUrl}/GetFromAuth`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //   },
      // });

      // if (!response.ok) {
      //   throw new Error(`Failed to fetch user profile: ${response.statusText}`);
      // }

      // const data = await response.json();
      // return data;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  async updateProfile(profileData: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    try {
      // MOCK DATA - Backend çalışmadığı için geçici test
      const mockResponse: UpdateProfileResponse = {
        id: '1234567890',
        name: profileData.name,
        surname: profileData.surname,
        email: profileData.email,
        accessToken: 'new-mock-token-' + Date.now()
      };
      console.log('Mock profile update:', mockResponse);
      return mockResponse;
      
      // Actual API call (backend çalıştığında)
      // const response = await fetch(`${this.baseUrl}/FromAuth`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //   },
      //   body: JSON.stringify(profileData),
      // });

      // if (!response.ok) {
      //   throw new Error(`Failed to update profile: ${response.statusText}`);
      // }

      // const data = await response.json();
      // return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  async changePassword(passwordData: ChangePasswordRequest): Promise<UpdateProfileResponse> {
    try {
      // MOCK DATA - Backend çalışmadığı için geçici test
      const mockResponse: UpdateProfileResponse = {
        id: '1234567890',
        name: passwordData.name,
        surname: passwordData.surname,
        email: passwordData.email,
        accessToken: 'new-mock-token-' + Date.now()
      };
      console.log('Mock password change:', mockResponse);
      return mockResponse;
      
      // Actual API call (backend çalıştığında)
      // const response = await fetch(`${this.baseUrl}/FromAuth`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //   },
      //   body: JSON.stringify(passwordData),
      // });

      // if (!response.ok) {
      //   throw new Error(`Failed to change password: ${response.statusText}`);
      // }

      // const data = await response.json();
      // return data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }
}

export const userProfileService = new UserProfileService();
