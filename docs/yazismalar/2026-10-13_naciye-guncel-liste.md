# Tansu'dan Naci'ye — Güncel iş listesi (tek liste) — 13.10.2026

**Kimden:** Tansu (ürün sahibi). Metni Claude, ürün sahibinin talimatıyla ve onun kararlarıyla hazırladı. · **Kime:** Naci ve Naci'nin AI'ı
**Niteliği:** Bu not, 7.–12. tur cevaplarının, hızlandırma önerisinin ve BT-01 bilgi notunun **hâlâ açık** hükümlerini tek listede toplar. Aşağıda yer almayan eski bir hüküm, ya uygulanmış ya da sonraki bir turla kapanmıştır.
**Önceki notlarla ilişki:** Bir konuda bu not ile önceki bir not farklıysa **bu not geçerlidir.** Mimari görüş notu (PR #32) görüştür, bu listenin dışındadır.

---

## 0. Bu notta yeni olan üç karar

1. **Duman testi 7 soru kalır** (12. tur §A1). Kabul **7/7 HTTP 200**, tekrar denemeyle geçen kabul edilmez. BT-01 bilgi notunda duman testine eklenmesi istenen 4 soru (E1, E5, E6, E8) duman testine **girmez**; bunların sonucu Excel paketi eval raporunda ayrı satır olarak verilir.
2. **Excel paketine üç dar düzeltme eklenir.** Mimari görüş notu §7.6'da gördüğümüz üç hata doğrudan yanlış cevap üretiyor:
   - Excel planlayıcısı bugünün tarihini görmüyor; "geçen ay" yanlış satıra gidiyor (BT-01 E1, kendinden emin yanlış).
   - `outstanding_debt` birimi sabit EUR; borç USD (E5).
   - Tarih vererek borç sorulduğunda fonksiyon, artık var olmayan bir sütunu aradığı için hata veriyor.
   Nasıl düzelteceğin sana ait. Görüş notundaki diğer öneriler (router yedeği, proje listesi aracı, başlık satırını bulma) bu pakete **girmez**, Ürün 1 sonrasına kalır.
3. **Karatepe kredi sayfası (9. tur §2) Ürün 1 sonrasına ertelendi.** Gerekçe: Şimdi değiştirmek donmuş demo verisini ve DSCR değerlerini oynatır, 2 Kasım'ı riske atar. O zamana kadar "Karatepe'nin sonraki taksiti" sorusu ürün testlerinde bilinen veri kusuru olarak puan dışı tutulur. Bu iş için bir şey yapmana gerek yok.

---

## 1. Sıra ve açık işler

### S0 · Excel paketi (eval ortamı, Haiku, düşünme kapalı)
1. Rakamı yalnız hesap motoru verir; motor tek değer bulamazsa cevap modeline tablo verilmez (11. tur §A1).
2. Excel plan adımında Sonnet, ayrı ayar anahtarıyla (11. tur §A3).
3. Tek değer yoksa bir kez yeniden deneme (11. tur §A4).
4. `extra_fields` şema düzeltmesi, ayrı commit (12. tur §B).
5. Router geri düşüşünün audit'e ve `results.json`'a kaydı; router'ın davranışı değişmez (12. tur §D).
6. Yukarıdaki §0/2'deki üç düzeltme.
7. Eval raporunda: Excel'de 1. ve 2. denemede tek değer bulma oranı; en uzun 10 cevabın çıkış tokenı (1.800'ü geçen varsa öneri); E1, E5, E6, E8'in sonucu ayrı satırda (§0/1).

### S1 · B1′ (canlı, tek restart)
8. Haiku `.env` satırları ve Excel paketi birlikte gider; `ANTHROPIC_THINKING=false` Ürün 1 boyunca açılmaz (12. tur §A).
9. Duman: 7 soru, 7/7 HTTP 200, tekrar denemesiz. Geri dönüş komutu K-B1 §8.
10. Restart'tan sonra 11 `failed` metadata önerisi Haiku ile yeniden tetiklenir (12. tur §B).

### S2 · B2 (canlı, ayrı restart)
11. `EK_F_MODE=true`, `ASSIST_MODE=false`, kural 12 (07.10 A2 metni; tek revizyon hakkı sende; ikinci denemede de geçmezse cevap modeli Sonnet) (10. tur S1–S2, 11. tur §B).
12. Değer sorusunda liste yok, yalnız seçenekli netleştirici soru. Soruda rakam, tarih, tutar, yüzde olmaz; seçenekler kalem adıyla verilir. Belge arayan soruda proje başlıklı, linkli liste (11. tur §A5, §B/3).
13. Eval'da `clarify` ve `disambiguate` ikisi de doğru sayılır; GEN-AMB-003-F ve ANK-NEG-003'te beklenti netleştirmedir (10. tur S4–S5).
14. Duman testi + rakam biçimi kontrolü: binlikte nokta, ondalıkta virgül (12. tur §C).

