> **Ortak Not Ek-1 (15.10.2026).** Bu belge yol haritasının geliştiriciye giden hâlidir ve tarihsel kayıttır. Bağlayıcı olan Ortak Not'tur (`2026-10-15_ORTAK_NOT_urun1-yol-haritasi.md`). Özellikle aşağıdaki tarihler Ortak Not §2 ile kaldırıldı; yerine çıkış ölçütleri geçti. Ürün sahibine yönelik iç bölümler (zaman planı, karar listesi, fact-check kaydı) bu kopyada yoktur.

# Balbal Ürün 1 — Tıkanıklığı aşma yol haritası (15.10.2026, v2 — fact-check sonrası)

**Hazırlayan:** kontrolör (ürün sahibi için). **Niteliği:** öneri; kararlar ürün sahibinindir.

## 1. Can alıcı nokta

Tıkanıklık geliştiricinin hızında değil, **üç yerde**: (1) ölçü aleti bozuk — puanlayıcı ürün tasarımıyla çelişiyor, doğru davranış puan kaybettiriyor; (2) tek yapısal kusur — belge arama proje bazında daraltılmıyor, model her soruda tüm projelerin belgelerini okuyup ayıklamak zorunda kalıyor; en büyük kayıp ve kırmızı çizgi ihlali buradan; (3) çalışma düzeni bu aşama için fazla ağır — küçük iş emri, uzun rapor, her bulgu için gidiş-dönüş. İlk ikisi kod olarak küçük (toplam 2–3 gün), üçüncüsü strateji kararı. Üçü düzelirse %75 ulaşılabilir; düzelmezse skor %60 bandında kalmaya devam eder.

## 2. Teşhis — kanıtla

