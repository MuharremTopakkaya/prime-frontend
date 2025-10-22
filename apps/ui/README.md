# UI Application

Modern React komponentleri ile oluşturulmuş kullanıcı arayüzü uygulaması.

## Özellikler

- ⚡ **Vite** - Hızlı geliştirme ortamı
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 💅 **Styled Components** - CSS-in-JS
- 🎭 **Twin.macro** - Tailwind + Styled Components
- 🎬 **Framer Motion** - Animasyonlar
- 📱 **Responsive** - Mobil uyumlu tasarım
- 🔷 **TypeScript** - Tip güvenli kod

## Komponentler

### Hero Bileşenleri
- `TwoColumnWithVideo` - Video içeren iki sütunlu hero
- `TwoColumnWithInput` - Input formu içeren hero
- `BackgroundAsImage` - Arka plan resmli hero

### Card Bileşenleri
- `ThreeColSlider` - 3 sütunlu slider kartlar
- `TabCardGrid` - Tab navigasyonlu kart grid

### Feature Bileşenleri
- `TwoColWithButton` - Buton içeren iki sütunlu feature

### Form Bileşenleri
- `SimpleContactUs` - İletişim formu

### CTA Bileşenleri
- `GetStarted` - Call-to-action bölümü

### Footer Bileşenleri
- `FiveColumnWithInputForm` - 5 sütunlu footer

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Kullanım

Komponentleri sayfalarınızda şu şekilde kullanabilirsiniz:

```tsx
import React from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage";
import TwoColumnWithVideo from "components/hero/TwoColumnWithVideo";
import ThreeColSlider from "components/cards/ThreeColSlider";

const MyPage: React.FC = () => {
  return (
    <AnimationRevealPage>
      <TwoColumnWithVideo />
      <ThreeColSlider />
    </AnimationRevealPage>
  );
};

export default MyPage;
```

## Yapılandırma

### Path Aliases

`tsconfig.json` ve `vite.config.ts` dosyalarında path alias'ları tanımlanmıştır:

- `components/*` → `src/components/*`
- `helpers/*` → `src/helpers/*`
- `images/*` → `src/images/*`

### Tailwind

`tailwind.config.js` dosyasında özel renkler ve stil ayarları yapılabilir.

### Twin.macro

`babel-plugin-macros.config.js` dosyasında twin.macro ayarları bulunur.

## Geliştirme

Yeni komponent eklemek için:

1. `src/components/[kategori]/` altında yeni komponenti oluşturun
2. TypeScript interface'lerini tanımlayın
3. Styled components ve twin.macro ile stillendirin
4. Export edin ve sayfalarınızda kullanın

## Port

Uygulama varsayılan olarak **5174** portunda çalışır.

## Lisans

MIT

