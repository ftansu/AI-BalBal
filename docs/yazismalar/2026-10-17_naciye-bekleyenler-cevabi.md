# Tansu'dan Naci'ye: Bekleyenler listesine cevap (17.10.2026)

> **18.10.2026 — Bu notun açık maddeleri `docs/URUN1_TANSU_NOTLAR.md` ana listesine taşındı. Cevaplar oraya yazılır; buradaki "Cevap (Naci)" bölümü doldurulmaz.**

**Tarih:** 17.10.2026
**Kimden:** Tansu (Ürün Yetkilisi / Proje Yetkilisi). Metni Claude, Tansu'nun talimatı ve onayıyla (17.10.2026, 07:45) hazırladı.
**Kime:** Naci ve Naci'nin AI'ı
**Tür:** Karar + onay (soru–cevap) ve bilgilendirme
**Dayanak:** PR #60 `docs/yazismalar/2026-10-16_naciden-tansuya-bekleyenler.md` (14 madde); PR #58 (Madde 1 planı, company-ai `1810cba`); PR #59 (V22/K2 cevapları); company-ai `docs/reports/IS_EMRI_2026-10-16P2_PLAN.md` (`bdbe0e1`) ve `IS_EMRI_2026-10-16P3_PLAN.md` (`bba766d`).

---

Naci merhaba, listeyi tek yerde topladığın için teşekkürler, çok işe yaradı. Maddeleri senin numaralarınla cevaplıyorum. Sonda iki kısa bölüm var: kapı sonrası sıra ve bir bilgilendirme (kütüphane).

**Özet:** Kodu açan dört karar (1, 4, 7, 11) onaylandı. En büyük değişiklik **12. maddede**: Karatepe çifti ❗ **değil**, farklı olgu. **8. madde** de daraltıldı.

**Ç-15/8 hakkında:** P2 ve P3 planların prompt metnini tam olarak içeriyor. Bu yüzden aşağıdaki plan onayları, ilgili prompt değişikliği onayını da kapsar (Ç-15/8). Ayrıca prompt onayı beklemene gerek yok. Canlıya alma onayı (Ç-15/6) her paket için ayrı kalır.

---

## A. Kararlar

### 1. LEG-004 yeni belge tarihi — **10.08.2026 onaylandı**

İtirazım yok. Tarih önlisans (15.01.2025) → ÇED ek bilgi talebi (18.07.2026) → ÇED durum yazısı (27.08.2026) sırasına oturuyor ve başka soruyu etkilemiyor.

**Canlı işlem (K1 + LEG-004):** 16.10 notundaki şartlarla yapılabilir (S5). Şartlar: yedek alınır, geri dönüş hazır olur, smoke testi 9/9 geçer, işlem kapı koşularından önce biter.

### 2. Q-1 kategori eşiği — **Kapı tanımı kategori bayrağını içermez**

Faz 2 kapısı PR #39'daki tanımdır:
- 3 koşunun ortalaması ≥ %75,
- KY = 0,
- saklı set şartı.

Kategori bayrakları (`EvalReport.ok`) bilgi amaçlı raporlanır, kapıyı belirlemez. Bu yüzden:
- (a) GEN-DSC-003-F ölçümde **kalır**, ayrı tutulmaz.
- (b) Ambiguous eşiği yeniden belirlenmez.

Gerekçe: Kapı tanımı hareketli hedef olmamalı.

Etiketi bu kararla atabilirsin.

### 3. Q-2 "bulamadım" sonrası yardım sorusu — **Böyle kalsın**

Bu, Ç-7.1'deki "veri durumu iletişimi kesmez" ilkesinin doğrudan uygulaması.

**Tek ek istek:** Her koşu raporunda bir satır ayrıca yazılsın: **"sabit 'bulamadım' cümlesiyle geçen soru sayısı"** (`answer_policy: either` dahil). Amaç, bu tür geçişlerin skora oranını izlemek. Sınır ya da kural değil, yalnız ölçü.

### 4. Madde 1 planı (P1, `1810cba`) — **Onaylandı: S-1, S-2, S-3'ün üçü de evet**

- **S-1:** Konu belirlenemezse bugünkü tam liste kalsın. Eksik seçenek, tam listeden kötüdür.
- **S-2:** Konu hiçbir proje belgesinde yoksa proje sorulmasın.
- **S-3:** Tek aday kalırsa doğrudan cevap bu pakette **yok**. Bu, 16.10 Madde 2 kararıyla tutarlı. Doğrudan cevap, P1 canlıda ölçüldükten sonra ayrı paket olarak gelir.

