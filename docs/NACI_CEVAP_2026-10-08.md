# Naci'ye cevap — Soru 15, Ürün 1 planı (İ, Ç, SORU 1–10), açık maddeler ve tek değer listesi

**Kimden:** Ürün sahibi (Tansu, Claude ile) · **Kime:** Naci ve Naci'nin AI'ı · **Tarih:** 08–09.10.2026

**Karşılık verdiği belgeler (company-ai):**
- `docs/notes/TANSU_GERI_BILDIRIM_2026-09-30.md` §7.2 (açık 2–5) ve §7.3 (Soru 15)
- `docs/plans/URUN1_NOT_PLAN.md` §2 (İ-1…İ-8, Ç-1…Ç-10) ve SORU 1–10

**Bu turda yapılanlar:**
- Canvas'ın 121 dosyası tarandı. İç çelişkiler tek değere indirildi (PR #12, `tasarim/canvas/`).
- Ürün 1 ve Ürün 2 notları aynı değerlere çekildi (PR #13).
- **Canvas, iki not ve senin ledger'ın artık aynı rakamları kullanır.** Bir fark görürsen önce bu dosyanın §3'üne bak; o da tutmuyorsa sor.

---

## 1. Soru 15 — Finans uzmanı finansal modeli görür mü? → **A**

Financial Model, ödeme planı ve bütçe workbook'u `normal` sınıfa çekilir.

- Kişi bazlı bordro ve dava dosyaları `restricted` kalır.
- P-2 kuralı (yetkisiz belgenin adı bile söylenmez) aynen kalır.

**İlk kredi ödemesi notu:** Anlaşıldı. İlk taksit tarihi hem kredi sözleşmesinin geri ödeme maddesinde hem ödeme planı Excel'inde yazmalı. Workbook'lar da "elimde şunlar var" listesine girmeli; planındaki Adım 2(b) bunu karşılıyor.

## 2. İ-1…İ-8 (Ürün 1 notunun kendi çelişkileri)

| # | Cevap |
|---|---|
| İ-1 Kızılova | **A — önlisans aşamasında geliştirme projesi.** 42 MW, önlisans bitişi 15.01.2027. EPC S-26-001 imzalı ama yalnızca sınırlı işe başlama talimatı (LNTP: detay mühendislik + türbin rezervasyonu) var. Saha işleri lisans + yapı ruhsatı + kredi kullandırımından sonra. Ayrıntı §3.2. |
| İ-2 Akyar | **A** — 60 MWp, önlisans 03.03.2026, bitiş 03.03.2028. |
| İ-3 Demirci | **A** — 80 MW, önlisans 10.10.2024, 36 aya uzatıldı, bitiş 10.10.2027. |
| İ-4 Personel | **A** — §C.1 tek kaynak; 36 kişi. Unvanlar §3.4'te. |
| İ-5 İmza | **A** — 500.000 TL'ye kadar tek A, üstü A+B. Gruplar canvas'taki gibi (§3.5); §D.4.1'deki eski dağılım düzeltildi. |
| İ-6 Demo bugün | **A** — 06.10.2026. |
| İ-7 Sözlük | **A** — admin/parametre tablosu. "Belgeden terim" testi tablo verisi üzerinde koşar. |
| İ-8 Belirsiz soru | **İki ayrı durum, ikisi de geçerli:** (1) Gerçek belirsizlik (birden çok proje, belge ya da dönem eşit uyuyor): 07.10 kararı (a) uygulanır. Balbal içerik sıralamaz, tek kısa netleştirme sorusu sorar; seçenekler belge veya proje adıyla, linkli verilebilir. (2) Zayıf eşleşme / "veri yok" yolu: §B.2–B.3 uygulanır. Balbal bulduğu belgeleri linkli listeler ve "bunu mu kastettiniz?" diye sorar. İkisinde de belge içeriği aktarılmaz. |

## 3. Tek değer listesi (canvas = notlar = ledger)

### 3.1 Şirketler

| Kısa ad | Ünvan | Durum | Kurulu güç |
|---|---|---|---|
| XYZ Enerji | XYZ Enerji A.Ş. | Holding | — |
| Karatepe RES | Karatepe RES Enerji Üretim A.Ş. | İşletme | 24 MW (YEKDEM 16); 8 × Enercon E-82 3,0 MW |
| Yeşilova RES | Yeşilova RES Enerji Üretim A.Ş. | İşletme | 22 MW; Vestas V136 |
| Boztepe RES | Boztepe RES Enerji Üretim A.Ş. | İşletme | 30 MW; 10 × Enercon E-82 3,0 MW |
| Güneşalan GES | Güneşalan GES Enerji Üretim A.Ş. | İşletme | 18 MWp |
| Kızılova RES | Kızılova RES Enerji Üretim A.Ş. | Geliştirme (önlisans) | 42 MW |
| Akyar GES | Akyar GES Enerji Üretim A.Ş. | Geliştirme | 60 MWp |
| Demirci RES | Demirci RES Enerji Üretim A.Ş. | Geliştirme | 80 MW |

- **Vergi dairesi:** her şirkette Çankaya VD.
- **Şirket bilgileri:** VKN, MERSİS, IBAN ve sicil numaraları canvas'taki `COS` verisindedir (Ana-Sayfa-Mali; Muhasebe aynı kopya). Akyar ve Demirci eklendi.
- **IBAN'lar:** hepsi yeniden üretildi ve mod-97 kontrolünden geçer.
- **Kurulu güçler:** canvas'taki üretim, kapasite faktörü (KF) ve YEKDEM hesaplarıyla sabittir. Önceki notta yazan 60/42/80/25 MW değerleri geçersizdir.

### 3.2 Krediler (kod yılı = imza yılı)

**2022-KT — Karatepe, Garanti BBVA**
- Sözleşmeler: ilk sözleşme 20.06.2022, 1. tadil (konsolide metin) 12.01.2024, 2. tadil 15.03.2025.
- Tutar: sözleşmede 14.000.000 USD, ödeme planında 13.600.000 USD. Bu fark **kasıtlı tuzak**.
- Faiz: Term SOFR + %2,90 (2. tadil öncesi +3,25).
- DSCR şartı: 1,20x (önceden 1,25x); test her yıl 30 Haziran'da.
- Geri ödeme: 6 aylık, 24 taksit, değişken anaparalı. Taksit 8/24 = 412.500 USD, vade 07.10.2026; sonraki taksit 07.04.2027.
- DSRA bakiyesi 1.240.000 USD.
- Proje hesapları Garanti BBVA'dadır.
- Ocak 2027'de yenilenecek teminat mektubu, **orman izni teminatı**dır.

**2023-YS — Yeşilova, Commerzbank AG**
- Sözleşme 03.06.2023. Tutar **2.352.000 USD** (24 × 98.000 eşit anapara), **3 aylık**, her ayın 14'ünde.
- Taksit #1 14.04.2024; #24 14.01.2030.
- Faiz: Term SOFR %3,89378 + %1,50.
- Taksit #11 (vade 14.10.2026): ödeme öncesi kalan anapara 1.372.000, sonrası 1.274.000. Banka faizi 18.912, ödeme takvimindeki faiz 18.240; bu fark **kasıtlı**.
- 2026'da ödenen taksitler: #8, #9, #10 (anapara 294.000). #12'nin vadesi 14.01.2027.
- DSCR şartı en az 1,15x. DSRA 702.000 USD. Borç servis hesabı 84.500 USD.
- Annex F: talep e-postası 14.09.2026, son gün 14.10.2026, raporlama yılı 2025. 2025'te #4–#7 ödendi: anapara 392.000, faiz 104.500, yıl sonu bakiyesi 1.666.000.
- Ödeme planının iki sürümü (01.09.2026 güncel, Mart 2026 eski) **kasıtlıdır**; ikisi de 3 aylık.
- Teminat mektubu belgesi **kasıtlı eksik**.

**2024-BZ — Boztepe, Garanti BBVA USD**
- Sözleşme 20.02.2024. Aylık faiz 84.300 USD.
- Son faiz 01.10.2026'da ödendi; sıradaki 02.11.2026 (01.11 pazar günü).

**2026-KZ — Kızılova, Garanti BBVA**
- 30.000.000 USD yatırım kredisi. **İmzalı ama kullandırılmadı;** kullandırımın ön koşulu lisans. Faiz yok.
- 05.01.2027'de taahhüt komisyonu: 30 mn × %0,80 × 92/360 = **61.333 USD**.

**Güneşalan:** kredisi yok, özkaynakla finanse.

**Borç servis hesabı (USD):** Karatepe, Boztepe ve Yeşilova'da var.

### 3.3 Kızılova EPC

- **Sözleşme:** S-26-001, ABC İnşaat A.Ş., anahtar teslim, **10.000.000 USD KDV hariç**, imza 15.09.2026, LNTP.
- **Avans:** %20 = 2.000.000 USD + KDV = 2.400.000 USD.
  - Fatura ABC2026000000184, itiraz son günü 14.10.2026.
  - Vade 15.10.2026, ödeme 12.10.2026.
- **Avans teminat mektubu:** Akbank, 2.000.000 USD, vade 15.03.2028.
- **Hakediş 1 (SÖ-26-014):** Eylül 2026 mühendislik/tasarım işleri; tutarlar canvas'taki gibi.
- **Kızılova için üretilmeyecekler:** inşaat sigortası (CAR/EAR), kullandırım talebi, inşaat ilerleme raporu.
- **Adlandırma:** her yerde "şantiye" yerine "saha"; "hafriyat metrajı" yerine "jeoteknik sondaj metrajı".

### 3.4 Kişiler (36)

§C.1 tablosu esastır. Değişen veya netleşen unvanlar:

- Deniz Kaya — İdari İşler Sorumlusu
- Onur Yıldız — O&M Mühendisi
- Hakan Tunç — EPC Proje Mühendisi
- Pınar Güler — Üretim/Piyasa Uzmanı
- Murat Kılınç — Saha Operasyon Müdürü
- Halil Öztürk — EPC Teknikeri
- Zeynep Koç — İK Uzmanı ve İK'nın departman başı

Diğer notlar:
- XYZ Enerji'nin YK Başkanı **Ahmet Karaman**'dır; personel değildir.
- Alt birim adları: "O&M (İşletme ve Bakım)", "EPC (İnşaat)", "Üretim/Piyasa", "Saha Operasyon".

### 3.5 İmza yetkileri

- **Kural:** 500.000 TL'ye (karşılığı) kadar tek A imzası, üstü A+B.
- **A grubu:** Levent Aksoy. XYZ Enerji'de ayrıca YK Başkanı Ahmet Karaman (sınırsız).
- **B grubu:** Elif Şahin ve Kaan Turhan. Kaan'ın yetkisi A ile birlikte, kredi ve teminat işlemleri içindir.
- **Kerem Aydın:** yalnız Kızılova'da B grubu, 2.000.000 TL'ye kadar.
- **Gökhan Erdem:** imza yetkisi yok; imza toplar ve belge teslimi için vekâleti var.
- Akyar ve Demirci sirkülerleri eklendi: Levent A, Elif B, Kaan B.

### 3.6 Vergi takvimi, bordro, kur

**Vergi takvimi**
- KDV son gün 28.10.
- Muhtasar ve damga son gün 26.10.
- SGK primi takip eden ayın sonunda ödenir: Eylül primi 31.10, Ekim primi 30.11.2026.

**Bordro (36 kişi, İK Maaş hesabından)**

| Ay | Net | SGK | Muhtasar | Toplam | Not |
|---|---|---|---|---|---|
| Eylül (BR-26-009) | 2.139.565 | 1.097.452 | 708.785 | 3.945.802 | Net 28.09'da ödendi |
| Ekim (BR-26-010) | 2.128.661 | 1.097.452 | 719.689 | 3.945.802 | Net ödeme 28.10; İK en geç 26.10'da iletir |

- Brüt toplam 3.351.000 TL.

**Kur:** USD 48,7499 (TCMB 23.09). 22.09 EUR kuru 55,8513; buna göre Hotel Adler 340 EUR = 18.989,44 TL. Önceki 51,24 değeri geçersiz.

### 3.7 Diğer kayıtlar

**Bakım (O&M)**
- Karatepe ve Boztepe: Enercon Servis Türkiye, 38.500 EUR/ay (S-25-007/008).
- Yeşilova: Vestas Bakım Hizmetleri (S-24-009), 396.000 EUR/yıl.
- Güneşalan: Solaris GES İşletme Hizmetleri Ltd. Şti., 3.240.000 TL/yıl.

**Sigorta** (STU Sigorta A.Ş., kurgusal)
- Boztepe poliçesi 10.11.2026'da bitiyor; yenileme primi SÖ-26-006, 05.11.2026.
- Karatepe poliçesi 30.06.2026'da yenilendi.
- Yeşilova poliçesi YS-2026-04471, bitiş 31.03.2027. Eylül'deki talep yenileme değil, ara dönem zeyilnamesidir.

**Faturalar ve ödemeler**
- Enercon mükerrer fatura ENR2026001121: asıl 29.09, kopya 30.09 (**kasıtlı**). Karatepe'nin Enercon faturası ENR2026001122, 06.10.
- Acil ödemeler:
  - AÖ-26-002: Rüzgar Teknik Servis Ltd. Şti., 46.800 TL, 03.10, Akbank TL (XYZ). Faturası RTS2026000512 05.10'da geldi.
  - AÖ-26-003: aynı firmanın ayrı faturası RTS2026000412, 38.400 TL, 05.10.
- PO-26-036 (Dell): Akbank TL'den ödendi; proforma DL-55821; fatura gelmedi.
- PO-26-038 (Testo): Karatepe; fatura TST2026000418.
- PO-26-041: revizyonda; irsaliye yok.
- PO-26-042 (dron): Kızılova; ödeme Garanti BBVA TL'den.

**Hukuk**
- Boztepe imar iptali (Ankara 2. İdare, duruşma 28.10.2026).
- Yeşilova tazminat (arazi tahsis).
- Karatepe kamulaştırma ve irtifak bedeli tespiti.
- Kızılova yüklenici ihtilafı (ihtarname aşaması).
- Demirci TEA olumsuz görüşüne itiraz.
- Akyar ve Güneşalan'da dava yok.

**Banka bildirimi:** Karatepe'nin faiz bildiriminin adı `GarantiBBVA_Faiz_Belirleme_Bildirimi`. Akbank'ın bu yapıda kredisi yok.

**Kasıtlı tuzaklar (değişmez):**
- Karatepe 14,0 / 13,6 mn USD
- Yeşilova 18.912 / 18.240
- Yeşilova ödeme planının iki sürümü
- Enercon mükerrer fatura
- Mükerrer yemek fişi (MS-26-031)
- Gökyolu faturası personel adına
- Okunamayan otopark fotoğrafı
- Hızlı Kargo faturasının PO'su yok
- Annex F için teminat mektubu belgesi yok
- Hakan Tunç'un askerlik belgesi yok
- Açıklamasız 12.450 TL havale
- PO-26-039: sipariş 9.800 TL, fatura 10.150 TL
- ABC avans teminat mektubu eksik
- PO-26-036 faturası geç
- YeniTalep-5'te mükerrer talep

**Ürün sahibi kararı bekleyenler** (değerler şimdilik canvas'taki gibi; karar gelince yalnız ad/tutar değişir, yapı değişmez):
- Gerçek banka adları (Garanti BBVA, Commerzbank, Akbank, İş Bankası) ve türbin üreticisi adları (Enercon, Vestas) **Anayasa Ç-12 ile çelişiyor**: demoda gerçek şirket kullanılmaz. Karar gelene kadar ledger'da bu adları tek yerden (sabit tablo) yönet ki toplu değişim kolay olsun.
- Yeşilova kredisinin 2,35 mn USD olması, 22 MW bir santral için küçük.
- Boztepe'deki KGF kefaleti, USD proje kredisiyle tam uyuşmuyor.

## 4. Ürün 1 planındaki çakışmalar (Ç-1…Ç-10)

| # | Cevap |
|---|---|
| Ç-1 | **A.** Eşik yalnızca "göster ve sor" yönünde gevşer; cevap üretme eşiği ve G1–G3 aynen kalır (§B.5). |
| Ç-2 | **A.** Sohbet bağlamı istemci tarafında taşınır: isteğe bir önceki sorunun metni eklenir. Sunucu hafızası yok, T9 değişmez, audit her isteği bağımsız yazar. |
| Ç-3 | **A.** Balbal sözlük karşılığını söyleyip belgede arar ("amendment'ı tadil olarak anlıyorum"). Kaynaksız genel tanım cümlesi kurmaz. Ürün 1 notu §C.2'deki açık soru böylece kapanır. |
| Ç-4 | İ-8 ile aynı cevap. |
| Ç-5 | **A.** Kişiler arası ekip sohbeti Ürün 1'de, şimdi yapılır (§5'teki tasarım uygun). Balbal sohbete giremez. |
| Ç-6 | **A.** Süreç ağı ve durum türetme Ürün 1 backend'ine girer. "Yetişir mi" tahmini Ürün 3'tür. |
| Ç-7 | **A.** .eml, .docx ve MT940 demo setine dosya olarak girer (PDF'e çevrilmiş kopya + orijinal ek). V0 yükleme kapsamı değişmez. |
| Ç-8 | **B.** Mevzuattaki tarih, süre ve bedelleri sen webden araştırıp öneri listesi olarak sunarsın; biz onaylarız. |
| Ç-9 | **B.** Yeniden adlandırma: Ankara RES → Karatepe RES, İzmir RES → Kızılova RES. Ancak ledger değerleri §3'e çekilmeli: MW, para birimi USD, Karatepe'nin Garanti kredisi, Kızılova'nın önlisans aşaması. |
| Ç-10 | **A.** Örnek soru çipleri kalkar; netleştirme sorusu ana metin olarak kalır. |

## 5. URUN1_NOT_PLAN — SORU 1–10

1. **Ç-9:** B (yukarıda).
2. **Ç-1:** A, onaylı.
3. **Ç-2:** A, istemci tarafı. Karar verildi.
4. **Ç-3:** A.
5. **Ç-5 ve Ç-6:** ikisi de Ürün 1'de, şimdi.
6. **Ç-7:** A.
7. **İ-6:** demo bugün 06.10.2026.
8. **Adım 1 ölçümü:** onaylı (en fazla 28 LLM çağrısı, bayrak açık/kapalı karşılaştırması). §3.1'deki 10 soru `discovery` kategorisi olarak `questions.json`'a eklensin. Proje adları yeniden adlandırmadan sonra Karatepe/Kızılova olacak.
9. **Takvim:** 2–3 hafta + 2 kota günü kabul. Teslim, frontend "tamamlandı" ilanıyla hizalanır. Öncelik sırası §F.2'deki gibi: önce Proje Finans ve Hukuk belgeleri. Bunlar hazır olunca haber ver, ürün testine o bölümden başlarız.
10. Ayrı bir not hazırlanmadı; İ ve Ç cevapları bu dosyada.

## 6. Geri bildirim dosyasında açık kalanlar (TANSU_GERI_BILDIRIM §7.2)

- **2. B-22/3 — onay zincirindeki yönetici izin belgesini görür mü?** Onay sırasında yalnızca kendi onay kuyruğundaki **talep formunu** görür (Onayla / Reddet / Formu aç). Onaylanıp İK klasörüne giren izin belgesini görmez; o belgeyi yalnızca kişinin kendisi ve İK görür. Talep nesnesi ile belge ayrıdır. Yönetici, retrieval ve Balbal üzerinden izin belgesine erişemez (P-2).
- **3. B-23/2 — yazışma kimde görünür?** "Kendisi + İK" modeli yalnız kişisel İK belgeleri (izin, personel dosyası, bordro) içindir. Yazışma ve dilekçe departman belgesidir:
  - Taslak: hazırlayan + onay zinciri.
  - Kayıt: departmanın klasörü; görünürlük klasör yetkisiyle (B-26).
  - `restricted` olursa: departman yöneticisi (B-08).
  - `management` kuralı değişmez.
- **4. B-02 — "departmana belge yüklendi" bildiriminin alıcısı:**
  - Onay bekleyen belge: yalnızca onaycı(lar) (B-28 akışı, ortak klasörde iki onaycı).
  - Onay sonrası: yükleyen kişi ve klasör sahibi departmanın yöneticisi.
  - Departmanın diğer üyeleri bildirim almaz; belgeyi "son eklenenler" listesinde görür.
  - Okuma anındaki `allowed_document_ids` süzgeci, senin önerdiğin gibi uygulanır.
- **5. B-06a — görüş talebi belgesinin departmanı ve gizliliği:**
  - Belge isteyen departmanın klasörüne kaydedilir; cevaplayan departmana o kayıt için görme yetkisi verilir.
  - Gizlilik: talebe eklenen belgelerin en yüksek düzeyi; ek belge yoksa `normal`.
  - Ürün 2 kapsamındadır; şimdi kodlanmaz.

---

**Kanal:** Bu dosya PR #13'tedir. Canvas düzeltmeleri PR #12'dedir.
