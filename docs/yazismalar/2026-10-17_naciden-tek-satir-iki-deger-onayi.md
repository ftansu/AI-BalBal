# Naci'den Tansu'ya: "Tek satır iki değer" için prompt onayı (Ç-15/8) (17.10.2026)

**Kimden:** Naci. Metni Claude, Naci'nin talimatıyla (17.10.2026) hazırladı.
**Kime:** Tansu
**Tür:** Onay isteği (Ç-15/8)
**Dayanak:** madde 8 (PR #61: "örnek 3 … kapıdan önce çözülsün; plan + ölçü ile gel; prompt değişirse Ç-15/8"). Plan: company-ai, dal `feat/adim5-veri-kutuphanesi`, commit `fbabcf0`, `docs/reports/IS_EMRI_2026-10-17T1_PLAN.md`.

**Bu onay gelmeden kod yazılmayacak.** Bu not sebep iddiası yapmaz; yalnız ölçülen sayılar var.

---

## 1. Sorun

Soru: "Yeşilova'nın bir sonraki kredi ödemesi ne zaman". Canlıdaki kodla aynı kodda eval'de 10 koşu yapıldı (P2C/P2D, mevcut loglar).

- **Planlayıcı doğru satırı buluyor: 10/10.** İlk plan, bir sonraki taksitin satırını vade, anapara ve faiz sütunlarıyla seçiyor.
- Kod yalnız **1 satır × 1 sütun**u sonuç sayıyor. Yeniden plan metni de planlayıcıya "tek hücre döndüren yeni bir plan yaz" diyor. Bu yüzden iki değerden biri düşüyor:
  - **7/10** yalnız tutar (116.240; tarih yok),
  - **3/10** yalnız tarih (14.10.2026; tutar yok).
- Cevaplar bunu açıkça yazıyor. Örnek: "… tutarı 116.240'tır; ödeme tarihi bu sonuçta verilmediği için belirtilemez."

## 2. Yalnız kod neden yetmez

Kod, "1 satır × birkaç sütun" sonucunu biçiminden tanıyıp kabul edemez, çünkü bu biçim **tek değer isteyen sorularda da** sık geliyor. Planlayıcı bağlam sütunu ekliyor. Ölçülmüş örnekler:

| Tek değer isteyen soru | İlk plandaki satır |
|---|---|
| Yeşilova ödeme planında 12. taksitin anaparası | `taksit_no, vade, anapara_usd` (5 kez) |
| Karatepe RES'in güncel kalan borcu (ANK-FIN-011) | `period, end_date, closing_usd` |
| Karatepe RES'in son covenant testi sonucu (ANK-AUT-003) | 7 sütun: `quarter, quarter_end, cfads_usd, debt_service_usd, dscr, covenant, result` |
| Güncel DSCR kaç? (ANK-MIX-001) | 5 sütun: `quarter, quarter_end, dscr, covenant, result` |

- Bunlar kabul edilseydi, cevap modeline 3–7 değer gidecekti. Hangisinin cevap olduğunu kod bilemez.
- Ayırmanın kodla tek yolu soru metnine bakmak ("ve", "ne zaman … ne kadar"); bu bir kelime kuralı olur. Önermiyoruz.

## 3. Öneri (plan §3 B)

Planlayıcı, sorunun aynı satırdan iki ya da üç değer istediğini planda bir alanla (`"row": true`) bildirir. Kod yalnız o zaman 1 satır × 2–3 sütunluk sonucu kabul eder. Alan yoksa davranış bugünkü gibi kalır.

**Onaylanacak iki cümle (plandan aynen):**

1. `PLAN_SYSTEM_PROMPT` sonuna:
```text
When the question asks for two or three values from the same row (e.g. an instalment's due date and principal), you may return that one row with only those columns and add "row": true to the JSON; otherwise return exactly one cell.
```

2. Yeniden plan metni (`retry_feedback`) sonuna:
```text
Soru aynı satırdan iki ya da üç değer istiyorsa yalnız o sütunları içeren tek satırı "row": true alanıyla yaz.
```

**Değişmeyenler:**
- Cevap promptu (`ANSWER_SYSTEM_PROMPT`) değişmez. Değerleri ve etiketleri kod biçimler ("Vade: 14.10.2026; Anapara (USD): 98.000"). Model bir değeri atlarsa kodun şablon cevabı çıkar; rakam modelden gelmez.
- Şema yok.
- Proje kapsamı (Excel proje ayrımı) ve yetki (T-5) değişmez. Değişiklik yalnız yetkili ve daraltılmış katalogdan gelen sonuçta çalışır. Sızıntı ve proje testleri yazılacak.
- **En fazla 3 değer.** 4 ve üstü bugünkü yola düşer.
- Çok satırlı sonuç (madde 8 örnek 2) bu işte yok.

## 4. Ölçüm planı (yalnız eval, plan §7)

- **Kollar:** taban (canlı kod `8afd623`) ve yeni kod. Her biri 5 tekrar.
- **Sorular:**
  - 3 yeni iki değerli soru (Yeşilova bir sonraki ödeme "ne zaman ve ne kadar", Yeşilova 12. taksit vadesi ve anaparası, Boztepe 12. taksit vadesi ve anaparası);
  - önceki ölçümlerin 12 sorusu;
  - setten bugün 1×k üreten 4 soru (ANK-AUT-003, ANK-FIN-011, ANK-FIN-013, ANK-MIX-001).
  - Sorular `questions.json`'a girmez.
- **Karar eşikleri** (yalnız sayılar, kesin değil):
  - İki değerli 3 soruda yeni kod ≥ 4/5 "iki değer doğru".
  - Tek değerli 16 soruda doğru sayısı tabandan ≥ 2/5 düşen soru yok.
  - "Fazla bildirim" (tek değerli soruda `row: true`) her soruda ≤ 1/5.
  - Başka projenin rakamı 0.
- **Bütçe tavanı:** **$1,50** (tahmin ≈ $0,8). Canlıya istek yok.
- **Canlıya alma:** ayrı Ç-15/6 onayı ile.

## 5. Para birimi (plan §4)

"98.000" bugün USD'siz çıkıyor, çünkü SQL sütun adında (`anapara_usd`) parantezli birim yok. Öneri:
- Sayfanın özgün başlığından ("Anapara (USD)") birimi kod okusun.
- **Ayrı commit, yalnız kod, prompt yok.**
- Bütün tek değerli SQL cevaplarına birim ekleyeceği için ayrı ölçülür.

## 6. Senden istenen karar

**§3'teki iki cümleyi onaylıyor musun?**
- **Evet**
- **Değişiklikle evet** (değişikliği yazarak)
- **Hayır**

Lütfen cevabı **Kayıtlı Kanalda** ver: bu PR'ın onayı ya da bu PR'a yorum. Onay gelmeden kod yazılmayacak.

---

[ANAYASA KONTROLÜ]
Anayasa versiyonu : v2.1 (+ ADT-4 geçici hükmü)
Okunan modüller   : Çekirdek
Ürün etiketi      : Ürün 1 — T-11 (mevcut Excel yolunun dar genişlemesi; çok satırlı sonuç yok)
Kritik Geliştirme Kararı : Ç-15/8 — planlayıcı promptu (1 cümle) ve yeniden plan metni (1 cümle) için
  Tansu onayı isteniyor; onay gelmeden kod yazılmaz. Cevap promptu değişmez. Ç-15/4 yok (şema yok).
  Ç-15/6 yok (canlıya alma ayrı onay)
Gizli bilgi / yeni bağımlılık : Yok — T-14
Kapsam dışı değişiklik        : Yok (yalnız yazışma notu eklendi) — Ç-16
Kendi başına verilen kararlar : Not, mevcut düzen gereği `docs/yazismalar/` altına tarih önekiyle konuldu;
  biçim PR #60 ve #67 ile aynı. Prompt cümleleri plandan (`fbabcf0` §3 B) aynen kopyalandı — Ç-9
