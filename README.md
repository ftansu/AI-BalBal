# AI-BalBal — Balbal Frontend

`ntoydem/company-ai` backend'i ile çalışan, **Balbal** yapay zekâ asistanı etrafında kurulmuş kurumsal belge ve bilgi platformu arayüzü.

- **Tasarım kaynağı:** Claude Design canvas "X Platformu — Ana Sayfa" (Balbal kimliği, Space Grotesk / IBM Plex Sans, koyu yeşil palet)
- **Backend:** `ntoydem/company-ai` (Naci). Bu repo backend koduna dokunmaz, aynı API sözleşmesini kullanır.
- **Backend'e eklenmesi gerekenler:** [`docs/BACKEND_GAPS.md`](docs/BACKEND_GAPS.md)

## Ekranlar

| Ekran | Durum |
|---|---|
| Üst bar: arama, belge yükle, bildirimler, kullanıcı menüsü | Arama çalışıyor (belge ve proje). Kişi araması ve bildirimler backend bekliyor (B-05, B-02) |
| Balbal penceresi: geçmiş sorular, proje kapsamı, cevap türü rozeti, numaralı kaynaklar, versiyon uyarısı, geri bildirim | `/api/ask` ile çalışıyor. Geçmiş şimdilik oturumda tutuluyor (B-03), geri bildirim backend bekliyor (B-04) |
| Ekip sohbeti: sohbet listesi, şirket rehberi, grup, görüş talebi, belge paylaşımı | Arayüz hazır, backend bekliyor (B-05, B-06) |
| Ana sayfa "Gündeminiz" | Arayüz hazır, backend bekliyor (B-01) |
| Departman: Balbal'a Sor, Belgeler, Belge Yükle (+ AI etiket önerisi), Projeler | Çalışıyor |
| Belge detayı: versiyon zinciri linkleri, Excel dosya yapısı | Çalışıyor (`/api/excel/{id}/inspect`) |
| Yönetim: kullanıcılar, denetim kaydı, belge görünürlüğü | Çalışıyor (yalnızca admin) |

Backend'de henüz olmayan bir özellik çağrıldığında arayüz sahte veri göstermez. Onun yerine **"Backend bekleniyor"** kutusu ve beklenen endpoint'in adı görünür. Sözleşmeler `frontend/src/api/proposed.ts` dosyasındadır.

## Sabit tasarım kuralları

1. **Her dosya referansı tıklanabilir ve indirilebilir olmalı** (`components/common/FileLink.tsx`): belge listesi, kaynak kartları, Excel kaynakları, arama, bildirimler ve sohbet ekleri.
2. **Tek kişi = tek arayüz:** Çalışan doğrudan kendi (ana) departmanına yönlenir; departman seçme ekranını yalnızca yönetim ve admin görür.
3. **Sadelik:** Bilgi ekrana yığılmaz; kullanıcı Balbal'a yazarak sorar.
4. **Görsel değişiklik önce canvas'ta onaylanır**, sonra bu repoya gelir.

## Çalıştırma

Backend ayrı çalışır (`company-ai` reposunda `make up`). Sonra:

```bash
cd frontend
npm install
VITE_DEV_API_TARGET=http://localhost:8000 npm run dev
```

Kontroller: `npm run typecheck`, `npm run lint`, `npm run build`.

## Klasör yapısı (yeni eklenenler)

```
frontend/src/
  api/proposed.ts            backend'de henüz olmayan uçların sözleşmesi (BACKEND_GAPS)
  api/excel.ts               /api/excel/{id}/inspect
  components/shell/          üst bar panelleri: arama, bildirimler, kullanıcı menüsü
  components/balbal/         Balbal penceresi, cevap ve kaynak görünümü, oturum geçmişi
  components/team/           ekip sohbeti, rehber, görüş talebi
  components/common/         FileLink (dosya linki + İndir), Modal, PendingNotice
```
