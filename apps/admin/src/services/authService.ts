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
  private readonly API_BASE_URL = '/api'; // Dev ortamında Vite proxy üzerinden

  /**
   * Login işlemi - Backend'e istek atar
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/Auth/Login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      if (!response.ok) {
        // Backend tipik olarak ProblemDetails döndürür, mesajı yüzeye çıkar
        let errorMessage = `Login failed: ${response.status} ${response.statusText}`;
        try {
          const errorBody = await response.json();
          errorMessage = errorBody?.Detail || errorBody?.message || errorMessage;
        } catch {
          // JSON parse hatasını sessizce yut
        }
        throw new Error(errorMessage);
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
