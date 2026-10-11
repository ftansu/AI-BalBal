# Tansu'dan Naci'ye — 6. tur: PR #19 (T-12), PR #20 (T-13.1) ve toplu tutarlılık tablosu — 11.10.2026

**Kimden:** Tansu (ürün sahibi; metni Claude hazırladı, ürün sahibinin talimatıyla) · **Kime:** Naci ve Naci'nin AI'ı
**Dayanak:** canlı canvas (v138, `1791542289-ba4a`), `docs/NACI_CEVAP_2026-10-08.md` §3, `docs/NACI_NOTU_URUN1.md` §C.6.2, senin `feat/adim5-veri-kutuphanesi` dalındaki `seed_data/master/*.yaml` (11.10.2026 hâli).

Bu dosya, PR #18'deki "süre ve verim" yorumundaki 1., 2. ve 5. isteklerinin cevabıdır:
**(1)** Toplu değer tablosu, **(2)** gönderilen her değerin aritmetik kontrolü, **(5)** bilinçli bırakılan tutarsızlıkların listesi.

Ledger'ını kanonik kaynaklarla satır satır karşılaştırdık. Çıkan bütün farklar ve kararlar aşağıda. **Kural değişmedi: canvas > notlar > ledger.** Bu dosyadaki bir değer canvas'la çelişirse canvas geçerlidir; bana yaz.

---

## 0. Özet — ne yapman gerekiyor

1. **PR #19 (T-12):** Hukuk değerleri §1'de, canvas'taki 10 hukuki süreçle birlikte (sen 6'sını sormuştun; canvas'ta 4 süreç daha var). Hepsi ürün sahibi onaylıdır, `AI_ASSUMPTION` gerekmez.
2. **PR #20 (T-13.1):** **A.** Kurgu ve belge kuralları §2'de.
3. **Ledger düzeltmeleri §3'te.** En önemlileri:
   - Boztepe imza tarihi **20.02.2024** (senin `2024-05-02` varsayımın geçersiz).
   - Banka adları **gerçek adlara** döner (Anayasa v2.1 Ç-12).
   - Karatepe'deki **ECA** kaldırılır.
   - Kızılova geliştirme takvimi canvas'a çekilir.
   - Kurlar canvas'la eşitlenir.
   - Her santrale işletmeye giriş ve YEKDEM tarihleri eklenir.
4. **KGF tamamen çıkar** (§3.6).
5. **Aritmetik kontroller §4'te, bilinçli bırakılanlar §5'te.** Bundan sonra bizden gelen her değer tablosu aynı kontrol listesiyle gelir.

---

## 1. T-12 — Hukuk partisi (canvas Hukuk ve Enerji panoları + Dava Geçmişi ekranı esas)

Demo bugünü **06.10.2026**. Dava belgeleri **restricted** (Soru 15 = A).

