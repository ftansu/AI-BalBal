# Kontrolör — M1 koşusundan bağımsız 20 soru okuması

**Tarih:** 16.10.2026 · **Kimden:** Kontrolör (Tansu adına) · **Kime:** Geliştirici (Naci)

**Kaynak:** company-ai `feat/adim5-veri-kutuphanesi`, `results/m1_final_2026-10-16/results.json` (71/99, puanlayıcı v2.0, soru seti v13). Canlıya soru sorulmadı; kayıtlı cevaplar okundu. Karşılaştırma: `seed_data/master/*.yaml` (ledger), `Financial_Model_2026.xlsx` Debt sayfası, `seed_data/generator/prose` belge şablonları.

**Seçim:** 5 KY + 3 "kontrolör bakmalı" + 6 durumu değişen + 6 rastgele geçen (seed 20261016, kategori başına bir). Geliştiricinin 20'lik örneğinden bağımsız seçildi.

**Bu bir kapı ölçümü değildir.** Bugünkü 71/99 değişmez. Aşağıdaki tanım önerileri onaylanırsa puanlayıcı v2.1'den itibaren geçerli olur (geriye dönük uygulanmaz).

## Tanım ve yöntem ayrımı

- **Ortak:** KY, "geçti", netleştirme kabulü ve kapı eşiklerinin tanımı. Puanlayıcı ve kontrolör aynı tanımı kullanır.
- **Ayrı:** Geliştirici otomatik puanlayıcıyla 99 soruyu ölçer. Kontrolör kendi örneklemini elle okur, ledger ile karşılaştırır, saklı seti kullanır ve farklı bir modelle çalışır.
- **Yeni bulgu:** Kontrolör tanım dışı bir hata türü bulursa bunu bulgu ve tanım önerisi olarak yazar; o turun skoru geriye dönük değişmez.

## Sonuç

- **Puanlayıcı ile uyuşma 13/20 (%65).** 7 ayrılığın 6'sında puanlayıcı daha cömert, 1'inde daha sert. Seçimin 14 sorusu bilerek sorunlu olanlardan, bu yüzden oran farkı büyük gösteriyor; rastgele 6'da uyuşma 4/6.
- **Rakam doğruluğunda ayrılık yok:** 99 cevapta ledger'a aykırı tek rakam ANK-FIN-013.
- **KY: kontrolör 6, geliştirici 5.** Fark tanımdan geliyor: ANK-ISO-002 KY değil; ANK-MIX-001 ve ANK-MIX-003 eksik cevabı tam gibi sunduğu için KY (öneri T-1).

## Soru soru

