# AI-BalBal — Frontend

Bu repo, `ntoydem/company-ai` backend'i (Naci) ile çalışacak, **Balbal** marka
kimliğiyle yeniden düzenlenmiş frontend'i içerir.

## Neden ayrı repo

Naci'nin `company-ai` reposundaki backend koduna dokunulmadı. Bu frontend,
backend'in **aynı API sözleşmesini** (`/api/...`) kullanır — backend
ayrı çalıştırılıp bu frontend ona bağlanabilir. Amaç: Naci'nin (ve onun
yapay zeka asistanının) bu kodu inceleyip kendi tarafında hangi backend
özelliklerinin eksik/uyumsuz olduğunu görmesi.

## Kaynak ve mantık

- Kod yapısı (`frontend/`) `company-ai` reposundaki Vite + React + TypeScript
  frontend'inin mimarisi temel alınarak hazırlandı (aynı sayfa/komponent/API
  katmanı deseni; react-router + TanStack Query).
- Görsel kimlik (renk paleti, fontlar — Space Grotesk / IBM Plex Sans, "Balbal"
  markası) daha önce hazırlanan Claude Design canvas'ından (Ana Sayfa mockup'ı)
  alındı.

## Bu sürümde yapılan değişiklikler

- Renk paleti ve fontlar canvas'taki Balbal kimliğine uyduruldu
  (`src/styles.css`).
- Marka adı "Balbal" olarak güncellendi (`src/lib/strings.ts`,
  `src/components/Layout.tsx`).
- Ana sayfa: tek departmanı olan kullanıcı doğrudan kendi departmanına
  yönlendiriliyor (departman seçim ekranı atlanıyor) — canvas'taki "tek kişi
  = tek arayüz" ilkesi (`src/pages/Home.tsx`).
- Ana sayfaya "Gündeminiz" özet bölümü eklendi — **şu an sadece arayüz
  iskeleti**, bunu besleyecek bir backend endpoint'i henüz yok.
- Dosya referanslarında indirme linki kontrolü yapıldı — `SourceCardList.tsx`
  ve `DocumentDetailPanel.tsx` bunu zaten uyguluyor.

## Çalıştırma

Backend ayrı çalışmalı (bkz. `company-ai` reposu, `make up`). Sonra:

```bash
cd frontend
npm install
VITE_DEV_API_TARGET=http://localhost:8000 npm run dev
```

## Naci'nin backend'inde kontrol edilmesi/eklenmesi gerekenler

- "Gündeminiz" (kişiye özel profesyonel uyarı/takip listesi) için bir
  endpoint yok — bu, ana sayfanın özet kutusunu besleyecek.
- Gerçek Balbal logosu (görsel dosya) henüz entegre edilmedi, sadece
  placeholder bir işaret var.
