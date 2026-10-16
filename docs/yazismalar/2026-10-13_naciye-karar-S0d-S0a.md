# Tansu'dan Naci'ye: S0-d ve S0-a kararları (13.10.2026)

**Kimden:** Tansu (Ürün Yetkilisi / Proje Yetkilisi). Metni Claude, Tansu'nun talimatı ve onayıyla hazırladı.
**Kime:** Naci ve Naci'nin AI'ı
**Dayanak:** `ntoydem/company-ai`, dal `feat/adim5-veri-kutuphanesi`, raporlar `docs/reports/IS_EMRI_2026-10-13S0d.md` (commit `12dddc1`) ve `docs/reports/IS_EMRI_2026-10-13S0a.md` §7.
**Önceki notlarla ilişki:** Bu not, 13.10.2026 tarihli güncel iş listesine (`docs/yazismalar/2026-10-13_naciye-guncel-liste.md`) **ek**tir. Listenin S1 maddesi aşağıdaki 1. kararla güncellenir. Bunun dışındaki hükümler aynen geçerlidir.

---

## 1. S0-d: Öneri B onaylandı

- Cevap modeli **Haiku** kalır. **Yalnız belge cevap çağrısında** adaptif düşünme açılır: `ANSWER_THINKING=true`, `ANSWER_THINKING_MAX_TOKENS=8192`.
- Router, Excel plan, Excel aktarım ve metadata çağrılarında düşünme **kapalı** kalır.
- `ANTHROPIC_THINKING=false` kararı (12. tur §A) istemci geneli için geçerliliğini korur. Bu not o kararın **tek ve dar bir istisnasıdır**: yalnız cevap çağrısı.
- **S1'e eklenir.** Canlı `.env` dosyasına `ANSWER_THINKING=true` satırı, Haiku satırları ve Excel paketi ile **aynı tek restartta** girer. Duman testi kuralı değişmez: 7 soru, 7/7 HTTP 200, tekrar denemesiz.
- Ortalama 7 sn, p90 yaklaşık 10 sn gecikme bu aşamada kabul edilmiştir. Canlıdan sonra ölçülecek; aksiyon gerekirse ayrıca konuşulur.

## 2. S0-a SORU 1: Seçenek (a)

- Saf `DATA_QUERY`'de Excel motoru tek değer bulamazsa (belirsiz / birden fazla tablo) kullanıcı **sabit cümleyi** görür. **Belge hattı denenmez.**
- Gerekçe: Bu durumda belge hattı, Excel'deki gerçekleşen rakamla çelişebilecek bir sözleşme rakamı verebilir. Bu, kendinden emin yanlış (KY) riski demek. 2 Kasım'a kadar sabit cümle daha güvenli.
- Kalıcı çözüm **B2**'deki seçenekli netleştirici sorudur (`ExcelAskResult.ambiguous.candidates`).
- "Bulunamadı" durumlarında (plan `none`, çalışma kitabı yok, fonksiyon hatası) belge hattına düşüş mevcut haliyle kalır.

## 3. Bilgi (talimat değil)

- S0-d'deki tahmini 62/99, Ürün 1 "bitti" eşiğinin (%75) altında. Kalan kayıplar (proje izolasyonu, "named" proje daraltması, soru ↔ belge ifade eşleşmesi, genel bilgi / karşılaştırma kuralı) için ayrı iş emri gelecek. S0-d §4'teki "named" daraltma önerisi o emirde değerlendirilecek. Şimdi uygulanmasın.
- KY = 0 kriteri değişmedi.

---

[ANAYASA KONTROLÜ]
Anayasa versiyonu : v2.1 (+ ADT-4 geçici hükmü)
Okunan modüller   : Çekirdek
Ürün etiketi      : Ürün 1 — T-11
Gizli bilgi / yeni bağımlılık : Yok — T-14
Kapsam dışı değişiklik        : Yok (yalnız yazışma notu eklendi) — Ç-16
Kendi başına verilen kararlar : Not, mevcut düzen gereği `docs/yazismalar/` altına tarih önekiyle konuldu — Ç-9