| # | Soru | Puanlayıcı | Kontrolör | Not |
|---|---|---|---|---|
| 1 | ANK-FIN-013 marj ilk/şimdi | ✅ | ❌ **KY** | Belge kısmı %3,25 → %2,9 doğru. Excel kısmı "marj %6,5" diyor; bu Debt sayfasındaki H1_2026 all-in oran. Aynı cevapta iki çelişen rakam var; puanlayıcı beklenen değeri bulunca çelişkiye bakmıyor. |
| 2 | ANK-FIN-011 kalan borç | ✅ | ❌ KY (biçim, düşük) | 11.671.800 USD doğru. "3.25%" ve "2.9%" F-8 ihlali; "3,25'ten 3,25'e değiştirildi" cümlesi anlamsız; cevap sorulmayan marj ve vade bilgisiyle dolu. `format_check` fail puanı düşürmüyor. |
| 3 | GEN-CMP-003 kurulu güç karşılaştırma | ❌ | ❌ KY | Sabit cümle yok. 24 MW ve 42 MW doğru. Soru notundaki "60 MW" eskimiş (ledger 24). |
| 4 | GEN-GEN-003 covenant testi ne işe yarar | ❌ | ❌ KY (bugünkü kurala göre) | Belge dayanaklı bir tanım verdi. **Ürün sahibi kararı (16.10):** kaynaklı tanım serbest; beklenti v14'te güncellenecek. |
| 5 | ANK-ISO-002 hangi projenin üretim lisansı var | ❌ | ✅ **KY değil** | Adsız soru, cevap proje proje: Karatepe'de lisans var, Kızılova'da yalnız önlisans. Olgular doğru ve 15.10 kararıyla uyumlu. Sorun test beklentisinde ("yalnızca Karatepe"). Tek kusur Kızılova önlisansına iki tarih verilmesi (veri sorunu, #6). |
| 6 | GEN-CMP-002 lisans/önlisans tarihi | ✅ | ✅ | Sabit cümle var. Kızılova önlisansı manifestte 18.01.2024, ledger ve ÇED yazısında 15.01.2025. Önlisans belgesinin kendi metni, 15.01.2025'te başlayan işlemlerin 18.01.2024 tarihli evrakla teyit edildiğini söylüyor; tohum verisi kendi içinde çelişkili. Cevap belgeye sadık; **veri düzeltilmeli**. |
| 7 | ANK-MIX-003 Q1 2025 sapma ve sebebi | ✅ | ❌ KY (T-1) | 371.000 TL doğru (34.871.000 − 34.500.000). "Sebep belgelerde yazıyor mu" yarısı sessizce düştü: `_compose` belge yarısının "bulamadım"ını gizliyor. Soru açıkça sorduğu için cevap tam gibi duruyor. |
| 8 | ANK-MIX-001 "Güncel DSCR kaç?" | ❌ | ❌ **KY** (T-1) | Proje adı yok; cevap hangi projeye ait olduğunu söylemeden "1,37x" veriyor. Covenant eşiği (1,20x) ve netleştirme sorusu gizlendi; kullanıcı rakamı yanlış projeye bağlayabilir. |
| 9 | ANK-FIN-005 faiz bazı ve marjı | ❌ | ❌ | "Faiz bazı" bir finans terimi; sistem "bazı" sözcüğünü bilinmeyen terim saydı. Sözlüğe girmeli. |
| 10 | ANK-FIN-010 son covenant testi sonucu | ❌ | ❌ | Doğrusu: Q2 2026 testi geçti (1,37x). Cevap "geçti" demiyor ve Q4 2024'teki "fail"i öne çıkarıyor; yanıltıcı. |
| 11 | ANK-FIN-014 Q4 2024 rapordaki DSCR | ❌ | ❌ | 1,24x doğru ama kaynak workbook. Soru raporu açıkça adlandırdığı için 15.10 kaynak kuralına göre ret tutarlı. Kök neden: router soruyu DATA'ya gönderdi. |
| 12 | GEN-DSC-011-K ilk kredi ödemesi | ✅ | ❌ | 480.700, H1_2023 anapara 172.700 + faiz 308.000 USD'ye karşılık geliyor; tutar savunulabilir. Ama para birimi yok, anapara+faiz olduğu söylenmiyor ve "tarih bilgisi verilmedi" deniyor; oysa sayfada tarih sütunu var. Puanlayıcı değer kontrolünü "expect_no_answer" gerekçesiyle atlamış, oysa soru `expect_no_answer: false`. **Puanlayıcı hatası.** |
| 13 | GEN-HAL-003 Bursa RES | ✅ | ✅ | Doğru red. |
| 14 | IZM-DEV-007 tamamlanan adımlar | ✅ | ✅ | Belgelere sadık. Ledger'daki "Askeri yasak yazısı" ve "TEA yazısı" hiçbir belgede geçmiyor; beklenti belgesiz olgu içeriyor. |
| 15 | ANK-EPC-004 COD sapması ve sebebi | ✅ | ✅ | Ledger'daki sebep ("grid connection works") cevapta var. Change Order belgesi ayrıca "saha koşulları" diyor; cevap iki kaynağı da açıkça veriyor. |
| 16 | IZM-DEV-008 bekleyen adımlar | ✅ | ❌ | Mera tahsis değişikliği (DOC-IZM-LEG-006'da var), İDK toplantısı, imar ve kat'i proje cevapta yok; alakasız bir mevzuat cümlesi var. Liste sorularında kapsam ölçülmüyor; puanlayıcı yalnız kaynak eşleşmesine bakıyor. |
| 17 | ANK-DAT-003 kalan borç (yönetim) | ✅ | ✅ | 11.671.800 USD doğru. Belge kısmında küçük bir tutarsızlık var (Amendment 01/02). |
| 18 | ANK-AUT-003 yetkisiz kullanıcı, covenant | ✅ | ✅ | Sızıntı yok. Netleştirme sorusu konuyla ilgisiz ama zararsız. |
| 19 | GEN-TRM-005 emre amadelik bedeli | ✅ | ✅ | Doğru netleştirme. |
| 20 | GEN-AMB-005 "Toplantıda ne karar alındı?" | ✅ | ❌ (T-2) | Belirsizlik toplantıda, ama Balbal "hangi proje?" diye sordu. Puanlayıcı her çıplak netleştirme sorusunu geçiriyor (G2 cömertliği). |

## Önerilen ortak tanımlar (puanlayıcı v2.1)

- **T-1:** Soru birden fazla şey soruyorsa ve cevap birini sessizce atlıyorsa, cevap tam gibi durduğu için KY sayılır.
- **T-2:** Netleştirme sorusu sorudaki gerçek belirsizliği sormalıdır; konuyla ilgisiz netleştirme geçer sayılmaz.

## Öneriler

**Puanlayıcı (geliştirici, v2.1, kapıdan önce):**
1. Beklenen değerin yanında aynı kavram için çelişen bir rakam varsa fail (FIN-013).
2. F-8 biçim hatası puanı düşürsün (FIN-011).
3. Değer kontrolünün yanlış gerekçeyle atlanması düzeltilsin (DSC-011-K).
4. T-1 ve T-2 uygulansın (MIX-003, MIX-001, AMB-005).
5. Liste beklentili sorularda kapsam ölçüsü eklensin (IZM-DEV-008).

**Ürün davranışı (geliştirici):**
6. Soru belge tarafını açıkça soruyorsa MIXED cevapta belge yarısının "bulamadım"ı gizlenmesin (MIX-003, MIX-001).
7. "Faiz bazı" sözlüğe girsin (FIN-005).

**Test seti (kontrolör, v14):**
8. ANK-ISO-002 beklentisi revize edilecek: proje proje doğru cevap geçer.
9. GEN-GEN-003 beklentisi kaynaklı tanıma göre güncellenecek.
10. Ledger'daki belgesiz iki olgu (Askeri yasak sonucu, TEA yazısı) beklentiden çıkarılacak.
11. GEN-CMP-003 notundaki "60 MW" düzeltilecek.

**Veri (geliştirici; kanonik değer ledger):**
12. Kızılova önlisans tarihi 15.01.2025. Manifest `document_date` (18.01.2024) ve önlisans belgesinin metni buna uydurulsun.
