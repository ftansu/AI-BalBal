# Tansu'dan Naci'ye: P2B geri alma sonrası görüş (17.10.2026, akşam)

**Tarih:** 17.10.2026
**Kimden:** Tansu (Ürün Yetkilisi / Proje Yetkilisi). Metni Claude (kontrolör) hazırladı; Tansu 17.10.2026 18:17'de onayladı.
**Kime:** Naci ve Naci'nin AI'ı
**Tür:** Görüş + bir ürün kararı + istekler + kontrol mekanizması önerisi
**Dayanak:** company-ai `feat/adim5-veri-kutuphanesi` HEAD `f03f765` — İş Emri raporları P2A_CANLI (`23e2828`), P2B (`4c44c95`), P2B_CANLI (`737b30a`), P2C_PLAN (`f03f765`); bu reponun PR #64 notu (kapı öncesi kararlar).

---

Naci merhaba, bugünkü işler için teşekkürler. P2A'nın canlıda 3/3 ile doğrulanması (Yeşilova/Boztepe'de Karatepe rakamı yok) en kritik riski kapattı. P2B'de smoke düşünce durmak ve geri almak da tam olması gerektiği gibiydi.

**Özet:** (1) Smoke şartı gevşetilmez. (2) Kod gerektirmeyen kapı öncesi adımlar P2C ile paralel başlasın. (3) Kalan adımlar için tahmini tarih rica ediyoruz. (5) Kaybın nerede olduğunu her koşuda gösteren bir kontrol mekanizması: kaynak türü etiketi, aşama bazlı huni, etiket/katalog denetimi.

---

## 1. Smoke şartı gevşetilmez — **ürün kararı**

P2C_PLAN §8 "Hiçbiri / belirsiz" satırında, sebep bulunamazsa canlıya alma şartının "2 koşuda en az 17/18" gibi bir dalgalanma payıyla yeniden tanımlanması bir seçenek olarak bırakılmış ve ürün kararı olduğu yazılmış.

**Karar:** Bu seçenek kullanılmaz. Canlıya alma şartı **smoke 9/9** olarak kalır.

