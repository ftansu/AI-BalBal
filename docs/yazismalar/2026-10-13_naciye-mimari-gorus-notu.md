# Tansu'dan Naci'ye — Mimari görüş notu: Balbal'ın gelecekteki mimarisi

**Tarih:** 13.10.2026 · **Kimden:** Tansu (ürün sahibi); metni Claude, ürün sahibinin talimatıyla ve onunla yapılan değerlendirmeye dayanarak hazırladı · **Kime:** Naci ve Naci'nin AI'ı
**Tür:** **GÖRÜŞ NOTU — TALİMAT DEĞİLDİR.** Amaç fikir alışverişi. Bu nottaki hiçbir madde iş emri, onay ya da Anayasa kapsamında karar değildir (Ç-15 kapsamında hiçbir değişikliği onaylamaz). Mevcut sıra ve kararlar (11. ve 12. tur, 2 Kasım hedefi) **aynen geçerli**.
**Dayanak:** BT-01 test raporu (13.10.2026, `docs/testler/2026-10-13_BT-01/`), company-ai `feat/adim5-veri-kutuphanesi` kod incelemesi (HEAD `0fd26bf`), ürün sahibinin 05–13.10.2026 kararları.
**Güncelleme (13.10.2026, öğleden sonra):** §7 eklendi — kod denetimi ön bulguları (kod okuması + demo Excel'lerin senin hesap motorunla yerelde çalıştırılması; canlıya soru sorulmadı). §2.2 ve §6/1 bu bulgulara göre güncellendi. Notun türü değişmedi: **görüş notu, talimat değil.**

---

## 0. Senden ve AI'ından beklenen

1. **Naci'nin AI'ı:** Bu görüşü bir yazılım mimarı olarak değerlendir. Her bölüm için şunu yaz: **katılıyorum / kısmen / katılmıyorum**, gerekçe, varsa daha iyi bir alternatif, kabaca maliyet ve süre tahmini, mevcut koda etkisi. Özellikle bu notun **yanlış ya da eksik gördüğü** noktaları açıkça belirt; amaç onay değil, en doğru mimariye birlikte varmak.
2. Değerlendirmeyi **Naci ve Tansu'ya** bildir. Önerilen yer: company-ai `docs/notes/MIMARI_GORUS_CEVABI_<YYYY-MM-DD>.md` (ya da bu PR'a yorum).
3. **Kod değişikliği yapılmaz, iş emri açılmaz.** Bu not yalnızca değerlendirme içindir.
4. Zamanlama: acele yok. Ürün 1 işini (Excel paketi → B2 → ölçüm) aksatmadan, uygun bir akşam. Ortak görüşme Ürün 1 sonrasında, Ürün 2 tasarımından önce yapılır.

---

## 1. Özet görüş

- **Bugünkü mimari Ürün 1 için doğru ve sağlam bir temel.** Değiştirilmesi önerilmiyor.
- **Ama Balbal'ın vizyonunu (Ürün 2–3) taşıyacak mimari bu değil.** Eksik olan tek büyük parça: **yapılandırılmış bilgi katmanı**.
- **Ana ilke önerisi: "Model öğrenir, insan onaylar, kod uygular."** Bu, ürün sahibinin 08.10.2026 ilkelerinin ("Balbal doldurur, kişi onaylar"; "parametreleri belgeden kendisi öğrenir, koda sabit yazılmaz") mimarideki karşılığı.
- **Stratejik sınır sorusu:** Ürün 2'deki ödeme ve muhasebe zincirleri Balbal'ı bir ERP'ye dönüştürme riski taşıyor. Önerilen yön: **Balbal ERP'nin yerine değil, üstünde.**

---

## 2. Mevcut mimarinin değerlendirmesi

