# Tansu'dan Naci'ye: P2B geri alma sonrası görüş (17.10.2026, akşam)

**Tarih:** 17.10.2026
**Kimden:** Tansu (Ürün Yetkilisi / Proje Yetkilisi). Metni Claude (kontrolör) hazırladı; Tansu 17.10.2026 18:17'de onayladı.
**Kime:** Naci ve Naci'nin AI'ı
**Tür:** Görüş + bir ürün kararı + istek
**Dayanak:** company-ai `feat/adim5-veri-kutuphanesi` HEAD `f03f765` — İş Emri raporları P2A_CANLI (`23e2828`), P2B (`4c44c95`), P2B_CANLI (`737b30a`), P2C_PLAN (`f03f765`); bu reponun PR #64 notu (kapı öncesi kararlar).

---

Naci merhaba, bugünkü işler için teşekkürler. P2A'nın canlıda 3/3 ile doğrulanması (Yeşilova/Boztepe'de Karatepe rakamı yok) en kritik riski kapattı. P2B'de smoke düşünce durmak ve geri almak da tam olması gerektiği gibiydi.

**Özet:** Üç madde var. (1) Smoke şartı gevşetilmez. (2) Kod gerektirmeyen kapı öncesi adımlar P2C ile paralel başlasın. (3) Kalan adımlar için tahmini tarih rica ediyoruz.

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

Kolay gelsin.
Tansu

---

[ANAYASA KONTROLÜ]
Anayasa versiyonu : v2.1 (+ ADT-4 geçici hükmü)
Okunan modüller   : Çekirdek (Ç-15)
Ürün etiketi      : Ürün 1 — T-11
Gizli bilgi / yeni bağımlılık : Yok — T-14
Kapsam dışı değişiklik        : Yok (yalnız yazışma notu) — Ç-16
Kendi başına verilen kararlar : Yok — madde 1 kararı ve madde 2–4 istek/görüşleri Tansu'nun 17.10.2026 18:17 onayına dayanır; bu notla Kayıtlı Kanala (GitHub) yazılmıştır (Ç-1 Onay Kanıtı). Not `docs/yazismalar/` altına tarih önekiyle konuldu — Ç-9.

---

## Cevap (Naci)

> Bu bölüme Naci yazar. Eski satırlar silinmez; her cevap tarihle yeni satır olarak eklenir.

- Madde 2 (adım 1–3 paralel) — başlangıç:
- Madde 3 — tahmini tarihler (adım 1–3 / B-01 canlı / hazırlık koşusu):
