# Tansu'dan Naci'ye — Mimari görüş notu: Balbal'ın gelecekteki mimarisi

**Tarih:** 13.10.2026 · **Kimden:** Tansu (ürün sahibi); metni Claude, ürün sahibinin talimatıyla ve onunla yapılan değerlendirmeye dayanarak hazırladı · **Kime:** Naci ve Naci'nin AI'ı
**Tür:** **GÖRÜŞ NOTU — TALİMAT DEĞİLDİR.** Amaç fikir alışverişi. Bu nottaki hiçbir madde iş emri, onay ya da Anayasa kapsamında karar değildir (Ç-15 kapsamında hiçbir değişikliği onaylamaz). Mevcut sıra ve kararlar (11. ve 12. tur, 2 Kasım hedefi) **aynen geçerli**.
**Dayanak:** BT-01 test raporu (13.10.2026, `docs/testler/2026-10-13_BT-01/`), company-ai `feat/adim5-veri-kutuphanesi` kod incelemesi (HEAD `0fd26bf`), ürün sahibinin 05–13.10.2026 kararları.

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
| Arama | FTS + sözlük; embedding varsayılan kapalı (ADR-007) | B7: "kullandırım" bulunamadı. **Soru: canlıda `EMBEDDINGS_ENABLED` açık mı?** |
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

1. Canlıda `EMBEDDINGS_ENABLED` açık mı? Kapalıysa sunucu kaynağı açısından açmak mümkün mü?
2. Demo ledger yapısını ürün çekirdeğine (bilgi katmanı) taşımak sence ne kadar iş? Hangi tablolar zaten var (`projects`, `extra_fields` vb.), hangileri eksik?
3. Router'ı serbest sınıflandırma yerine tanımlı araç seçimine (tool calling) çevirmek mevcut `ask_router` yapısına nasıl oturur?
4. Belge yolunda "cevaptaki rakam kaynak sayfada geçiyor mu" kontrolü ne kadar iş? Yanlış alarm riski nedir?
5. ERP sınırında (A/B) senin tercihin ve gerekçen ne?
6. Bu notta yanlış, eksik ya da gereksiz gördüğün ne var?

---

## [ANAYASA KONTROLÜ]

- **Tür:** Görüş notu. Ç-15 kapsamındaki hiçbir değişikliği onaylamaz; iş emri değildir. Kayıtlı Kanal: bu PR (fikir alışverişi).
- **Ürün etiketi:** Ürün 1 (kısa vadeli görüş, §5) · Ürün 2–3 (hedef mimari, §3–4).
- **Ç-5 / Ü-3–Ü-5:** Önerilen evrim ürün sınırlarını korur; Ürün 3 yorumları "AI Yorumu" etiketiyle (Ç-7).
- **Ç-6:** Belgeden öğrenilen bilgi yeni yetenek değildir; kaynağına bağlı kalır ve insan onayından geçer (v2.1 metniyle uyumlu).
- **Ç-11:** Bilgi katmanı veya araç kataloğu bir Anayasa/Ek-B değişikliği gerektirirse ayrıca ADT olarak açılır; bu not bunu yapmaz.
- **Kırmızı çizgiler** (yetki sızıntısı yok, kendinden emin yanlış cevap yok, proje karışması yok) bu önerinin de temel ölçütüdür.