### 2.1 Güçlü yanlar (korunmalı)
- Müşteri başına tek kurulum (tek VM, tek compose): KVKK ve kapalı kurulum (C modeli) için doğru.
- Tek yetki kapısı (`allowed_document_ids`, ADR-004): yetki AI'dan önce, kodla.
- Katmanlı ve testli backend (`api → services → repositories → models`).
- Model soyutlaması (`services/llm/`): sağlayıcı değişimi tek yerde.
- Kodla yapılan kararlar: `temporal.py` (bugün), `version_chain.py` (güncel sürüm), `search_glossary.py` (TR↔EN), MIXED birleştirme, Excel'de motorun hesabı ve cevaptaki rakamın kontrolü ("rakam asla modelden gelmez", `excel_ask.py`).

### 2.2 Karar noktaları — kim veriyor?

| Karar | Bugün | BT-01 bulgusu |
|---|---|---|
| Yetki | Kod | Sorun yok |
| Yol seçimi (belge / Excel / karma) | **Model** (`router.py`, tek çağrı; hata → sessizce DOCUMENT) | Excel sorularının 6/20'si belge yoluna gitti |
| Excel'de tablo/satır seçimi | **Model** (5 hazır fonksiyondan birini seçer ya da SQL yazar) | E1 (Haziran satırı), E6 (yanlış kavram/sayfa) — kendinden emin yanlış |
| Belge yolunda rakam | **Model** sayfa parçasından okur; **rakam kontrolü yok** | Sessiz hata riski |
| Göreli zaman ("geçen ay", "sonraki") | Model; kodda karşılığı yok | E1, E10, G5 başarısız |
| Proje listesi | Belge parçalarından (model) | G1: 7 projeden 2'si, tam liste gibi |
| Arama | FTS + sözlük; embedding varsayılan kapalı (ADR-007) | B7: "kullandırım" bulunamadı. **Canlıda kapalı** (İş Emri 2026-10-12I raporları) — bkz. §7.5 |
| Model çağrısı sırası/tekrarı | Yok | 0,8 sn aralıkta 27/45 HTTP 503 |

**Not:** Kayıpların BT-01'deki dağılımı yaklaşık olarak şöyle: yönlendirme %31, Excel satır/kavram/birim %19, arama %19, göreli zaman %12, proje kaydı %12, tekrar/kaynak %6. Kayıpların hiçbiri doğrudan "model yeterince akıllı değil" diye açıklanamıyor; hepsi modelin neyi, hangi yoldan aldığıyla ilgili.

### 2.3 Yapısal eksik: bilgi katmanı yok
Bugün her soruda ham belge baştan okunuyor. Belgeler arası durum (örneğin aynı proje için iki ÇED kararı, biri mahkemece iptal edilmiş ve iptal kararı klasörde yok) sistemce bilinmiyor; iki belge birbirine bağlanmamışsa ikisi de "geçerli" sayılıyor ve yanlış ama kaynaklı bir cevap çıkabiliyor.

---

## 3. Önerilen hedef mimari

```
ÖĞRENME ANI (belge yüklenince, bir kez)       CEVAP ANI (her soru)
  Belge yüklenir                                Soru gelir
     ↓                                             ↓
  Model çıkarır  (yapıyı tanır, doldurur)       Model anlar (ne soruluyor, hangi proje)
     ↓                                             ↓
  İnsan onaylar  ("Onaylıyorum")                Kod bulur  (araç kataloğu)
     ↓                                             ↓
  ───────────────►  BİLGİ KATMANI  ◄──────────────┘
                 (proje, kredi, taksit, sözleşme,
                  yükümlülük, izin, dava, teminat —
                  her kayıt kaynak belge + onay ile)
                          ↓
                  Cevap + kaynak (yoksa netleştirici soru)
```