**Gerekçe:** P2B'de düşen g satırı "kalan borç" sorusuna kalan bakiye (11.671.800) yerine ödenmiş anapara toplamını (1.928.200) getirdi. Cevap modeli belirsizliği yazdığı için KY sayılmadı, ama KY'ye çok yakın. Finans sorularında (borç, bakiye, taksit) dalgalanma payı kabul edilmez. Sebep bulunamazsa B-01 canlıya alınmaz; daraltılmış bir sürüm (P2C §8'deki R(a), P(a), K(a) gibi) yeniden planlanır.

## 2. Kod gerektirmeyen adımlar P2C ile paralel — **istek**

PR #64 §F sırasındaki ilk üç adım henüz başlamadı:
1. Tanımlar (T1 v14.2 + LLM'siz yeniden puanlama, T2, T3)
2. A3 — 12553 MWh netleşmesi
3. P-5 — ANK-ISO-003

Bunlar kapı ölçümünü doğrudan etkiliyor (T1 tek başına P1M'deki 5 soruyu değiştiriyor) ve B-01'e bağlı değil. P2C ölçümü beklenirken paralel yürütülmesini rica ediyoruz. B-01 sırası (commit 2'nin ayrı doğrulanması) değişmez.

## 3. Tahmini tarih — **istek**

PR #63 "Cevap" bölümündeki "Kapı öncesi kod — tahmini sıra/tarih" satırı hâlâ boş. Kabaca şu üç tarihi yazarsan planlamamız kolaylaşır:
- Adım 1–3 (tanımlar, A3, P-5)
- B-01'in canlıda smoke 9/9 ile geçmesi
- Hazırlık koşusu

Kesin değil, tahmin yeterli. Acele yok; amaç sırayı birlikte görmek.

## 4. P2C açık sorular — görüşümüz

Karar senin; görüşümüz senin önerilerinle aynı:
- **S-1:** (a) — yalnız ölçüm için, altı kola aynı tek satırlık plan logu; canlıya ve commit'e girmez.
- **S-2:** Aşamalı — önce BASE + ALL; ALL düşüşü üretirse tek kollar.
- **S-3:** Evet — ölçüm canlıya istek atmaz.

## 5. Kontrol mekanizması — kaybın nerede olduğunu her koşuda görmek — **istek**

**Neden:** Bugün P2B'nin neden düştüğü bulunamadı; router kararı ve Excel planı kayıtta yoktu, bu yüzden 2,5 saatlik ayrı bir ölçüm (P2C) gerekiyor. Ayrıca PDF ve Excel doğruluğunu ayrı bilmiyoruz: P1M'de router yoluna göre bölünce belge 62/84, karma 9/14, veri 1/2 çıkıyor, ama bu bölme router'ın kararına dayandığı için yanlış yönlenen Excel soruları "belge hatası" görünüyor. Etiket hataları da (K2 tarihleri, katalogda proje ve sürüm alanının olmaması, R-3 sözlüğü) her seferinde tek tek yakalandı; sistematik ölçülmüyor.

**İlke:** Bu mekanizma **puanlamayı ve kapı tanımını değiştirmez** (genel ≥ %75, KY = 0, güvenlik %100, saklı set aynen kalır). Yalnız raporlamayı zenginleştirir; amacı sorunun nerede olduğunu ölçmek ve odaklanacağımız yeri göstermek.

### 5.1 Beklenen kaynak türü etiketi

- Her soruya `expected_source_type` alanı: `pdf` / `excel` / `both`. T1 ile aynı v14.2 ekine girer; puanlamayı etkilemez.
- Her koşu raporunda ayrı satırlar: **PDF doğruluğu**, **Excel doğruluğu**, **ikisi birden doğruluğu** ve **yönlendirme doğruluğu** (Excel sorusu Excel'e gitti mi).
- **Bilinen sınır:** Dondurulmuş sette Excel soru sayısı az (data kategorisi 4). Bu oranlar kapı ölçütü olmaz, yalnız gösterge. Kapıdan önce dondurulmuş sete soru **eklenmez** (hedef oynatma olur); ek Excel soruları saklı sete veya kapı sonrasına.

### 5.2 Aşama bazlı huni — her kayıp tek bir aşamaya yazılır

| # | Aşama | Soru |
|---|---|---|
| 0 | **Etiket / katalog** | Gereken belge doğru proje, tür, tarih, sürüm etiketiyle kayıtlı mı? Gereken Excel kataloğda var mı? |
| 1 | **Yönlendirme** | Soru doğru yola (DOCUMENT / DATA / MIXED) gitti mi? |
| 2 | **Arama** | Doğru belge / parça / Excel satırı getirildi mi? |
| 3 | **Değerlendirme** | Doğru parça elindeyken cevap doğru ve tam mı? |
| 4 | **Belge içeriği** | Belgenin kendisi hatalı veya eksik mi (ör. A3 — 12553)? |
| 5 | **Ölçüm hatası** | Cevap doğru, beklenti mi yanlış (ör. T1)? |

- Kayıp, ilk bozulan aşamaya yazılır (0'dan başlayarak).
- Mümkün olan yerde LLM'siz belirlenir; belirlenemeyenler "elle" diye işaretlenir, kontrolör bağımsız okur.
- **Kırılımlar:** aşama × proje × belge türü (dijital PDF, taranmış PDF, Excel, Word).
- **Belge bazında oran tutulmaz** (belge başına ortalama ~1 soru düşüyor, oran anlamsız olur). Bunun yerine **tekrar eden belge listesi**: birden fazla koşuda sorun çıkaran belgeler.

**Ön şart — kayıt:** Her soruda router kararı (tam), getirilen parçalar (belge kimliği + sayfa/aralık) ve Excel planı (SQL/fonksiyon) **eval sonuç dosyasına** yazılır. P2C S-1'deki geçici plan logu bunun ilk adımı olabilir.
- Yalnız eval sonuç dosyası: ADT-4 kapsamında doğrudan uygulanır, rapora yazılır.
- Canlı `audit_log`'a alan eklenecekse şema değişikliğidir: **Ç-15/4, önce plan + onay**.

### 5.3 Etiket / katalog denetimi (aşama 0'ın ölçüsü)

- Kütüphanedeki **tüm belgelerin** (bugün 113) kayıtlı etiketleri ledger ile karşılaştırılır: proje, belge türü, tarih, sürüm/durum (güncel / superseded), departman. Excel kataloğu için ayrıca: dosya hangi projeye ait, hangi tablo türü (ör. ödeme planı mı, Debt sayfası mı).
- LLM'siz, tek tablo: alan × hata sayısı + hatalı belge listesi.
- **Neden ayrıca:** Soru setinde hiç sorulmayan bir belgenin etiketi yanlışsa 100 soruluk testte görünmez; denetim bütün kütüphaneyi tarar.
- Bulunan hatalar K2 ile aynı şartlarla düzeltilir (yedek, smoke 9/9, kapıdan önce). BT-02'deki etiket kalitesi ölçüsü yeni yüklenen belgeler içindir; bu denetim mevcut kütüphane içindir.

### 5.4 Sıra ve zamanlama

- B-01 ve P-5'in **önüne geçmez**; paralel ek iş.
- **Hazırlık koşusundan önce** hazır olsun ki kapı koşularının teşhisi de elde olsun.
- Önerilen sıra: 5.3 etiket denetimi (en ucuz, kapıyı doğrudan etkileyebilir) → 5.2 kayıt + huni → 5.1 etiket alanı (T1 ile birlikte v14.2).
- Yöntem senin; kapsam veya sıra konusunda farklı görüşün varsa yaz.

Kolay gelsin.
Tansu

---

[ANAYASA KONTROLÜ]
Anayasa versiyonu : v2.1 (+ ADT-4 geçici hükmü)
Okunan modüller   : Çekirdek (Ç-15)
Ürün etiketi      : Ürün 1 — T-11
Gizli bilgi / yeni bağımlılık : Yok — T-14
Kapsam dışı değişiklik        : Yok (yalnız yazışma notu) — Ç-16
Kendi başına verilen kararlar : Yok — madde 1 kararı ve madde 2–4 istek/görüşleri Tansu'nun 17.10.2026 18:17 onayına, madde 5 Tansu'nun 17.10.2026 19:10 talimatına dayanır; bu notla Kayıtlı Kanala (GitHub) yazılmıştır (Ç-1 Onay Kanıtı). Not `docs/yazismalar/` altına tarih önekiyle konuldu — Ç-9.

---

## Cevap (Naci)

> Bu bölüme Naci yazar. Eski satırlar silinmez; her cevap tarihle yeni satır olarak eklenir.

- Madde 2 (adım 1–3 paralel) — başlangıç:
- Madde 3 — tahmini tarihler (adım 1–3 / B-01 canlı / hazırlık koşusu):
- Madde 5 — kapsam/sıra görüşü ve tahmini süre (5.1 / 5.2 / 5.3):
