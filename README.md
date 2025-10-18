# Prime Frontend

Modern React monorepo projesi - admin paneli, kullanıcı arayüzü ve ortak bileşenler için.

## Proje Yapısı

```
prime-frontend/
├── apps/
│   ├── admin/          # React admin paneli
│   └── ui/             # React kullanıcı arayüzü
├── packages/
│   ├── shared-ui/      # Ortak UI bileşenleri
│   └── shared-utils/   # Ortak utility fonksiyonları
└── package.json        # Root package.json (workspaces)
```

## Kurulum

```bash
# Tüm bağımlılıkları yükle
npm run install:all

# Veya
npm install
```

## Geliştirme

```bash
# Admin paneli geliştirme modunda çalıştır
npm run dev:admin

# Kullanıcı arayüzü geliştirme modunda çalıştır
npm run dev:ui

# Tüm projeleri build et
npm run build

# Temizlik yap
npm run clean
```

## Workspace Komutları

```bash
# Belirli bir workspace'te komut çalıştır
npm run <script> --workspace=@prime/admin
npm run <script> --workspace=@prime/ui
npm run <script> --workspace=@prime/shared-ui
npm run <script> --workspace=@prime/shared-utils
```

## Teknolojiler

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **npm workspaces** - Monorepo yönetimi

## Geliştirme Rehberi

1. Yeni özellikler için uygun workspace'i seçin
2. Ortak bileşenler için `packages/shared-ui` kullanın
3. Ortak utility fonksiyonları için `packages/shared-utils` kullanın
4. Her workspace kendi bağımsız geliştirme döngüsüne sahiptir