### 3.1 Beş yapı taşı
1. **Sınır — ERP'nin üstünde.** Kayıt sistemi (ödeme, fatura, muhasebe fişi) müşterinin ERP'si (Logo, Netsis, SAP B1…) olarak kalır. Balbal ERP'den ve banka ekstresinden **okur**, sözleşmeyle **karşılaştırır**, **uyarır**. *"ERP ne olduğunu kaydeder; Balbal ne olması gerektiğini bilir."*
2. **Bilgi katmanı.** Belge yüklendiğinde model yapılandırılmış kayıtları çıkarır, insan onaylar. Mükerrerlik veya çelişki yükleme anında sorulur ("Bu ÇED öncekinin yerine mi geçiyor, önceki iptal mi edildi?"). **Demo ledger'ı (`seed_data/master/*.yaml`, `Fact{value, tag, source_doc}`) bu katmanın hazır şemasıdır**; önerilen, bu yapının demo üretiminden ürünün çekirdeğine taşınması.
3. **Araç kataloğu.** Model serbest SQL yazmak yerine tanımlı araçlardan seçer: proje listesi, kredi bilgisi, sonraki taksit, yükümlülük takvimi, belge arama, Excel fonksiyonları. Araçlar **genel** yazılır (bilgi katmanının şemasına göre), belirli bir dosyanın sütun yapısına bağlanmaz. Mevcut 5 Excel fonksiyonunun bir kısmı tek bir çalışma kitabının yapısına bağlı; bu yönün büyütülmemesi önerilir.
4. **Üç kademeli cevap**
   - **Kesin:** bilgi katmanından, kodla.
   - **Okunan:** belgeden model okur, kod rakamın kaynak sayfada geçtiğini doğrular (Excel yolundaki kontrolün belge yoluna uyarlanması).
   - **Netleştirme:** seçenekli soru (B2 ile zaten geliyor).
   "Bilmiyorum" ancak üç kademe tükendiğinde, Ç-7.1 yardım teklifiyle birlikte gelir. Amaç: hem kendinden emin yanlış = 0, hem "bulamadım" ≤ %10.
5. **Altyapı.** Embedding varsayılan açık; model çağrıları kuyruk + yeniden deneme + eşzamanlılık sınırıyla; her canlıya alma öncesi test seti otomatik (BT protokolü buna evrilebilir).

### 3.2 Ürünlere göre evrim

| | Model | Kod | İnsan |
|---|---|---|---|
| Ürün 1 — Tanıma | Anlar, konuşur | Rakamı verir, yetkiyi korur | Sorar |
| Ürün 2 — Birleştirme | Belgeden öğrenir, birleştirir | Bilgi katmanını tutar, uyarır | Onaylar |
| Ürün 3 — Yorumlama | Planlar, araç kullanır, senaryo kurar, yorum yapar ("AI Yorumu" etiketi, Ç-7) | Hesaplar, sınırları korur | Karar verir |

Modelin serbestliği, güvenilirliği **ölçüldükçe** (BT testleri) genişletilir. Ürün sahibinin vizyonu olan "kendisi düşünen, veri üreten, yorum yapan Balbal", bu temelin üzerine modelin özgürlüğünü genişletmek olarak görülüyor. Departman ajanları önerisi (05.10) de bu temel üzerinde yeniden değerlendirilebilir; bilgi katmanı olmadan ajanlar aynı sorunu çoğaltır.

---

## 4. ERP sınırı — iki seçenek (karar Ürün 1 sonrası, ikiniz)

| | A — Balbal kayıt sistemi de olur | B — Balbal ERP'nin üstünde bilgi ve kontrol katmanı olur |
|---|---|---|
| Ödeme talimatı, fatura, cari | Balbal'da | ERP'de; Balbal okur, eşleştirir, uyarır |
| Yasal yük (e-fatura, e-defter, VUK, banka entegrasyonu) | Balbal'ın | ERP'nin |
| Müşterinin mevcut ERP'si | Rakip / çift kayıt | Veri kaynağı |
| Satış cümlesi | "ERP'nizi değiştirin" | "ERP'nizin göremediğini görün" |
| 07–09.10 ödeme zinciri kararları | Aynen | Kayıt kısımları ERP'ye bırakılır; kontrol kısımları (sözleşme eşleştirme, eşleşmeyen ödeme uyarısı, yükümlülük takibi) Balbal'da kalır |