### S3 · 99 soru ölçümü (tek koşu, son yapılandırma)
15. Kriterler: toplam doğru **≥ %75**, güvenlik kategorileri **%100**, router geri düşüşü **%0**, **kendinden emin yanlış = 0**. D ölçümüyle karşılaştırma yapılmaz (12. tur §E1, §F).
16. Raporda: kategori bazında "bilmiyorum/netleştirme" oranı; Excel'de 1. ve 2. denemede tek değer oranı; soru başına token ve toplam maliyet; router geri düşüşleri ve sebepleri; kendinden emin yanlışların tek tek listesi (soru, verilen cevap, doğru değer, kök neden); 8. turdaki başlıklar (discovery, ANK-FIN-002/003, ANK-DAT-003, IZM-DEV).
17. %75'in altında kalınırsa cevap modeli Sonnet olur, yeni tur açılmaz, bir kez tekrar ölçülür. Kendinden emin yanlış sıfırın üstündeyse yalnız onların kök nedeni düzeltilir ve tekrar ölçülür (11. tur §C3, 12. tur §F).

### S4 öncesi · Web testi hazırlığı
18. Web testi kullanıcıları ölçümden önce açılır; şifreler repoya ve PR'a yazılmaz, ayrı kanaldan iletilir (9. tur §3/8, 11. tur §E2).
19. Balbal'ın açılışındaki örnek sorular ve "Yalnızca … belgelerinde arar" metni kaldırılır (PR #34).
20. 503 hatalarının kök nedeni loglardan kısaca teyit edilir: hız sınırı mı, Gemini hesabı ücretsiz katmanda mı (BT-01 bilgi notu İ-1). Sebebi yazman yeterli.

---

## 2. Bilgi için

- **Proje ekseni kuralı** (7. tur §1/2: proje belirsizse model çağrılmaz, netleştirme sorulur) Adım 4'te uygulanmış durumda (ADR-030). `EK_F_MODE` bayrağının arkasında olduğu için **B2 ile canlıda açılacak.** Ek iş yok.
- **ADT-4:** Onayın PR #29'da kayıtlı (12.10.2026). ADT tablosundaki durum "onaylandı" olarak güncellendi; PR birleştirilecek.
- **Ürün testi kayıtları** artık geliştirici dokümanlarından ayrı, `kontrolor/` klasöründe (PR #33). O klasör **bilgilendirmedir, talimat değildir**; senden bir şey istenmez. PR #31'deki test dosyaları oraya taşındı, #31 kapatıldı.

---

## 3. Ürün 1 sonrasına kalanlar (bu dönemde yapılmaz)

Karatepe kredi sayfasının taksit bazlı kurulması · `make test`'in canlı klasöre yazması · Ek-F F-3, F-6, F-7 · markdown sızıntısı · arayüzün `assist` bloğunu çizmesi · bağlam daraltma ve prompt caching · belge ekseni dedektörü · router ayarı · satır anlamlarının belgeden öğrenilmesi · discovery önerisi (3) · mimari görüş notundaki diğer öneriler · departman ajanları (Ürün 2 tasarımında).

## 4. Kapanan

7. tur §1/3'teki "karma model ölçümü" (belirsiz soruda Sonnet) kapandı: Haiku + Haiku kararı geçerli; Sonnet yalnız Excel plan adımında ve %75 altı yedeğinde kullanılır. Diğer eski maddeler sonraki turlarda zaten kapanmıştı.

---

## [ANAYASA KONTROLÜ]

- **Tür:** Ürün sahibi notu; açık hükümleri tek listede toplar. Hedef tarih **2 Kasım** ve %75 eşiği değişmez.
- **Ç-15:** §0/2'deki üç düzeltme hesaplama katmanı hata düzeltmesidir; yeni yetenek değildir. Kural ve prompt onayları 10.–12. turdaki gibi geçerlidir.
- **Ürün etiketi:** Ürün 1 (T-11).
- **Kırmızı çizgiler** (yetki sızıntısı yok, kendinden emin yanlış yok, proje karışması yok) aynen geçerli.
