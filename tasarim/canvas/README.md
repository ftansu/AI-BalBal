# Balbal — Onaylı Tasarım Kaynağı (Canvas)

Bu klasör, Ürün Yetkilisinin tasarım ortamındaki **"X Platformu — Ürün 2"** canvas'ının 07.10.2026 tarihli anlık kopyasıdır. Balbal projesinin **tam frontend tasarımıdır** (yalnızca Ürün 2 değil; ad tarihsel).

**Ürün etiketi:** Ürün 1 / Ürün 2 / Ürün 3 (tasarım tüm ürünleri kapsar; ürün ayrımı arayüz ve backend bittikten sonra yapılacak).

## Bu klasörün rolü (T-12)

- Buradaki ekranlar **Ürün Yetkilisi tarafından onaylanmış tasarımdır.** React frontend (`frontend/`) bu ekranları birebir uygulayarak geliştirilir; birebir uygulama ayrıca onay gerektirmez.
- Buradaki dosyalar **kod değildir**, çalışan uygulamanın parçası değildir; referanstır. Doğrudan `frontend/` içine kopyalanmaz.
- Tasarımda değişiklik önce canvas'ta yapılır, onaylanır, sonra bu klasör yeni bir PR ile güncellenir. Bu klasördeki dosyalar elle düzenlenmez.

## Dosya yapısı

- `canvas.json` — canvas dizini: sayfalar, her ekranın konumu/boyutu, sıralama.
- `*.dc.html` — her biri bir ekran (artboard). Ekranlar birbirini `<dc-import>` ile içe aktarır; bir ekran değişince onu kullanan zincir panoları da değişir.
- Kısa (~500 bayt) `Zincir*`, `Mali-*`, `Muhasebe-*`, `Yonetim-*` dosyaları yalnızca asıl ekranı belirli bir sekmede gösteren sarmalayıcılardır.

| Canvas sayfası | Ekran sayısı |
|---|---|
| Proje Finans | 13 |
| Enerji (Proje Geliştirme sekmesi dahil) | 3 |
| Hukuk | 3 |
| İK | 2 |
| İdari İşler | 1 |
| Mali İşler (Finansal Muhasebe + Muhasebe) | 9 |
| Sistem Yönetimi (admin) | 5 |
| Ürün 2 — Balbal penceresi ve onay akışları | 4 |
| Ortak Bileşenler | 9 |
| Akış Zincirleri (satın alma, sözleşme usulü ödeme) | 22 |

## Bilinen sınırlar

- Görseller (Balbal logosu vb.) `/_blob/<id>` adresleriyle canvas'ın kendi deposunda durur, bu klasöre dahil değildir. Logoların kaynak dosyaları `frontend/src/assets/` içindedir.
- `support.js` canvas çalışma ortamına aittir; dosyalar tarayıcıda doğrudan açıldığında canvas'taki gibi görünmez.
- Tüm kişi, şirket ve belge adları **kurgusaldır** (XYZ Enerji A.Ş. ve SPV'leri). Gerçek şirket verisi kullanılmaz.

## Bu sürümde öne çıkanlar

- **Enerji › Proje Geliştirme sekmesi (yeni):** COD'si tamamlanmamış projeler alt sekmelerde; önlisans→lisans süreç ağacı; adıma tıklayınca alt süreçler, belge penceresi ve personel notları açılır. Bu sekmedeki Balbal yalnızca o sürece özel cevap verir.
- Mali İşler (Finansal Muhasebe / Muhasebe), ödeme listesi, şirket bilgileri, ödeme talimatı.
- İK şirket yapısı (hiyerarşi düzenleyici), Yönetim paneli yetki/onay ekranları.
- Akış zincirleri 1–3 (talep → onay → ödeme → teslim; sözleşme usulü ödeme).
