// Auth Service - JWT token decode ve authentication method kontrolü
import { USE_MOCKS } from '../config/runtime';

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

interface MockUser {
  id: string;
  email: string;
  password: string;
  authenticationMethod: AuthenticationMethod;
  roles: string[];
  fullName: string;
}

const MOCK_USERS: MockUser[] = [
  {
    id: 'owner-1',
    email: 'salikkutluk@mail.com',
    password: '123456',
    authenticationMethod: 'Owner',
    roles: ['Admin'],
    fullName: 'Salih Kutluk',
  },
  {
    id: 'owner-2',
    email: 'salihsaygili@mail.com',
    password: '123456',
    authenticationMethod: 'Owner',
    roles: ['Admin'],
    fullName: 'Salih Saygılı',
  },
  {
    id: 'customer-1',
    email: 'adem@mail.com',
    password: '123456',
    authenticationMethod: 'Customer',
    roles: ['Customer'],
    fullName: 'Adem Müşteri',
  },
];

type NodeBufferLike = {
  from: (input: string, encoding?: string) => {
    toString: (encoding?: string) => string;
  };
};

const toBase64 = (value: string): string => {
  if (typeof window === 'undefined') {
    const nodeBuffer = (globalThis as { Buffer?: NodeBufferLike }).Buffer;
    if (nodeBuffer) {
      return nodeBuffer.from(value, 'utf-8').toString('base64');
    }
    // SSR ortamında Buffer yoksa basit bir fallback kullan
    return BufferFallback(value);
  }
  return btoa(unescape(encodeURIComponent(value)));
};

const BufferFallback = (input: string): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let str = encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) =>
    String.fromCharCode(Number.parseInt(p1, 16))
  );
  let output = '';
  for (let block = 0, charCode: number, i = 0, map = chars;
    str.charAt(i | 0) || ((map = '='), i % 1);
    output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
  ) {
    charCode = str.charCodeAt((i += 3 / 4));
    if (charCode > 0xff) {
      throw new Error('Invalid character in BufferFallback');
    }
    block = (block << 8) | charCode;
  }
  return output;
};

const base64UrlEncode = (obj: Record<string, unknown>): string => {
  const base64 = toBase64(JSON.stringify(obj));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const createMockToken = (user: MockUser): string => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.roles,
    name: user.fullName,
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationmethod': user.authenticationMethod,
    exp: now + 7 * 24 * 60 * 60,
    iat: now,
  };
  return `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.mock-signature`;
};

class AuthService {
  private readonly API_BASE_URL = '/api'; // Dev ortamında Vite proxy üzerinden
  private readonly USE_MOCKS = USE_MOCKS;

  /**
   * Login işlemi - Backend'e istek atar
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      if (this.USE_MOCKS) {
        const matchedUser = MOCK_USERS.find(
          (user) =>
            user.email.toLowerCase() === credentials.email.toLowerCase() &&
            user.password === credentials.password
        );

        if (!matchedUser) {
          throw new Error('Geçersiz kullanıcı adı veya şifre');
        }

        const token = createMockToken(matchedUser);
        const expiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

        return {
          accessToken: {
            token,
            expirationDate: expiration,
          },
          requiredAuthenticatorType: 'Password',
        };
      }

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
