# Naci'nin Dikkatine — Bilgilendirmeler

**Açılış:** 15.10.2026 · **Hazırlayan:** Kontrolör (Ürün Yetkilileri adına)

Bu dosyada yalnızca canlı sistemde çalışmadığı görülen noktalar Naci'nin dikkatine sunulmaktadır. Talimat değil, bilgilendirmedir.

> **18.10.2026:** Talep ve sıra ana listede: `docs/URUN1_TANSU_NOTLAR.md` — B-01 → A-5, B-02 → A-1, B-03 → A-3. Burada yalnız **Durum** satırı güncellenir.

**Nasıl kapanır:** Bir sorun çözüldüğünde ilgili maddenin **Durum** satırını `Çözüldü — GG.AA.GGGG` olarak güncellemen yeterli. Kontrolör canlıda doğruladıktan sonra madde aşağıdaki "Kapananlar" bölümüne taşınır; madde silinmez, iz kalır.

> Not: `kontrolor/` klasörüne geliştirici yazmaz kuralının tek istisnası bu dosyadaki **Durum** satırlarıdır.

---

## Açık maddeler

### B-01 · 15.10.2026 · Excel içeriğine hiçbir hat ulaşamıyor

**Durum:** Açık

**Gözlem** (canlı sistem, 15.10.2026, Yeşilova kredisi 2023-YS):

| # | Soru | Balbal | Beklenen |
|---|---|---|---|
| 1 | "Yeşilova kredi ödeme planında 12. taksitin anapara tutarı nedir" | Yalnız Belge hattı çalıştı (etiket: Belge · Ürün 1). "Ödeme Planı — Güncel (01.09.2026)" dosyası listelendi ama "kesin bilgi bulamadım" dendi. | 98.000 USD |
| 2 | "Yeşilova 2027'de hangi kredi ödemelerini yapacak?" | Yalnız belge listesi döndü. | 2027 satırları ödeme planı Excel'inde mevcut |
| 3 | "Yeşilova'nın bir sonraki kredi ödemesi ne zaman" | Vade 14.10.2026 ve faiz 18.912 USD banka faiz bildiriminden doğru bulundu; anapara verilmedi, "kaynaklarda anapara ve ödeme takvimi yok" dendi. | 14.10.2026 · 98.000 USD anapara + 18.912 USD faiz |

**Okuma:** Dosya sistemde adıyla görülüyor ama hücre içeriğine ne belge hattı ne hesap motoru ulaşıyor. Açık proje ve kalem adı içeren soru Excel hattına yönlenmiyor.

**Teşhis sorusu:** "Ödeme Planı — Güncel" dosyası hesap motorunun Excel kayıt listesinde var mı ve Yeşilova'ya bağlı mı? Varsa, bu soru neden Excel'e yönlenmedi?

**Ek not:** Sözlük "ödeme planı" ifadesini Financial Model › Debt sayfasına eşliyor; aynı adı taşıyan ödeme planı dosyalarına değil.

**Kontrolör notu (17.10.2026):** İlerleme var — P2A (`1f9ac13`) ile Excel yolunda proje ayrımı kodlandı; "Yeşilova kalan kredi borcu" artık Karatepe'nin rakamını döndürmüyor (ölçüm 12 → 0). Ödeme planı başlıkları (`col_b…`, birimsiz 98000) P2 commit 2'nin işi; madde açık kalır.

---

### B-02 · 17.10.2026 · "Hangi proje…" sorusuna geri soru soruluyor

**Durum:** Açık

**Gözlem** (eval ortamı, ayarlar canlıyla birebir aynı — P1M §1a; soru ANK-ISO-003, kullanıcı finans):

| Soru | Balbal | Beklenen |
|---|---|---|
| "Hangi projenin finansmanı kapanmış (financial close) durumda?" | "Hangi projeyi kastediyorsunuz: Karatepe RES mi, Yeşilova RES mi?" + Excel yarısı "veri bulamadım" (MIXED) | Karatepe RES — 08.07.2022, kaynağıyla |

**Okuma:** Soru zaten çoklu proje soruyor; adsız-değer netleştirmesine düşüyor. Aynı tipteki ANK-ISO-002 belge yolunda doğru cevaplanıyor. Kapı şartı (3) gereği izolasyon kategorisi %100 olmalı (17.10 akşamüstü notu, P-5).

---

### B-03 · 17.10.2026 · "12553 MWh üretim kaybı"

**Durum:** Açık

**Gözlem** (eval, P1M; soru ANK-MIX-002): cevap "Arıza … 12553 MWh üretim kaybına yol açmıştır [Bakım Raporu — Temmuz 2024]".

**Okuma:** Ledger'da 12.553 MWh, Temmuz 2024'ün **üretim** değeri (`ankara_res.yaml` satır 219). Ya belge böyle yazılmış (demo veri hatası) ya da model yanlış okumuş (KY). Belge metninde arama sonucu bekleniyor (17.10 akşamüstü notu, A3).

---

## Kapananlar

_(henüz yok)_