### 2.1 Ölçü aleti
- Aynı 99 soru, 11–14.10: 53 → 60 → 62 → 59. Dört günde net ilerleme yok; ama bu dört ölçümün hiçbiri aynı puanlayıcıyla yapılmadı (soru seti v12'ye kadar 3 kez değişti).
- S3'te 13 bayrak "cevapsız yanıt sabit cümleyle başlamıyor" — ürün tasarımı bilerek sabit cümle yazmıyor (yalnız soru soruyor). 6–7 sorunun tek düşme sebebi bu.
- `finans_mudur` kullanıcısı puanlayıcının görünürlük listesinde yok → o kullanıcının her cevabı "yetkisiz belge" sayılıyor.
- İki beklenti eskimiş (IZM-ISO-004, GEN-HAL-004): kütüphaneye sonradan eklenen Kızılova sözleşmesi doğru cevabı "yasak" yapıyor.
- ANK-NEG-003 netleştirmeyle hiç geçemiyor (değer kontrolü atlanmıyor).
- Eval veritabanında 6 proje var; kütüphane kaydı 7 diyor. **Açıklandı:** 7. proje (Güneşalan, GNS_GES) ana veride tanımlı ama hiç belgesi yok. Kayıt "7 proje tanımlı / 6 projede belge" diye düzeltilir; iş yok.
- Geliştiricinin ham sonuç dosyası (`results.json`) repoya girmiyor; kontrolörün zorunlu %20 bağımsız yeniden puanlaması yapılamıyor.

→ Sonuç: skor ne kadarı ürün, ne kadarı puanlayıcı — ayırt edilemiyor. Bu düzelmeden hiçbir düzeltmenin işe yarayıp yaramadığı görülemez.

### 2.2 Yapısal kusur: proje izolasyonu
- Kodda belge arama yalnız **departmana** göre daraltılıyor; proje süzgeci altyapıda var ama kullanılmıyor. Soruda proje adı geçse bile (ör. "Karatepe") modele giden pakette diğer projelerin belgeleri de var (soru başına ~34.000 giriş tokenı, 80 parça).
- Proje tespiti arama **sonrasında** ve yalnız "belirsiz → sor" için kullanılıyor; "adı geçiyor → o projeye daralt" adımı yok.
- Sonuçları S3'te görülüyor: izolasyon 1/4, keşif listelerinde Kızılova (5 soru), "Bursa RES" sorusunun Karatepe'ye bağlanması, ANK-ISO-002'de iki projenin birlikte aktarılması. Üç ölçümdür aynı desen; hiçbir ayar değişikliği bunu çözmedi, çözemez.
- Düzeltme yönü: proje adı geçiyorsa aramayı o projeyle sınırla; geçmiyorsa belge dağılımına bak — baskınsa daralt ve varsayımı söyle, dengeliyse sor (bu kısım zaten var). **Dikkat (fact-check):** mevcut proje süzgeci katıdır — projeye bağlı olmayan grup belgeleri (holding, genel) dışarıda kalır; tasarım "o proje + projesiz belgeler" olmalı. Büyüklük tahmini kontrolörün; kararı geliştirici verir. Yan kazanç: giriş tokenı ve süre düşer.

### 2.3 Çalışma düzeni
- 5–14.10 arası ~200 commit'in 90'ı rapor; 107 rapor dosyası. Bir saatlik iş bir saatlik raporla geliyor.
- İş emirleri S0-a/b/c/d, B1, B2a/b, S2c, S3 diye parçalı; her parça ayar düğmesi (model, düşünme, bayrak, prompt cümlesi). Geliştirici emri harfiyen uyguluyor, kök nedene gitmiyor — çünkü kural (Ç-16) "kapsam dışını düzeltme, yalnız raporla" diyor. Üç ölçümdür raporlanan izolasyon kusuru bu yüzden üç ölçümdür duruyor.
- Her bulgu → rapor → sabah okuma → karar → yeni iş emri → kod: bir düzeltmenin yolu 2 gün.
- Not: Bu düzeni biz kurduk; ayar denemelerinin bir kısmı bizim listemizdeki maddelerdi (Sonnet yedeği, düşünme kapalı vb.). Geliştirici "çamurda debelenmiyor", verilen rotada yürüyor; rota yanlış.

### 2.4 Teknoloji mi, ekip mi?
- S0-d: aynı 39 soruda Sonnet de Haiku da 28 verdi. Model değişimi kaybı değiştirmedi. Kayıp modelde değil, modele ne verildiğinde (2.2) ve nasıl ölçüldüğünde (2.1). Bu aşamada 2×2 teşhis testine gerek yok; 2.1 + 2.2 sonrası skor hâlâ kıpırdamazsa gündeme gelir.

## 3. Strateji değişiklikleri (karar gerektirir)

| # | Şimdiki | Önerilen | Gerekçe |
|---|---|---|---|
| K-A | Parçalı iş emirleri, her biri ayar | **Tek iş paketi, sorun düzeyinde hedef** ("proje adı geçen soruda pakette başka projenin belgesi olmayacak") — nasıl yapılacağı geliştiricinin | Ayar denemeleri bitti; kök neden hedeflenir |
| K-B | Ç-16: kapsam dışı bulgu düzeltilmez, raporlanır | **Önce K-A ile çözülür:** iş emri kapsamı sorun düzeyinde yazılınca kök neden düzeltmesi kapsam içindedir, Ç-16 ihlal edilmez. ADT-4 zaten Ç-15'in çoğunda plan-onay şartını kaldırmış. Yeni ADT-5 **yalnız** K-A yetmezse (yedek) | Anayasayı değiştirmeden aynı sonuç |
| K-C | 100–230 satırlık rapor her emirde | **Tek sayfa rapor** (ne değişti, ölçüm, açık konu, karar isteği); ayrıntı loglarda kalır | Rapor yükü ~%45 commit; zaman koda dönsün |
| K-D | Her bulguda ayrı tur, günün her saati | **Günde tek karar penceresi:** sabah raporu → tek mesajla tüm kararlar → geliştirici gün içinde uygular | Karar gecikmesi kalkar |
| K-E | %75 altı → "cevap modeli Sonnet" (liste md.17) | **Kaldırılır.** %75 altı → hunide en büyük kayıp aşaması düzeltilir, bir kez tekrar | 12.10 tam set: Sonnet cevap 62 vs Haiku 60 (+2); S0-d 39 soruda 28=28; maliyet ≈16–20× |
| K-F | KY = "ledger'a aykırı rakam" | **KY tanımı çerçeveyle aynı:** kural ihlaliyle verilmiş emin cevap, proje karışması, başka projenin belgesini doğru diye sunma, eksik listeyi tam sunma da KY | Dünkü "KY=0" bu tanımla 3–4 |
| K-G | Ham sonuçlar sunucuda | `results.json` her ölçümde kontrolöre verilir | Bağımsız puanlama zorunluluğu |

## 4. Yol haritası (tarihler Ortak Not §2 ile kaldırıldı)

### Faz 0 — Ölçü aletini düzelt
- Puanlayıcı: `disambiguate` metni G2'de geçerli; `finans_mudur` görünürlük listesine; `expect_no_answer` + netleştirmede değer kontrolü atlanır; "yasak kaynak" ad **veya** tür değil, belge kimliğiyle.
- Beklenti güncellemesi: IZM-ISO-004 → "Evet, 2026-KZ"; GEN-HAL-004 aynı kök; başka değişiklik yok (v13).
- Proje sayısı: 7 tanımlı / 6'sında belge (Güneşalan belgesiz) — kayıt düzeltilir, yeni belge **üretilmez**.
- Kontrolör: 99 soruyu Ürün 1 kapsamına göre denetler — hesap isteyen, Ürün 2'ye ait soruları "kapsam dışı — puan dışı" işaretler; ürün sahibiyle kilitlenir.
- Çıkış ölçütü: aynı S3 ham sonuçları yeni puanlayıcıyla yeniden puanlanır → **gerçek taban skor**. Bu rakam bundan sonraki tek referans.

### Faz 1 — Kayıp hunisi: parça parça ölç, tek tek düzelt
"Her şeyi bir pakette düzelt, sonra ölç" yerine kaybı aşamalara ayır, her aşamayı kendi ölçüsüyle ölç, en büyük düğümü çöz, yalnız o aşamayı yeniden ölç, sonrakine geç. Tam 99 koşu yalnız kapıda.

| Aşama | Soru | Ölçüm | LLM gerekir mi |
|---|---|---|---|
| 1 Arama | Hedef belge/sayfa getirilen 80 parça içinde mi? | sayfa isabeti | Hayır |
| 2 Proje ekseni | adlı/baskın/belirsiz kararı doğru mu; pakette yabancı proje parçası var mı? | karar doğruluğu, yabancı parça oranı | Hayır |
| 3 Cevap üretimi | hedef sayfa promptta iken model doğru değeri verdi mi / reddetti mi? | doğru / eksik / red / yanlış | Evet — yalnız ilgili sorular |
| 4 Excel hattı | router türü doğru mu → plan tek değer mi → değer doğru mu? | üç ayrı oran | Kısmen |
| 5 Puanlama | doğru cevap puan aldı mı? | puanlayıcı kaybı | Hayır |

- En büyük aşamadan başla, **bir seferde tek aşama**, her düzeltmenin kendi önce/sonra ölçüsü: Aşama 2 proje daraltma; Aşama 3 ısrarlı 4 red (IZM-DEV-004/005/006, ANK-COR-001); kural tutarlılığı kodda; Aşama 4 Excel "LIMIT 1 ama çok sütun".
- Her adımda tek sayfa kayıt: aşama, değişiklik, önce/sonra, yan etki kontrolü.
- Ortam-bağımlı 25 test ve hata sınıfı başına birim testi bu fazda; duman ölçütüne değer kontrolü eklenir (HTTP 200 yetmez).

### Faz 2 — Kapı
- Geliştirici: canlı ayarla birebir koşu, `results.json` kontrolöre.
- Kontrolör: ≥20 soruyu bağımsız puanlar, KY'yi K-F tanımıyla sayar.
- Karar ağacı: **≥ %75, KY 0, güvenlik %100** → BT-02 · **%68–75** → en büyük tek kayıp kaynağına bir düzeltme, tekrar · **< %68** → 2×2 teşhis, Ürün 1 hedefi yeniden konuşulur.

### Faz 3 — BT-02 ve web testi
- Geliştirici test alanı (Test departmanı/klasörü) + web testi kullanıcılarını açar; kontrolör belge yükleme ve tuzak belgelerini hazırlar.
- BT-02 (soru seti + saklı set + belge yükleme), bulgular, kabul koşusu.
- Web testi, 3–5 kişi. Kritik bulgu 0 → Ürün 1 "bitti".
