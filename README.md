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
| Üst bar: arama, belge yükle, bildirimler, kullanıcı menüsü | Arama `GET /api/search` ile çalışıyor (belge içeriği + metadata — snippet ve sayfa —, proje, kişi; B-14). Kişi araması rehberden (`/api/directory`, B-05). Bildirimler backend bekliyor (B-02) |
| Balbal penceresi: geçmiş sorular, cevap türü + ürün katmanı rozeti (proje seçimi yok, canvas v165), Ç-7 veri durumu uyarıları (`warnings`), numaralı kaynaklar (önceki/sonraki versiyon tıklanabilir, proje adı kartta), geri bildirim | `/api/ask` ile çalışıyor (`product_level`, `warnings`, `audit_log_id`). Geçmiş şimdilik oturumda tutuluyor (B-03), geri bildirim ucu backend bekliyor (B-04) |
| Ekip sohbeti: sohbet listesi, şirket rehberi, grup, görüş talebi, belge paylaşımı | Rehber çalışıyor (`/api/directory`, B-05). Sohbet uçları backend bekliyor. Kişiler arası/grup sohbet (B-06b) **Ürün 1**; **Balbal bu sohbetlere dahil edilemez**, Balbal penceresi ayrıdır. Görüş talebi (B-06a) Ürün 2 |
| Ana sayfa "Gündeminiz" | Arayüz hazır, backend bekliyor (B-01) |
| Departman: Balbal'a Sor, Belgeler, Belge Yükle (+ AI etiket önerisi), Projeler | Çalışıyor |
| Belge detayı: versiyon zinciri linkleri, Excel dosya yapısı | Çalışıyor (`/api/excel/{id}/inspect`). Listede dosya türü (`file_kind`, B-13) ve onay durumu rozeti (`review_status`, B-28 — yalnızca gösterim; onay işlemleri ayrı PR'da). "Aç" PDF/görüntüyü tarayıcıda açar (`?inline=1`), "İndir" belge başlığıyla indirir (B-17) |
| Yönetim: kullanıcılar, denetim kaydı, belge görünürlüğü | Çalışıyor (yalnızca admin); sekmeli |
| Yönetim › Klasörler ve erişim: klasör ağacı, departman bazında görme/değiştirme, genel tablo, değişiklik geçmişi | Çalışıyor (`/api/admin/folders*`, B-26) |
| Belgeler: klasör ağacı (kendi klasörlerim + bana açılanlar), klasörde arama, proje süzme; Belge Yükle'de klasör seçimi | Çalışıyor (`/api/folders`, B-26). Roller: `department_manager` (B-08) kendi departmanının kısıtlı belgelerini görür; kartlar üyelik bazlı |
| Ürün anahtarı (B-25) | `enabled_products` backend'den geliyor. P2 kapalıyken "Gündeminiz", görüş talebi sekmesi ve Excel örnek soruları gizli (ekip sohbeti her pakette açık); cevap kartında `product_level` rozeti; alan gelmezse yalnızca P1 varsayılır |
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
