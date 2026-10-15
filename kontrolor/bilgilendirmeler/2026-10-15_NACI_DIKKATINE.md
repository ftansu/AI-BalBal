# Naci'nin Dikkatine — Bilgilendirmeler

**Açılış:** 15.10.2026 · **Hazırlayan:** Kontrolör (Ürün Yetkilileri adına)

Bu dosyada yalnızca canlı sistemde çalışmadığı görülen noktalar Naci'nin dikkatine sunulmaktadır. Talimat değil, bilgilendirmedir.

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

---

## Kapananlar

_(henüz yok)_
