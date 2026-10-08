# Tasarım — Ürün 2 ve sonrası (tek kopya)

**Ne:** "X Platformu — Ürün 2" canvas'ının kaynak dosyaları. Bu, Balbal uygulamasının **Ürün 2 ve sonrasına ait tam arayüzüdür**. Canvas adı tarihseldir; Ürün 3 ekranları da buradadır.
**Tek kopya kuralı (07.10.2026, Ürün Yetkilisi):** Ürün 2 ve sonrasının tasarımı repoda **yalnızca bu klasörde** durur. Başka dal veya klasörde ikinci bir canvas kopyası tutulmaz.
**Ürün 1 ayrıdır:** Ürün 1'in kendi arayüzü vardır ve ayrı durur — tasarım kaynağı "X Platformu — Ürün 1" canvas'ı, kod `frontend/`, kurallar `docs/URUN1_ARAYUZ.md`. Ürün 1 ekranları bu klasöre eklenmez; bu klasördeki ekranlar Ürün 1 arayüzüne taşınmaz.

**Alındığı an:** 08.10.2026, canvas sürümü `1791471743-c7f2` (v135). Önceki kopya: 07.10.2026 `1791363018-8719`.
**Esas olan:** Canlı canvas. Bu klasör, canvas'a erişimi olmayan geliştirici ve AI'ı için **salt okunur referanstır**; buradan canvas'a geri yazılmaz. Canvas değiştikçe bu klasör yeni bir PR ile yenilenir (eskisinin üzerine; yeni kopya açılmaz).

