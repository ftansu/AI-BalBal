# Tansu'dan Naci'ye: AI konumlandırması ve PR #37'deki açık iki soru (16.10.2026)

**Kimden:** Tansu (Ürün Yetkilisi / Proje Yetkilisi). Metni Claude, Tansu'nun talimatı ve onayıyla (16.10.2026, 20:31) hazırladı.
**Kime:** Naci ve Naci'nin AI'ı
**Dayanak:** PR #37 yorumundaki (c) ve (d) soruları; ADR-033 "Left open" maddesi; 16.10 görüş notu (proje ekseni: AI anlar, kod uygular); `docs/yazismalar/2026-10-16_naciye-acik-kararlar.md` (PR #53).

---

## 1. Genel yön: dil anlamayı koda kural yazarak çözmüyoruz

"Karatepe GES" gibi vakalar (yanlış son ek, eski ad, kısaltma, yazım farkı) bir dil anlama işidir. Bunları kelime eşleştiren koda yeni kurallar ekleyerek kovalamak istemiyoruz. Bu kurallar, yapay zekâ projeyi kendisi anlamaya başladığında çöpe gidecek.

**Karar:**
- **AI konumlandırması yeniden ele alınacak:** neyi AI anlar, neyi kod uygular. Yön değişmedi: **AI anlar, kod uygular**. Yetki ve proje filtresi her zaman kodda kalır.
- Taslak bizden gelecek. Senin ve AI'ının fikri özellikle istenecek.
- **Kapı sırası değişmez.** Kapı öncesi işler PR #53'tekiler ve Excel proje ayrımıdır (PR #52).
- Bu süre içinde benzer bir dil vakasıyla karşılaşırsan **koda kural ekleme**. İlgili rapora "AI konumlandırma adayı" diye bir satır yaz, yeter.
- **İstisna:** Bir vaka kendinden emin yanlış (KY), yetki ihlali ya da proje karışması üretiyorsa beklemez. Bize hemen bildir, birlikte bakalım.

## 2. PR #37'deki açık sorular

**(c) Saklı set ne zaman hazır?**
Hazır. 16.10.2026'da v1 olarak kilitlendi. İçerik geliştiriciyle paylaşılmaz; koşuyu kontrolör yapar.
Kapı sırası:
1. v14 + v14.1 uygulanır.
2. Dondurma etiketi konur.
3. Kapı öncesi işler yapılır (PR #52, PR #53).
4. Kapı koşuları başlar.

**(d) "Karatepe GES" son ek uyuşmazlığı (ADR-033):**
**Mevcut davranış kalsın**: ayırt edici kelimeyle Karatepe'ye bağlanır. Yeni iş yok. 1. maddedeki AI konumlandırması kapsamında, yapay zekâ çözecek.

## 3. Hatırlatma: dondurma etiketi

PR #37 yorumunda etiket adı `cetvel-v2.1-v14` olarak geçiyor. PR #53 ile soru setine **v14.1 eki** geldi (5 adsız soru). Etiket **v14 + v14.1'in birlikte uygulandığı commit'e** konsun. Önerilen ad `cetvel-v2.1-v14.1`. v14.1'den önce konan bir etiket, 5 soruyu yanlış beklentiyle dondurur.

Acele yok, kendi temponda. Kolay gelsin.
Tansu

---

[ANAYASA KONTROLÜ]
Anayasa versiyonu : v2.1 (+ ADT-4 geçici hükmü)
Okunan modüller   : Çekirdek
Ürün etiketi      : Ürün 1 — T-11
Gizli bilgi / yeni bağımlılık : Yok — T-14
Kapsam dışı değişiklik        : Yok (yalnız yazışma notu eklendi) — Ç-16
Kendi başına verilen kararlar : Not, mevcut düzen gereği `docs/yazismalar/` altına tarih önekiyle konuldu — Ç-9

---

## Cevap (Naci)

> Bu bölüme Naci yazar. Eski satırlar silinmez; her cevap tarihle yeni satır olarak eklenir.

- Dondurma etiketi ve commit:
- AI konumlandırması hakkında ilk görüş:
- Diğer:
