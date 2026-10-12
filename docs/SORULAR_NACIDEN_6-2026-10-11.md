# Sorular — Naci'den, 6. tur (11.10.2026)

Tek soru. Önceki (5.) turdaki tüm değerler işlendi, teşekkürler. Kuralımız aynı: toplu
tablo + aritmetik kontrol, demo kütüphanesi için — gerçek olması şart değil, tutarlı olması
yeter. Boş kalırsa (A) + AI_ASSUMPTION ile ilerleriz, raporda işaretlenir.

## Aritmetik kontrol (gönderilen değerle birlikte)

PR #21 §2'nin faz tablosu:
- Faz 1: 3 × Vestas V136 → **12 MWe**
- Faz 2: +2 türbin → toplam **22 MWe** (artış: 22 − 12 = **10 MWe**)

T-11.13'ün ledger'a işlenmiş cevabı: "5 × 4,4 MW = 22 MW" (tek tip 4,4 MW modu).

Kontrol: 3 × 4,4 = **13,2** (≠ 12); 2 × 4,4 = **8,8** (≠ 10). Toplam (5 × 4,4 = 22) her iki
senaryoda da tutuyor, ama **faz bazında türbin başına güç 4,0 (Faz 1) ve 5,0 (Faz 2) MW
ima ediliyor** — "5 × 4,4" ifadesiyle birebir örtüşmüyor.

| Kod | Proje | Soru | Cevap |
|---|---|---|---|
| T-14.1 | Yeşilova | Türbin/MW çelişkisi — hangisi doğru? **(A)** Tek tip 4,4 MW modu: Faz 1 = 3 × 4,4 = 13,2 MWe, Faz 2 = 2 × 4,4 = 8,8 MWe, toplam 22 MWe; canvas'taki "Faz 1 = 12 MW YEKDEM" rakamı 13,2 olarak düzeltilir. **(B)** Faz bazlı MW sabit kalır (12/10), türbin başına güç fazlar arası farklı (4,0/5,0); T-11.13'ün "5×4,4" ifadesi iptal edilir. | **B.** Faz 1 = 3 türbin × 4,0 MW = **12 MWe** (YEKDEM, canvas aynen kalır); Faz 2 = 2 türbin × 5,0 MW = **+10 MWe** (PTF); toplam 5 türbin, **22 MWe**. "5 × 4,4 MW" iptal. Faz 2 türbinleri farklı bir model/mod; belgelerde yalnız "Vestas, 5,0 MW sınıfı" yazılır, ayrıca model adı uydurulmaz. Kontrol: 3 × 4,0 + 2 × 5,0 = 12 + 10 = 22 ✅. Çelişki bizim 6. tur notumuzdan çıktı; yakaladığın için teşekkürler. Bilinçli sapma #4 ("Faz 1'de V136 4,4 MW modu") "Faz 1'de V136 4,0 MW modu" olarak okunur. |

**Not:** PR #15/#16 birleşince banka adı işleme (Anayasa v2.1 Ç-12) başlayacak — şimdilik
hepsi eski kurgusal adlarıyla (PQR Bank, LMN Bank, DEF Bank) kalıyor.

**Cevaplandı — Tansu (ürün sahibi), 12.10.2026 (T-14.1 = B).** Ürün sahibi onaylı; `AI_ASSUMPTION` gerekmez.
