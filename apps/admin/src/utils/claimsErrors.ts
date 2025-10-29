/**
 * Claims Error Handling Utilities
 * 
 * Claims ile ilgili error handling için standart utilities
 */

/**
 * Claims Error Types
 */
export enum ClaimsErrorType {
  /** Network error (connection failed, timeout, etc.) */
  NetworkError = 'NETWORK_ERROR',
  
  /** 401 Unauthorized (token invalid/expired) */
  UnauthorizedError = 'UNAUTHORIZED_ERROR',
  
  /** 403 Forbidden (no permission) */
  ForbiddenError = 'FORBIDDEN_ERROR',
  
  /** 404 Not Found (user not found, etc.) */
  NotFoundError = 'NOT_FOUND_ERROR',
  
  /** 500 Server Error */
  ServerError = 'SERVER_ERROR',
  
  /** Invalid response format */
  InvalidResponseError = 'INVALID_RESPONSE_ERROR',
  
  /** Claims data not available */
  ClaimsNotAvailableError = 'CLAIMS_NOT_AVAILABLE_ERROR',
  
  /** Unknown error */
  UnknownError = 'UNKNOWN_ERROR',
}

/**
 * Custom Claims Error Class
 */
export class ClaimsError extends Error {
  constructor(
    public type: ClaimsErrorType,
    message: string,
    public originalError?: Error,
    public statusCode?: number,
    public responseData?: any
  ) {
    super(message);
    this.name = 'ClaimsError';
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ClaimsError);
    }
  }
  
  /**
   * Check if error is recoverable (can retry)
   */
  isRecoverable(): boolean {
    return [
      ClaimsErrorType.NetworkError,
      ClaimsErrorType.ServerError,
    ].includes(this.type);
  }
  
  /**
   * Check if error requires logout/reauth
   */
  requiresReauth(): boolean {
    return [
      ClaimsErrorType.UnauthorizedError,
    ].includes(this.type);
  }
  
  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    switch (this.type) {
      case ClaimsErrorType.NetworkError:
        return 'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.';
      case ClaimsErrorType.UnauthorizedError:
        return 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.';
      case ClaimsErrorType.ForbiddenError:
        return 'Bu işlem için yetkiniz bulunmamaktadır.';
      case ClaimsErrorType.NotFoundError:
        return 'İstenen kayıt bulunamadı.';
      case ClaimsErrorType.ServerError:
        return 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
      case ClaimsErrorType.InvalidResponseError:
        return 'Sunucudan geçersiz yanıt alındı.';
      case ClaimsErrorType.ClaimsNotAvailableError:
        return 'Yetki bilgileri yüklenemedi.';
      default:
        return 'Beklenmeyen bir hata oluştu.';
    }
  }
  
  /**
   * Get translation key for error message
   */
  getTranslationKey(): string {
    const keyMap: Record<ClaimsErrorType, string> = {
      [ClaimsErrorType.NetworkError]: 'claims.errors.networkError',
      [ClaimsErrorType.UnauthorizedError]: 'claims.errors.unauthorizedError',
      [ClaimsErrorType.ForbiddenError]: 'claims.errors.forbiddenError',
      [ClaimsErrorType.NotFoundError]: 'claims.errors.notFoundError',
      [ClaimsErrorType.ServerError]: 'claims.errors.serverError',
      [ClaimsErrorType.InvalidResponseError]: 'claims.errors.invalidResponseError',
      [ClaimsErrorType.ClaimsNotAvailableError]: 'claims.errors.claimsNotAvailableError',
      [ClaimsErrorType.UnknownError]: 'claims.errors.unknownError',
    };
    return keyMap[this.type];
  }
}

/**
 * Create ClaimsError from fetch Response
 */
export function createClaimsErrorFromResponse(
  response: Response,
  originalError?: Error
): ClaimsError {
  let errorType: ClaimsErrorType;
  let message: string;
  
  switch (response.status) {
    case 401:
      errorType = ClaimsErrorType.UnauthorizedError;
      message = 'Yetki hatası: Oturum süreniz dolmuş olabilir.';
      break;
    case 403:
      errorType = ClaimsErrorType.ForbiddenError;
      message = 'Yetkisiz erişim: Bu işlem için yetkiniz bulunmamaktadır.';
      break;
    case 404:
      errorType = ClaimsErrorType.NotFoundError;
      message = 'Kayıt bulunamadı.';
      break;
    case 500:
    case 502:
    case 503:
      errorType = ClaimsErrorType.ServerError;
      message = 'Sunucu hatası.';
      break;
    default:
      errorType = ClaimsErrorType.UnknownError;
      message = `Beklenmeyen hata: ${response.status}`;
  }
  
  return new ClaimsError(
    errorType,
    message,
    originalError,
    response.status
  );
}

/**
 * Create ClaimsError from network error
 */
export function createClaimsErrorFromNetwork(
  error: Error | unknown
): ClaimsError {
  const originalError = error instanceof Error ? error : new Error(String(error));
  
  return new ClaimsError(
    ClaimsErrorType.NetworkError,
    'Bağlantı hatası oluştu.',
    originalError
  );
}

/**
 * Create ClaimsError from invalid response
 */
export function createClaimsErrorFromInvalidResponse(
  reason: string,
  responseData?: any
): ClaimsError {
  return new ClaimsError(
    ClaimsErrorType.InvalidResponseError,
    `Geçersiz yanıt: ${reason}`,
    undefined,
    undefined,
    responseData
  );
}

/**
 * Handle error and return user-friendly message
 */
export function handleClaimsError(error: unknown): string {
  if (error instanceof ClaimsError) {
    return error.getUserMessage();
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Beklenmeyen bir hata oluştu.';
}

/**
 * Check if error requires immediate logout
 */
export function shouldLogoutOnError(error: unknown): boolean {
  if (error instanceof ClaimsError) {
    return error.requiresReauth();
  }
  
  return false;
}

