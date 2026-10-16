# Naci'ye not — Yazışmaları GitHub'da toparlama

**Tarih:** 16.10.2026
**Kimden:** Tansu (Ürün Yetkilisi)
**Kime:** Naci ve Naci'nin yapay zekâsı
**Tür:** Yönlendirme (süreç)

---

Naci merhaba,

Son günlerde pratik olsun diye çok şeyi WhatsApp'tan, Word olarak gönderdik. WhatsApp kayıtlı kanal değil. Ne karar verdik, kim ne istedi, kim ne cevap verdi; bunu bir hafta sonra ikimiz de bulamayabiliriz. Senin yapay zekân da hiç göremez. Bu yüzden bundan sonra her şey GitHub'da da olsun istiyoruz.

## Benim tarafımda yapılanlar (bilgi)

`docs/yazismalar/whatsapp/` klasörünü açtım (kurallar `README.md`'de). Benim WhatsApp'tan gönderdiklerimi oraya geriye dönük kaydettim:

| Dosya | İçerik |
|---|---|
| `2026-10-14_WA_teshis-testi-2x2.md` | 2×2 teşhis testi notu (sonra kural merdivenine dönüştü) |
| `2026-10-15_WA_bilgi-notu-16-10-oncesi.md` | 15.10 akşam "sabaha kadar yapılacaklar" notu |
| `2026-10-16_WA_verimlilik-gorusune-cevap.md` | Verimlilik görüşüne cevabım (kural merdiveni dahil) |
| `2026-10-16_WA_C1-dogrulama-ve-kontrolor-notlari.md` | C1 doğrulaması ve kontrolör uyarıları |

Her dosyanın sonunda senin için bir **"Cevap (Naci)"** bölümü var.

## Senden beklediklerimiz

### 1. Açık cevaplar

Cevapları ilgili dosyanın "Cevap (Naci)" bölümüne, tarihle yaz. Mevcut satırları silme ya da değiştirme, yalnız ekle.

- **C1 dosyası:** `ankara_res.yaml:54` ve `fx_rates.yaml:8` runtime'da okunuyor mu, okunuyorsa değer kullanıcıya ulaşıyor mu? Yalnız salt okuma kontrol istiyoruz, kod değişikliği değil. C1 ana dalda mı?
- **Verimlilik cevabı:** §5'teki iki soru (`previous_question`, Excel 1×1 / B-01) ve §4 ADR-032 sorusu. Diğer satırlar hazır oldukça doldurulabilir; acelesi yok.
- **Teşhis notu (14.10):** Not sana ulaşmış mıydı? Tek kelime yeter.

### 2. Senin WhatsApp'tan gönderdiklerin

Senin gönderdiğin ve hiçbir repoda olmayan belgeler var. En azından şunu biliyoruz:

- `Balbal_Gelistirici_Gorusu_Verimlilik_Raporu_2026-10-16.docx`, yani verimlilik raporuna verdiğin görüş.

Bunu ve WhatsApp'tan yazdığın, kararı ya da işi etkileyen diğer mesajları aynı klasöre README formatıyla ekle: `YYYY-AA-GG_WA_<konu>.md`. Dosyanın sonuna benim için boş bir "Cevap (Tansu)" bölümü koy.

15.10 yol haritası cevabın company-ai'de (`docs/yazismalar/2026-10-15_gelistirici-cevabi-yol-haritasi.md`) zaten var, onu tekrar eklemene gerek yok.

### 3. company-ai ana dalı

company-ai'nin ana dalı 08.10'dan beri güncellenmemiş görünüyor. İş emri raporları, C1'in `CLAUDE.md` değişikliği ve yazışmaların hepsi `feat/adim5-veri-kutuphanesi` dalında duruyor. Bunun iki sonucu var:

- Ana daldan açılan bir oturum ya da başka biri eski durumu görür.
- Dal uzadıkça birleştirme zorlaşır.

Bunu bilinçli mi yapıyorsun? Ana dala alma planın ne? Bir iki satırla C1 dosyasının "Cevap" bölümüne yaz. Nasıl yapılacağı sana kalmış.

### 4. AI-BalBal'daki açık PR'lar

Bu PR'lar hâlâ açık:

| PR | Konu | Senden |
|---|---|---|
| #32 | Mimari görüş notu (13.10) | Okuduysan PR'a bir satır yorum yaz. İtiraz yoksa ben kapatırım. |
| #37 | Karar notu + 16.10 karar penceresi cevapları (yorumlarda) | Okuduğunu yorumla teyit et. |
| #38 | S4a örnek soruların kaldırılması (senin PR'ın) | Hazır mı, bekliyor mu? Durumunu yorumla. |
| #46 | AI verimlilik raporu (Word) | Görüşünü zaten verdin. Ek bir şey yoksa ben birleştiririm. |

Birleştirmeyi ben yaparım. Repo kuralı gereği insan onayı gerekiyor.

### 5. Bundan sonrası için kural

- WhatsApp'tan konuştuğumuz her şey aynı gün `docs/yazismalar/whatsapp/` altına girsin. Notu kim attıysa kaydı o açar, karşı taraf "Cevap" bölümüne yazar.
- WhatsApp'ta verilen bir karar, repoya girene kadar resmî sayılmaz.
- Senin yapay zekân her oturumda bunu hatırlasın diye company-ai'deki `CLAUDE.md`'ye tek satırlık bir hatırlatma eklemeni öneriyorum. Örnek: "WhatsApp'tan gelen notlar ftansu/AI-BalBal docs/yazismalar/whatsapp/ altına kaydedilir; README'deki formata uyulur." Uygun görürsen ekle.

Hepsi ayrı dal ve PR ile, PR açıklamasında `[ANAYASA KONTROLÜ]` notuyla.

Kolay gelsin.
Tansu

---

## Cevap (Naci)

> Bu bölüme Naci yazar. Eski satırlar silinmez; her cevap tarihle yeni satır olarak eklenir.

- 2 (eklenen WA dosyaları): 16.10.2026 — Verimlilik görüşü Word'ü (Balbal_Gelistirici_Gorusu_Verimlilik_Raporu_2026-10-16.docx) repoya ayrıca eklenecek.
- 3 (company-ai ana dal planı): 16.10.2026 — Dal ana dalın 195 commit önünde. Plan henüz kesin değil; Tansu ile konuşulacak.
- 5 (kural — okundu / itiraz): 16.10.2026 — Okundu.
- Diğer:
