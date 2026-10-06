# Tasarım — Claude Design canvas anlık görüntüsü

**Ne:** "X Platformu — Ürün 2" canvas'ının (Balbal uygulamasının **tam** arayüzü) kaynak dosyaları. Canvas adı tarihseldir; içerik yalnızca Ürün 2 değil, uygulamanın bütün ekranlarıdır.
**Alındığı an:** 06.10.2026, canvas sürümü `1791297325-0284` (devir notundaki v61'den sonraki son yayın).
**Esas olan:** Canlı canvas. Bu klasör, canvas'a erişimi olmayan geliştirici ve AI'ı için **salt okunur referanstır**; buradan canvas'a geri yazılmaz. Canvas değiştikçe klasör yeni bir PR ile yenilenir.

> **Durum: Balbal frontend tasarımı TAMAMLANMADI.** Mali İşler, İdari İşler ve Akış Zincirleri bugün eklendi ama açık işler var (bkz. `docs/NACI_NOTU_2026-10-06.md` §1). Bu dosyalar kodlamaya hazır ekranlar listesi değildir; mantığı ve yönü gösterir.

## Dosyaları okumak

- `*.dc.html` bir Claude Design bileşenidir: üstte işaretleme (`sc-for`, `sc-if`, `{{…}}` bağlamaları), altta `<script type="text/x-dc">` içinde `renderVals()` mantığı ve kurgusal demo verisi.
- `<dc-import name="X" …>` başka bir dosyayı içe alır. Akış zinciri panoları (`Zincir*`) ve küçük sarmalayıcılar (`Mali-*`, `Muhasebe-*`, `Yonetim-Kisi*`) yalnızca gerçek ekranı belirli bir sekme/kişiyle çağırır — **tek kaynak** ilkesi: ekran tek dosyadadır.
- `canvas.json` sayfa düzenini ve canvas üzerindeki geliştirici notlarını (yeşil/mavi kartlar) taşır. Notlar arayüze metin olarak girmez.
- Dosyalar tarayıcıda tek başına çalışmaz (`support.js` ve `/_blob/…` görselleri canvas ortamına aittir). Görsel kontrol canvas'tan yapılır.
- Tüm kişi, şirket, tutar ve tarihler kurgusaldır (P-9).

## Sayfalara göre dosyalar

| Canvas sayfası | Dosyalar |
|---|---|
| Proje Finans | `Main`, `Belge-Yukle`, `Belgeler`, `Departman-Belgeleri`, `Excel-Onizleme`, `Gelen-Talep-Detay-Hukuk`, `Gorev-Detay-SigortaYenileme`, `Mail-Talep-Detay*` |
| Ürün 2 (Balbal penceresi, onay akışları) | `Sablon-Doldur`, `Yazi-Taslagi`, `Gorus-Talebi`, `Izin-Talebi` |
| **Mali İşler** (06.10 yeni) | `Ana-Sayfa-Mali` (Finansal Muhasebe), `Mali-Odeme-Talimati`, `Mali-Sirket-Bilgileri`, `Ana-Sayfa-Muhasebe` (Muhasebe), `Muhasebe-Evrak`, `Muhasebe-Evrak-Karti`, `Muhasebe-Kayit`, `Muhasebe-Cari`, `Muhasebe-Kontrol` |
| Hukuk | `Ana-Sayfa-Hukuk`, `Dava-Gecmisi`, `Sozlesme-Onizleme` |
| **İdari İşler** (06.10 yeni) | `Ana-Sayfa-Idari` |
| İK | `Ana-Sayfa-IK`, `IK-Sirket-Yapisi` |
| Enerji | `Ana-Sayfa-Enerji`, `Belge-Bildirim-CED`, `Talep-Onay-Yonetici` |
| Sistem Yönetimi | `Yonetim`, `Yonetim-Kisi-Karti`, `Yonetim-Kisiler`, `Yonetim-Onay-Kurallari`, `Yonetim-Yapi-Uyum` |
| Ortak Bileşenler | `Arama-Sonuclari`, `Balbal-Sohbet`, `Bildirimler`, `Doviz-Kurlari`, `Ekip-Sohbet`, `Giris`, `Kullanici-Menusu`, `Fatura-Odeme` (fatura kartı), `Sozlesme-Karti` |
| **Akış Zincirleri** (06.10 yeni) | `Zincir1-*` satın alma talebi · `Zincir2-*` İdari İşler'in kendi alımı · `Zincir3-*` sözleşme usulü ödeme |