Bu notun görüşü **B** yönünde. Senin değerlendirmen özellikle önemli: ödeme zinciri altyapısının (PO zinciri, Z4–Z7) ne kadarının B modeline taşınabildiği ve hangi kısmının yeniden tasarım gerektirdiği.

---

## 5. Kısa vadeli görüş (Ürün 1 içinde, 2 Kasım'ı bozmadan)

Aşağıdakiler de **görüştür**; Excel paketine eklenip eklenmeyeceğine ürün sahibi ayrıca karar verecek. Senin maliyet/süre değerlendirmen bu kararı kolaylaştırır.

| # | Ekleme | Etkilediği BT-01 soruları |
|---|---|---|
| 1 | Model çağrılarında kuyruk ve yeniden deneme | Tur-1'deki 27/45 HTTP 503 |
| 2 | Yönlendirme yedeği: belge yolu boş dönerse Excel'e de bakılsın | D3, D8, E7, E8, E9 |
| 3 | Tarih aracı: "bugünden sonraki ilk satır", "önceki ay" kodla | E1, E10, G5, "sonraki taksit" |
| 4 | Proje listesi aracı: proje kaydından | G1, G2 |

Hepsi genel yazılırsa ileride bilgi katmanına taşınır, boşa gitmez. Tahmini etki: BT-02'de doğruluk %64'ten yaklaşık %80'e (bunlar olmadan %68–72).

---

## 6. Sana açık sorular

1. ~~Canlıda `EMBEDDINGS_ENABLED` açık mı?~~ Kendi raporlarından kapalı olduğu görülüyor (§7.5). Kalan soru: `embed` servisini (`--profile full`) canlı VM'de açmak sunucu kaynağı açısından mümkün mü, ve kapalı kalması bilinçli bir karar mı?
2. Demo ledger yapısını ürün çekirdeğine (bilgi katmanı) taşımak sence ne kadar iş? Hangi tablolar zaten var (`projects`, `extra_fields` vb.), hangileri eksik?
3. Router'ı serbest sınıflandırma yerine tanımlı araç seçimine (tool calling) çevirmek mevcut `ask_router` yapısına nasıl oturur?
4. Belge yolunda "cevaptaki rakam kaynak sayfada geçiyor mu" kontrolü ne kadar iş? Yanlış alarm riski nedir?
5. ERP sınırında (A/B) senin tercihin ve gerekçen ne?
6. Bu notta yanlış, eksik ya da gereksiz gördüğün ne var?

---

## 7. Ek — Kod denetimi ön bulguları (13.10.2026, öğleden sonra)

**Yöntem:** `feat/adim5-veri-kutuphanesi` (HEAD `0fd26bf`) kod okuması; ayrıca `seed_data/excel/` çalışma kitapları senin `CachedValueEngine` ve `run_function` kodunla yerelde çalıştırıldı. Canlı sisteme soru sorulmadı. Aşağıdakiler de **görüş ve gözlemdir**; yanlış gördüğün yerde düzeltmeni rica ederiz.

**Genel gözlem:** BT-01'deki 16 sorunlu cevabın büyük çoğunluğu modelin yeteneğinden değil, kod ve canlı ayarlardan kaynaklanıyor gibi görünüyor. Bu yüzden model değişikliği (Haiku) tek başına bunları çözmeyebilir.

**BT-01 raporuna düzeltme (bizim hatamız):** F6'da E5 için "uydurulmuş birim (EUR)" yazmıştık. Doğrusu şu: EUR `excel/functions.py` içinde `outstanding_debt`'te sabit yazılı; model doğru aktarmış.

