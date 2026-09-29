# AI-BalBal — Balbal Frontend

`ntoydem/company-ai` backend'i ile çalışan, **Balbal** yapay zekâ asistanı etrafında kurulmuş kurumsal belge ve bilgi platformu arayüzü.

- **Tasarım kaynağı:** Claude Design canvas "X Platformu — Ana Sayfa" (Balbal kimliği, Space Grotesk / IBM Plex Sans, koyu yeşil palet)
- **Ürünün arayüzü bu repodur.** `ntoydem/company-ai` içindeki `frontend/` klasörü yalnızca backend'i denemek için kullanılan test arayüzüdür.
- **Backend:** `ntoydem/company-ai` (backend tarafı). Bu repo backend koduna dokunmaz, aynı API sözleşmesini kullanır.
- **Backend'e eklenmesi gerekenler:** [`docs/BACKEND_GAPS.md`](docs/BACKEND_GAPS.md)

## Ekranlar

| Ekran | Durum |
|---|---|
| **Ürün 1 ana sayfası** (canvas: "X Platformu — Ürün 1") — **yalnızca Ürün 1 içindir** | Çalışıyor: ortada büyük Balbal çubuğu, departmana özel örnek sorular, kaynaklı cevaplar; tablo/gösterge yok. Yalnızca Ürün 1 açıkken görünür. Ayrıntı: [`docs/URUN1_ARAYUZ.md`](docs/URUN1_ARAYUZ.md) |
| Giriş (canvas: Giris.dc.html) | Çalışıyor: marka alanı + giriş kartı, şifre göster/gizle, backend'in hata mesajları |
| Üst bar: arama, belge yükle, bildirimler, kullanıcı menüsü | Arama çalışıyor (belge ve proje). Kişi araması ve bildirimler backend bekliyor (B-05, B-02) |
| Balbal penceresi: geçmiş sorular, cevap türü rozeti (proje seçimi yok, canvas v165), numaralı kaynaklar, versiyon uyarısı, geri bildirim | `/api/ask` ile çalışıyor. Geçmiş şimdilik oturumda tutuluyor (B-03), geri bildirim backend bekliyor (B-04) |
| Ekip sohbeti: sohbet listesi, şirket rehberi, grup, görüş talebi, belge paylaşımı | Arayüz hazır, backend bekliyor. Kişiler arası/grup sohbet (B-06b) ve rehber (B-05) **Ürün 1**; **Balbal bu sohbetlere dahil edilemez**, Balbal penceresi ayrıdır. Görüş talebi (B-06a) Ürün 2 |
| Ana sayfa "Gündeminiz" | Arayüz hazır, backend bekliyor (B-01) |
| Departman: Balbal'a Sor, Belgeler, Belge Yükle (+ AI etiket önerisi), Projeler | Çalışıyor |
| Belge detayı: versiyon zinciri linkleri, Excel dosya yapısı | Çalışıyor (`/api/excel/{id}/inspect`) |
| Yönetim: kullanıcılar, denetim kaydı, belge görünürlüğü | Çalışıyor (yalnızca admin); sekmeli |
| Yönetim › Klasörler ve erişim: klasör ağacı, departman bazında görme/değiştirme, genel tablo, değişiklik geçmişi | Arayüz hazır, backend bekliyor (B-26) |
| Belgeler: klasör ağacı (kendi klasörlerim + bana açılanlar), klasörde arama, proje süzme; Belge Yükle'de klasör seçimi | Arayüz hazır, backend bekliyor (B-26). Backend klasör sunmadıkça bugünkü departman listesi ve yükleme çalışır |
| Ürün anahtarı (B-25) | P2 kapalıyken "Gündeminiz" ve görüş talebi sekmesi gizli (ekip sohbeti her pakette açık); alan gelmezse yalnızca P1 varsayılır |
| İzin talebi (Balbal ile), Taleplerim, Onay kuyruğu | Henüz tasarlanmadı; önce canvas. Backend sözleşmesi hazır (B-22, `proposed.ts` §8) |
| Gelen yazı / dava evrakı → cevap ve dilekçe taslağı | Henüz tasarlanmadı; önce canvas. Backend sözleşmesi hazır (B-23, `proposed.ts` §9) |

Backend'de henüz olmayan bir özellik çağrıldığında arayüz sahte veri göstermez. Onun yerine **"Backend bekleniyor"** kutusu ve beklenen endpoint'in adı görünür. Sözleşmeler `frontend/src/api/proposed.ts` dosyasındadır.

## Sabit tasarım kuralları

1. **Her dosya referansı tıklanabilir ve indirilebilir olmalı** (`components/common/FileLink.tsx`): belge listesi, kaynak kartları, Excel kaynakları, arama, bildirimler ve sohbet ekleri.
2. **Tek kişi = tek arayüz:** Çalışan doğrudan kendi (ana) departmanına yönlenir; departman seçme ekranını yalnızca yönetim ve admin görür.
3. **Sadelik:** Bilgi ekrana yığılmaz; kullanıcı Balbal'a yazarak sorar.
4. **Görsel değişiklik önce canvas'ta onaylanır**, sonra bu repoya gelir.
5. **Personel onayı olmadan hiçbir işlem ilerlemez (P-1).** Balbal yalnızca taslak üretir; taslak, sahibi arayüzdeki açık onay butonuyla onaylamadan kimseye görünmez ve hiçbir kuyruğa düşmez. Sohbette "onaylıyorum" yazmak onay değildir. Onaydan sonra içerik değişirse onay düşer. Ayrıntı: [`docs/BACKEND_GAPS.md` → P-1](docs/BACKEND_GAPS.md).

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
  components/team/           ekip sohbeti (Balbal dahil edilemez), rehber, görüş talebi
  components/common/         FileLink (dosya linki + İndir), Modal, PendingNotice
```
