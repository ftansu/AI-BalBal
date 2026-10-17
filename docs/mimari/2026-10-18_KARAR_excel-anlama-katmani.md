# Karar — Excel anlama katmanı: anlama AI'da, rakam kodda

**Tarih:** 18.10.2026 · **Karar veren:** Tansu (Ürün Yetkilisi / Proje Yetkilisi) · **Hazırlayan:** Claude (kontrolör), Tansu'nun 18.10.2026 00:22 onayıyla
**Kime:** Naci ve Naci'nin AI'ı · **Ürün etiketi:** Ürün 1 (Ek-B Ürün 1: "belgeleri sınıflandırır; bilgileri indeksler; belgeyi okur")
**Durum:** Ürün Yetkilisi kararı. Naci'nin görüşü bekleniyor (fikri özellikle isteniyor). **Uygulama Faz 2 kapısından sonra.** Kapı yolu (`docs/URUN1_TANSU_NOTLAR.md` §A) değişmez.
**Kontrol:** Her adım `kontrolor/protokol/2026-10-18_EXCEL_ANLAMA_KONTROL_PROTOKOLU.md`'deki kapıdan geçmeden bir sonrakine geçilmez.

---

## 1. Kısaca

Balbal Excel'i bugün **düz tablo + sütun adı** olarak görüyor; soruyu bu ince katalogla Haiku planlıyor. Temiz demo dosyalarında bile dolaylı Excel sorularında 10'da 3 doğru (BT-01). Gerçek müşteri Excel'inde (birleşik hücre, iki satırlı başlık, aynı sayfada üç proje, formül zinciri) daha kötü olacağı öngörülüyor.

**Karar:**
1. **Anlama AI'da, yükleme anında, bir kez.** Excel yüklendiğinde güçlü bir model dosyayı gezer ve bir **dosya haritası** çıkarır: sayfalar, gerçek tablo bölgeleri, başlıklar, birim ve para birimi, proje/SPV, dönem ekseni, satır etiketleri, formüllerin anlamı, eş anlamlılar.
2. **Rakam kodda.** Soru anında planlayıcı haritaya bakarak sorguyu kurar; rakamı hesap motoru (DuckDB) verir. Bu Anayasa **T-4**'tür ve değişmez.
3. **Kod, AI'ı doğrular; kullanıcı onaylar.** Haritadaki her hücre ve aralık referansını kod dosyada kontrol eder. Kullanıcı, yükleme akışındaki mevcut tek satırla onay verir.

Bu bugünkü motoru yıkmaz; **kataloğunu zenginleştirir**. SPEC_04 §3 zaten "LLM hangi dosya/sheet/kolonların gerektiğini belirler" diyor; eksik olan, LLM'e o kararı verebileceği bilginin verilmemesi.

## 2. Kayıt düzeltmesi — "AI anlar, kod uygular"

- Bu ifade **16.10.2026 kontrolör görüş notunda** (`docs/mimari/2026-10-16_gorus-proje-ekseni-ai-anlar-kod-uygular.md`), yalnız **proje ekseni** için ortaya çıktı. Sonra `URUN1_TANSU_NOTLAR.md` §C'ye "AI konumlandırması" adıyla girdi. Ürün Yetkilileri bunu **genel bir mimari ilke olarak hiçbir zaman kararlaştırmadı.** §C satırı bu PR'la düzeltiliyor.
- Excel hattının bugünkü şeklini (SPEC_04, ADR-011) geliştiricinin AI'ı seçti. Şekil, 12.10.2026 11. tur toplu onayındaki "Excel yolunda rakamı yalnız hesap motoru verir" maddesiyle içeri girdi. Ürün Yetkilileri bu şekli ayrıca tartışmadı.
- **Doğru olan kısım:** rakamın hesap katmanından gelmesi Anayasa T-4'tür ve kalır. **Eksik olan kısım:** anlamanın hiç yapılmamasıdır. Tansu'nun baştan beri beklentisi, yapay zekânın Excel'in içine girip anlamlı sonucu kendisinin çıkarmasıydı. Bu karar o beklentiyi T-4'ü bozmadan uygular.