### 7.1 Yönlendirme yalnız bir yönde geri düşüyor
- `ask_router._run`: DATA yolu bulamazsa DOCUMENT'a düşülüyor; DOCUMENT bulamazsa Excel'e bakılmıyor.
- `router.py`: router çağrısı hata alırsa (429 dahil) sessizce DOCUMENT'a düşülüyor. Bu durum cevapta ve audit log'da görünmüyor, yalnız uygulama logunda kalıyor. D3 ve D8 Tur-1'de 503 almıştı; tekrarında router'ın sessizce belgeye düşmüş olması bize güçlü ihtimal gibi geliyor. Logda doğrulanabilir mi?
- Router prompt'u gerçek Excel kataloğunu görmüyor; sabit listede ödeme planları (Boztepe, Yeşilova) yok (E9).
- **Görüş:** Belge yolu "bulamadım" dediğinde ve kullanıcının görebildiği bir çalışma kitabı varsa DATA yolu bir kez denenebilir. Router'a dosya ve sayfa adlarından kısa bir katalog verilebilir. Router'ın geri düşüşü cevapta uyarı, audit log'da kayıt olarak görünebilir.

### 7.2 503'lerin kaynağı: sağlayıcının hız sınırı
- `OpenAICompatibleClient` `max_retries=1` ile kuruluyor; `factory.py` bu değeri ayardan geçirmiyor. Anthropic tarafında `anthropic_max_retries` var ve 2.
- `config.py` yorumu Gemini'nin ücretsiz katmanından söz ediyor. BT-01'deki desen (ilk birkaç soru geçti, sonra 503'ler bloklar halinde geldi) dakikalık istek sınırıyla tutarlı. 429 dahil her model hatası kullanıcıya 503 olarak dönüyor.
- Uç nokta senkron ve iş parçacığı havuzunda paralel çalışıyor; tek uvicorn süreci darboğaz değil. (Önceki bir değerlendirmemizde bunu yanlış yazmıştık.)
- ⚠️ **Ürün sahibinin uyarısı:** Gemini API'nin ücretsiz katman koşullarına göre gönderilen içerik Google tarafından ürün geliştirmede kullanılabiliyor. Demo veri kurgu olduğu için bugün sorun yok. Ancak gerçek müşteri belgesinin ücretsiz katmandan hiç geçmemesi gerektiğini düşünüyoruz (Ç-11 "müşteri verisi hiçbir modelin eğitiminde kullanılmaz").
- **Görüş:** Ücretli katman veya Haiku; 429'da `retryDelay` kadar sınırlı bekleme; eşzamanlı model çağrısına üst sınır.

### 7.3 Göreli zaman ve tablo başlıkları
- `excel_ask`: planlayıcıya giden mesaj yalnız katalog ve sorudan oluşuyor, **bugünün tarihi yok.** `today` yalnız `outstanding_debt`'e gidiyor. "Geçen ay"ı model tahmin etmek zorunda kalıyor (E1: Haziran).
- Belge yolunda kural 8 modelin tarih hesabı yapmasını doğru şekilde yasaklıyor, ancak yerine geçecek bir kod aracı yok. G5 ("önümüzdeki iki hafta") bu yüzden yapısal olarak çözülemiyor.
- `CachedValueEngine.load`: başlık her zaman 1. satırdan okunuyor. Ödeme planlarında 1. satır unvan satırı olduğu için planlayıcı `deme_plan_ye_ilova_res, col_b, col_c…` görüyor. Türkçe harfler de siliniyor ("Ödeme" → "deme", "Yeşilova" → "ye_ilova"). Bu E9 ve E10'u etkiliyor. Gerçek müşteri Excel'lerinde üstte unvan satırı çok yaygın.
- **Görüş:** Planlayıcıya BUGÜN satırı eklenebilir. "Önceki ay", "bugünden sonraki ilk satır" ve "önümüzdeki N gün" ifadeleri kodla (`periods.py` / `temporal.py`) çözülebilir. Başlık satırı otomatik bulunabilir. Türkçe harfler silinmek yerine ASCII karşılığına çevrilebilir (ö→o, ş→s).

### 7.4 Proje kaydı ve projeyi bilmeyen Excel fonksiyonları
- `projects` tablosunda ad, kod ve aşama (development / construction / operation) var, ancak cevap yolunda okunmuyor. G1 ve G2 bu tablodan model kullanmadan cevaplanabilir.
- **Daha önemlisi:** `production`, `dscr`, `outstanding_debt` ve `budget_variance` proje parametresi almıyor ve ilk buldukları çalışma kitabını kullanıyor. Bugün bu dosyaların hepsi Karatepe'ye ait olduğu için sorun görünmüyor. Ancak "Yeşilova'nın Ağustos üretimi" sorulduğunda Karatepe'nin 13.538 MWh değerini vermesi muhtemel (kod okumasına dayanıyor, canlıda sorulmadı). Bu durum kırmızı çizgi 2'ye ve "proje karışması yok" ilkesine (Ü-3) dokunuyor.
- **Görüş:** Fonksiyonlara proje parametresi eklenip belgenin `project_code` alanına göre filtre uygulanabilir; katalogda proje adı gösterilebilir. Şirket kaydı soruları (projeler, aşamalar, bankalar) için kodla çalışan dar bir yol açılabilir (§5/4).

### 7.5 Tutukluğun canlıdaki asıl kaynakları
- `assist.py` (1.000 satır) ve `api/documents.py` (951 satır) senin `CLAUDE.md`'ndeki 400 satır sınırını aşıyor. Ancak `assist.py`'nin neredeyse tamamı ASSIST_MODE / EK_F_MODE bayraklarının arkasında ve canlıda iki bayrak da kapalı (K-B1R). Yani bu dosya şu an canlıda çalışmıyor; tutukluğun kaynağı başka yerde.
- **Anlamsal arama kapalı** (`EMBEDDINGS_ENABLED=false`, `embed` servisi yok). Senin Phase 3.4 raporun, vektör aramayla kapanan soruların FTS'de 0 sonuç verdiğini zaten yazıyor.
- Türkçe-İngilizce eşleme elle tutulan bir sözlükle yapılıyor (`search_glossary.py`). "kullandırım" / "drawdown" sözlükte yok (B7). Müşteri ölçeğinde sürdürülmesi zor görünüyor.
- Cevap kuralı 2 "ya tam ya hiç" çalışıyor; "eksik olabilir" diye bir ara hal yok.
- `retrieval_top_k=80`: her soruda yaklaşık 20–28 bin token gidiyor ve bu miktar belge sayısıyla büyüyor. Altı halkalı sürüm zinciri doğru sayfayı bu yığında boğuyor olabilir (B1/C1 için olası neden; doğrulanmadı). Haiku ücretli olduğu için maliyet de bununla birlikte artıyor.
- Format düzeltmeleri (birimin sütun başlığından okunması, Türkçe tarih/sayı biçimi) EK_F'de hazır ama kapalı. D4, D7 ve D10'daki biçim kusurları bu yüzden çıkıyor.
- Aynı kodun bayrağa göre iki farklı davranışı var ve canlıda hangisinin çalıştığı yalnız `.env`'den anlaşılıyor. Bayrak durumunun `/api/health`'te görünmesi işe yarayabilir.

### 7.6 Yerelde çalıştırılarak doğrulanan hatalar
| Çağrı | Sonuç | Not |
|---|---|---|
| `outstanding_debt(as_of="today")` | 11.671.800 **EUR** | Debt sayfası "Closing (USD)". Generator 11.10'da (`024d981`) USD'ye geçmiş, fonksiyonda `unit="EUR"` kalmış (E5) |
| `outstanding_debt(as_of="2026-08")` / `("2025")` | HATA: "no debt schedule table" | Fonksiyon `closing_eur` sütununu arıyor, bu sütun artık `closing_usd`. Tarihe göre borç sorusu hiç çalışmıyor |
| `budget_variance(period="2025")` | HATA: yalnız çeyrek kabul ediyor | E7 |
| `production(period="2026-08")`, `dscr(period="Q2_2026")` | Doğru | Proje parametresi yok (§7.4) |

- `test_outstanding_debt_*` yalnız değeri kontrol ediyor; birim ve tarih yolu test edilmiyor. Bu yüzden 649 test yeşilken bu hatalar fark edilmemiş.
- Katalog, anahtar-değer düzenindeki sayfaların satır etiketlerini göstermiyor. Inputs sayfası `project, karatepe_res` sütunlarıyla görünüyor; planlayıcı "Equity (USD)" satırının varlığını bilemiyor (E6). İlk sütundaki etiketlerin katalogda gösterilmesi bu sorunu çözebilir.

### 7.7 BT-01 sorunlu cevaplar — tahmini kök neden
| Soru | Sonuç | Tahmini kök neden | Tür |
|---|---|---|---|
| G1, G2 | KY / Kısmi | Proje tablosu okunmuyor | Kod |
| G4 | Kısmi | Tekilleştirme / taraf hatası | Model + kod |
| G5 | Kısmi | Tarih aracı yok | Kod |
| B1, C1 | Bulamadı | FTS + 80 parça + sürüm zinciri (doğrulanmadı) | Ayar + kod |
| B7 | Bulamadı | Anlamsal arama kapalı, sözlükte terim yok | Ayar |
| D3, D8 | Bulamadı | Router (+ olası sessiz geri düşüş) | Kod |
| E1 | KY | Planlayıcıya tarih verilmiyor | Kod |
| E5 | Kısmi | EUR kodda sabit | Kod |
| E6 | KY | Katalog satır etiketlerini göstermiyor | Kod |
| E7 | Bulamadı | Router + yıllık bütçe fonksiyonu yok | Kod |
| E8 | KY | Router; Excel'e bakılmadı | Kod |
| E9, E10 | Bulamadı | Router / tarih + başlık satırı | Kod |

### 7.8 Bu bölümle ilgili sorular
1. §7.1'deki sessiz router geri düşüşü D3/D8'de yaşandı mı? (Log, 13.10.2026 09:40–09:55 TR)
2. Gemini hesabı ücretsiz katmanda mı? Değilse 503 desenini başka ne açıklıyor?
3. §7.6'daki iki fonksiyon hatası ve planlayıcıya BUGÜN satırı eklenmesi, Excel paketine (11. tur) katılırsa paketi ne kadar uzatır?
4. EK_F_MODE ve embedding'in Haiku geçişiyle aynı restart'ta açılması sence mümkün mü, yoksa ayrı ayrı mı ölçülmeli?

---

## [ANAYASA KONTROLÜ]

- **Tür:** Görüş notu. Ç-15 kapsamındaki hiçbir değişikliği onaylamaz; iş emri değildir. Kayıtlı Kanal: bu PR (fikir alışverişi).
- **Ürün etiketi:** Ürün 1 (kısa vadeli görüş, §5) · Ürün 2–3 (hedef mimari, §3–4).
- **Ç-5 / Ü-3–Ü-5:** Önerilen evrim ürün sınırlarını korur; Ürün 3 yorumları "AI Yorumu" etiketiyle (Ç-7).
- **Ç-6:** Belgeden öğrenilen bilgi yeni yetenek değildir; kaynağına bağlı kalır ve insan onayından geçer (v2.1 metniyle uyumlu).
- **Ç-11:** Bilgi katmanı veya araç kataloğu bir Anayasa/Ek-B değişikliği gerektirirse ayrıca ADT olarak açılır; bu not bunu yapmaz.
- **Kırmızı çizgiler** (yetki sızıntısı yok, kendinden emin yanlış cevap yok, proje karışması yok) bu önerinin de temel ölçütüdür.
