# Authentication System Implementation

Bu proje, JWT token tabanlı authentication sistemi ile Owner ve Customer panellerine yönlendirme yapan bir React uygulamasıdır.

## Özellikler

### 🔐 Authentication Service
- JWT token decode işlemi
- Authentication method kontrolü (Owner/Customer)
- Token validation ve storage
- Backend API entegrasyonu

### 🎯 Routing System
- **Owner** authentication method → Admin Panel (`/admin/*`)
- **Customer** authentication method → Customer Panel (`/customer/*`)
- Protected routes ile yetki kontrolü
- Otomatik yönlendirme

### 📱 Components
- **Login Component**: Email/password ile giriş
- **AuthContext**: Global authentication state management
- **CustomerDashboard**: Customer panel component'i
- **ProtectedRoute**: Yetki kontrolü yapan wrapper component

## Backend Entegrasyonu

### Login Endpoint
```
POST /api/Auth/Login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Response
```json
{
  "accessToken": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expirationDate": "2024-01-01T12:00:00Z"
  }
}
```

### JWT Token Claims
Token içinde şu claim bulunur:
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationmethod`: "Owner" veya "Customer"

## Kullanım

1. **Login**: `/auth/sign-in` sayfasından giriş yapın
2. **Otomatik Yönlendirme**: Authentication method'a göre:
   - Owner → `/admin/default`
   - Customer → `/customer/dashboard`
3. **Yetki Kontrolü**: Yanlış panele erişim denemesi → `/unauthorized`

## Dosya Yapısı

```
src/
├── services/
│   └── authService.ts          # JWT decode ve API calls
├── contexts/
│   └── AuthContext.tsx         # Global auth state
├── views/
│   ├── auth/signIn/index.tsx   # Login component
│   └── customer/
│       └── CustomerDashboard.tsx # Customer panel
├── App.tsx                     # Routing ve protected routes
└── types/
    └── assets.d.ts             # Asset type declarations
```

## Geliştirme Notları

- Backend URL'i `authService.ts` dosyasında `API_BASE_URL` değişkeninde tanımlanmıştır
- Token localStorage'da saklanır
- Component'ler best practice'lere uygun olarak modüler yapıda tasarlanmıştır
- TypeScript ile tip güvenliği sağlanmıştır

## Test Senaryoları

1. **Owner Login**: Owner authentication method ile giriş → Admin panel'e yönlendirme
2. **Customer Login**: Customer authentication method ile giriş → Customer panel'e yönlendirme
3. **Invalid Credentials**: Hatalı bilgilerle giriş → Error message
4. **Token Expiry**: Süresi dolmuş token → Login sayfasına yönlendirme
5. **Unauthorized Access**: Yanlış panele erişim → Unauthorized page
