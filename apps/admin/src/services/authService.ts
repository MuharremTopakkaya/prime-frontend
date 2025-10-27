// Auth Service - JWT token decode ve authentication method kontrolü
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: {
    token: string;
    expirationDate: string;
  };
  requiredAuthenticatorType?: string;
}

export interface DecodedToken {
  sub: string; // User ID
  email: string;
  role: string[];
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationmethod': string; // Owner veya Customer
  exp: number;
  iat: number;
}

export type AuthenticationMethod = 'Owner' | 'Customer';

class AuthService {
  private readonly API_BASE_URL = 'http://localhost:5132/api'; // Backend URL'ini buraya ekleyin

  /**
   * Login işlemi - Backend'e istek atar
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // MOCK DATA - Database bağlantısı olmadığı için geçici test
      // if (credentials.email === 'test@gmail.com' && credentials.password === 'Tester123.') {
      //   // Mock token - Owner authentication method
      //   const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL2F1dGhlbnRpY2F0aW9ubWV0aG9kIjoiT3duZXIifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      //   
      //   return {
      //     accessToken: {
      //       token: mockToken,
      //       expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      //     }
      //   };
      // }
      // 
      // if (credentials.email === 'customer@test.com' && credentials.password === 'Customer123.') {
      //   // Mock token - Customer authentication method
      //   const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL2F1dGhlbnRpY2F0aW9ubWV0aG9kIjoiQ3VzdG9tZXIifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      //   
      //   return {
      //     accessToken: {
      //       token: mockToken,
      //       expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      //     }
      //   };
      // }

      // Gerçek API çağrısı
      const response = await fetch(`${this.API_BASE_URL}/Auth/Login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
      }

      const data: LoginResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * JWT token'ı decode eder ve authentication method'u döner
   */
  decodeToken(token: string): DecodedToken | null {
    try {
      // JWT token'ı decode et (header.payload.signature)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload) as DecodedToken;
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  }

  /**
   * Token'dan authentication method'u alır
   */
  getAuthenticationMethod(token: string): AuthenticationMethod | null {
    const decodedToken = this.decodeToken(token);
    if (!decodedToken) {
      return null;
    }

    const authMethod = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationmethod'];
    
    if (authMethod === 'Owner' || authMethod === 'Customer') {
      return authMethod as AuthenticationMethod;
    }

    return null;
  }

  /**
   * Token'ı localStorage'a kaydeder
   */
  saveToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  /**
   * Token'ı localStorage'dan alır
   */
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Token'ı localStorage'dan siler
   */
  removeToken(): void {
    localStorage.removeItem('accessToken');
  }

  /**
   * Token'ın geçerli olup olmadığını kontrol eder
   */
  isTokenValid(token: string): boolean {
    const decodedToken = this.decodeToken(token);
    if (!decodedToken) {
      return false;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp > currentTime;
  }

  /**
   * Login işlemi ve yönlendirme
   */
  async performLogin(credentials: LoginRequest): Promise<AuthenticationMethod | null> {
    try {
      const loginResponse = await this.login(credentials);
      
      if (loginResponse.accessToken?.token) {
        // Token'ı kaydet
        this.saveToken(loginResponse.accessToken.token);
        
        // Authentication method'u al
        const authMethod = this.getAuthenticationMethod(loginResponse.accessToken.token);
        
        return authMethod;
      }
      
      return null;
    } catch (error) {
      console.error('Login process error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