Adım 4 "proje ekseni" yolunu belge düzeyine çekmek şimdilik gündemde değil.

### 5. 6 soruluk LLM'li doğrulama — **Liste kabul, GEN-DSC-003-F eklensin (7 soru)**

Liste: GEN-CMP-001, GEN-CMP-002, IZM-DEV-001, IZM-DEV-007, IZM-DEV-011, ANK-ISO-002 **+ GEN-DSC-003-F**.

PR #59'da 003-F'nin ilk ölçümünün bu koşuda olacağını yazmıştın, ama listede yoktu. ❌ çıkması bekleniyor (Madde 1 kodu henüz yok); amaç yalnız ilk ham cevabı almak. Koşu bir kez yapılır, kapı koşusu değildir.

### 6. PR #58, #59, #60 — Tansu birleştirir

Bu notla birlikte birleştirilecek.

### 7. P2 planı (B-01 + Excel proje ayrımı, `bdbe0e1`) — **Onaylandı, prompt değişikliği dahil**

- `ROUTER_SYSTEM_PROMPT`: plandaki 2 cümle + 1 genel örnek (proje adı yok).
- `PLAN_SYSTEM_PROMPT`: 1 cümle (sürüm durumu).
- Sıra plandaki gibi: **commit 1 proje ayrımı → commit 2 B-01**. Commit 2, commit 1'den önce canlıya çıkmaz.

Excel yolundaki proje karışması bulgun ("Yeşilova kalan kredi borcu" → Karatepe'nin 11.671.800 USD'si) çok değerli; yakaladığın için teşekkürler. Bu sıra tam da bu riski kapatıyor.

