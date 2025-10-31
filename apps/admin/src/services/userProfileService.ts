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

import { USE_MOCKS } from '../config/runtime';

class UserProfileService {
  private baseUrl = 'http://localhost:5132/api/Users';
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }

  async getUserProfile(): Promise<UserProfile> {
    try {
      if (USE_MOCKS) {
        return {
          id: '1234567890',
          name: 'John',
          surname: 'Doe',
          email: 'test@gmail.com',
          company: { id: 'company-123', name: 'Acme Corporation' },
          createdDate: '2024-01-15T10:30:00Z',
        };
      }
      const response = await fetch(`${this.baseUrl}/GetFromAuth`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  async updateProfile(profileData: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    try {
      if (USE_MOCKS) {
        return {
          id: '1234567890',
          name: profileData.name,
          surname: profileData.surname,
          email: profileData.email,
          accessToken: 'new-mock-token-' + Date.now(),
        };
      }
      const response = await fetch(`${this.baseUrl}/FromAuth`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update profile: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  async changePassword(passwordData: ChangePasswordRequest): Promise<UpdateProfileResponse> {
    try {
      if (USE_MOCKS) {
        return {
          id: '1234567890',
          name: passwordData.name,
          surname: passwordData.surname,
          email: passwordData.email,
          accessToken: 'new-mock-token-' + Date.now(),
        };
      }
      const response = await fetch(`${this.baseUrl}/FromAuth`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(passwordData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to change password: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }
}

export const userProfileService = new UserProfileService();