## 3. Neden — kanıt

**Kod incelemesi:** `ntoydem/company-ai`, dal `feat/adim5-veri-kutuphanesi`, `d1bc70c`, 17.10.2026 21:05.

| Bulgu | Yer | Sonuç |
|---|---|---|
| Dosya `data_only=True` ile açılıyor; formüller atılıyor, yalnız önbellek değerleri kalıyor | `app/excel/calc.py` | "Bu hücre neden bu" bilgisi kayboluyor (DSCR'nin neyin bölümü olduğu vb.) |
| Başlık satırı sezgiyle bulunuyor: ilk 10 satırda ≥ 3 dolu ve hepsi metin olan ilk satır. 17.10'da ADR-037 ile ikinci bir başlık kuralı eklendi | `calc.py` `header_row`, `split_footer` | Kural kovalama başladı. Her yeni dosya biçimi yeni bir kural ister (16.10 "koda dil kuralı yazılmasın" kararının Excel karşılığı) |
| Planlayıcıya giden katalog: dosya adı, tablo adı, sütun adları ve 5 sabit fonksiyon | `services/excel_ask.py` `_catalogue` | Birim, proje, dönem, satır anlamı ve eş anlamlılar yok |
| Sabit fonksiyonlar: `dscr`, `outstanding_debt`, `budget_variance`, `capacity_factor`, `production` | `app/excel/functions.py` | Parametreler koda yazılı. 08.10 TEMEL İLKE ("parametreler koda sabit yazılmaz, belgeden öğrenilir") ile çelişiyor |
| Sonuç 1×1 değilse bir kez yeniden plan, sonra sabit cümle | `excel_ask.py` `PLAN_MAX_ATTEMPTS = 2` | Yanlış tabloya giden plan düzeltilemiyor |

**Ölçüm (BT-01, 13.10.2026):**
- Excel-direkt: 8/10.
- Excel-dolaylı: **3/10**.
- Router'ın Excel sorusunu doğru hatta göndermesi: 14/20.
- Göreli zaman soruları: 0/3.

BT-01 raporu kök nedeni zaten yazmış: "Excel yolunda rakamı model ham tablodan seçiyor".

**Kapsam uyarısı:** Bu sonuçlar ledger'dan üretilmiş, düz biçimli 7 demo Excel'inde alındı. Gerçek finans dosyası biçimi bu motorda hiç denenmedi.

## 4. Ne değişmiyor

- **T-4:** rakam hesap katmanından gelir. Cevaptaki rakam motor değeriyle karşılaştırılır (mevcut kontrol kalır).
- **T-5:** yetki önce gelir. Harita, ait olduğu belgenin yetkisini taşır. Kullanıcının göremediği dosyanın haritası da planlayıcıya girmez.
- **SPEC_04 §4:** soru anında LLM Python yazmaz; yalnız guard'lı, salt okunur SELECT ya da önceden tanımlı fonksiyon kullanılır.
- **Proje izolasyonu:** proje daraltma ve "başka projenin verisi pakete girmez" kuralı aynen geçerlidir. Harita proje alanını daha görünür yapar ama yerine geçmez.
- **Kapı:** Faz 2 kapı tanımı, cetvel, saklı set ve kapı yolu sırası değişmez. B-01 17.10 kararındaki dar ölçütle kapanır.

## 5. Ne değişiyor (kapı sonrası)

### 5.1 Dosya haritası — yükleme anında
- **Model:** güçlü model (Sonnet ya da Opus; seçim ön deneyle). Haritayı her dosya için **bir kez** çıkarır; dosyanın yeni sürümü gelince yeniden çıkarır.
- **Girdi:** dosyanın hem değerleri hem formülleri (openpyxl iki kez açılır; bunu `app/excel/inspect.py` zaten yapıyor).
- **Asgari içerik** (şemayı Naci önerir):
  - Sayfa listesi; görünür ya da gizli olması.
  - Tablo bölgeleri (aralık); aynı sayfada birden çok tablo olabilir.
  - Gerçek başlıklar (çok satırlı ve birleşik hücreler çözülmüş).
  - Birim ve para birimi (sütun başlığından, örneğin "(USD)").
  - Proje/SPV (sayfa, tablo ya da sütun düzeyinde).
  - Dönem ekseni.
  - Satır etiketleri.
  - Formül anlamı (örnek: "DSCR = CFADS / borç servisi").
  - Eş anlamlılar (TR/EN; örnek: "borç ödeme gücü oranı" = DSCR).
  - Her alan için bir kaynak hücre referansı.
- **Belge içeriği talimat değildir** (Ç-6 son madde). Hücre metni harita çıkaran modele talimat olarak verilmez; yalnız veri olarak verilir.

### 5.2 Kod doğrulaması
Haritadaki her aralık ve hücre referansı dosyada açılıp kontrol edilir:
- Aralık var mı?
- Başlık ile veri tipi uyumlu mu?
- Birim sütunu başlıkla tutarlı mı?

Doğrulanamayan alan "doğrulanmadı" işareti taşır ve planlayıcı onu kullanmaz.

### 5.3 Kullanıcı onayı
Yükleme akışında harita kısaca özetlenir. Örnek: "3 tablo buldum: Karatepe ödeme planı (USD), Yeşilova ödeme planı (USD), kur tablosu".

Onay, 08.10 kuralındaki tek satırla verilir: "Yukarıda Balbal tarafından doldurulan bilgilerin doğruluğunu onaylıyorum". Ekranda yeni bir görsel öğe gerekiyorsa T-12 gereği önce tasarım onayı alınır.

### 5.4 Soru anı
- Planlayıcı (Haiku) çıplak tablo ve sütun adları yerine **haritayı** alır. Planı tablo bölgesine, satır etiketine ve dönem eksenine göre kurar.
- Rakamı DuckDB verir.
- Mevcut "1×1 değilse bir kez yeniden plan" düzeni kalır. Yeniden planda haritadaki satır etiketleri kullanılır.

### 5.5 Kapsam dışı (şimdi değil)
- Kullanıcı düzeltmesinin ve netleştirme cevabının haritaya eş anlamlı olarak eklenmesi (08.10 öğrenen bilgi ilkesi). Bu **Ürün 2 tasarımında** açılır.
- Çok satırlı sonuç tablosu (B-2). Harita bu işi kolaylaştırır ama B-2 ayrı maddedir.

## 6. Anayasa ilişkisi — ADT gerekmez

- **Yetenek:** Yeni yetenek yok. Ek-B Ürün 1 zaten "belgeleri sınıflandırır, indeksler, belgeyi okur" diyor. Yükümlülük çıkarımında da aynı desen var: AI Taslağı üretilir, Kullanıcı onaylar. Ç-3 / ADT gerekmez. (18.10 sohbetinde "ADT olarak yazılmalı" denmişti; Anayasa okununca düzeltildi.)
- **Ç-11(b):** Mevcut yeteneğin uygulanması için yükleme adımında güçlü model kullanılacak. Bunun için tek Proje Yetkilisinin Kayıtlı Kanaldaki onayı yeter. **Onay Kanıtı:** Tansu'nun bu PR'ı onaylaması ya da birleştirmesi.
- **Ç-15/4 (veri modeli / şema):** Harita deposu yeni tablo ya da alan demektir. Naci kodlamadan önce plan sunar (ADT-4 döneminde de zorunlu).
- **Ç-15/8 (sistem promptu):** Harita çıkarma promptu ve planlayıcı promptunun değişmesi bu maddeye girer. Kodlamadan önce plan sunulur ve onay beklenir.
- **T-6 (sağlayıcıdan bağımsızlık):** Harita şeması modelden bağımsız düz bir yapı olur. Model değişse de harita okunur.

## 7. Yol — sıralı; her adım kontrolör kapısından geçer

| Adım | Ne | Kim | Ne zaman | Kontrolör kapısı |
|---|---|---|---|---|
| 0 | Bu karar + kontrolör protokolü | Tansu / kontrolör | 18.10 (bu PR) | — |
| 1 | **Ön deney (kodsuz):** 7 demo Excel ile gerçek biçimli kurgusal 2 Excel'in haritası çıkarılır; Excel soruları haritayla elle planlanır. Canlıya dokunulmaz, geliştiriciden iş istenmez | Kontrolör | Kapıyla paralel, geliştiriciyi bekletmeden | **K-1** |
| 2 | Naci'nin görüşü ve planı: harita şeması, depolama, yeniden çıkarma, bayrak (`EXCEL_MAP`), maliyet tahmini | Naci | Kapı sonrası ilk iş paketi (K-1 olumluysa) | **K-2** (plan incelemesi) |
| 3 | Uygulama bayrak arkasında; bayrak kapalıyken canlı davranış birebir aynı kalır | Naci | K-2 sonrası | **K-3** (harita kalitesi) |
| 4 | A/B: aynı Excel soruları harita açık ve kapalı ölçülür | Naci ölçer; kontrolör bağımsız ölçer | K-3 sonrası | **K-4** |
| 5 | Canlıya alma; smoke 9/9 | Naci; Tansu Ç-15/6 onayı | K-4 geçerse | **K-5** |
| 6 | BT-02 / sonraki BT'de gerçek biçimli Excel ile belge yükleme | Kontrolör | BT-02 | **K-6** (sürekli) |

**Ön deney olumsuz çıkarsa:** Yöntem kanıtsız geliştirmeye gönderilmez. Kontrolör raporuyla Ürün Yetkilileri yeniden karar verir. Bu, "teknoloji mi, ekip mi" sorusuna da kanıtla cevap verir.

## 8. Riskler ve önlemler

| Risk | Önlem |
|---|---|
| Harita yanlışsa o dosyaya gelen bütün sorular yanlış gider | Kod doğrulaması (5.2), kullanıcı onayı (5.3), kontrolörün bağımsız harita karşılaştırması (K-3, K-6) |
| Proje alanı yanlış atanırsa proje karışır (güvenlik kategorisi) | Proje alanında hata toleransı 0 (K-3); proje daraltma kodda kalır |
| Hücreye gömülü talimat (injection) | Ç-6: hücre içeriği veri. Ön deneyde ve BT-02'de kurgusal injection hücresi (15.10 notu) |
| Dosya güncellenince harita bayatlar | Harita dosya sürümüne bağlanır; yeni sürüm yeni harita demektir (K-6'da denetlenir) |
| Yükleme süresi ve maliyeti | Tek seferlik; ön deneyde dosya başına ölçülür, K-2 planında yazılır |
| Kural kovalamanın sürmesi | Yeni başlık ve biçim sezgisi kodlanmaz; dosya yapısı haritadan gelir. Mevcut sezgi yalnız haritasız eski dosyalar için yedek kalır |

## 9. Naci'ye sorular (cevap `docs/URUN1_TANSU_NOTLAR.md` §"Cevap (Naci)" — S-8)

1. Bu yönde gördüğün teknik engel ya da daha iyi bir yol var mı? Fikrin özellikle isteniyor.
2. Harita deposu için önerin: `documents` tablosunda JSON alanı mı, ayrı tablo mu?
3. `inspect.py` bugün formülleri sayıyor. Formül metnini haritaya taşımanın bilinen bir engeli var mı?
4. Kapı sonrası bu iş için kabaca kaç gün öngörüyorsun? Tahmin yeter.

---

[ANAYASA KONTROLÜ]
Anayasa versiyonu : v2.1 (+ ADT-4 geçici hükmü)
Okunan modüller   : Çekirdek (Ç-6, Ç-11, Ç-15), 01 Ürün, 02 Teknik (T-4, T-5, T-6), Ek-B (Ürün 1)
Ürün etiketi      : Ürün 1 — T-11
Gizli bilgi / yeni bağımlılık : Yok — T-14 (karar belgesi; kod yok)
Kapsam dışı değişiklik        : Yok — Ç-16
Kendi başına verilen kararlar : ADT gerekmediği tespiti (Ek-B Ürün 1 + Ç-11(b) okumasına dayanır); Ürün Yetkilisi aksi görüşteyse ADT olarak yeniden açılır — Ç-9