**Kabul ölçüsü önerisi:** Yeşilova ve Boztepe için en az birer Excel sorusu (LLM'siz yerel denemede kullandığın `outstanding_debt` / `dscr` çağrıları dahil) proje ayrımından sonra:
- ya doğru projenin rakamını,
- ya da "veri yok" cevabını vermeli.

Hiçbir durumda başka projenin rakamı dönmemeli. Sayıyı raporda göster.

### 8. B-01 kapsamı (S-1) — **Kısmen evet: çok satır kapıdan sonra, "tek satır iki değer" kapıdan önce**

- **Örnek 2** ("2027'de hangi ödemeler", çok satır): Kapıdan sonra olabilir. Sonuç tablosu planı kapı sonrasının **ilk işlerinden biri** olsun. Gerekçe: Bir finansçının ödeme planına soracağı en tipik soru budur.
- **Örnek 3** ("bir sonraki taksit ne zaman ve ne kadar"): Tek bir satırdan vade + anapara (+ faiz) okumak. **Kapıdan önce çözülsün.** Bu da sık sorulan bir finans sorusu. "Ne zaman" ile "ne kadar" aynı satırın hücreleri; kullanıcı bunu tek soru olarak görüyor.

  Yöntem senin. ADR-011'deki 1×1 sınırını genişletmek yerine "tek satır, birden çok sütun" gibi dar bir istisna da olabilir. Plan + ölçü ile gel. Prompt değişirse aynı Ç-15/8 kuralı geçerli.

### 9. S-2 (adsız Excel sorusu, veriye tek proje sahip) — **Evet, cevap versin**

Şartlar: Cevapta proje adı ve kaynak kartı açıkça yazsın.

Belge yolunda "tek aday da sorulsun" demiştik (16.10 Madde 2). Excel'de ise cevap veriyoruz. Bu **bilinçli bir asimetri**:
- Excel verisi kesin.
- Excel yolunda tek aday, sıralamadan değil `documents.project_id`'den geliyor.

Lütfen bunu ADR'ye bu gerekçeyle yaz; ileride tutarsızlık sanılmasın.

### 10. S-3 (iki proje adı geçen Excel sorusu) — **Evet**

"Hangisi?" diye sorulsun. Proje proje ayrı Excel cevabı (Ü-3) kapıdan sonraya kalır. 16.10 kararıyla aynı: proje proje tam cevap Ürün 1'de yalnız açıkça istenirse.

### 11. P3 planı (❗ çelişkili veri, `bba766d`) — **Onaylandı, kural 13 dahil; iki ek şart var**

Yöntem doğru: tespiti AI yapar, ❗'i ve sabit cümleyi kod basar, kod doğrular (aynı zincir / farklı proje / yürürlükte değil → ret).

**Ek şart 1 — kural 13'e (d) bendi eklensin** (12. maddeye bak):
> *"Farklı adla tanımlanmış iki olgu (ör. kredi limiti/taahhüt tutarı ile kullandırılan tutar; ödeme planındaki öngörülen tutar ile bankanın bildirdiği gerçekleşen tutar) çelişki değildir; ikisi de kendi adıyla ve kaynağıyla verilir."*

Bu bir kelime kuralı değil, mantık kuralı. Örnekler genel; proje adı ve rakam yok.

**Ek şart 2 — kabul ölçüsü üç parça olsun:**
1. Kasıtlı çelişki soruları dışında 0 yanlış ❗ (senin ölçün).
2. N1'deki ANK-FIN-002 tipi hata kaybolsun: farklı zincirdeki iki belge için "… seviyesinden değiştirilmiştir" cümlesi kurulmamalı. Plandaki `version_sentence_cross_chain` ölçüsü bunu sayıyor; sayıyı raporla.
3. **En az bir doğru ❗:** Mekanizma hiç tetiklenmezse 1. ölçü boş yere geçer. 12. madde kararından sonra demo veride gerçek bir belge ↔ belge çelişkisi kalmıyor (Karatepe farklı olgu, Kızılova K2 ile düzeliyor, Yeşilova Excel ↔ belge kapsam dışı). **Soru:** Doğru ❗'i demo kütüphaneye dokunmadan nasıl test edersin?

   Önerimiz: BT-02 için zaten planlanan ayrı test alanına (Test departmanı/klasörü) kurgusal, birbiriyle çelişen bir belge çifti konur, test oradan yapılır. Dondurulmuş kütüphane ve 100 soruluk set değişmez. Daha iyi bir yolun varsa onu yaz.

### 12. Madde 3 planı S-1 (Karatepe 14,0M ↔ 13,6M) — **Hayır, ❗ değil: farklı olgu**

Bu çelişki değil, çok net bir finansal durum:
- **Kredi limiti (tesis tutarı) bir taahhüttür.** Bankanın kullandırmayı taahhüt ettiği üst sınırdır.
- Limitin tamamının kullandırılması zorunlu değildir. Proje daha düşük kullandırımla da kapatılabilir.

Yani 14.000.000 USD tesis tutarı (Facility Agreement) ile 13.600.000 USD kullandırılan tutar (Covenant Report) iki ayrı olgudur. İkisi de doğrudur ve kendi adlarıyla verilmelidir. Bunlara ❗ basmak, Balbal'ı müşteri karşısında finansı bilmeyen biri gibi gösterir.

**Uygulama:**
- Kural 13 (d) bendi (11. maddedeki metin).
- Ledger'da `karatepe-kredi-tutari` grubunun `conflict_kind` değeri `genuine_conflict`'ten "farklı olgu" anlamına gelen bir değere çevrilir. Ad senin; ör. `different_facts`.
- ANK-FIN-002 beklentisi değişmez. N1'in o sorudaki sürüm cümlesi yine yanlış sayılır (11. madde, ek şart 2.2).

**Aynı mantık Yeşilova 11. taksit faizine de uygulanır:** Ödeme planındaki 18.240 USD öngörülen tutardır. Değişken faizde bağlayıcı olan, bankanın dönem başındaki faiz bildirimidir (18.912 USD). Bu da gerçek bir çelişki değil, "plan ↔ gerçekleşen" farkıdır. Ledger'daki `yesilova-taksit11-faiz` grubu da "farklı olgu" sınıfına alınsın. 13. maddeyle birlikte oku.

### 13. Madde 3 planı S-2 (Excel ↔ belge) — **Hayır, kapıdan sonra (P2'den sonra)**

Önerin aynen kabul. FIN-013 tipi Excel eşleme hatası bugün yanlış ❗ üretir.

12. madde kararından sonra Yeşilova faiz çifti zaten ❗ değil, "farklı olgu". MIXED cevapta iki değer de kaynağıyla görünsün: biri Excel kısmından, biri belge kısmından. Bugünkü `merge_mixed_answer` art arda yazdığı için bu kendiliğinden sağlanıyor. Ek iş yok.

### 14. Madde 3 planı S-3 (künye ↔ metin) — **Evet, ❗ sayılır**

Gerçek müşteri verisinde sık çıkacak. K2 canlıya geçince IZM-DEV-001/007 yanlış alarm testine girer; önerinle aynı.

---

## B. Sıra (özet)

1. Etiket (`cetvel-v2.2-v14.1`): Q-1 kararı (madde 2) ile hemen atılabilir.
2. K1 + LEG-004 canlı (madde 1, Ç-15/6 şartlarıyla).
3. 7 soruluk LLM'li doğrulama koşusu (madde 5).
4. Kapı öncesi kod sırası **senin önerinle aynı**:
   - Madde 1 (P1),
   - P2 (commit 1 proje ayrımı → commit 2 B-01),
   - madde 8'deki "tek satır iki değer",
   - Madde 3 (P3 + kural 13 (d)).
5. Kapı koşuları (3 koşu, saklı set kontrolörde).

**Etiket atıldıktan sonra, kapı işlerinden bağımsız:** 16.10 WA notunda "dondurmadan önce başlamayacak" dediğimiz **kural merdiveni** başlayabilir. Önce K0 ve K5, güçlü model kolu ile. Kapı kodunu beklemez; eval ortamında çalışır. Maliyet tahminini koşudan önce yaz.

**company-ai ana dalı:** `main` 08.10'dan beri geride, canlı kod `feat/adim5-veri-kutuphanesi`'nden çalışıyor. Etiket atıldıktan sonra `main`'e birleştirmeyi öneriyoruz (S10'da "kapıdan sonra" demiştik, bunu öne çekiyoruz). Gerekçe: Kapı koşuları `main` üzerindeki tek ve net bir commit'ten yapılsın. Görüşünü yaz; çakışma riski görüyorsan kapıdan sonra kalabilir.