> **Durum: Balbal frontend tasarımı TAMAMLANMADI.** Bu dosyalar kodlamaya hazır ekranlar listesi değildir; mantığı ve yönü gösterir. Backend beklentileri ve açık işler: `docs/NACI_NOTU_URUN2.md` (PR #13) — ⛔ ürün sahibinin onayı gelmeden başlanmaz. Ürün 1 işleri: `docs/NACI_NOTU_URUN1.md`.

## Dosyaları okumak

- `canvas/*.dc.html` bir Claude Design bileşenidir: üstte işaretleme (`sc-for`, `sc-if`, `{{…}}` bağlamaları), altta `<script type="text/x-dc">` içinde `renderVals()` mantığı ve kurgusal demo verisi.
- `<dc-import name="X" …>` başka bir dosyayı içe alır. Akış zinciri panoları (`Zincir*`) ve küçük sarmalayıcılar (`Mali-*`, `Muhasebe-*`, `Yonetim-*`) yalnızca gerçek ekranı belirli bir sekme/kişiyle çağırır — **tek kaynak** ilkesi: ekran tek dosyadadır.
- `canvas/canvas.json` sayfa düzenini ve canvas üzerindeki geliştirici notlarını taşır. Notlar arayüze metin olarak girmez.
- Dosyalar tarayıcıda tek başına çalışmaz (`support.js` ve `/_blob/…` görselleri canvas ortamına aittir). Görsel kontrol canvas'tan yapılır. Logoların kaynak dosyaları `frontend/src/assets/` içindedir.
- Tüm kişi, şirket, tutar ve tarihler kurgusaldır (Ç-12).

## Sayfalara göre dosyalar

| Canvas sayfası | Dosyalar |
|---|---|
| Proje Finans | `Main`, `Belge-Yukle`, `Belgeler`, `Departman-Belgeleri`, `Excel-Onizleme`, `Gelen-Talep-Detay-Hukuk`, `Gorev-Detay-SigortaYenileme`, `Mail-Talep-Detay*` |
| Ürün 2 (Balbal penceresi, onay akışları) | `Sablon-Doldur`, `Yazi-Taslagi`, `Gorus-Talebi`, `Izin-Talebi` |
| Mali İşler | `Ana-Sayfa-Mali` (Finansal Muhasebe: Ödeme Listesi, **Talimat oluştur ▾ → Seçilileri öde / Acil öde**, Banka hareketleri), demo sarmalayıcılar `Mali-Odeme-Talimati`, `Mali-Sirket-Bilgileri`, `Mali-Elle-Odeme`, `Mali-Banka-Hareketleri`, `Mali-Talimat-Secenek`, `Mali-Acil-Ode`, `Mali-Secilileri-Ode`; `Ana-Sayfa-Muhasebe` (Muhasebe), `Muhasebe-Evrak`, `Muhasebe-Evrak-Karti`, `Muhasebe-Kayit`, `Muhasebe-Cari`, `Muhasebe-Kontrol`, `Muhasebe-Imza-Yetkileri` |
| Hukuk | `Ana-Sayfa-Hukuk`, `Hukuk-Imza-Yetkileri`, `Dava-Gecmisi`, `Sozlesme-Onizleme` |
| İdari İşler | `Ana-Sayfa-Idari` |
| İK | `Ana-Sayfa-IK`, `IK-Sirket-Yapisi` |
| Enerji | `Ana-Sayfa-Enerji` (**07.10 yeni: Proje Geliştirme sekmesi** — COD'si tamamlanmamış projeler, önlisans→lisans süreç ağacı, alt süreçler, belge penceresi, personel notları, sürece özel Balbal), `Belge-Bildirim-CED`, `Talep-Onay-Yonetici` |
| Sistem Yönetimi | `Yonetim`, `Yonetim-Kisi-Karti`, `Yonetim-Kisiler`, `Yonetim-Onay-Kurallari`, `Yonetim-Yapi-Uyum` |
| Ortak Bileşenler | `Arama-Sonuclari`, `Balbal-Sohbet`, `Bildirimler`, `Doviz-Kurlari`, `Ekip-Sohbet`, `Giris`, `Kullanici-Menusu`, `Fatura-Odeme` (fatura kartı), `Sozlesme-Karti`, `Imza-Yetkilileri`, `Odeme-Zinciri` (PO kartı altyapısı; Zincir 4–7 bunun üstünde), `Yeni-Odeme-Talebi` (ödeme talepleri listesi + tür → kayıt → talep; **08.10: üst bar menüsünden pencere olarak açılır**), **`Masraf-Formu`** (08.10 yeni: personel masrafı / iş avansı; demo panoları `Masraf-Demo-Tablo`, `Masraf-Demo-Onayli`, `Masraf-Demo-Avans`) |
| Akış Zincirleri | `Zincir1-*` satın alma talebi (red → revize dahil) · `Zincir2-*` İdari İşler'in kendi alımı · `Zincir3-*` sözleşme usulü ödeme (B1–B3 fatura yolu dahil) · `Zincir4-*` eşleşmeyen fatura · `Zincir5-*` kredi ödemesi · `Zincir6-*` vergi / yasal yükümlülük · `Zincir7-*` bordro · `YeniTalep-*` + Yeni ödeme talebi akışı. Hazine, banka masrafı, otomatik ödeme talimatlı faturalar için zincir yok (banka ekstresinden otomatik — bkz. `NACI_NOTU_URUN2.md` §D.6). Masraf/avans zinciri (Z8) henüz çizilmedi |

## 08.10.2026 çıkışında değişenler (özet)

- **Her ana ekranın üst barında "+ Ödeme talebi ▾" menüsü** (Enerji, Proje Finans, İK, İdari İşler, Muhasebe, Finansal Muhasebe, Hukuk). Menü: Taleplerim + departmanın açabileceği ödeme türleri. Tür listesi `Yeni-Odeme-Talebi` ile aynı kaynaktan gelir; iki ayrı liste yoktur.
- **Masraf / Avans** (`Masraf-Formu`): çoklu belge yükleme, Balbal'ın çıkardığı tablo (turuncu çerçeveli hücreler), kısa uyarılar, açık avans kapama, istenen sayıda onaycı, tek satır onay.
- **Finansal Muhasebe ödeme listesi:** "+ Elle ödeme" kaldırıldı; "Talimat oluştur ▾" → Seçilileri öde (onay penceresi) / Acil öde (kayıt + talimat tek adımda; + Belge ekle, ✉ Mailden al, hızlı ani ödeme zinciri). Banka hareketleri sekmesi: listede olmayan çıkış → "Listeye ekle".
- **Akış Zincirleri:** Zincir 4–7 panoları, Yeni ödeme talebi panoları (1–9), Zincir 3 fatura yolu (B1–B3), Zincir 1 red → revize. `Zincir1-4-Teslim` kaldırıldı (adımlar yeniden numaralandı).
- Ortak kural: Balbal'ın otomatik doldurduğu her bilgi için tek satırlık kullanıcı onayı şart; onay yoksa sonraki aşamaya geçilmez.
