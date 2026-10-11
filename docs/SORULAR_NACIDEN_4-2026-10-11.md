# Sorular — Naci'den, 4. tur (11.10.2026)

Demo kütüphanesi için eksik değerler listesi (Hukuk partisi, T-12). Bu belgeler **gerçek değil** —
tutarlı bir demo veri seti kuruyoruz, gerçek olması şart değil, yalnız **tutarlı** olması yeter.
Boş bırakılan bir satır olursa biz bir varsayım (AI_ASSUMPTION) ile ilerleriz ve bunu raporda
açıkça işaretleriz — yani cevapsız kalması süreci durdurmaz, sadece demo verisinin kökenini
(gerçek bilgi mi, varsayım mı) değiştirir.

Not: önceki (3.) turdaki tüm değerler işlendi, teşekkürler.

| Kod | Proje | Eksik değer | Şu anki varsayım | Cevap |
|---|---|---|---|---|
| T-12.1 | Karatepe | Kamulaştırma davası: mahkeme adı, dava no, duruşma/karar tarihi, talep/belirlenen bedel | Hiç yok || **Ankara 4. İdare Mahkemesi, 2025/412 E.** Davacı Karatepe, davalı ETKB (TEİAŞ 154 kV ENH irtifakı; Karatepe taşınmaz sahibi). İdare bedeli 1.850.000 TL · Karatepe talebi 3.400.000 TL · bilirkişi 2.960.000 TL. Dava 12.02.2025 → savunma 03.04.2025 → bilirkişi ara kararı 20.06.2025 → rapor 15.09.2025 → ek bilirkişi reddi 10.01.2026 → **sonraki duruşma 14.10.2026**. Ayrıca Elektrik Direği İhlali davası: NACI_CEVAP_2026-10-11 §1 (T-12.1b). |
| T-12.2 | Yeşilova | Tazminat davası: mahkeme adı, dava no, duruşma/karar tarihi, talep edilen tutar | Hiç yok || **Çanakkale 1. Asliye Hukuk, 2025/208 E.** Davacı malik, davalı Yeşilova. Talep 1.350.000 TL. Açılış 11.06.2025. **Sonraki duruşma 05.11.2026**. Annex F'te bilgi notu; önemli dava eşiği 250.000 USD. Ayrıca Sınır İhlali davası: §1 (T-12.2b). |
| T-12.3 | Boztepe | İmar iptali davası: dava no, talep edilen sonuç/gerekçe (mahkeme + duruşma tarihi zaten verildi: Ankara 2. İdare, 28.10.2026) | Hiç yok || **2026/418 E.** Davacı Boztepe, davalı İlçe Belediyesi. Talep: santral sahasına bitişik alanı konuta çeviren plan değişikliğinin iptali + YD (gerekçe: planlama esasları, şehircilik ilkeleri, RES emniyet mesafesi). Dilekçe 22.05.2026 · YD reddi 10.07.2026 · cevaba cevap 22.09.2026 · bilirkişi keşfi 26.09.2026 · rapor bekleniyor · **duruşma 28.10.2026**. |
| T-12.4 | Kızılova | Yüklenici ihtilafı: ihtarname tarihi, ihtilafın konusu/tutarı, taraf (ABC İnşaat mı?) | Hiç yok || Taraf **ABC İnşaat A.Ş.** Noter ihtarnamesi **29.09.2026**. Konu: LNTP'deki saha yerleşim + temel ön tasarım paketinin 25.09.2026'da teslim edilmemesi. Talep: **22.10.2026'ya kadar teslim**; aksi halde gecikme cezası (günlük %0,05 = 5.000 USD, tavan %10) işletilir. Tutar talep edilmez, hak saklı. |
| T-12.5 | Demirci | TEA itirazı: TEA'nın olumsuz görüş tarihi, itiraz tarihi, mercii, gerekçe | Hiç yok || Olumsuz görüş **TEİAŞ, 08.09.2026, TEA-2026-119**. İtiraz **22.09.2026**, ETKB koordinasyonunda TEİAŞ'a. Gerekçe: radar etki alanının yeniden hesabı + alternatif mikro-yerleşim (revize yerleşim 10.10.2026'da bekleniyor). Durum: İtiraz İncelemede; beklenen cevap **08.11.2026**. |
| T-12.6 | Boztepe | Kredi (2024-BZ) imza günü | AI_ASSUMPTION: 2024-05-02 (zaten ledger'a işlendi) || **20.02.2024** (canvas + NACI_CEVAP_2026-10-08 §3.2). 2024-05-02 geçersiz. Anapara 01.03.2027'den 84 aylık eşit taksit. Ayrıntı NACI_CEVAP_2026-10-11 §3.1. |

**Cevaplandı — Tansu (ürün sahibi), 11.10.2026.** Değerler ürün sahibi onaylıdır; `AI_ASSUMPTION` gerekmez. Canvas'taki diğer hukuki süreçler (Karatepe elektrik direği, Yeşilova sınır ihlali, Kızılova mera, Akyar arazi müzakeresi), ledger düzeltmeleri, aritmetik kontroller ve bilinçli bırakılanlar listesi: `docs/NACI_CEVAP_2026-10-11.md` (PR #21).