---

## C. Kapı sonrası ilk işler (bilgi, şimdi iş değil)

Öncelik sırası:
1. BT-02 belge yükleme testi (13.10 kararı: dijital PDF, taranmış PDF, Excel, fotoğraf, Word; ayrı test alanında). Bu test alanı madde 11'deki doğru ❗ testine de ev sahipliği yapar.
2. Çok satırlı Excel sonucu (madde 8, örnek 2).
3. Hukuk görünürlüğü (Madde 4, KP-3).
4. Takma ad alanı, embedding (Dalga 1'in kalanı).

---

## D. Bilgilendirme: Balbal Kütüphanesi (Ürün 2 yönü — şimdi iş değil)

Ürün sahibinin hedefi: Şirket bilgisi ile sektör bilgisinin Balbal'ın başvurduğu tek bir **kütüphane / başvuru merkezinde** toplanması. Personel "bu nedir?" diye sorduğunda Balbal oradan kaynaklı cevap verebilmeli. Balbal ileride ilk kez duyduğu terimleri sözleşmelerden, personelden veya webden öğrenip bu kütüphaneye aktarabilmeli. 12. maddedeki "limit ≠ kullandırım" ayrımı tam bu kütüphanenin işi.

Taslak çerçeve (görüşünü ve AI'ının görüşünü özellikle istiyoruz):

- **Katman 1 — Sektör kütüphanesi:** RES/GES finans, hukuk ve teknik terim ve kuralları. Ürün tarafında yazılır, sürümlü ve kaynaklıdır.
- **Katman 2 — Şirket kütüphanesi:** Belgeden öğrenilen bilgi (08.10 ilkesi). Her kayıt belgeye bağlı ve onaylıdır. Ç-6 (v2.1) bunu zaten tanımlıyor: "Ortak alandaki belgelerden öğrendiği ve biriktirdiği bilgi yeni bir yetenek değildir."
- **Katman 3 — Öğrenme döngüsü (Ürün 2+):** Balbal yeni terimi fark eder ve kütüphaneye *öneri* yapar. **Kişi onaylamadan kütüphaneye girmez** (Ç-15/7, O-7).
  - Web kaynağı yeni bir veri kaynağıdır (Ç-11, Ç-15/2). Web'den gelen her içerik veri sayılır, talimat değildir (Ç-6 son bent).
- **Sınır:** Kütüphane *anlam* verir, *değer* vermez. "Karatepe kredisi ne kadar?" belgeden cevaplanır; "tesis tutarı ne demek?" kütüphaneden. Bu sınır yazılmazsa Balbal kütüphanedeki örnek rakamı cevap diye verebilir.

**Kapı sonrası, kod gerektirmeyen ilk adım:** Sektör kütüphanesinin ilk sürümü (30–50 terim) ürün tarafında yazılır ve **grup belgesi** olarak ortak alana yüklenir. Balbal onu diğer belgeler gibi bulur. GEN-GEN tanım soruları kaynaklı cevap alır mı, ölçülür. Yapısal kütüphane (terim, tanım, kaynak, kapsam, durum) Ürün 2 mimari gündemine girer.

**Küçük bir gözlem (iş değil, kapı sonrası):** `search_glossary.py` dosyasında `"taahhüt": ("covenant",)` eşlemesi var. Finans dilinde "taahhüt" çoğu zaman *commitment* demek (ör. limit taahhüdü, *commitment fee*); *covenant* ise "finansal şart / sözleşme yükümlülüğü" karşılığı. Kütüphane kurulurken bu eşlemenin gözden geçirilmesi iyi olur.

---

Acele yok, kendi temponda. Kolay gelsin.
Tansu

---

[ANAYASA KONTROLÜ]
Anayasa versiyonu : v2.1 (+ ADT-4 geçici hükmü)
Okunan modüller   : Çekirdek
Ürün etiketi      : Ürün 1 — T-11 (D bölümü Ürün 2 yönüdür, bilgilendirme; iş açmaz)
Gizli bilgi / yeni bağımlılık : Yok — T-14
Kapsam dışı değişiklik        : Yok (yalnız yazışma notu eklendi) — Ç-16
Kendi başına verilen kararlar : Not, mevcut düzen gereği `docs/yazismalar/` altına tarih önekiyle konuldu — Ç-9. Ç-15/8 prompt onayları (P2, P3 kural 13) ve Ç-15/6 canlı işlem onayı (K1 + LEG-004) bu notla Kayıtlı Kanala (GitHub) yazılmıştır (Ç-1 Onay Kanıtı).

---

## Cevap (Naci)

> Bu bölüme Naci yazar. Eski satırlar silinmez; her cevap tarihle yeni satır olarak eklenir.

- Madde 2 (etiket) — commit / etiket:
- Madde 1 (K1 + LEG-004 canlı) — yedek, smoke, rapor:
- Madde 5 (7 soruluk koşu) — sonuç:
- Madde 8 (tek satır iki değer) — plan:
- Madde 11 (doğru ❗ testi) — yöntem:
- Madde 12 (ledger `conflict_kind`) — commit:
- B (ana dala birleştirme, kural merdiveni) — görüş:
- D (kütüphane) — görüş:

---

## Durum (kontrolör) — 17.10.2026 16:15

> Kontrolör yazar; "Cevap (Naci)" bölümüne dokunulmaz. Dayanak: company-ai `feat/adim5-veri-kutuphanesi` HEAD `b73b750`.

| Madde | Durum | Kanıt |
|---|---|---|
| 1 · LEG-004 + K1 canlı | **Kapandı** | K2CANLI `b2a4c68` (113 belge, smoke 9/9); eval DB eşitlendi D2 `add0473` |
| 2 · Etiket `cetvel-v2.2-v14.1` | **Kapandı** | E1 `dd08085`, etiket uzakta. Tanım ek kararı: 17.10 akşamüstü notu T1 (v14.2), T2 |
| 3 · "Bulamadım ile geçen" satırı | **Kapandı** | E1 `verdict_passes`; P1M §6 (17/72) |
| 4 · P1 (Madde 1) | **Kapandı** | `6c4f38b`; canlı P1K_CANLI `647b2c3` (smoke 9/9); P1M 71/99 |
| 5 · 7 soruluk doğrulama | **Kapandı** | D1 canlı 6/7, D3 eval 6/7 (003-F P1 ile P1M'de ✅) |
| 6 · PR #58–#60 birleştirme | **Kapandı** | ai-balbal main |
| 7 · P2 | **Kısmen** — commit 1 kodlandı (`1f9ac13`, 12 → 0), canlı onayı 17.10 akşamüstü notu A1; commit 2 (B-01) açık | P2A |
| 8 · Tek satır iki değer | Açık | — |
| 9 · Adsız Excel, tek sahip → cevap | **Kodlandı, canlı bekliyor** (P2A ile) | ADR-036, P2A §2 kural 3 |
| 10 · İki proje adı → "hangisi?" | **Kodlandı, canlı bekliyor** (P2A ile) | P2A §2 kural 4 |
| 11 · P3 + kural 13 (d) | Açık | — |
| 12 · Ledger `different_facts` | **Kapandı** | E1 `dd08085` |
| 13 · Excel ↔ belge | Kapı sonrası (karar) | — |
| 14 · Künye ↔ metin ❗ | P3 içinde, açık | — |
| B · `main`'e birleştirme | Açık — Naci görüşü bekleniyor | — |
| B · Kural merdiveni (K0, K5) | Açık — başlamadı | — |
