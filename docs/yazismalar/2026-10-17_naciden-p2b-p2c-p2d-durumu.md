# Naci'den Tansu'ya: P2B, P2C, P2D durumu (17.10.2026)

**Kimden:** Naci. Metni Claude, Naci'nin talimatıyla (17.10.2026) hazırladı.
**Kime:** Tansu
**Tür:** Bilgi notu
**Senden karar istenen bir şey yok.**

**Dayanak:** company-ai, dal `feat/adim5-veri-kutuphanesi`, raporlar (`docs/reports/`):

| Rapor | Commit |
|---|---|
| `IS_EMRI_2026-10-17P2B_CANLI.md` | `737b30a` |
| `IS_EMRI_2026-10-17P2C_PLAN.md` | `f03f765` |
| `IS_EMRI_2026-10-17P2C_ASAMA1.md` | `f9f17a0` |
| `IS_EMRI_2026-10-17P2C_ASAMA2.md` | `2a17d65` |
| `IS_EMRI_2026-10-17P2D.md` | `2e77caa` |
| `IS_EMRI_2026-10-17P2D_CANLI.md` | `7b52b9b` |

Bu not sebep iddiası yapmaz. Yalnız ölçülen sayılar var. Örneklemler küçük (kol başına 5 tekrar), farklar **kesin değil**.

---

## 1. P2B canlıya alındı, geri alındı

- **P2B** (`da3dd08`) = P2 commit 2 (B-01). Dört parça vardı:
  - router cümlesi + örnek (ödeme planı),
  - planlayıcı cümlesi (sürüm),
  - katalog satırında proje/sürüm durumu,
  - başlık satırı ve alt not kodu.
- **Canlıya alındı (17.10, 14:47 UTC).** Smoke iki koşuda **8/9** ve **7/9** çıktı.
  - Düşen satırlar g, a, b; üçü de Karatepe Excel yarısı.
  - Smoke'un hiçbir cevabında başka projenin rakamı yoktu.
- **Naci'nin kararıyla geri alındı** (`faedc84`). Geri almadan sonra smoke **9/9**.

## 2. P2C: P2B dört parçaya bölünüp eval'de ölçüldü

- **Ortam:** yalnız eval. Canlıya istek yok, canlı kod ve DB değişmedi.
- **Toplam maliyet $2,67.**
- **Kollar ve tekrar:**
  - Taban (P2A) 8 tekrar, P2B'nin tamamı 5 tekrar.
  - Dört parça tek tek, 5'er tekrar.
  - Her tekrarda aynı 12 soru.

| Kol | b'de router kayması (DOC → MIX) | g düşüş | a düşüş | Karatepe l: Excel yarısında yanlış rakam |
|---|---|---|---|---|
| Taban (P2A) | 0/8 (DOC 8/8) | 0/8 | 0/8 | 0/8 |
| **Yalnız router cümlesi** | **5/5** | 1/5 | 0/5 | **3/5** |
| Yalnız planlayıcı cümlesi | 0/5 | 0/5 | 0/5 | 0/5 |
| Yalnız katalog satırı | 0/5 | 0/5 | 0/5 | 0/5 |
| Yalnız başlık/alt not kodu | 0/5 | 0/5 | 0/5 | 1/5 |
| P2B'nin tamamı | 5/5 | 2/5 | 1/5 | 0/5 |

- **Ölçülen:** b'deki router kayması ve l'deki 3/5 yanlış rakam yalnız router cümlesi kolunda görüldü. l'deki yanlış rakam 15.240.080,45: Karatepe'nin kendi borç tablosundan, kalan anapara + faiz toplamı.
- Plandaki eşiğe göre sinyal yalnız bu kolda çıktı. Planlayıcı cümlesi ve katalog satırı tek başına bu düşüşleri üretmedi.
- Başlık/alt not kodu kolunda l'de 1/5 yanlış rakam (11.293.600) var; eşiğin altında.
- **Örneklem küçük (5 tekrar); kesin değil.**
- **Başka projenin rakamı:** altı kolda **0**.

## 3. P2D canlıda

**Kod (company-ai):**
- `d3a2a65`: Excel SQL'i çalışırken DuckDB hata verince yanıt HTTP 500 oluyordu (P2C tabanında 96 istekte 4). Artık bu hata **mevcut** ExcelError yolundan gidiyor:
  - yeniden plan yok, yeni metin yok, prompt değişikliği yok;
  - "Erişebildiğiniz Excel dosyalarında bu soruyu cevaplayacak veri bulamadım." döner, soru belgeye düşer;
  - log ve audit'e yalnız hata türünün adı yazılır.
- `8afd623`: P2B'nin yalnız **başlık satırı ve alt not kodu** geri geldi. Router, planlayıcı ve katalog cümleleri **gelmedi**.

**Ölçü:**
- **Eval** (yeni kod, 5 tekrar × 12 soru): HTTP 500 **0/60**, başka projenin rakamı **0**.
- Bu ölçüde DuckDB hatası hiç oluşmadı. 500 düzeltmesinin kendisi birim testleriyle doğrulandı.
- **Canlı:** 17.10 19:47 UTC. Önce DB yedeği alındı. Smoke **9/9** (ilk denemede). Geri alma gerekmedi.

## 4. Açık konular (bilgi)

- **Router cümlesinin faydası da var.** Yeşilova 12. taksit sorusu yalnız P2B'nin tamamında (router cümlesi + başlık kodu birlikte) 5/5 Excel'e gitti ve 98.000'i Excel'den verdi. Router cümlesi tek başına bunu yapmadı: 4/5 belge, 1/5 HTTP 500.
  Canlıdaki P2D koduyla bu soru eval'de 5/5 belge metninden (98.000) cevaplandı; canlıda ayrıca sorulmadı. Router cümlesi geri gelecekse yeni ya da farklı bir metinle gelir; bu Ç-15/8 ile senin onayını ister.
- **"Yeşilova 2027'de hangi kredi ödemelerini yapacak?":** canlıda HTTP 200, 500 yok.
  - Planlayıcının sorgusu boş (NULL) tek bir değer döndürdü. Kod bunu cevap modeline verdi; model "değer bulunmadığı için … bildiremiyorum" yazdı. Sabit "veri bulamadım" metni dönmedi.
  - Bu davranış P2D'den önce de vardı. Ayrı bir iş olarak not edildi (öneri: boş sonuç = "veri yok").
  - Bu soru çok satırlı bir istek (madde 8, kapı sonrası).
- **Sıradaki iş:** madde 8'deki **"tek satır iki değer"** planı (vade + anapara gibi). Prompt değişirse Ç-15/8 ile sana gelir.

---

[ANAYASA KONTROLÜ]
Anayasa versiyonu : v2.1 (+ ADT-4 geçici hükmü)
Okunan modüller   : Çekirdek
Ürün etiketi      : Ürün 1 — T-11 (mevcut Excel yolunun düzeltilmesi; bilgi notu, iş açmaz)
Kritik Geliştirme Kararı : Yok — bu not karar istemiyor. Anılan canlı işlemler (P2B canlı/geri alma, P2D
  canlı) kendi Ç-15/6 onaylarıyla yapıldı; kanıtları company-ai raporlarında
Gizli bilgi / yeni bağımlılık : Yok — T-14
Kapsam dışı değişiklik        : Yok (yalnız yazışma notu eklendi) — Ç-16
Kendi başına verilen kararlar : Not, mevcut düzen gereği `docs/yazismalar/` altına tarih önekiyle konuldu;
  biçim PR #60 (Naci'den Tansu'ya) ile aynı — Ç-9