| Kod | Proje | Süreç | Değerler |
|---|---|---|---|
| T-12.1 | Karatepe | **Kamulaştırma ve İrtifak Bedeli Tespiti Davası** | **Ankara 4. İdare Mahkemesi, 2025/412 E.** Davacı: Karatepe RES Enerji Üretim A.Ş. Davalı: Enerji ve Tabii Kaynaklar Bakanlığı. Konu: TEİAŞ'ın 154 kV enerji nakil hattı için Karatepe'ye ait iki parsel üzerinde tesis edilen irtifakın bedeli (Karatepe burada **taşınmaz sahibi**). İdarenin belirlediği bedel **1.850.000 TL**. Karatepe'nin talebi **3.400.000 TL**. Bilirkişi heyetinin bulduğu değer **2.960.000 TL**. Kronoloji (canvas Dava Geçmişi ekranıyla birebir): dava 12.02.2025 · savunma 03.04.2025 · bilirkişi ara kararı 20.06.2025 · bilirkişi raporu 15.09.2025 (bedel piyasa değerinin altında) · idarenin ek bilirkişi talebi reddi 10.01.2026 (duruşma tutanağı aynı tarihli) · **sonraki duruşma 14.10.2026** (nihai beyanlar). Mahkeme kalemi e-postası `Kamulaştırma_Itiraz_Sureci.eml` 15.09.2026. Karşı taraf avukatının e-postası `Dava_Dosyasi_Guncelleme.eml` 10.09.2026. |
| T-12.1b | Karatepe | **Elektrik Direği İhlali Davası** | **Ankara 1. Asliye Hukuk Mahkemesi, 2026/356 E.** Davacı: komşu parsel maliki (kurgusal kişi). Davalı: Karatepe. İddia: santral iç saha OG hattının bir direği izinsiz olarak davacının parseline dikildi. Talep: el atmanın önlenmesi + ecrimisil **240.000 TL**. Açılış 18.06.2026. Durum "Bekliyor": ön inceleme yapılmadı. **İlk duruşma 20.11.2026**. |
| T-12.2 | Yeşilova | **Tazminat Davası (Arazi Tahsis)** | **Çanakkale 1. Asliye Hukuk Mahkemesi, 2025/208 E.** (canvas'ta sıra numarası düzeltilecek, §3.9). Davacı: arazi maliki (kurgusal kişi). Davalı: Yeşilova. Talep **1.350.000 TL** (yaklaşık 27.700 USD). Açılış 11.06.2025. **Sonraki duruşma 05.11.2026**. Hukuk danışmanının yazışması `Yesilova_Arazi_Tahsis_Tazminat_Yazışması.msg` 14.09.2026. Annex F'te (raporlama yılı 2025) bilgi notu olarak geçer. Kredi sözleşmesindeki "önemli dava" eşiği **250.000 USD**; dava eşiğin altında, bildirim ihlali yok. |
| T-12.2b | Yeşilova | **Sınır İhlali Davası** | **Çanakkale 2. Asliye Hukuk Mahkemesi, 2026/511 E.** Davacı: komşu parsel maliki. Davalı: Yeşilova. İddia: santral servis yolu yaklaşık 1,2 dönüm davacının parseline taşıyor. Talep: el atmanın önlenmesi + ecrimisil **85.000 TL**. Açılış 02.09.2026. Durum "Bekliyor". **İlk duruşma 18.12.2026**. |
| T-12.3 | Boztepe | **İmar İptali Davası** | **Ankara 2. İdare Mahkemesi, 2026/418 E.** **Davacı Boztepe, davalı İlçe Belediyesi** (canvas: karşı taraf Belediye). Konu: Belediye'nin santral sahasına bitişik alanı konut alanına çeviren imar planı değişikliğinin iptali; gerekçe planlama esaslarına, şehircilik ilkelerine ve RES emniyet mesafelerine aykırılık. Dilekçe 22.05.2026. Yürütmeyi durdurma (YD) talebi **10.07.2026'da reddedildi**: plan yürürlükte; mevcut santralin işletmesini ve kredi servisini etkilemiyor, sahanın çevresinde ileride kısıt riski doğuruyor. Kronoloji: savunma 25.06.2026 · cevaba cevap dilekçesi **22.09.2026** (canvas görevi) · bilirkişi keşfi **26.09.2026** (keşif tutanağı dosyada) · **bilirkişi raporu bekleniyor** · **duruşma 28.10.2026** (kanonik, değişmez). Bilirkişi ücreti avansı Boztepe tarafından "Kurum / resmî ödeme" türüyle ödenir (mahkeme: Ankara **2.** İdare). |
| T-12.4 | Kızılova | **Yüklenici İhtilafı (İhtarname Aşaması)** | Kızılova, **ABC İnşaat A.Ş.**'ye noter ihtarnamesi gönderdi: **29.09.2026**. Konu: S-26-001 LNTP kapsamındaki **saha yerleşim ve temel ön tasarım paketinin** iş programındaki **25.09.2026** teslim tarihinde teslim edilmemesi (mühendislik teslim gecikmesi; kanonik konu). Talep: paketin **22.10.2026'ya kadar** teslimi (canvas tarihi). Aksi halde S-26-001'deki gecikme cezası (**günlük sözleşme bedelinin %0,05'i = 5.000 USD, tavan %10**) işletilir ve hakedişlerden mahsup edilir. **Ceza hakkı saklı tutulur, tutar talep edilmez.** Avans faturası (ABC2026000000184; ödeme 12.10.2026) ve Hakediş 1 (SÖ-26-014) ihtarın konusu değildir. |
| T-12.4b | Kızılova | **Mera Tahsis Değişikliği Süreci** (dava değil, idari süreç) | Valilik Mera Komisyonu. Talep 21.08.2026 (`Kizilova_Mera_Tahsis_Degisikligi_Talebi.pdf`, §C.6.2). Komisyon Kasım öncesi toplanmıyor; **sonraki toplantı 12.11.2026**. Belge üretilmez, yalnız talep yazısı. |
| T-12.5 | Demirci | **TEA Olumsuz Görüşüne İtiraz** | TEA olumsuz görüşü **TEİAŞ**, **08.09.2026**, **TEA-2026-119** (kanonik). Gerekçe: T-04 ve T-07 türbinleri meteoroloji radarının etki alanında; yerleşim revizyonu isteniyor (kanonik). İtiraz **22.09.2026**, ETKB koordinasyonunda TEİAŞ'a. İtirazın gerekçesi: radar etki alanının yeniden hesaplanması ve alternatif mikro-yerleşim önerisi. Revize mikro-yerleşim rüzgâr danışmanından 10.10.2026'da bekleniyor (kanonik). Durum "İtiraz İncelemede"; **kurumun cevabı için beklenen tarih 08.11.2026** (canvas tarihi). Sonuç belgesi üretilmez. |
| T-12.5b | Akyar | **Arazi Bedeli Müzakeresi / Kamulaştırma Ön Değerlendirmesi** (dava yok) | Malikle müzakere; değerleme raporu 10.04.2026, görüşme tutanağı 05.09.2026 (malik bedeli iki katına çıkardı; §C.6.2). **Sonraki görüşme 25.10.2026**. Hukuk kamulaştırma takvimi taslağını hazırlıyor. Dava belgesi üretilmez. |
| T-12.6 | Boztepe | **Kredi (2024-BZ) imza günü** | **20.02.2024** (canvas: `Boztepe_RES_Kredi_Sozlesmesi.pdf` · 20.02.2024; NACI_CEVAP §3.2). Senin `2024-05-02` varsayımın ve bizim 3. turdaki "imza Mayıs 2024" ifademiz **geçersiz**. Geri ödeme yapısı §3.1'de. |

**Güneşalan:** dava yok.

---

## 2. T-13.1 — Yeşilova: özkaynak 24.048.000 + kredi 2.352.000 = capex 26.400.000

**Cevap: A.** Santral sponsor fonuyla kuruldu. 2023-YS sonradan alındı ve sponsor fonunun 2.352.000 USD'lik kısmını geri ödedi. Kalan net sponsor katkısı **24.048.000 USD**.

Canvas'taki YEKDEM verisi (Yeşilova 22 MW'ın **12 MW**'ı YEKDEM'de, 73 USD/MWh, bitiş **31.12.2026**) Yeşilova'nın iki fazlı olduğunu gösteriyor. Kurgu şöyle:

| | Faz 1 | Faz 2 (kapasite artışı) |
|---|---|---|
| Kapasite | 3 × Vestas V136 → **12 MWe** (ilk lisans) | +2 türbin → **22 MWe** (lisans tadili) |
| İşletmeye giriş (COD) | **28.12.2016** | **15.11.2022** |
| Satış | YEKDEM **01.01.2017–31.12.2026**, 73 USD/MWh (2021 öncesi mekanizma) | YEKDEM dışı (PTF) |
| Finansman | Sponsor fonu | Sponsor fonu |

- **Capex 26.400.000 USD** iki fazın toplamıdır.
- 2023-YS (imza **03.06.2023**, Faz 2 COD'sinden sonra) **inşaat kredisi değildir**. Kullanım amacı: sponsor fonunun (ortak cari hesabı) geri ödenmesi. Sermaye azaltımı yapılmadı.
- İlk kullandırım **14.07.2023** (ledger'da yoksa). İlk taksit 14.04.2024 (9 ay anapara ödemesiz).
- Kredi sözleşmesinde **inşaat dönemi ön koşulu (CP) yok**: EPC, ÇED, özkaynak katkısı, inşaat sigortası maddeleri yer almaz.
- Ledger etiketleri: `equity` = 24.048.000, etiketi **"net sponsor katkısı (kredi sonrası)"**. Ayrı bir alanda **"inşaat dönemi sponsor fonu" = 26.400.000**. İkisi bir belgede etiketsiz yan yana durmasın.
- **DSRA 702.000 USD:** kredi sözleşmesinde "6 dönemlik borç servisi karşılığı, sabit tutar" olarak tanımlanır.
- **Borç servis hesabı 84.500 USD** (06.10.2026), 14.10.2026 taksitinden küçük. Hesap ekstresinde eksik kısmın **vade öncesinde işletme hesabından aktarıldığı** görülsün; aksi halde plansız bir "yetersiz bakiye" bulgusu çıkar.
- **Annex F'te kasıtlı eksik belge:** "Yeşilova TEİAŞ bağlantı anlaşması teminat mektubu" (listede bu adla geçsin, belgenin kendisi üretilmez).

Değişmeyenler: 2.352.000 USD, 24 × 98.000, taksit #1 14.04.2024 ve #24 14.01.2030, DSCR 1,15x (2024: 3,9x · 2025: 3,6x), 5 × V136.

---

## 3. Ledger düzeltmeleri (senin `seed_data/master/*.yaml` ↔ kanonik)

### 3.1 Boztepe (`boztepe_res.yaml`)

| Alan | Ledger'da | Olması gereken |
|---|---|---|
| `finance.signed_date` | 2024-05-02 (AI_ASSUMPTION) | **2024-02-20** |
| `repayment_profile` | anapara Mayıs 2027 | İlk 3 yıl yalnız faiz. Anapara **01.03.2027**'den **84 aylık eşit taksit** (178.571,43 USD; son taksit **01.02.2034**). Tenor 10 yıl. |
| faiz | swap sabit %3,894 + %2,85 | Aynı (%6,744). Gün esası **30/360**; ödeme günü ayın 1'i, tatile denk gelirse sonraki iş günü; kayma faiz tutarını değiştirmez. Her ay 84.300 USD. |
| `timeline` | boş | **COD 28.12.2020.** YEKDEM **01.01.2021–31.12.2030**, 85 USD/MWh (2021 öncesi mekanizma, yerli katkı dahil; canvas). 2024-BZ, inşaat dönemi sponsor fonunun **refinansmanıdır**. |
| `lender` | PQR Bank | **Garanti BBVA** (§3.5) |

### 3.2 Karatepe (`ankara_res.yaml`)

| Alan | Ledger'da | Olması gereken |
|---|---|---|
| `lenders.eca` / `eca_debt` / taraf listeleri | VWX Export Credit Agency, borç 0 | **Kaldır.** 2022-KT yalnız Garanti BBVA'nın proje kredisidir; canvas'ta ECA yok. Facility zinciri yeniden üretilirken ECA tarafı çıkar. |
| `lenders.local_bank` | PQR Bank | **Garanti BBVA** |
| `turbines.model_generic` | "3,0 MW sınıfı kara tipi türbin" | **Enercon E-82 3,0 MW** (T-9 kararı: üretici adları gerçek) |
| YEKDEM | yok | **24 MW'ın tamamı, 2021 sonrası YEKDEM mekanizması**, 10 yıl: **15.10.2023–14.10.2033**, fiyat 51 USD/MWh (USD tavanlı TL fiyatın demo karşılığı). Canvas'taki "YEKDEM 16 MW · 73 USD · 2028" değerleri 2023 COD ile bağdaşmıyor; canvas düzeltilecek (§3.9). |
| `capacity_mw.initial` / türbin | 21 MW, 7 → 8 türbin | Aynı kalır (T-11.1). Lisans 15.06.2020 (21 MW), tadil 10.02.2021 (24 MW); 24 MW tek fazda 15.10.2023'te işletmeye girdi. |
| `guarantee_letters` | yalnız amaç ve "Ocak 2027" | Vade **15.01.2027** (canvas: `Karatepe_RES_Teminat_Mektubu_2026.pdf`, Kredi Tadil 2 md. 4). Lehtar: orman idaresi. Banka: Garanti BBVA. Tutar: **1.150.000 TL**. |

### 3.3 Kızılova (`izmir_res.yaml`) — geliştirme takvimi eski İzmir RES verisinde kalmış

| Alan | Ledger'da | Olması gereken (§C.6.2, canvas) |
|---|---|---|
| `development_start` | 2023-02-01 | **2022-06-01** (ölçüm 01.06.2022'de başladı) |
| `pre_licence_application` | 2023-05-10 | **04–18.10.2023** (Ekim RES penceresi; başvuru 04.10.2023) |
| `pre_licence` | 2024-01-18 | **2025-01-15** (ÖL/13085-3; 24 ay → bitiş 15.01.2027) |
| `land_acquisition` | 2024-04-02 / 2024-09-30 | satış vaadi **20.01.2025**, tapu devri **15.02.2025**. ENH güzergâhındaki 3 parselin kira sözleşmesi imzalı, şerh bekliyor. |
| `ced_application` | 2025-03-05 | **2025-04-10** (önlisans + 90 gün sınırı 15.04.2025 içinde) |
| ÇED son olay | İDK 27.08.2026 | ek bilgi talebi **18.07.2026** · kurum görüş yazısı **12.09.2026** · İDK **bekleniyor** (ÇED-2026-057) |
| `pending_steps` | Askeri yazı ve TEA bekliyor | **Askeri yazı tamamlandı (30.08.2025)**. **TEA olumlu (25.10.2025, TEA-2025-301)**. Jeoteknik 20.05.2025, kurum görüşleri 10.12.2025, bağlantı çağrısı 14.07.2025 (BA-2025-042): hepsi tamamlandı. Arazi izinleri devam (orman ön izni 30.06.2026, mera talebi 21.08.2026). |
| `signed_undrawn_facility.lender` | PQR Bank | **Garanti BBVA** |
| `advance_guarantee` | DEF Bank | **Akbank** |

**Bu fark zaten üretilmiş belgeleri etkiliyor** (DOC-IZM-DEV-001…003). Enerji partisinden önce yeniden üretilmeleri gerekir.

**ABC avans teminat mektubu:** ledger'daki bilgiler (Akbank, 2.000.000 USD, 15.03.2028) kalır. Kaynakları:
- ABC İnşaat'ın **02.10.2026** tarihli e-postası (`.eml`; mektubun düzenlendiğini ve aslının gönderileceğini bildirir),
- canvas'taki "Belge isteği · Avans teminat mektubu" görevi.

**Mektubun kendisi sistemde yok.** Kasıtlı eksik budur (canvas: "Ödeme koşulu olan avans teminat mektubu belgelerde yok"). EPC sözleşmesi banka adı vermez; yalnız tutarı ve geçerlilik şartını yazar.

### 3.4 Yeşilova (`yesilova_res.yaml`)

- `lender`: LMN Bank → **Commerzbank AG**.
- `timeline`: §2'deki iki faz.
- `capex`/`equity` etiketleri: §2.

### 3.5 Banka adları (`company.yaml`, tüm SPV'ler)

Anayasa v2.1 Ç-12 (PR #15, iki onay tamam) bankaların gerçek adlarına izin veriyor. Kurgusal karşılıklar kalkar:
- PQR Bank → **Garanti BBVA**
- LMN Bank → **Commerzbank AG**
- DEF Bank → **Akbank**

İş Bankası (bordro/vergi) da gerçek adla. Sözleşme koşulları, oranlar ve tutarlar kurgusal kalır (Ç-12'nin şartı).

### 3.6 KGF — tamamen çıkar

Boztepe'deki KGF kefaleti USD krediyle uyumsuz; ürün sahibi kararıyla (11.10.2026) demodan tamamen çıkıyor. Ürün 1 notunda kalan atıflar geçersiz:
- §D.1.3 "Kefalet · KGF" satırı,
- §D.3.6 KGF e-postası,
- §D.6.2 "Boztepe'de KGF yazışmasını görür".

Canvas'taki KGF talep ekranı kaldırılacak (§3.9). **KGF belgesi üretme.**

### 3.7 Kurlar (`fx_rates.yaml`)

Canvas kurları geçerli: **USD/TRY 48,7499 (TCMB 23.09.2026)**, **EUR/TRY 55,8513 (22.09.2026)**; çapraz kur EUR/USD 1,1457. Ledger'daki 2026-09-15 spot değeri (43,60 / 47,35) canvasla çelişiyor.
- Öneri: 2026-09-15 spot **USD 48,30 · EUR 55,30** (1,1449).
- 2026 ortalaması **USD 45,90 · EUR 52,40** (1,1416).
- 22.09 ve 23.09 dönemleri ayrı satır olarak eklensin.
- Önceki yıllar değişmez. Hotel Adler 340 EUR × 55,8513 = **18.989,44 TL** (kontrol).

### 3.8 Güneşalan, Akyar, Demirci

- **Güneşalan** (`gunesalan_ges.yaml`, timeline boş): **COD 01.07.2017**. YEKDEM **01.07.2017–30.06.2027**, 133 USD/MWh (canvas). Kredisiz.
- **Akyar** ve **Demirci:** ledger kanonikle uyumlu; değişiklik yok.

### 3.9 Canvas'ta düzeltilecekler (ürün sahibi tarafı; yayın kontrolünden geçtikten sonra canlıya ve PR #12'ye çıkar)

Bunlar yayınlanana kadar **bu dosyadaki değerler geçerlidir**; canvas'taki eski hali belge üretimine taşıma.

1. Karatepe YEKDEM satırı (`Ana-Sayfa-Enerji`, `Main`): 16 MW / 73 USD / 31.12.2028 → **24 MW / 51 USD / 14.10.2033**.
2. KGF talep ekranı ve `Main`'deki KGF satırı kaldırılır.
3. `Fatura-Odeme`: Kızılova avans faturası açıklamasındaki **"%25" → "%20"**.
4. Boztepe bilirkişi: Ekip Sohbeti ve Bildirimler'deki "Boztepe_Bilirkisi_Raporu.pdf (26.09.2026)" → **"Boztepe_Bilirkisi_Kesif_Tutanagi.pdf"**. Rapor henüz gelmedi; pano durumları "Bilirkişi Bekleniyor" doğru.
5. `Yeni-Odeme-Talebi`: Boztepe bilirkişi avansında mahkeme "Ankara 3. İdare" → **"Ankara 2. İdare"**.
6. Yeşilova tazminat davası mahkemesi → **"Çanakkale 1. Asliye Hukuk Mahkemesi"**.

---

## 4. Aritmetik kontroller (gönderilen her değerle birlikte)

| Kontrol | Sonuç |
|---|---|
| Karatepe: kullandırılan 13.600.000 + özkaynak 6.400.000 = capex 20.000.000 | ✅ |
| Karatepe: kullanımlar 8.000.000 + 5.600.000 = 13.600.000 | ✅ |
| Karatepe: EPC 14.500.000 EUR × 1,1783 (2021) = 17.085.350 USD ≤ 20.000.000 | ✅ |
| Yeşilova: 24 × 98.000 = 2.352.000; 2.352.000 − 10 × 98.000 = 1.372.000 (#11 öncesi); − 7 × 98.000 = 1.666.000 (2025 sonu) | ✅ |
| Yeşilova: 24.048.000 + 2.352.000 = 26.400.000 | ✅ |
| Yeşilova #11 banka faizi: 1.372.000 × (%3,89378 + %1,50) × 92/360 = 18.911,79 ≈ **18.912** (ödeme planındaki 18.240 kasıtlı fark) | ✅ |
| Boztepe: 15.000.000 × %6,744 / 12 = 84.300; DSRA 6 × 84.300 = 505.800; Mart 2027–Şubat 2034 = 84 taksit | ✅ |
| Kızılova: 30.000.000 × %0,80 × 92/360 = 61.333; 05.10.2026 → 05.01.2027 = 92 gün | ✅ |
| Kızılova: avans %20 × 10.000.000 = 2.000.000 + KDV %20 = 2.400.000 | ✅ |
| Kızılova: önlisans 15.01.2025 + 24 ay = 15.01.2027; ÇED son başvuru 15.04.2025 (başvuru 10.04.2025); TEA son başvuru 14.07.2025 | ✅ |
| Bordro: Eylül 2.139.565 + 1.097.452 + 708.785 = 3.945.802; Ekim 2.128.661 + 1.097.452 + 719.689 = 3.945.802 | ✅ |
| Kur: 55,8513 / 48,7499 = 1,1457 (EUR/USD) | ✅ |

---

## 5. Bilinçli bırakılanlar (bunları düzeltmeye çalışma, sorma)

**Kasıtlı tuzaklar (değişmez):**
- Karatepe kredi tutarı 14,0 / 13,6 mn USD (hiçbir belge "400.000 kullandırılmadı" demesin),
- Yeşilova #11 faizi 18.912 / 18.240,
- Yeşilova ödeme planının iki sürümü,
- Enercon mükerrer fatura,
- MS-26-031 mükerrer yemek fişi,
- Gökyolu faturası personel adına,
- okunamayan otopark fotoğrafı,
- Hızlı Kargo faturasının PO'su yok,
- Annex F teminat mektubu yok (§2),
- ABC avans teminat mektubunun kendisi yok (§3.3),
- Hakan Tunç askerlik belgesi yok,
- açıklamasız 12.450 TL havale,
- PO-26-039 sipariş/fatura farkı,
- PO-26-036 faturası geç,
- YeniTalep-5 mükerrer talep.

**Bilinçli gerçekçilik sapmaları (demo için kabul):**
1. Karatepe ilk taksiti (07.04.2023) COD'den (15.10.2023) önce. Düzeltmek 8/24 = 412.500'ü bozar.
2. Karatepe kamulaştırma davası idare mahkemesinde ve bedel konulu. Hukuken bedel tespiti adli yargının işidir; canvas'taki hali korunur.
3. Boztepe'nin 2024 refinansman kredisinde 3 yıl yalnız faiz.
4. Yeşilova Faz 1'de (2016) V136 4,4 MW modu.
5. Yeşilova DSRA'sı (6 dönem) diğer kredilerden yüksek.

**Kural:** Bu iki listenin dışında kalan her tutarsızlık **plansızdır**; belge üretmeden önce yaz.

---

## 6. Süreç (PR #18'deki 3. ve 4. isteklerin)

- Bundan sonra soruları **günde bir toplu tablo** olarak cevaplıyoruz; her tablo §4 biçiminde aritmetik kontrolle gelir.
- **Anayasa PR #15/#16:** onay satırları işlendi (Ek-C, sürüm başlıkları, ADT-1/ADT-2 tabloları). Birleştirme ürün sahibinin tek tıkına kaldı. Birleşince güncel Anayasayı company-ai'ye ekle (bizim o repoya yazma yetkimiz yok).
